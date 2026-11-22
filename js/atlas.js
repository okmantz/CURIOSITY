/* The Atlas: a generative question engine over structured fact tables (js/content/atlas-*.js).
   One fact row becomes several different interactive questions (recognise, recall, judge, categorise, date, compare, order),
   so the bank grows by adding rows, not by writing questions. Also provides the Quickfire drill card for the feed,
   the Atlas pages (home, subject, study list) and the 10-question runner. */
(function () {
  const C = (window.CUR = window.CUR || {});
  const h = C.h, kit = C.tpl.kit, V = C.views, T = C.tpl;
  const A = (C.atlas = {});
  C.ATLAS = C.ATLAS || [];

  /* ---------- Table access ---------- */
  let idx = null;
  A.table = (id) => { if (!idx) { idx = {}; C.ATLAS.forEach((t) => { idx[t.id] = t; }); } return idx[id]; };
  A.tablesFor = (topic) => C.ATLAS.filter((t) => t.topic === topic);
  const kindsOf = (t) => {
    const k = ['who', 'what', 'tft', 'tff'];
    if (t.cats && Object.keys(t.cats).length >= 3) k.push('cat');
    if (t.mode) k.push('num', 'cmp');
    return k;
  };
  const nOrd = (t) => (t.mode ? Math.floor(t.rows.length / 4) : 0);
  const nOdd = (t) => (t.odd ? Math.floor(t.rows.length / 3) : 0);
  A.count = (t) => t.rows.length * kindsOf(t).length + nOrd(t) + nOdd(t);
  A.facts = (topic) => C.ATLAS.filter((t) => !topic || t.topic === topic).reduce((a, t) => a + t.rows.length, 0);
  A.questions = (topic) => C.ATLAS.filter((t) => !topic || t.topic === topic).reduce((a, t) => a + A.count(t), 0);

  /* ---------- Formatting ---------- */
  const fmtYear = (y) => (y < 0 ? (-y) + ' BCE' : y < 1000 ? y + ' CE' : String(y));
  const fmtNum = (x) => (Math.abs(x) >= 1000 ? Math.round(x).toLocaleString('en-US') : String(Math.round(x * 100) / 100));
  const fmtVal = (t, v) => (t.mode === 'year' ? fmtYear(v) : fmtNum(v) + (t.unit ? ' ' + t.unit : ''));
  const sentence = (s) => { s = String(s); s = s.charAt(0).toUpperCase() + s.slice(1); return /[.!?)]$/.test(s) && !/\)$/.test(s) ? s : /[.!?]$/.test(s) ? s : s + '.'; };

  A.range = function (t) {
    if (t._range) return t._range;
    const vs = t.rows.map((r) => r[2]).filter((v) => typeof v === 'number');
    let lo = Math.min(...vs), hi = Math.max(...vs);
    if (t.log) { lo = Math.max(t.min || lo * 0.4, 1e-9); hi = t.max || hi * 2.5; }
    else { const pad = (hi - lo) * 0.04; lo = t.min != null ? t.min : Math.floor((lo - pad) / 5) * 5; hi = t.max != null ? t.max : Math.ceil((hi + pad) / 5) * 5; }
    return (t._range = { lo, hi });
  };

  /* ---------- Item generation (deterministic from table id + index) ---------- */
  const ROW = (r) => ({ n: r[0], c: r[1], v: r[2], k: r[3], w: r[4] });
  function others(t, i, rnd, count, sameCat) {
    const me = t.rows[i];
    let pool = [];
    t.rows.forEach((r, j) => { if (j !== i && r[0] !== me[0]) pool.push(j); });
    if (sameCat && me[3]) { const sc = pool.filter((j) => t.rows[j][3] === me[3]); if (sc.length >= count) pool = sc; }
    return C.shuffle(pool, rnd).slice(0, count);
  }
  const why = (r, t) => sentence(r.c) + (r.v != null ? ' (' + fmtVal(t, r.v) + ')' : '') + (r.w ? ' ' + sentence(r.w) : '');

  A.make = function (t, id) {
    const rows = t.rows, n = rows.length, ks = kindsOf(t), base = n * ks.length, ordN = nOrd(t);
    const rnd = C.rng(t.id + ':' + id);
    let kind, i;
    if (id < base) { kind = ks[Math.floor(id / n)]; i = id % n; }
    else if (id < base + ordN) { kind = 'ord'; i = id - base; }
    else { kind = 'odd'; i = id - base - ordN; }
    const it = { id: t.id + ':' + id, tid: t.id, idx: id, kind, topic: t.topic };
    if (kind === 'who') {
      const r = ROW(rows[i]), ids = C.shuffle([i, ...others(t, i, rnd, 3, true)], rnd);
      Object.assign(it, { q: 'Which one matches this description?', stem: sentence(r.c), opts: ids.map((j) => rows[j][0]), ans: ids.indexOf(i), exp: r.n + '. ' + why(r, t) });
    } else if (kind === 'what') {
      const r = ROW(rows[i]), ids = C.shuffle([i, ...others(t, i, rnd, 3, true)], rnd);
      Object.assign(it, { q: 'What is “' + r.n + '”?', opts: ids.map((j) => sentence(rows[j][1])), ans: ids.indexOf(i), exp: r.n + ': ' + why(r, t) });
    } else if (kind === 'tft' || kind === 'tff') {
      const r = ROW(rows[i]);
      let shown = r.c, truth = true;
      if (kind === 'tff') { const j = others(t, i, rnd, 1, rnd() < 0.5)[0]; shown = rows[j][1]; truth = false; it.rival = rows[j][0]; }
      Object.assign(it, { q: 'True or false?', stem: r.n + ': ' + sentence(shown), opts: ['True', 'False'], ans: truth ? 0 : 1,
        exp: truth ? 'True. ' + why(r, t) : 'False. That description fits ' + it.rival + ', not ' + r.n + '. In fact, ' + r.n + ': ' + why(r, t) });
    } else if (kind === 'cat') {
      const r = ROW(rows[i]), keys = Object.keys(t.cats), pool = C.shuffle(keys.filter((k) => k !== r.k), rnd).slice(0, 3), all = C.shuffle([r.k, ...pool], rnd);
      Object.assign(it, { q: t.catQ ? t.catQ.replace('{n}', r.n) : 'Which category fits “' + r.n + '”?', opts: all.map((k) => t.cats[k]), ans: all.indexOf(r.k), exp: r.n + ' sits under “' + t.cats[r.k] + '”. ' + why(r, t) });
    } else if (kind === 'num') {
      const r = ROW(rows[i]), { lo, hi } = A.range(t);
      const tol = t.log ? 1.5 : (t.tol || (t.mode === 'year' ? Math.max(3, Math.round(0.05 * Math.abs(2025 - r.v))) : (hi - lo) * 0.05));
      Object.assign(it, { q: (t.ask || 'Estimate the value for {n}.').replace('{n}', r.n), lo, hi, truth: r.v, tol, exp: r.n + ': ' + why(r, t) });
    } else if (kind === 'cmp') {
      const r = ROW(rows[i]); let j = others(t, i, rnd, 12, false).find((x) => rows[x][2] !== r.v);
      if (j == null) j = (i + 1) % n;
      const o = ROW(rows[j]), pair = C.shuffle([r, o], rnd), hiWins = t.mode === 'year' ? !!t.cmpHi : t.cmpHi !== false;
      const win = hiWins ? (r.v > o.v ? r : o) : (r.v < o.v ? r : o);
      Object.assign(it, { q: t.cmpQ || (t.mode === 'year' ? 'Which came first?' : 'Which is larger?'), opts: pair.map((x) => x.n), ans: pair.indexOf(win),
        exp: r.n + ' (' + fmtVal(t, r.v) + ') versus ' + o.n + ' (' + fmtVal(t, o.v) + '). ' + win.n + ' is the answer.' });
    } else if (kind === 'ord') {
      const pool = C.shuffle(rows.map((_, j) => j), rnd), pick = [];
      for (const j of pool) { if (!pick.some((p) => rows[p][2] === rows[j][2])) pick.push(j); if (pick.length === 4) break; }
      const sorted = pick.slice().sort((a, b) => rows[a][2] - rows[b][2]);
      Object.assign(it, { q: t.ordQ || (t.mode === 'year' ? 'Tap these in order, earliest first.' : 'Tap these in order, smallest first.'), items: pick.map((j) => rows[j][0]), order: sorted.map((j) => rows[j][0]),
        exp: sorted.map((j) => rows[j][0] + ' (' + fmtVal(t, rows[j][2]) + ')').join(' → ') });
    } else if (kind === 'odd') {
      const by = {}; rows.forEach((r, j) => { (by[r[3]] = by[r[3]] || []).push(j); });
      const big = Object.keys(by).filter((k) => by[k].length >= 3), a = big[i % big.length];
      const b = C.shuffle(Object.keys(by).filter((k) => k !== a), rnd)[0];
      const three = C.shuffle(by[a], rnd).slice(0, 3), one = C.pick(by[b], rnd), all = C.shuffle([...three, one], rnd);
      Object.assign(it, { q: 'Which one does not belong with the others?', opts: all.map((j) => rows[j][0]), ans: all.indexOf(one), exp: 'The other three are “' + t.cats[a] + '”. ' + rows[one][0] + ' is “' + t.cats[b] + '”.' });
    }
    return it;
  };

  /* ---------- Progress state ---------- */
  A.stat = (tid) => { const s = C.store.state; return s.atlas[tid] || (s.atlas[tid] = { p: 0, ep: 0, right: 0, seen: 0, miss: [] }); };
  A.accuracy = (tid) => { const st = C.store.state.atlas[tid]; return st && st.seen ? st.right / st.seen : null; };
  A.totals = () => { const m = C.store.state.atlasMeta; return { total: m.total, right: m.right, acc: m.total ? m.right / m.total : null }; };
  const perm = (t, ep) => C.shuffle(Array.from({ length: A.count(t) }, (_, i) => i), C.rng(t.id + ':ep' + ep));

  /** Next n item ids for a table, never repeating until the whole bank has been seen. Mutates the pointer. */
  A.take = function (t, n) {
    const out = [];
    C.store.update(() => {
      const st = A.stat(t.id), total = A.count(t);
      st.miss.slice(0, st.seen >= 10 ? 2 : 0).forEach((m) => { if (m < total && out.length < n) out.push(m); });
      let p = perm(t, st.ep);
      while (out.length < n) {
        if (st.p >= total) { st.ep++; st.p = 0; p = perm(t, st.ep); }
        const id = p[st.p++]; if (!out.includes(id)) out.push(id);
      }
    });
    return out.map((id) => A.make(t, id));
  };
  /** Non-mutating pick, for feed cards. */
  A.sample = function (t, n, seed) {
    const r = C.rng(seed), total = A.count(t), out = new Set();
    while (out.size < Math.min(n, total)) out.add(Math.floor(r() * total));
    return Array.from(out).map((id) => A.make(t, id));
  };
  A.record = function (it, ok) {
    C.store.update((s) => {
      const st = A.stat(it.tid), m = s.atlasMeta;
      st.seen++; m.total++;
      if (ok) { st.right++; m.right++; st.miss = st.miss.filter((x) => x !== it.idx); }
      else if (!st.miss.includes(it.idx)) { st.miss.push(it.idx); if (st.miss.length > 40) st.miss.shift(); }
    });
  };
  /** Weighted choice of a table inside a subject: weak and unseen tables come up more. */
  A.pickTable = function (topic, rnd = Math.random) {
    const ts = A.tablesFor(topic); if (!ts.length) return null;
    const w = ts.map((t) => { const a = A.accuracy(t.id); const st = C.store.state.atlas[t.id]; return 0.5 + (a == null ? 1 : 1 - a) + (st ? 0 : 0.5); });
    let x = rnd() * w.reduce((p, q) => p + q, 0);
    for (let i = 0; i < ts.length; i++) { x -= w[i]; if (x <= 0) return ts[i]; }
    return ts[ts.length - 1];
  };

  /* ---------- Item renderer ---------- */
  function feedback(ok, text) { return h('div', { class: 'panel reveal atlas-fb ' + (ok ? 'ok' : 'no') }, h('p', { class: 'verdict-line', text: ok ? 'Correct' : 'Not quite' }), h('p', { text })); }

  A.render = function (it, done) {
    const t = A.table(it.tid), root = h('div', { class: 'atlas-item' }), out = h('div', { class: 'out' });
    let answered = false;
    const finish = (ok) => { if (answered) return; answered = true; A.record(it, ok); kit.show(feedback(ok, it.exp), out); done && done(ok); };
    root.append(h('div', { class: 'kicker', text: t.title }), h('h3', { class: 'q', text: it.q }));
    if (it.stem) root.append(h('blockquote', { class: 'claim', text: it.stem }));
    if (it.opts) {
      const opts = h('div', { class: 'opts' + (it.kind === 'tft' || it.kind === 'tff' || it.kind === 'cmp' ? ' two' : '') });
      it.opts.forEach((o, i) => {
        const b = kit.opt(o, () => {
          kit.lock(opts); const ok = i === it.ans;
          b.classList.add(ok ? 'right' : 'wrong'); if (!ok) C.$$('.opt', opts)[it.ans].classList.add('right');
          finish(ok);
        });
        opts.append(b);
      });
      root.append(opts);
    } else if (it.kind === 'num') {
      const lg = !!t.log, { lo, hi } = it;
      const toVal = (p) => (lg ? lo * Math.pow(hi / lo, p / 5000) : lo + (p / 5000) * (hi - lo));
      const rnd = (v) => (t.mode === 'year' ? Math.round(v) : lg ? Number(v.toPrecision(3)) : Math.round(v / (t.step || 1)) * (t.step || 1));
      let cur = rnd(toVal(2500));
      const read = h('div', { class: 'predict-val', text: fmtVal(t, cur) });
      const sl = h('input', { type: 'range', class: 'slider', min: 0, max: 5000, value: 2500, 'aria-label': 'Your estimate' });
      sl.addEventListener('input', () => { cur = rnd(toVal(parseFloat(sl.value))); read.textContent = fmtVal(t, cur); });
      const go = kit.btn('Lock in my guess', () => {
        go.disabled = true; sl.disabled = true;
        const ok = lg ? (cur / it.truth <= it.tol && it.truth / cur <= it.tol) : Math.abs(cur - it.truth) <= it.tol;
        const gap = t.mode === 'year' ? 'You were ' + Math.abs(cur - it.truth) + ' years off. ' : lg ? 'You were off by a factor of about ' + (Math.max(cur / it.truth, it.truth / cur)).toFixed(1) + '. ' : 'You were off by ' + fmtNum(Math.abs(cur - it.truth)) + '. ';
        finish(ok); const fb = C.$('.atlas-fb p:last-child', out); if (fb) fb.textContent = 'You guessed ' + fmtVal(t, cur) + '. ' + gap + it.exp;
      });
      root.append(read, sl, h('div', { class: 'scale-ends' }, h('span', { text: fmtVal(t, rnd(lo)) }), h('span', { text: fmtVal(t, rnd(hi)) })), go);
    } else if (it.kind === 'ord') {
      const picked = [], list = h('div', { class: 'opts' });
      const reset = kit.btn('Start over', () => { picked.length = 0; C.$$('.opt', list).forEach((b) => { b.disabled = false; b.classList.remove('chosen'); b.querySelector('.ord-n') && b.querySelector('.ord-n').remove(); }); }, 'ghost small');
      it.items.forEach((name) => {
        const b = kit.opt(name, () => {
          if (answered) return; picked.push(name); b.disabled = true; b.classList.add('chosen'); b.append(h('span', { class: 'ord-n', text: String(picked.length) }));
          if (picked.length === it.items.length) { kit.lock(list); reset.disabled = true; const ok = picked.every((x, k) => x === it.order[k]); finish(ok); }
        });
        list.append(b);
      });
      root.append(list, reset);
    }
    root.append(out);
    return root;
  };

  /* ---------- Quickfire drill card (generated, like memory checks) ---------- */
  C.makeDrill = function (topic, seed) {
    const t = A.pickTable(topic, C.rng('pt:' + seed)); if (!t) return null;
    const tp = C.topic(topic);
    return { id: 'drill:' + t.id + ':' + seed, type: 'drill', drill: true, tid: t.id, seed, topic, diff: 1, mins: 2, title: 'Quickfire: ' + t.title, hook: 'Five fast questions from a bank of ' + A.count(t).toLocaleString('en-US') + ' about ' + tp.short.toLowerCase() + '.',
      links: [], thinkers: [], takeaway: 'Quick retrieval is how facts stick. Anything you missed returns later in the Atlas.', prompt: '' };
  };
  T.drill = function (e, ctx) {
    const t = A.table(e.tid), items = A.sample(t, 5, e.id), root = h('div', { class: 'tpl' }), slot = h('div', { class: 'drill-slot' }), bar = h('div', { class: 'fine drill-bar' });
    let i = 0, right = 0;
    root.append(bar, slot);
    const show = () => {
      bar.textContent = 'Question ' + (i + 1) + ' of ' + items.length + ' · ' + right + ' correct';
      C.clear(slot);
      const node = A.render(items[i], (ok) => {
        ctx.interact(); if (ok) right++;
        bar.textContent = 'Question ' + (i + 1) + ' of ' + items.length + ' · ' + right + ' correct';
        const next = kit.btn(i + 1 < items.length ? 'Next question' : 'Finish', () => { next.remove(); i++; if (i < items.length) show(); else end(); });
        slot.append(next);
      });
      slot.append(node);
    };
    const end = () => {
      C.clear(slot);
      slot.append(kit.panel(kit.kicker('Result'), h('p', { class: 'verdict-line', text: right + ' of ' + items.length }), h('p', { text: 'Misses are scheduled to come back. Keep going in the Atlas for the full bank.' }), h('a', { class: 'btn ghost small', href: '#/atlas/topic/' + e.topic }, 'Open the Atlas')));
      ctx.complete({ drill: true, right, n: items.length });
    };
    show();
    return root;
  };

  /* Progress hook for finished sessions and drills */
  A.finishSession = function (topic, right, n) {
    const today = C.dateKey(), m = C.store.state.atlasMeta;
    if (m.day !== today) C.store.update((s) => { s.atlasMeta.day = today; s.atlasMeta.xp = 0; });
    const room = Math.max(0, 30 - C.store.state.atlasMeta.xp), gain = Math.min(room, Math.min(10, Math.floor(right / 2)));
    if (gain) { C.progress.addXP(gain, topic); C.store.update((s) => { s.atlasMeta.xp += gain; }); }
    C.progress.atlasDone(topic);
    return gain;
  };

  /* ---------- Views ---------- */
  const pct = (a) => (a == null ? '—' : Math.round(a * 100) + '%');
  V.atlasHome = function () {
    const tot = A.totals(), root = V.page('The Atlas', 'Thousands of quick, checked questions across every subject. Each one is a doorway into a fact worth knowing.');
    root.append(h('section', { class: 'hero-stats' }, h('div', { class: 'stat-row' },
      h('div', { class: 'stat' }, h('b', { text: A.facts().toLocaleString('en-US') }), h('span', { text: 'facts' })),
      h('div', { class: 'stat' }, h('b', { text: A.questions().toLocaleString('en-US') }), h('span', { text: 'questions' })),
      h('div', { class: 'stat' }, h('b', { text: tot.total.toLocaleString('en-US') }), h('span', { text: 'answered' })),
      h('div', { class: 'stat' }, h('b', { text: pct(tot.acc) }), h('span', { text: 'accuracy' })))));
    root.append(h('p', { class: 'fine', text: 'Every question is generated from a fact table, so the same fact is asked in different ways: recognise it, recall it, judge a claim, categorise it, date it, compare it, order it. Missed questions come back later.' }));
    root.append(h('h2', { class: 'sec', text: 'Subjects' }), h('div', { class: 'tiles' }, ...C.TOPICS.map((tp) => {
      const q = A.questions(tp.id), seen = A.tablesFor(tp.id).reduce((a, t) => a + ((C.store.state.atlas[t.id] || {}).seen || 0), 0);
      return h('a', { class: 'tile', href: '#/atlas/topic/' + tp.id, style: { '--accent': tp.color } }, h('div', { class: 'tile-art', html: C.art({ id: 'atl-' + tp.id, topic: tp.id }) }),
        h('div', { class: 'tile-body' }, h('b', { text: tp.short }), h('span', { class: 'fine', text: q.toLocaleString('en-US') + ' questions · ' + seen + ' answered' })));
    })));
    return root;
  };

  V.atlasTopic = function (id) {
    const tp = C.TOPICS.find((x) => x.id === id); if (!tp) return V.notFound();
    const ts = A.tablesFor(id);
    const root = h('div', { class: 'page', style: { '--accent': tp.color } }, V.back('#/atlas', 'Atlas'),
      h('div', { class: 'topic-hero' }, h('h1', { text: tp.name + ': Atlas' }), h('p', { class: 'sub', text: A.facts(id).toLocaleString('en-US') + ' facts · ' + A.questions(id).toLocaleString('en-US') + ' questions across ' + ts.length + ' tables.' }),
        h('div', { class: 'row' }, h('a', { class: 'btn primary', href: '#/atlas/play/topic/' + id }, 'Mixed run (10)'), h('a', { class: 'btn ghost small', href: '#/explore/topic/' + id }, 'Deep experiences'))));
    root.append(h('h2', { class: 'sec', text: 'Fact tables' }), h('div', { class: 'atlas-tables' }, ...ts.map((t) => {
      const st = C.store.state.atlas[t.id], acc = A.accuracy(t.id);
      return h('div', { class: 'card-panel atlas-table' }, h('b', { text: t.title }), h('p', { class: 'fine', text: t.blurb }),
        h('div', { class: 'fine', text: t.rows.length + ' facts · ' + A.count(t).toLocaleString('en-US') + ' questions · ' + (st ? st.seen + ' answered, ' + pct(acc) + ' correct' : 'not started') }),
        V.progressBar(st ? Math.min(1, st.seen / A.count(t)) : 0),
        h('div', { class: 'row' }, h('a', { class: 'btn primary small', href: '#/atlas/play/table/' + t.id }, 'Play 10'), h('a', { class: 'btn ghost small', href: '#/atlas/table/' + t.id }, 'Study list')));
    })));
    return root;
  };

  V.atlasStudy = function (id) {
    const t = A.table(id); if (!t) return V.notFound();
    const tp = C.topic(t.topic), list = h('div', { class: 'study-list' });
    const input = h('input', { class: 'input search', type: 'search', placeholder: 'Filter this table…', 'aria-label': 'Filter facts' });
    const draw = () => {
      C.clear(list); const q = input.value.trim().toLowerCase();
      t.rows.map(ROW).filter((r) => !q || (r.n + ' ' + r.c + ' ' + (r.w || '')).toLowerCase().includes(q)).sort((a, b) => (t.mode ? a.v - b.v : 0)).slice(0, 300).forEach((r) => {
        list.append(h('div', { class: 'study-row' }, h('b', { text: r.n }), r.v != null ? h('span', { class: 'chip dim', text: fmtVal(t, r.v) }) : null, r.k && t.cats ? h('span', { class: 'chip', text: t.cats[r.k] }) : null, h('p', { text: sentence(r.c) + (r.w ? ' ' + sentence(r.w) : '') })));
      });
    };
    input.addEventListener('input', draw); draw();
    return h('div', { class: 'page', style: { '--accent': tp.color } }, V.back('#/atlas/topic/' + t.topic, tp.short + ' Atlas'), h('header', { class: 'page-head' }, h('h1', { text: t.title }), h('p', { class: 'sub', text: t.blurb })),
      h('div', { class: 'row' }, h('a', { class: 'btn primary small', href: '#/atlas/play/table/' + id }, 'Play 10')), h('div', { class: 'search-wrap' }, C.icon('search', 18), input), list);
  };

  V.atlasPlay = function (kind, id) {
    const t = kind === 'table' ? A.table(id) : null, topic = kind === 'table' ? (t && t.topic) : id;
    if (kind === 'table' && !t) return V.notFound();
    if (kind !== 'table' && !C.TOPICS.some((x) => x.id === topic)) return V.notFound();
    const tp = C.topic(topic), N = 10;
    const items = [];
    if (kind === 'table') A.take(t, N).forEach((x) => items.push(x));
    else { const r = Math.random; for (let k = 0; k < N; k++) { const tb = A.pickTable(topic, r); items.push(A.take(tb, 1)[0]); } }
    const root = h('div', { class: 'page atlas-run', style: { '--accent': tp.color } }, V.back(kind === 'table' ? '#/atlas/topic/' + topic : '#/atlas/topic/' + topic, 'Atlas'));
    const head = h('div', { class: 'atlas-head' }), slot = h('div', { class: 'atlas-slot' });
    root.append(h('h2', { class: 'sec', text: kind === 'table' ? t.title : tp.name + ': mixed run' }), head, slot);
    let i = 0, right = 0, run = 0, best = 0;
    const drawHead = () => { C.clear(head).append(V.progressBar(i / items.length), h('span', { class: 'fine', text: 'Question ' + Math.min(i + 1, items.length) + ' of ' + items.length + ' · ' + right + ' correct' + (run >= 3 ? ' · ' + run + ' in a row' : '') })); };
    const show = () => {
      drawHead(); C.clear(slot);
      slot.append(A.render(items[i], (ok) => {
        if (ok) { right++; run++; best = Math.max(best, run); } else run = 0;
        drawHead();
        const nx = kit.btn(i + 1 < items.length ? 'Next' : 'See results', () => { nx.remove(); i++; i < items.length ? show() : end(); });
        slot.append(nx);
      }));
    };
    const end = () => {
      i = items.length; drawHead(); C.clear(slot);
      const gain = A.finishSession(topic, right, items.length);
      const byT = {}; items.forEach((x) => { byT[x.tid] = (byT[x.tid] || 0) + 1; });
      slot.append(kit.panel(kit.kicker('Session complete'), h('p', { class: 'verdict-line', text: right + ' of ' + items.length + ' correct' }), h('p', { class: 'fine', text: 'Longest streak: ' + best + (gain ? ' · +' + gain + ' insight' : ' · daily Atlas insight limit reached') + '. Missed questions are queued to return.' }),
        h('div', { class: 'row wrap' }, h('a', { class: 'btn primary', href: location.hash, onclick: () => setTimeout(() => C.router.refresh(), 0) }, 'Another 10'), h('a', { class: 'btn ghost', href: '#/atlas/topic/' + topic }, 'Back to ' + tp.short))));
    };
    show();
    return root;
  };
})();
