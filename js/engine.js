/* The personalised discovery engine. Runs fully on-device.
   Balances: affinity (what you like) + novelty (what you have not seen) + connection (links to what you know)
   + difficulty fit + format variety, and reserves a share of the feed for deliberate exploration outside your
   usual interests. Also schedules memory checks (Leitner spaced repetition). */
(function () {
  const C = (window.CUR = window.CUR || {});
  const INTERVALS = [0, 1, 3, 7, 16, 35]; // days per Leitner box

  const E = (C.engine = {});

  /* ----- Signals ----- */
  E.signal = function (topic, kind) {
    const w = { view: 0.15, complete: 1.0, like: 1.0, save: 1.4, skip: -0.35, share: 1.0, reflect: 0.8, follow: 2.0 }[kind] || 0;
    C.store.update((s) => { C.store.tp(topic).aff += w; });
  };

  E.masteryLevel = function (topic) {
    const xp = C.store.tp(topic).xp;
    let lvl = 0;
    C.MASTERY_XP.forEach((t, i) => { if (xp >= t && xp > 0) lvl = i; });
    return lvl;
  };

  E.targetDifficulty = function (topic) {
    const pref = C.store.state.prefs.depth; // 1..3
    return C.clamp(pref + (E.masteryLevel(topic) - 2) * 0.25, 1, 3);
  };

  /* ----- Scoring ----- */
  function score(e, ctx) {
    const s = C.store.state, tp = C.store.tp(e.topic), ex = s.exp[e.id];
    const prior = s.interests.includes(e.topic) ? 1.2 : 0;
    const aff = Math.tanh((prior + tp.aff) / 3) * 1.6;
    const nov = 1 / (1 + tp.views / 3);
    const doneTopics = (e.links || []).filter((t) => (s.topic[t] && s.topic[t].done > 0)).length;
    const conn = (e.links && e.links.length) ? doneTopics / e.links.length : 0;
    const diff = -Math.abs(E.targetDifficulty(e.topic) - e.diff) * 0.45;
    const recent = ctx.recent;
    const rep = (recent.slice(-2).some((r) => r.type === e.type) ? 1 : 0) + (recent.length && recent[recent.length - 1].topic === e.topic ? 1.6 : 0);
    const fol = (s.follows.topics.includes(e.topic) ? 0.7 : 0) + ((e.thinkers || []).some((t) => s.follows.thinkers.includes(t)) ? 0.7 : 0);
    const seen = ex && ex.done ? 6 : (ex && ex.views > 0 ? 0.8 + Math.max(0, 1.5 - (Date.now() - (ex.seenAt || 0)) / 3.6e6) : 0);
    return aff * 1.0 + nov * 0.9 + conn * 0.5 + diff + fol - rep * 0.9 - seen + Math.random() * 0.55;
  }

  /** Experiences with a memory check due today. */
  E.dueRecalls = function () {
    const today = C.dateKey(), s = C.store.state;
    return Object.keys(s.exp).filter((id) => { const x = s.exp[id]; return x.done && x.due && x.due <= today && C.byId[id]; })
      .sort((a, b) => s.exp[a].due.localeCompare(s.exp[b].due));
  };

  E.recordRecall = function (id, ok) {
    C.store.update((s) => {
      const x = C.store.ex(id);
      x.box = ok ? Math.min(5, (x.box || 1) + 1) : 1;
      x.due = C.addDays(C.dateKey(), INTERVALS[x.box]);
      ok ? x.correct++ : x.wrong++;
      s.stats.recallTotal++;
      if (ok) s.stats.recallCorrect++;
    });
  };
  E.scheduleFirstRecall = function (id) {
    C.store.update(() => { const x = C.store.ex(id); if (!x.box) { x.box = 1; x.due = C.addDays(C.dateKey(), 1); } });
  };
  /** Average memory strength 0-100 across completed experiences. */
  E.retention = function () {
    const s = C.store.state, ids = Object.keys(s.exp).filter((i) => s.exp[i].done && s.exp[i].box);
    if (!ids.length) return null;
    const today = C.dateKey();
    const v = ids.map((i) => { const x = s.exp[i]; let st = (x.box / 5) * 100; if (x.due && x.due < today) st *= Math.max(0.4, 1 - C.daysBetween(x.due, today) * 0.05); return st; });
    return Math.round(v.reduce((a, b) => a + b, 0) / v.length);
  };

  /* ----- Candidate selection ----- */
  /**
   * @param {number} n  how many cards to return
   * @param {object} opts {filter: fn(e), exclude:Set, recent:[exp], includeRecall:boolean}
   * @returns [{exp, why}]  why in 'for-you' | 'explore' | 'follow' | 'review' | 'revisit'
   */
  E.next = function (n, opts = {}) {
    const s = C.store.state;
    const exclude = opts.exclude || new Set();
    const recent = (opts.recent || []).slice();
    const out = [];
    let pool = C.library.filter((e) => (!opts.filter || opts.filter(e)));
    const fresh = () => pool.filter((e) => !exclude.has(e.id) && !(s.exp[e.id] && s.exp[e.id].done));

    for (let i = 0; i < n; i++) {
      // memory check slot
      if (opts.includeRecall && i === 2 && !out.some((o) => o.exp.type === 'recall')) {
        const due = E.dueRecalls().filter((id) => !exclude.has('recall:' + id));
        if (due.length) { const rc = C.makeRecall(due[0]); exclude.add(rc.id); out.push({ exp: rc, why: 'review' }); recent.push(rc); continue; }
      }
      let cand = fresh();
      let why = 'for-you';
      if (!cand.length) {
        // everything completed: revisit the oldest completed items, re-asking them with fresh eyes
        cand = pool.filter((e) => !exclude.has(e.id));
        if (!cand.length) { exclude.clear(); cand = pool.slice(); }
        if (!cand.length) break;
        cand.sort((a, b) => ((s.exp[a.id] && s.exp[a.id].doneAt) || 0) - ((s.exp[b.id] && s.exp[b.id].doneAt) || 0));
        const e = cand[0]; exclude.add(e.id); out.push({ exp: e, why: 'revisit' }); recent.push(e); continue;
      }
      let chosen;
      // exploration slot: ~30% of picks go to the least-explored subjects, regardless of affinity
      if (!opts.noExplore && Math.random() < 0.3) {
        const exposure = (t) => (s.topic[t] ? s.topic[t].views + s.topic[t].done * 2 : 0);
        const minExp = Math.min(...cand.map((e) => exposure(e.topic)));
        const low = cand.filter((e) => exposure(e.topic) <= minExp + 1 && (!recent.length || recent[recent.length - 1].topic !== e.topic));
        if (low.length) { chosen = C.pick(low); why = 'explore'; }
      }
      if (!chosen) {
        const ctx = { recent };
        const scored = cand.map((e) => ({ e, sc: score(e, ctx) })).sort((a, b) => b.sc - a.sc);
        chosen = scored[Math.floor(Math.random() * Math.min(3, scored.length))].e; // pick among top 3 for variety
        if ((s.follows.topics.includes(chosen.topic) || (chosen.thinkers || []).some((t) => s.follows.thinkers.includes(t))) && Math.random() < 0.6) why = 'follow';
      }
      exclude.add(chosen.id); out.push({ exp: chosen, why }); recent.push(chosen);
    }
    return out;
  };

  /* ----- Curated sets ----- */
  E.dailyPicks = function (dateKey = C.dateKey()) {
    const r = C.rng('daily:' + dateKey);
    const s = C.store.state;
    // Challenge: a single high-engagement format
    const challengeTypes = ['challenge', 'debate', 'thought', 'predict', 'spot'];
    const ch = C.shuffle(C.library.filter((e) => challengeTypes.includes(e.type)), r)[0];
    // Journey: 5 experiences, distinct topics + formats, preferring those not yet completed
    const uncompleted = C.library.filter((e) => !(s.exp[e.id] && s.exp[e.id].done) && e.id !== ch.id);
    const pool = uncompleted.length >= 12 ? uncompleted : C.library.filter((e) => e.id !== ch.id);
    const shuffled = C.shuffle(pool, r);
    const picked = [], topics = new Set(), types = new Set();
    for (const e of shuffled) { if (!topics.has(e.topic) && !types.has(e.type)) { picked.push(e); topics.add(e.topic); types.add(e.type); } if (picked.length === 5) break; }
    for (const e of shuffled) { if (picked.length >= 5) break; if (!picked.includes(e)) picked.push(e); }
    picked.sort((a, b) => a.diff - b.diff);
    return { challenge: ch, journey: picked };
  };

  /** Edges for the knowledge map: pairs of topics that are linked by experiences, weighted by completions. */
  E.topicEdges = function () {
    const s = C.store.state, edges = {};
    C.library.forEach((e) => {
      (e.links || []).forEach((t) => {
        if (t === e.topic) return;
        const k = [e.topic, t].sort().join('|');
        const ed = edges[k] || (edges[k] = { a: e.topic, b: t, potential: 0, lit: 0 });
        ed.potential++;
        if (s.exp[e.id] && s.exp[e.id].done) ed.lit++;
      });
    });
    return Object.values(edges);
  };
})();
