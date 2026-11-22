/* The Intellectual Mirror.
   After an idea is explored it asks questions that reveal HOW you think (assumptions, evidence, the opposite view,
   connections to your life, confidence, where your instinct came from) and builds a private, non-evaluative profile of
   reasoning patterns and intellectual interests. It never marks a belief right or wrong, never scores you, and all of it
   stays in this browser. Loads after views2.js (needs C.views, C.tpl.kit, C.store). */
(function () {
  const C = (window.CUR = window.CUR || {});
  const h = C.h, kit = C.tpl.kit, V = C.views;
  const M = (C.mirror = {});
  const MAX_LOG = 400;

  M.KINDS = {
    assume: {
      label: 'Assumptions', hint: 'Name one assumption in your own words (optional)',
      q: (c) => 'While thinking about “' + c.title + '”, what did you take for granted?',
      chips: [['A word meant what I assumed it meant', 'definition'], ['Most people would agree', 'consensus'], ['My own experience is typical', 'experience'], ['The basic facts are settled', 'facts'], ['Things work by simple cause and effect', 'causal'], ['I am not sure yet', 'unsure']]
    },
    evidence: {
      label: 'Evidence', hint: 'What exactly would it take? (optional)',
      q: (c) => (c.claim ? 'What kind of evidence would change your mind about this: “' + c.claim + '”?' : 'What would it take to change your mind about “' + c.title + '”?'),
      chips: [['Hard data or a good study', 'data'], ['A strong counterexample', 'counter'], ['A trusted expert disagreeing', 'expert'], ['A better argument', 'logic'], ['Someone’s lived experience', 'story'], ['Honestly, not much', 'firm'], ['I am not sure', 'unsure']]
    },
    opposite: {
      label: 'The other side', hint: 'Give the opposing case in a sentence or two (optional)',
      q: (c) => (c.anti ? 'Can you argue the other side? “' + c.anti + '”' : 'Could you argue the opposite of your own view on “' + c.title + '”?'),
      chips: [['Yes, easily', 'easy'], ['Yes, with some effort', 'effort'], ['Only part of it', 'part'], ['Not yet', 'not']]
    },
    connect: {
      label: 'Your life', hint: 'Where did you meet it? (optional)',
      q: () => 'Where have you met something like this in your own life?',
      chips: [['At work or in school', 'work'], ['With family or friends', 'people'], ['Online or in the news', 'media'], ['In a book, film or music', 'culture'], ['Nowhere I can think of', 'none']]
    },
    confidence: {
      label: 'Confidence', hint: 'Why that level of confidence? (optional)',
      q: (c) => 'How sure are you of your current view on “' + c.title + '”?',
      chips: [['Very sure', 'high'], ['Fairly sure', 'mid'], ['Torn', 'low'], ['I have no view yet', 'none']]
    },
    origin: {
      label: 'Where it came from', hint: 'Say more about the source (optional)',
      q: (c) => 'Where did your first instinct on “' + c.title + '” come from?',
      chips: [['Family or upbringing', 'family'], ['School or study', 'school'], ['Something I lived through', 'lived'], ['Books or long reading', 'reading'], ['Social media or the news', 'media'], ['I am not sure', 'unsure']]
    }
  };
  const ORDER = ['assume', 'evidence', 'opposite', 'connect', 'confidence', 'origin'];
  const chipLabel = (kind, key) => { const c = (M.KINDS[kind] || { chips: [] }).chips.find((x) => x[1] === key); return c ? c[0] : key; };
  const ACK = {
    assume: 'Noted. Spotting an assumption is a skill; there is no wrong one to have.',
    evidence: 'Noted. Knowing what would move you is part of holding a view well.',
    opposite: 'Noted. Either answer is just information about where you are today.',
    connect: 'Noted. Ideas stick when they attach to something you have lived.',
    confidence: 'Noted. Confidence is a reading, not a grade.',
    origin: 'Noted. Everyone’s instincts come from somewhere.'
  };

  /* ---------- Themes (what draws you) ---------- */
  M.THEMES = { knowledge: 'Knowledge & truth', perception: 'Perception & illusion', self: 'Self & identity', justice: 'Justice & fairness', power: 'Power & institutions', change: 'Change & history', meaning: 'Meaning & purpose', uncertainty: 'Uncertainty & risk', community: 'People & community', technology: 'Tools & technology', nature: 'Nature & the cosmos', beauty: 'Beauty & expression' };
  const T2TH = { history: ['change', 'power'], philosophy: ['knowledge', 'self'], religion: ['meaning', 'community'], literature: ['beauty', 'self'], psychology: ['self', 'perception'], science: ['nature', 'uncertainty'], society: ['power', 'justice'], arts: ['beauty', 'perception'], ethics: ['justice', 'meaning'], geography: ['nature', 'community'], thinkers: ['technology', 'knowledge'], wisdom: ['meaning', 'self'] };
  M.themesFor = (ctx) => (ctx && ctx.themes && ctx.themes.length ? ctx.themes : (ctx && T2TH[ctx.topic]) || []);

  /* ---------- Text analysis: simple counts, no judgement ---------- */
  const WORDS = {
    hedge: /\b(maybe|perhaps|might|probably|possibly|seems?|i think|i guess|sort of|kind of|depends|not sure|could be)\b/gi,
    abs: /\b(always|never|everyone|nobody|no one|obviously|clearly|certainly|definitely|must|absolutely|undeniably)\b/gi,
    contrast: /\b(but|however|although|though|yet|whereas|on the other hand|except|unless)\b/gi,
    causal: /\b(because|therefore|so that|since|causes?|leads? to|results? in|as a result|hence)\b/gi
  };
  M.lex = function (text) {
    const t = (text || '').trim(), words = t ? t.split(/\s+/).length : 0, f = { w: words };
    Object.keys(WORDS).forEach((k) => { f[k] = (t.match(WORDS[k]) || []).length; });
    f.abstract = (t.match(/\b[a-z]{7,}(ity|ism|ness|tion|sion|ment|ance|ence)\b/gi) || []).length;
    f.q = (t.match(/\?/g) || []).length;
    return f;
  };

  /* ---------- Data ---------- */
  const S = () => C.store.state;
  M.log = () => S().mirror.log;
  M.count = () => S().mirror.log.length;
  M.textCount = () => S().mirror.log.filter((e) => e.text).length;

  function award(topic) {
    const m = S().mirror, today = C.dateKey();
    if (m.day !== today) C.store.update((s) => { s.mirror.day = today; s.mirror.xp = 0; });
    if (S().mirror.xp < 10) { C.progress.addXP(2, topic); C.store.update((s) => { s.mirror.xp += 2; }); return 2; }
    return 0;
  }
  M.record = function (ctx, kind, chip, text) {
    const clean = (text || '').trim().slice(0, 600);
    const entry = { t: Date.now(), id: ctx.id, topic: ctx.topic, title: ctx.title, kind, chip: chip || null, text: clean || undefined, th: M.themesFor(ctx).slice(0, 3) };
    if (clean) entry.f = M.lex(clean);
    if (ctx.claim) entry.claim = ctx.claim.slice(0, 160);
    C.store.update((s) => { s.mirror.log.push(entry); if (s.mirror.log.length > MAX_LOG) s.mirror.log.splice(0, s.mirror.log.length - MAX_LOG); });
    const gain = award(ctx.topic);
    C.progress.check();
    C.bus.emit('mirror', entry);
    return gain;
  };
  M.remove = (t) => C.store.update((s) => { s.mirror.log = s.mirror.log.filter((e) => e.t !== t); });
  M.clear = () => C.store.update((s) => { s.mirror.log = []; s.mirror.shifts = 0; s.mirror.revisits = 0; });

  /** Pick the kinds to ask: those least recently asked about this context, in a varied order. */
  M.pickKinds = function (ctx, n) {
    const log = S().mirror.log.filter((e) => e.id === ctx.id).map((e) => e.kind);
    const seen = {}; log.forEach((k) => { seen[k] = (seen[k] || 0) + 1; });
    const r = C.rng('mk:' + ctx.id + ':' + log.length + ':' + C.dateKey());
    const pool = C.shuffle(ORDER.slice(), r).sort((a, b) => (seen[a] || 0) - (seen[b] || 0));
    const want = ctx.kinds ? ctx.kinds.filter((k) => M.KINDS[k]) : null;
    const base = want && want.length ? want : pool;
    return base.slice(0, n);
  };

  /* ---------- Question UI ---------- */
  function questionNode(ctx, kind, onAnswered, compact) {
    const K = M.KINDS[kind];
    let chosen = null;
    const wrap = h('div', { class: 'mq' + (compact ? ' compact' : '') });
    const chips = h('div', { class: 'mq-chips', role: 'group', 'aria-label': K.label });
    const ta = h('textarea', { class: 'input', rows: compact ? 2 : 3, placeholder: K.hint, 'aria-label': 'Your words (optional)', maxlength: 600 });
    const msg = h('p', { class: 'fine mq-ack', hidden: true });
    const save = kit.btn('Save', () => {
      if (!chosen && !ta.value.trim()) { C.toast('Pick an option or write a line'); return; }
      const gain = M.record(ctx, kind, chosen, ta.value);
      save.disabled = skip.disabled = true; C.$$('button', chips).forEach((b) => { b.disabled = true; }); ta.disabled = true;
      msg.hidden = false; msg.textContent = ACK[kind] + (gain ? ' +' + gain + ' insight.' : '');
      onAnswered && onAnswered(true);
    }, 'primary small');
    const skip = kit.btn('Skip', () => { save.disabled = skip.disabled = true; wrap.classList.add('skipped'); onAnswered && onAnswered(false); }, 'ghost small');
    K.chips.forEach(([label, key]) => {
      const b = h('button', { class: 'chip toggle', type: 'button', 'aria-pressed': 'false', onclick: () => { chosen = chosen === key ? null : key; C.$$('button', chips).forEach((x) => { const on = x === b && chosen === key; x.classList.toggle('on', on); x.setAttribute('aria-pressed', String(on)); }); } }, label);
      chips.append(b);
    });
    wrap.append(h('div', { class: 'kicker', text: 'Mirror · ' + K.label }), h('p', { class: 'mq-q', text: K.q(ctx) }), chips, ta, h('div', { class: 'row' }, save, skip), msg);
    return wrap;
  }

  /** A short sequence of n questions about ctx. Calls onDone(answeredCount) at the end. */
  M.ask = function (ctx, n, onDone) {
    const kinds = M.pickKinds(ctx, n), root = h('div', { class: 'mirror-seq' });
    let i = 0, answered = 0;
    const next = () => {
      if (i >= kinds.length) { root.append(h('p', { class: 'fine', text: 'That is your mirror for this idea. Nothing here is marked right or wrong. It only adds to the picture of how you think.' })); onDone && onDone(answered); return; }
      const q = questionNode(ctx, kinds[i], (ok) => { if (ok) answered++; i++; setTimeout(next, 250); });
      root.append(q);
    };
    next();
    return root;
  };

  /** One compact question for a card’s takeaway. */
  M.card = function (ctx) {
    const kind = M.pickKinds(ctx, 1)[0];
    const box = h('div', { class: 'tk-mirror' });
    box.append(questionNode(ctx, kind, null, true));
    const old = M.revisitCandidate();
    if (old) box.append(M.revisitNode(old));
    return box;
  };

  /* ---------- Revisit: would you answer the same today? ---------- */
  M.revisitCandidate = function () {
    const m = S().mirror, now = Date.now(), DAY = 86400000;
    const c = m.log.filter((e) => e.chip && ['evidence', 'opposite', 'confidence', 'assume'].includes(e.kind) && now - e.t > 3 * DAY && (!e.rev || now - e.rev[e.rev.length - 1].t > 14 * DAY));
    if (!c.length) return null;
    return c.sort((a, b) => ((a.rev ? a.rev.length : 0) - (b.rev ? b.rev.length : 0)) || (a.t - b.t))[0];
  };
  M.revisitNode = function (e) {
    const box = h('div', { class: 'revisit' }), K = M.KINDS[e.kind];
    box.append(h('div', { class: 'kicker', text: 'Revisit' }), h('p', { class: 'mq-q', text: 'On ' + new Date(e.t).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) + ' you were asked: ' + K.q({ title: e.title, claim: e.claim }) }),
      h('p', { class: 'fine', text: 'You answered: ' + chipLabel(e.kind, e.chip) + (e.text ? ' · “' + e.text.slice(0, 120) + '”' : '') }), h('p', { class: 'mq-q', text: 'Would you answer the same today?' }));
    const row = h('div', { class: 'mq-chips' });
    [['The same', 'same'], ['Differently now', 'diff'], ['Not sure', 'unsure']].forEach(([l, k]) => row.append(h('button', { class: 'chip toggle', type: 'button', onclick: () => {
      C.store.update((s) => { const x = s.mirror.log.find((y) => y.t === e.t); if (!x) return; (x.rev = x.rev || []).push({ t: Date.now(), r: k }); s.mirror.revisits++; if (k === 'diff') s.mirror.shifts++; });
      C.clear(box).append(h('p', { class: 'fine', text: k === 'diff' ? 'Noted. Changing your answer over time is what learning looks like. You can re-answer the question on the idea’s page whenever you like.' : 'Noted. Holding steady is also information.' }));
      C.progress.check();
    } }, l)));
    box.append(row);
    return box;
  };

  /* ---------- Profile ---------- */
  M.profile = function () {
    const s = S(), log = s.mirror.log;
    const by = {}; ORDER.forEach((k) => { by[k] = {}; });
    log.forEach((e) => { if (e.chip && by[e.kind]) by[e.kind][e.chip] = (by[e.kind][e.chip] || 0) + 1; });
    const lex = { n: 0, w: 0, hedge: 0, abs: 0, contrast: 0, causal: 0, abstract: 0, q: 0 };
    log.forEach((e) => { if (e.f && e.f.w) { lex.n++; ['w', 'hedge', 'abs', 'contrast', 'causal', 'abstract', 'q'].forEach((k) => { lex[k] += e.f[k] || 0; }); } });
    const topics = {}, themes = {};
    const bump = (o, k, v) => { o[k] = (o[k] || 0) + v; };
    log.forEach((e) => { bump(topics, e.topic, e.text ? 2 : 1); (e.th || []).forEach((t) => bump(themes, t, 1)); });
    Object.keys(s.exp).forEach((id) => { const x = s.exp[id]; const e = C.byId[id]; if (x.done && e) { bump(topics, e.topic, 0.5); (T2TH[e.topic] || []).forEach((t) => bump(themes, t, 0.5)); } });
    Object.keys(s.holes || {}).forEach((id) => { const hs = s.holes[id], n = Object.keys(hs.paths || {}).length; if (!n) return; const hole = C.holes.get(id); if (!hole) return; bump(topics, hole.topic, 2 * n); M.themesFor(hole).forEach((t) => bump(themes, t, 1.5 * n)); });
    return { n: log.length, by, lex, topics, themes, shifts: s.mirror.shifts, revisits: s.mirror.revisits, mindChanges: s.stats.mindChanges };
  };
  const rate = (n, w) => (w ? Math.round((n / w) * 1000) / 10 : 0);

  function distBars(kind, counts, title, note) {
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    const box = h('div', { class: 'card-panel mirror-block' }, h('b', { text: title }));
    if (!total) { box.append(h('p', { class: 'fine', text: 'No answers yet. Questions appear after you explore an idea.' })); return box; }
    Object.entries(counts).sort((a, b) => b[1] - a[1]).forEach(([k, n]) => {
      box.append(h('div', { class: 'bar-row' }, h('div', { class: 'bar-label', text: chipLabel(kind, k) }), h('div', { class: 'bar' }, h('div', { class: 'bar-fill', style: { width: Math.round((n / total) * 100) + '%' } })), h('div', { class: 'bar-pct', text: String(n) })));
    });
    if (note) box.append(h('p', { class: 'fine', text: note }));
    return box;
  }

  M.insights = function (p) {
    const out = [], top = (o) => Object.entries(o).sort((a, b) => b[1] - a[1])[0];
    const ev = top(p.by.evidence), op = top(p.by.opposite), og = top(p.by.origin), as = top(p.by.assume);
    if (ev) out.push('When asked what would change your mind, you most often chose “' + chipLabel('evidence', ev[0]).toLowerCase() + '”.');
    if (op) out.push('Asked whether you could argue the other side, your most common answer was “' + chipLabel('opposite', op[0]).toLowerCase() + '”.');
    if (og) out.push('Your first instincts most often trace back to: ' + chipLabel('origin', og[0]).toLowerCase() + '.');
    if (as) out.push('The assumption you name most: “' + chipLabel('assume', as[0]).toLowerCase() + '”.');
    if (p.mindChanges) out.push('You have changed your mind on ' + p.mindChanges + ' idea' + (p.mindChanges > 1 ? 's' : '') + ' after hearing the other side.');
    if (p.revisits) out.push('You have revisited ' + p.revisits + ' earlier answer' + (p.revisits > 1 ? 's' : '') + (p.shifts ? ' and answered differently ' + p.shifts + ' time' + (p.shifts > 1 ? 's' : '') : ' and kept the same view each time') + '.');
    return out;
  };

  /* ---------- Views ---------- */
  V.mirror = function () {
    const p = M.profile(), root = V.page('The Intellectual Mirror', 'A private picture of how you reason and what draws you in. It describes your patterns. It never judges your beliefs.');
    root.append(h('section', { class: 'hero-stats' }, h('div', { class: 'stat-row' },
      h('div', { class: 'stat' }, h('b', { text: String(p.n) }), h('span', { text: 'answers' })),
      h('div', { class: 'stat' }, h('b', { text: String(Object.keys(p.topics).length) }), h('span', { text: 'subjects touched' })),
      h('div', { class: 'stat' }, h('b', { text: String(p.revisits) }), h('span', { text: 'revisits' })),
      h('div', { class: 'stat' }, h('b', { text: String(p.mindChanges) }), h('span', { text: 'mind changes' })))));
    if (!p.n) {
      root.append(h('div', { class: 'card-panel' }, h('b', { text: 'Nothing here yet' }), h('p', { class: 'fine', text: 'After you finish an experience or a pathway in a Rabbit Hole, the Mirror asks a question or two: what you assumed, what would change your mind, whether you can argue the other side. Your answers build this page.' }), h('a', { class: 'btn primary', href: '#/holes' }, 'Go down a rabbit hole')));
    } else {
      const ins = M.insights(p);
      if (ins.length) root.append(h('h2', { class: 'sec', text: 'Patterns so far' }), h('div', { class: 'card-panel' }, h('ul', { class: 'insight-list' }, ...ins.map((x) => h('li', { text: x }))), h('p', { class: 'fine', text: 'These are descriptions of what you have said, not conclusions about who you are. They become more meaningful with more answers.' })));
      root.append(h('h2', { class: 'sec', text: 'How you reason' }),
        distBars('evidence', p.by.evidence, 'What would change your mind', 'Different kinds of evidence suit different questions. This only shows which you reach for.'),
        distBars('opposite', p.by.opposite, 'Arguing the other side'),
        distBars('assume', p.by.assume, 'Assumptions you notice in yourself'),
        distBars('origin', p.by.origin, 'Where first instincts come from'),
        distBars('confidence', p.by.confidence, 'How sure you are'));
      const L = p.lex;
      root.append(h('h2', { class: 'sec', text: 'Your words' }));
      if (L.n < 3) root.append(h('div', { class: 'card-panel' }, h('p', { class: 'fine', text: 'Write a few answers in your own words (optional text boxes under each question) and a picture of how you phrase ideas will appear here. Needs at least 3 written answers; you have ' + L.n + '.' })));
      else {
        const cell = (label, v, note) => h('div', { class: 'stat lexstat' }, h('b', { text: String(v) }), h('span', { text: label }), h('span', { class: 'fine', text: note }));
        root.append(h('div', { class: 'card-panel' }, h('div', { class: 'stat-row wrap' },
          cell('hedges /100 words', rate(L.hedge, L.w), 'maybe, perhaps, I think'),
          cell('absolutes /100', rate(L.abs, L.w), 'always, never, clearly'),
          cell('contrasts /100', rate(L.contrast, L.w), 'but, however, although'),
          cell('reasons /100', rate(L.causal, L.w), 'because, therefore'),
          cell('abstract nouns /100', rate(L.abstract, L.w), 'e.g. freedom, identity'),
          cell('questions asked', L.q, 'question marks')),
          h('p', { class: 'fine', text: 'Based on ' + L.n + ' written answers (' + L.w + ' words). Hedging is not weakness and absolutes are not error; each fits some situations. This is a mirror, not a grade.' })));
      }
      const tops = Object.entries(p.topics).sort((a, b) => b[1] - a[1]).slice(0, 5), ths = Object.entries(p.themes).sort((a, b) => b[1] - a[1]).slice(0, 6);
      root.append(h('h2', { class: 'sec', text: 'What draws you' }), h('div', { class: 'card-panel' },
        h('div', { class: 'kicker', text: 'Subjects you linger in' }), h('div', { class: 'chip-cloud' }, ...tops.map(([id]) => { const tp = C.topic(id); return h('a', { class: 'chip link', href: '#/explore/topic/' + id, style: { '--accent': tp.color }, text: tp.short }); })),
        h('div', { class: 'kicker', style: { marginTop: '14px' }, text: 'Recurring themes' }), h('div', { class: 'chip-cloud' }, ...ths.map(([t]) => h('span', { class: 'chip', text: M.THEMES[t] }))),
        h('p', { class: 'fine', text: 'Built from the ideas you finish, the rabbit-hole paths you take and what you answer. It is meant to suggest where to look next, so about a third of your feed still comes from subjects you see least.' })));
      const old = M.revisitCandidate();
      if (old) root.append(h('h2', { class: 'sec', text: 'Revisit an old answer' }), h('div', { class: 'card-panel' }, M.revisitNode(old)));
      root.append(h('h2', { class: 'sec', text: 'Recent answers' }));
      const list = h('div', { class: 'mirror-log' });
      M.log().slice(-12).reverse().forEach((e) => {
        list.append(h('div', { class: 'mlog-row' }, h('div', { class: 'li-main' }, h('b', { text: e.title }), h('span', { class: 'fine', text: M.KINDS[e.kind].label + ' · ' + new Date(e.t).toLocaleDateString() + (e.chip ? ' · ' + chipLabel(e.kind, e.chip) : '') }), e.text ? h('p', { class: 'fine', text: '“' + e.text + '”' }) : null),
          h('button', { class: 'icon-btn', type: 'button', 'aria-label': 'Delete this answer', onclick: () => { M.remove(e.t); C.router.refresh(); } }, C.icon('trash', 18))));
      });
      root.append(list, h('div', { class: 'row' }, kit.btn('Clear all Mirror data', () => { if (confirm('Delete all Mirror answers on this device?')) { M.clear(); C.router.refresh(); } }, 'ghost small')));
    }
    root.append(h('p', { class: 'fine', text: 'The Mirror is not a personality test. It never labels a belief right or wrong, and nothing leaves this device.' }));
    return root;
  };

  /** Compact summary for My Mind. */
  V.mirrorSummary = function () {
    const p = M.profile(), ins = M.insights(p);
    return h('div', { class: 'card-panel' }, h('div', { class: 'kicker', text: 'The Intellectual Mirror' }),
      ins.length ? h('ul', { class: 'insight-list' }, ...ins.slice(0, 3).map((x) => h('li', { text: x }))) : h('p', { class: 'fine', text: 'Answer the questions that appear after an idea and a picture of how you reason will grow here.' }),
      h('a', { class: 'btn ghost small', href: '#/mirror' }, p.n ? 'Open the Mirror (' + p.n + ' answers)' : 'About the Mirror'));
  };
})();
