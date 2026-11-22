/* The Rabbit Hole.
   Every idea is a doorway into a self-contained exploration of its own: the original, an interactive version,
   comparisons, objections, modern echoes, and links that chain into other holes and experiences.
   Authored holes live in js/content/holes-*.js (C.HOLES). Every experience in the library also gets pathways derived
   from its own data, so no idea is a dead end. Loads after mirror.js and before app.js. */
(function () {
  const C = (window.CUR = window.CUR || {});
  const h = C.h, kit = C.tpl.kit, V = C.views;
  const H = (C.holes = {});
  C.HOLES = C.HOLES || [];
  H.sims = {};

  H.KINDS = {
    origin: { label: 'The original', icon: 'book' }, play: { label: 'Step inside', icon: 'play' }, compare: { label: 'Compare', icon: 'swap' },
    objections: { label: 'Objections', icon: 'scale' }, modern: { label: 'Today', icon: 'spark' }, voices: { label: 'Voices', icon: 'chat' },
    answers: { label: 'Every answer', icon: 'target' }, layers: { label: 'Deeper', icon: 'down' }, people: { label: 'The people', icon: 'user' },
    connect: { label: 'Connections', icon: 'route' }, mirror: { label: 'Mirror', icon: 'brain' }, history: { label: 'What happened', icon: 'map' }
  };
  const kindOf = (k) => H.KINDS[k] || H.KINDS.origin;

  /* ---------- Registry ---------- */
  const authored = () => C.HOLES;
  H.byAnchor = (expId) => authored().find((x) => x.anchor === expId || x.id === expId);
  H.get = function (id) {
    const a = H.byAnchor(id);
    if (a) return a;
    const e = C.byId[id];
    return e ? derive(e) : null;
  };
  H.forExp = (expId) => H.get(expId.startsWith('recall:') ? expId.slice(7) : expId);
  H.all = () => authored();

  /* ---------- State ---------- */
  H.st = (id) => { const s = C.store.state; return s.holes[id] || (s.holes[id] = { paths: {}, seen: 0 }); };
  H.doneCount = (hole) => { const st = C.store.state.holes[hole.id]; return st ? hole.paths.filter((p) => st.paths[p.id]).length : 0; };
  H.depthLabel = function (hole) {
    const n = H.doneCount(hole), total = hole.paths.length;
    if (!n) return 'On the surface';
    if (n >= total) return 'Bottom of the hole';
    if (n === 1) return 'Ankle-deep';
    return n >= total - 1 ? 'Deep' : 'Wading';
  };
  H.totalPaths = () => Object.values(C.store.state.holes).reduce((a, x) => a + Object.keys(x.paths || {}).length, 0);
  H.totalHoles = () => Object.values(C.store.state.holes).filter((x) => Object.keys(x.paths || {}).length).length;
  H.completePath = function (hole, path) {
    const st = H.st(hole.id);
    const first = !st.paths[path.id];
    C.store.update(() => { st.paths[path.id] = Date.now(); st.seen = Date.now(); });
    return C.progress.holePath(hole, path, first);
  };

  /* ---------- Derived pathways: no experience is a dead end ---------- */
  const TOPIC_THEMES = { history: ['change', 'power'], philosophy: ['knowledge', 'self'], religion: ['meaning', 'community'], literature: ['beauty', 'self'], psychology: ['self', 'perception'], science: ['nature', 'uncertainty'], society: ['power', 'justice'], arts: ['beauty', 'perception'], ethics: ['justice', 'meaning'], geography: ['nature', 'community'], thinkers: ['technology', 'knowledge'], wisdom: ['meaning', 'self'] };
  const cache = {};
  function relatedExps(e, n) {
    const st = C.store.state;
    const score = (x) => ((x.thinkers || []).filter((t) => (e.thinkers || []).includes(t)).length * 3) + ((e.links || []).includes(x.topic) ? 2 : 0) + (x.topic === e.topic ? 1 : 0) + (st.exp[x.id] && st.exp[x.id].done ? -2 : 0);
    return C.library.filter((x) => x.id !== e.id).map((x) => ({ x, s: score(x) })).filter((o) => o.s > 0).sort((a, b) => b.s - a.s || a.x.id.localeCompare(b.x.id)).slice(0, n).map((o) => o.x);
  }
  function derive(e) {
    if (cache[e.id]) return cache[e.id];
    const paths = [];
    const hole = { id: e.id, derived: true, topic: e.topic, title: e.title, hook: e.hook, claim: e.takeaway, themes: TOPIC_THEMES[e.topic], anchor: e.id, paths };
    const voices = (e.lenses || e.perspectives || []).map((l) => ({ who: l.who, text: l.view || l.text || '', tag: l.tag })).filter((v) => v.text);
    if (e.type === 'debate' && e.sides) {
      e.sides.forEach((s) => voices.push({ who: s.label, text: (s.case || []).join(' '), tag: 'Case' }));
    }
    if (voices.length >= 2) {
      const nodes = [{ t: 'read', h: 'Voices worth arguing with', p: ['Each voice below has a real case behind it. Read them as people to talk with, not answers to pick up.'] }];
      voices.slice(0, 5).forEach((v) => nodes.push({ t: 'read', h: v.who + (v.tag ? ' · ' + v.tag : ''), p: [v.text] }));
      nodes.push({ t: 'choice', q: 'Which of these voices is closest to your own instinct?', opts: voices.slice(0, 5).map((v) => [v.who, 'Notice what ' + v.who + ' would have to assume for this to hold, and what a critic would say back. You are not being scored; you are locating yourself.']).concat([['None of them', 'That is useful too: what is the voice that is missing?']]) });
      nodes.push({ t: 'mirror', n: 2, kinds: ['assume', 'opposite'] });
      paths.push({ id: 'voices', kind: 'voices', title: 'Voices to argue with', blurb: voices.length + ' viewpoints, then find where you stand.', mins: 4, nodes });
    }
    if (e.type === 'thought' && e.choices) {
      const nodes = [{ t: 'read', h: 'Every answer, examined', p: ['The best test of a position is what it commits you to. Here is the cost and the case for each answer.'] }];
      e.choices.forEach((c) => nodes.push({ t: 'read', h: c.label, p: [c.result, c.lens] }));
      nodes.push({ t: 'mirror', n: 2, kinds: ['assume', 'evidence'] });
      paths.push({ id: 'answers', kind: 'answers', title: 'Every answer, examined', blurb: 'What each way of answering commits you to.', mins: 4, nodes });
    }
    if (e.type === 'debate' && e.sides && e.sides.length === 2) {
      const [a, b] = e.sides;
      const rungs = [];
      if (a.objection) rungs.push({ o: 'Against “' + a.label + '”: ' + a.objection, r: (b.case || [])[0] || '' });
      if (b.objection) rungs.push({ o: 'Against “' + b.label + '”: ' + b.objection, r: (a.case || [])[0] || '' });
      if (rungs.length) paths.push({ id: 'objections', kind: 'objections', title: 'Press on both sides', blurb: 'The strongest objection to each position.', mins: 4, nodes: [{ t: 'ladder', h: 'Test each position at its weakest point', claim: e.question, rungs }, { t: 'mirror', n: 1, kinds: ['opposite'] }] });
    }
    if (e.type === 'challenge' && e.stances) {
      const nodes = [{ t: 'read', h: 'Where the problem actually bites', p: [e.claim, e.verdict] }];
      (e.perspectives || []).forEach((p) => nodes.push({ t: 'read', h: p.who, p: [p.view] }));
      nodes.push({ t: 'mirror', n: 2, kinds: ['assume', 'evidence'] });
      if (!paths.some((p) => p.id === 'voices')) paths.push({ id: 'attempts', kind: 'voices', title: 'Attempted solutions', blurb: 'Each way thinkers have tried to resolve it, and what each gives up.', mins: 4, nodes });
    }
    if (e.type === 'layers' && e.layers) {
      const nodes = e.layers.map((l) => ({ t: 'read', h: l.h, p: [l.t] }));
      nodes.push({ t: 'mirror', n: 2, kinds: ['evidence', 'origin'] });
      paths.push({ id: 'layers', kind: 'layers', title: 'All the layers', blurb: 'Every layer of the idea, from the popular version to the careful one.', mins: 4, nodes });
    }
    if (e.type === 'history' && e.options) {
      const nodes = [{ t: 'read', h: 'What really happened', p: [e.outcome, e.why] }];
      e.options.forEach((o) => nodes.push({ t: 'read', h: 'Option: ' + o.label, p: [o.think] }));
      nodes.push({ t: 'mirror', n: 2, kinds: ['assume', 'origin'] });
      paths.push({ id: 'history', kind: 'history', title: 'Every option, and what really happened', blurb: 'The road taken and the roads not taken.', mins: 4, nodes });
    }
    if (e.type === 'socratic' && e.steps) {
      const nodes = [{ t: 'read', h: 'Where the argument goes', p: [e.intro, e.conclusion] }];
      e.steps.forEach((s) => (s.choices || []).forEach((c) => nodes.push({ t: 'read', h: 'If you answered: ' + c.label, p: [c.reply] })));
      nodes.push({ t: 'mirror', n: 2, kinds: ['assume', 'opposite'] });
      paths.push({ id: 'branches', kind: 'answers', title: 'Every branch of the argument', blurb: 'The replies you did not hear.', mins: 4, nodes: nodes.slice(0, 9) });
    }
    // Always available: people + connections, and a mirror
    const rel = relatedExps(e, 4);
    const people = (e.thinkers || []);
    const cNodes = [{ t: 'read', h: 'Follow the thread', p: ['Ideas rarely live in one subject. These continue what “' + e.title + '” opened up.'] }];
    const items = rel.map((x) => ({ href: '#/hole/' + x.id, label: x.title, sub: C.topic(x.topic).short + ' · ' + C.FORMATS[x.type].name + ' · go down this hole' }));
    items.push({ href: '#/atlas/topic/' + e.topic, label: 'Test the facts around it in the ' + C.topic(e.topic).short + ' Atlas', sub: A_count(e.topic) + ' quick questions' });
    (e.links || []).slice(0, 2).forEach((t) => items.push({ href: '#/atlas/topic/' + t, label: 'Neighbouring subject: ' + C.topic(t).name, sub: 'Atlas questions' }));
    cNodes.push({ t: 'link', items });
    cNodes.push({ t: 'mirror', n: 1, kinds: ['connect'] });
    paths.push({ id: 'connect', kind: 'connect', title: people.length ? 'The people and the web around it' : 'Connections', blurb: people.length ? 'Meet ' + people.slice(0, 3).join(', ') + ' and follow the links outward.' : 'Where this idea leads next.', mins: 3, nodes: cNodes });
    paths.push({ id: 'mirror', kind: 'mirror', title: 'Look in the mirror', blurb: 'What you assumed, what would change your mind, and whether you can argue the other side.', mins: 3, nodes: [{ t: 'read', h: 'Thinking about your thinking', p: ['You have met an idea. The next questions are about you, not it. There are no right answers, and nothing here is graded.'] }, { t: 'mirror', n: 3 }] });
    cache[e.id] = hole;
    return hole;
  }
  function A_count(topic) { return C.atlas ? C.atlas.questions(topic).toLocaleString('en-US') : ''; }

  /* ---------- Node renderers ---------- */
  const R = {};
  const mirrorCtx = (hole) => ({ id: 'hole:' + hole.id, topic: hole.topic, title: hole.title, claim: hole.claim, anti: hole.anti, themes: hole.themes });

  R.read = (n, api) => { api.done(); return h('div', { class: 'hn hn-read' }, n.h ? h('h3', { text: n.h }) : null, ...(n.p || []).map((t) => h('p', { text: t })), n.src ? h('p', { class: 'fine', text: n.src }) : null); };

  R.choice = (n, api) => {
    const box = h('div', { class: 'hn' }), out = h('div', { class: 'out' }), opts = h('div', { class: 'opts' });
    box.append(n.h ? kit.kicker(n.h) : null, h('h3', { class: 'q', text: n.q }), n.fig ? h('div', { class: 'cave-scene fig', html: n.fig }) : null);
    n.opts.forEach(([label, resp], i) => {
      const b = kit.opt(label, () => {
        kit.lock(opts); kit.mark(b);
        const graded = n.ans !== undefined;
        if (graded) { const ok = i === n.ans; b.classList.add(ok ? 'right' : 'wrong'); if (!ok) C.$$('.opt', opts)[n.ans].classList.add('right'); }
        out.append(kit.panel(graded ? h('p', { class: 'verdict-line', text: i === n.ans ? 'Yes' : 'Not quite' }) : null, h('p', { text: graded ? (n.why || resp) : resp })));
        api.done();
      });
      opts.append(b);
    });
    box.append(opts, out);
    return box;
  };

  R.compare = (n, api) => {
    const box = h('div', { class: 'hn' }), cols = h('div', { class: 'cmp-cols' }), out = h('div', { class: 'out' });
    n.cols.forEach((c) => cols.append(h('div', { class: 'cmp-col' }, h('h4', { text: c.h }), h('ul', {}, ...c.pts.map((p) => h('li', { text: p }))))));
    box.append(n.h ? kit.kicker(n.h) : null, cols, h('h3', { class: 'q', text: n.q || 'Which feels closer to how things are?' }));
    const row = h('div', { class: 'mq-chips' });
    [n.cols[0].h, 'Parts of both', n.cols[1].h, 'Neither'].forEach((l, i) => row.append(h('button', { class: 'chip toggle', type: 'button', onclick: () => { kit.lock(row); out.append(kit.panel(h('p', { text: n.note || 'Either way, notice what each side would have to explain.' }))); api.done(); } }, i === 0 || i === 2 ? 'Closer to: ' + l : l)));
    box.append(row, out);
    return box;
  };

  R.ladder = (n, api) => {
    const box = h('div', { class: 'hn' }), slot = h('div', { class: 'ladder' });
    box.append(n.h ? kit.kicker(n.h) : null, n.claim ? h('blockquote', { class: 'claim', text: n.claim }) : null, slot);
    let i = 0;
    const show = () => {
      if (i >= n.rungs.length) { slot.append(h('p', { class: 'fine', text: 'That is the ladder. Strong objections tend to survive the first reply; weak ones do not. Your own ratings are only your reading today.' })); api.done(); return; }
      const r = n.rungs[i], card = h('div', { class: 'rung' }), out = h('div', { class: 'out' }), row = h('div', { class: 'mq-chips' });
      card.append(h('div', { class: 'kicker', text: 'Objection ' + (i + 1) + ' of ' + n.rungs.length }), h('p', { text: r.o }), h('p', { class: 'mq-q', text: 'How strong does that feel to you?' }), row, out);
      [['Strong', 's'], ['Partly', 'p'], ['Weak', 'w']].forEach(([l, k]) => row.append(h('button', { class: 'chip toggle', type: 'button', onclick: () => {
        kit.lock(row);
        out.append(kit.panel(kit.kicker('A reply'), h('p', { text: r.r }), r.c ? h('p', { class: 'fine', text: 'Counter: ' + r.c }) : null));
        const nx = kit.btn(i + 1 < n.rungs.length ? 'Next objection' : 'Done', () => { nx.remove(); i++; show(); }, 'ghost small'); out.append(nx);
      } }, l)));
      slot.append(card);
    };
    show();
    return box;
  };

  R.sort = (n, api) => {
    const box = h('div', { class: 'hn' }), list = h('div', { class: 'sort-list' }), out = h('div', { class: 'out' }), pick = {};
    box.append(n.h ? kit.kicker(n.h) : null, h('h3', { class: 'q', text: n.q }), list);
    const check = kit.btn('Check my sorting', () => {
      if (Object.keys(pick).length < n.items.length) { C.toast('Sort every item first'); return; }
      kit.lock(list); check.disabled = true;
      let ok = 0; n.items.forEach((it, i) => { if (pick[i] === it.b) ok++; });
      out.append(kit.panel(h('p', { class: 'verdict-line', text: ok + ' of ' + n.items.length }), ...n.items.map((it) => h('p', { class: 'fine', text: it.t + ' → ' + n.buckets[it.b] + '. ' + it.why }))));
      api.done();
    }, 'primary');
    n.items.forEach((it, i) => {
      const row = h('div', { class: 'sort-row' }, h('span', { text: it.t }));
      n.buckets.forEach((bk, bi) => row.append(h('button', { class: 'chip toggle', type: 'button', 'aria-pressed': 'false', onclick: (ev) => { pick[i] = bi; C.$$('button', row).forEach((x) => { x.classList.remove('on'); x.setAttribute('aria-pressed', 'false'); }); ev.currentTarget.classList.add('on'); ev.currentTarget.setAttribute('aria-pressed', 'true'); } }, bk)));
      list.append(row);
    });
    box.append(check, out);
    return box;
  };

  R.scale = (n, api) => {
    const box = h('div', { class: 'hn' }), out = h('div', { class: 'out' }), row = h('div', { class: 'scale-row' });
    box.append(n.h ? kit.kicker(n.h) : null, h('h3', { class: 'q', text: n.q }));
    for (let i = 1; i <= 5; i++) row.append(h('button', { class: 'chip toggle', type: 'button', onclick: () => { kit.lock(row); out.append(kit.panel(h('p', { text: (n.after && n.after[i - 1]) || n.note || 'Noted.' }))); api.done(); } }, String(i)));
    box.append(row, h('div', { class: 'scale-ends' }, h('span', { text: n.left }), h('span', { text: n.right })), out);
    return box;
  };

  R.reveal = (n, api) => {
    const box = h('div', { class: 'hn' }), out = h('div', { class: 'out' });
    box.append(n.h ? h('h3', { text: n.h }) : null, n.lead ? h('p', { text: n.lead }) : null);
    const b = kit.btn(n.btn || 'Reveal', () => { b.remove(); (n.p || []).forEach((t) => out.append(h('p', { text: t }))); api.done(); }, 'ghost');
    box.append(b, out);
    return box;
  };

  R.fig = (n, api) => { api.done(); return h('div', { class: 'hn' }, h('div', { class: 'cave-scene fig', html: n.svg }), n.caption ? h('p', { class: 'fine', text: n.caption }) : null); };
  H.R = R;
  R.link = (n, api) => { api.done(); return h('div', { class: 'hn' }, h('div', { class: 'hole-links' }, ...n.items.map((it) => h('a', { class: 'more-link', href: it.href }, h('b', { text: it.label }), h('span', { text: it.sub || '' }))))); };

  R.mirror = (n, api, hole) => { const box = h('div', { class: 'hn' }, M().ask(Object.assign(mirrorCtx(hole), n.kinds ? { kinds: n.kinds } : {}), n.n || 2, () => api.done())); return box; };
  R.sim = (n, api, hole) => { const f = H.sims[n.id]; return f ? f(api, hole) : h('p', { class: 'fine', text: 'This interactive is unavailable.' }); };
  const M = () => C.mirror;

  /* ---------- Views ---------- */
  const DOOR_ORDER = ['origin', 'play', 'compare', 'objections', 'modern'];
  function door(hole, p) {
    const done = !!(C.store.state.holes[hole.id] && C.store.state.holes[hole.id].paths[p.id]), K = kindOf(p.kind);
    return h('a', { class: 'door' + (done ? ' done' : ''), href: '#/hole/' + hole.id + '/' + p.id },
      h('span', { class: 'door-ic' }, C.icon(K.icon, 22)),
      h('div', { class: 'door-main' }, h('span', { class: 'kicker', text: K.label }), h('b', { text: p.title }), h('span', { class: 'fine', text: p.blurb + ' · ' + p.mins + ' min' })),
      done ? h('span', { class: 'li-done', title: 'Explored' }, C.icon('check', 18)) : C.icon('right', 18));
  }
  H.doors = function (hole) { return h('div', { class: 'doors' }, ...hole.paths.map((p) => door(hole, p))); };
  H.depthMeter = function (hole) {
    const n = H.doneCount(hole), total = hole.paths.length;
    return h('div', { class: 'depth' }, h('div', { class: 'depth-top' }, h('b', { text: H.depthLabel(hole) }), h('span', { class: 'fine', text: n + ' of ' + total + ' paths' })), V.progressBar(total ? n / total : 0, 'var(--accent)'));
  };

  V.hole = function (id) {
    const hole = H.get(id); if (!hole) return V.notFound();
    const tp = C.topic(hole.topic), anchor = hole.anchor && C.byId[hole.anchor];
    C.store.update(() => { H.st(hole.id).seen = Date.now(); });
    const root = h('div', { class: 'page hole-page', style: { '--accent': tp.color } }, V.back('#/holes', 'Rabbit Holes'),
      h('div', { class: 'topic-hero' }, h('div', { class: 'kicker', text: tp.name }), h('h1', { text: hole.title }), h('p', { class: 'sub', text: hole.hook }), H.depthMeter(hole)));
    if (anchor) root.append(h('a', { class: 'list-item', href: '#/x/' + anchor.id, style: { '--accent': tp.color } }, h('span', { class: 'li-dot' }), h('div', { class: 'li-main' }, h('b', { text: 'Start here: ' + anchor.title }), h('span', { class: 'fine', text: C.FORMATS[anchor.type].name + ' · ' + anchor.mins + ' min · the experience this hole opens from' }))));
    root.append(h('h2', { class: 'sec', text: 'Ways down' }), H.doors(hole));
    if (hole.related && hole.related.length) {
      root.append(h('h2', { class: 'sec', text: 'Where this hole connects' }), h('div', { class: 'hole-links' }, ...hole.related.map((rid) => { const rh = H.get(rid); if (!rh) return null; return h('a', { class: 'more-link', href: '#/hole/' + rid }, h('b', { text: rh.title }), h('span', { text: C.topic(rh.topic).short + ' · ' + rh.paths.length + ' paths' })); })));
    }
    root.append(h('p', { class: 'fine', text: 'Take the paths in any order. There is no score. Each one ends with a question or two from the Mirror.' }));
    return root;
  };

  V.holes = function () {
    const root = V.page('Rabbit Holes', 'Every idea is a doorway. Pick one and go as deep as you like: the original, an interactive version, objections, modern echoes.');
    const done = H.totalPaths();
    root.append(h('section', { class: 'hero-stats' }, h('div', { class: 'stat-row' },
      h('div', { class: 'stat' }, h('b', { text: String(authored().length) }), h('span', { text: 'handcrafted holes' })),
      h('div', { class: 'stat' }, h('b', { text: String(C.library.length) }), h('span', { text: 'more from experiences' })),
      h('div', { class: 'stat' }, h('b', { text: String(H.totalHoles()) }), h('span', { text: 'entered' })),
      h('div', { class: 'stat' }, h('b', { text: String(done) }), h('span', { text: 'paths explored' })))));
    const unexplored = authored().filter((x) => !H.doneCount(x));
    const pool = unexplored.length ? unexplored : authored();
    root.append(h('div', { class: 'row' }, h('a', { class: 'btn primary', href: '#/hole/' + C.pick(pool).id }, 'Surprise me'), h('a', { class: 'btn ghost', href: '#/mirror' }, 'The Mirror')));
    root.append(h('h2', { class: 'sec', text: 'Handcrafted holes' }), h('div', { class: 'tiles' }, ...authored().map((x) => {
      const tp = C.topic(x.topic), n = H.doneCount(x);
      return h('a', { class: 'tile', href: '#/hole/' + x.id, style: { '--accent': tp.color } }, h('div', { class: 'tile-art', html: C.art({ id: 'hole-' + x.id, topic: x.topic }) }), h('div', { class: 'tile-body' }, h('b', { text: x.title }), h('span', { class: 'fine', text: tp.short + ' · ' + n + ' / ' + x.paths.length + ' paths' })));
    })));
    const input = h('input', { class: 'input search', type: 'search', placeholder: 'Find any idea to dive into…', 'aria-label': 'Find an idea' }), res = h('div', { class: 'results' });
    const draw = () => { C.clear(res); const q = input.value.trim(); (q ? C.search(q) : C.library.slice().sort(() => 0).slice(0, 10)).slice(0, 12).forEach((e) => res.append(h('a', { class: 'list-item', href: '#/hole/' + e.id, style: { '--accent': C.topic(e.topic).color } }, h('span', { class: 'li-dot' }), h('div', { class: 'li-main' }, h('b', { text: e.title }), h('span', { class: 'fine', text: C.topic(e.topic).short + ' · ' + H.get(e.id).paths.length + ' paths' }))))); };
    input.addEventListener('input', draw); draw();
    root.append(h('h2', { class: 'sec', text: 'Any experience is a hole' }), h('p', { class: 'fine', text: 'Every experience in the app has pathways built from its own material: voices, objections, layers, people and links.' }), h('div', { class: 'search-wrap' }, C.icon('search', 18), input), res);
    return root;
  };

  V.holePath = function (id, pid) {
    const hole = H.get(id); if (!hole) return V.notFound();
    const idx = hole.paths.findIndex((p) => p.id === pid); if (idx < 0) return V.notFound();
    const path = hole.paths[idx], tp = C.topic(hole.topic), K = kindOf(path.kind);
    const root = h('div', { class: 'page hole-page path-run', style: { '--accent': tp.color } }, V.back('#/hole/' + hole.id, hole.title));
    const head = h('div', { class: 'path-head' }, h('div', { class: 'kicker', text: K.label + ' · ' + path.title }), h('div', { class: 'dots' })), body = h('div', { class: 'path-body' }), nav = h('div', { class: 'row path-nav' });
    root.append(head, body, nav);
    let i = 0, ready = false;
    const dots = C.$('.dots', head);
    const drawDots = () => { C.clear(dots); path.nodes.forEach((_, k) => dots.append(h('span', { class: 'dot' + (k < i ? ' done' : k === i ? ' cur' : '') }))); };
    const next = kit.btn('Continue', () => advance(), 'primary');
    next.disabled = true;
    const api = { done() { ready = true; next.disabled = false; } };
    function show() {
      ready = false; next.disabled = true; drawDots(); C.clear(body); C.clear(nav);
      const n = path.nodes[i], r = R[n.t];
      try { body.append(r ? r(n, api, hole) : h('p', { text: '' })); } catch (e) { console.error(e); body.append(h('p', { class: 'fine', text: 'This step failed to load.' })); api.done(); }
      next.textContent = i + 1 < path.nodes.length ? 'Continue' : 'Finish this path';
      nav.append(next);
      window.scrollTo && 0;
      const v = document.getElementById('view'); if (v) v.scrollTop = 0;
    }
    function advance() { if (!ready) return; if (i + 1 < path.nodes.length) { i++; show(); } else finish(); }
    function finish() {
      i = path.nodes.length; drawDots(); C.clear(body); C.clear(nav);
      const gain = H.completePath(hole, path), left = hole.paths.filter((p) => !(C.store.state.holes[hole.id].paths[p.id]));
      body.append(kit.panel(kit.kicker('Path explored'), h('h3', { text: path.title }), h('p', { text: 'You are now ' + H.depthLabel(hole).toLowerCase() + ' in “' + hole.title + '”.' + (gain ? ' +' + gain + ' insight.' : '') }), H.depthMeter(hole)));
      if (left.length) body.append(h('h3', { class: 'sec', text: 'Keep going down' }), h('div', { class: 'doors' }, ...left.map((p) => door(hole, p))));
      else body.append(h('p', { class: 'fine', text: 'You have taken every path in this hole. One interesting idea became an entire exploration.' }));
      const rel = relatedHoles(hole);
      if (rel.length) body.append(h('h3', { class: 'sec', text: 'Or surface somewhere new' }), h('div', { class: 'hole-links' }, ...rel.map((x) => h('a', { class: 'more-link', href: '#/hole/' + x.id }, h('b', { text: x.title }), h('span', { text: C.topic(x.topic).short + ' · ' + x.paths.length + ' paths' })))));
      nav.append(h('a', { class: 'btn ghost', href: '#/hole/' + hole.id }, 'Back to the hole'), h('a', { class: 'btn ghost', href: '#/holes' }, 'All holes'));
    }
    show();
    return root;
  };
  function relatedHoles(hole) {
    const ids = (hole.related || []).slice(0, 3);
    const out = ids.map((x) => H.get(x)).filter(Boolean);
    if (out.length < 3) authored().filter((x) => x.id !== hole.id && !out.includes(x) && !H.doneCount(x)).sort((a, b) => (b.topic === hole.topic) - (a.topic === hole.topic)).slice(0, 3 - out.length).forEach((x) => out.push(x));
    return out;
  }

  /* A compact "rabbit hole" block for an experience’s takeaway. */
  H.takeawayBlock = function (expId) {
    const hole = H.forExp(expId); if (!hole) return null;
    const first = hole.paths.slice(0, 3);
    return h('div', { class: 'tk-hole' }, h('div', { class: 'tk-head' }, kit.kicker('Rabbit hole'), h('span', { class: 'fine', text: hole.paths.length + ' ways deeper' })),
      h('p', { class: 'fine', text: 'This idea goes further. Pick a path, or see them all.' }),
      ...first.map((p) => door(hole, p)),
      h('a', { class: 'btn ghost small', href: '#/hole/' + hole.id }, 'Open the whole hole'));
  };

  /* ---------- Interactive: Plato’s cave ---------- */
  const SHAPES = {
    tree: '<path d="M0 22 L0 8 M0 14 L-8 6 M0 12 L8 4 M0 8 L-5 0 M0 6 L6 -2" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round"/>',
    dog: '<path d="M-12 14 q0 -10 8 -10 h8 q4 0 6 -4 l3 -3 v8 q0 4 -3 6 v8 h-3 v-6 h-10 v6 h-3 v-6 z" fill="currentColor"/>',
    jug: '<path d="M-6 -6 h12 v4 q6 4 6 12 q0 8 -12 8 q-12 0 -12 -8 q0 -8 6 -12 z" fill="currentColor"/>'
  };
  const sym = (k, x, y, s = 1.4) => '<g transform="translate(' + x + ',' + y + ') scale(' + s + ')">' + SHAPES[k] + '</g>';
  H.sims.cave = function (api) {
    const root = h('div', { class: 'hn cave' }), stage = h('div', { class: 'cave-stage' }), out = h('div', { class: 'out' });
    root.append(stage, out);
    const rec = { score: 0, react: '', ret: '' };
    const scene = (inner, cls) => h('div', { class: 'cave-scene ' + (cls || ''), html: '<svg viewBox="0 0 320 150" role="img" aria-label="Cave scene">' + inner + '</svg>' });
    const keys = ['tree', 'dog', 'jug'], pattern = ['tree', 'dog', 'jug', 'tree', 'dog', 'jug'];
    const s1 = () => {
      C.clear(stage); C.clear(out);
      let round = 3;
      stage.append(kit.kicker('Stage 1 · The wall'), h('p', { text: 'You have faced this wall since birth. Shapes pass along it, and the prisoners who best predict what comes next earn honour. Watch the order and predict the next shadow.' }));
      const view = h('div', {}), row = h('div', { class: 'opts two' }), msg = h('p', { class: 'fine' });
      const draw = () => {
        const shown = pattern.slice(Math.max(0, round - 3), round);
        view.replaceChildren(scene('<rect x="0" y="0" width="320" height="150" fill="#1b1a22"/>' + shown.map((k, i) => '<g color="#07070a" opacity="0.92">' + sym(k, 70 + i * 90, 70) + '</g>').join('') + '<text x="260" y="140" font-size="10" fill="#8a8a96">?</text>', 'wall'));
        C.clear(row);
        keys.forEach((k) => row.append(kit.opt('Next: ' + k, () => {
          kit.lock(row); const ok = k === pattern[round];
          if (ok) rec.score++; msg.textContent = ok ? 'Right. You are good at this.' : 'Not this time. It was the ' + pattern[round] + '.';
          round++;
          if (round < pattern.length) setTimeout(draw, 700);
          else setTimeout(() => { msg.textContent = 'You predicted ' + rec.score + ' of 3. You are now an expert on shadows. Everything you know about “reality” comes from this wall.'; row.replaceChildren(kit.btn('Turn around', s2, 'primary')); }, 700);
        })));
      };
      stage.append(view, row, msg); draw();
    };
    const s2 = () => {
      C.clear(stage); C.clear(out);
      stage.append(kit.kicker('Stage 2 · Turning around'), scene('<rect width="320" height="150" fill="#2a2418"/><circle cx="60" cy="40" r="20" fill="#ffcf5c" opacity="0.95"/><circle cx="60" cy="40" r="34" fill="#ffcf5c" opacity="0.25"/><rect x="0" y="110" width="320" height="40" fill="#14120d"/>' + ['tree', 'dog', 'jug'].map((k, i) => '<g color="#c9b891">' + sym(k, 150 + i * 60, 96, 1.2) + '</g>').join('') + '<rect x="130" y="100" width="170" height="3" fill="#3a3327"/>', 'fire'),
        h('p', { text: 'Your chains are loosed. Standing is painful; the fire dazzles you. Behind the shadows you were so good at predicting are carried objects, and a fire throwing the light. The shadows were copies of copies.' }));
      const opts = h('div', { class: 'opts' });
      [['It hurts. I would turn back to the wall', 'Back to the wall'], ['I would doubt my eyes. The shadows were clearer', 'The shadows were clearer'], ['I would keep looking, even though it hurts', 'Keep looking'], ['I would ask someone to explain what I am seeing', 'Ask for an explanation']].forEach(([l, short], i) => {
        const resp = ['Plato predicts exactly this: the freed prisoner is pained and would think the old shadows truer than what he is shown. Comfort is a strong argument.', 'This is the other half of the same prediction: the newly freed mind trusts the familiar over the unfamiliar. Notice how often you do this with ideas you have known longest.', 'Plato suggests the eyes need time: sight adjusts by degrees. Persistence through discomfort is how he thinks understanding starts.', 'In the Republic, the move out of the cave is not solitary: education means being turned toward the light by someone who is already facing it. Whether teaching can really do this is a famous question.'][i];
        opts.append(kit.opt(l, () => { kit.lock(opts); rec.react = short; out.append(kit.panel(h('p', { text: resp })), kit.btn('Climb out', s3, 'primary')); }));
      });
      stage.append(opts);
    };
    const s3 = () => {
      C.clear(stage); C.clear(out);
      const steps = [['Shadows of things outside', 'Easiest to see first. Even now you are looking at copies.'], ['Reflections in water', 'A little brighter, a little closer to the thing itself.'], ['The things themselves', 'Trees and animals, not their images. This is where the dazzle turns to wonder.'], ['The night sky', 'Looking at the stars and moon is easier on the eyes than the day.'], ['The sun', 'Last of all you can look at the sun itself and see what makes all the rest visible. In the Republic, the sun stands for the Form of the Good.']];
      let k = 0;
      const lead = h('p', { text: 'Let your eyes adjust. Look a little further each time.' }), view = h('div', { class: 'cave-scene sky', html: '' }), txt = h('p', { class: 'fine' }), btn = kit.btn('Look: ' + steps[0][0], () => {
        txt.textContent = steps[k][0] + ': ' + steps[k][1]; view.style.setProperty('--lit', String((k + 1) / steps.length)); k++;
        if (k < steps.length) btn.textContent = 'Look: ' + steps[k][0]; else { btn.replaceWith(kit.btn('Go back down', s4, 'primary')); }
      }, 'primary');
      view.innerHTML = '<svg viewBox="0 0 320 150" role="img" aria-label="Daylight"><rect width="320" height="150" fill="url(#g)"/><defs><linearGradient id="g" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#2d4a2a"/><stop offset="0.45" stop-color="#6fa8dc"/><stop offset="1" stop-color="#bfe3ff"/></linearGradient></defs><circle cx="250" cy="34" r="16" fill="#fff6c7"/></svg>';
      stage.append(kit.kicker('Stage 3 · The ascent'), lead, view, txt, btn);
    };
    const s4 = () => {
      C.clear(stage); C.clear(out);
      stage.append(kit.kicker('Stage 4 · Back in the dark'), h('p', { text: 'You have seen the sun. Now you go back down. Your eyes, used to brightness, cannot make out the shadows as well as before, and the prisoners, who still compete at predicting them, laugh. How do you speak to them?' }));
      const opts = h('div', { class: 'opts' });
      [['Tell them plainly the shadows are not real', 'Plato’s prediction is blunt: they would think you ruined by the journey, and if they could lay hands on the one who tries to free them, they would kill him. Many readers hear Socrates’s fate in this line. Plain assertion rarely moves people who are invested in the shadows.', 'Blunt truth'], ['Ask them questions about the shadows they know so well', 'This is closer to Socrates’s own method: start from what they already believe, and let them find where it breaks. It is slower and humbler, and it may not work either.', 'Questions'], ['Show them just one real object', 'A concrete step may be gentler than an argument. But the prisoners may call it a trick: a statue is not what they know.', 'One object'], ['Stay outside. They will not listen', 'Plato says the philosopher must return: those who have seen the good owe it to others, though it is hard. Whether that is a duty or a burden has been argued ever since.', 'Stay outside']].forEach(([l, resp, short]) => {
        opts.append(kit.opt(l, () => {
          kit.lock(opts); rec.ret = short;
          out.append(kit.panel(h('p', { text: resp })), kit.panel(kit.kicker('Your trip'), h('p', { text: 'You predicted ' + rec.score + ' of 3 shadows, reacted by: ' + rec.react.toLowerCase() + ', and returned with: ' + rec.ret.toLowerCase() + '. Plato offers no one right route; the story is about how hard it is to leave a comfortable picture of the world, and what we owe those who still live in it.' })));
          api.done();
        }));
      });
      stage.append(opts);
    };
    s1();
    return root;
  };
})();
