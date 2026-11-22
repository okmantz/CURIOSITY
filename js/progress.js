/* Progression: XP, levels, streaks, mastery, weekly goals, daily sets, journeys, achievements.
   Rewards understanding and reflection, not views: XP comes only from completing experiences,
   writing reflections, correct memory checks and changing your mind after hearing the other side. */
(function () {
  const C = (window.CUR = window.CUR || {});
  const P = (C.progress = {});
  const FORMAT_COUNT = Object.keys(C.FORMATS).length - 2; // recall and drill are generated, not counted

  function addXP(n, topic) {
    C.store.update((s) => { s.xp += n; if (topic) C.store.tp(topic).xp += n; const a = s.activity[C.dateKey()] || (s.activity[C.dateKey()] = { done: 0, xp: 0, topics: [] }); a.xp += n; });
  }
  P.addXP = addXP;

  P.levelInfo = function (xp = C.store.state.xp) {
    let idx = 0;
    C.LEVELS.forEach((l, i) => { if (xp >= l.xp) idx = i; });
    const cur = C.LEVELS[idx], nxt = C.LEVELS[idx + 1];
    return { idx, name: cur.name, next: nxt ? nxt.name : null, xp, from: cur.xp, to: nxt ? nxt.xp : cur.xp, pct: nxt ? (xp - cur.xp) / (nxt.xp - cur.xp) : 1 };
  };

  P.streak = function () {
    const s = C.store.state.streak, today = C.dateKey();
    if (!s.last) return { current: 0, best: s.best, today: false, atRisk: false };
    const gap = C.daysBetween(s.last, today);
    return { current: gap <= 1 ? s.current : 0, best: s.best, today: gap === 0, atRisk: gap === 1 };
  };

  P.todayActivity = () => C.store.state.activity[C.dateKey()] || { done: 0, xp: 0, topics: [] };

  P.week = function () {
    const s = C.store.state, start = C.weekStart();
    const topics = new Set(); let done = 0, xp = 0;
    const days = [];
    for (let i = 0; i < 7; i++) {
      const k = C.addDays(start, i), a = s.activity[k];
      days.push({ key: k, done: a ? a.done : 0 });
      if (a) { done += a.done; xp += a.xp; (a.topics || []).forEach((t) => topics.add(t)); }
    }
    return { done, xp, topics: topics.size, days, goal: s.prefs.weeklyGoal, topicGoal: s.prefs.weeklyTopics };
  };

  P.masteryInfo = function (topic) {
    const lvl = C.engine.masteryLevel(topic), xp = C.store.tp(topic).xp;
    const nxt = C.MASTERY_XP[lvl + 1];
    return { lvl, name: C.MASTERY[lvl], xp, pct: nxt ? (xp - C.MASTERY_XP[lvl]) / (nxt - C.MASTERY_XP[lvl]) : 1 };
  };

  /** Called by templates when an experience is finished. */
  P.complete = function (exp, info = {}) {
    const id = exp.id, today = C.dateKey();
    const s0 = C.store.state;
    const ex = C.store.ex(id);
    const first = !ex.done;
    let gained = 0;
    C.store.update((s) => {
      ex.done = true; ex.doneAt = Date.now(); if (!ex.firstDoneAt) ex.firstDoneAt = ex.doneAt;
      const act = s.activity[today] || (s.activity[today] = { done: 0, xp: 0, topics: [] });
      act.done++;
      if (!act.topics.includes(exp.topic)) act.topics.push(exp.topic);
      // streak
      const st = s.streak;
      if (st.last !== today) { st.current = st.last && C.daysBetween(st.last, today) === 1 ? st.current + 1 : 1; st.last = today; st.best = Math.max(st.best, st.current); }
      if (!s.stats.formats.includes(exp.type)) s.stats.formats.push(exp.type);
      if (exp.type === 'debate' && first) s.stats.debates++;
      s.lastSeenDay = today;
    });
    if (first) {
      gained = 8 + 3 * exp.diff;
      addXP(gained, exp.topic);
      C.store.update((s) => { C.store.tp(exp.topic).done++; });
      C.engine.signal(exp.topic, 'complete');
      C.engine.scheduleFirstRecall(id);
    }
    if (info.changedMind && !ex.changedAwarded) {
      C.store.update((s) => { ex.changedAwarded = true; s.stats.mindChanges++; });
      addXP(3, exp.topic); gained += 3;
    }
    // journeys
    C.JOURNEYS.forEach((j) => {
      if (!j.ids.includes(id)) return;
      C.store.update((s) => {
        const jr = s.journeys[j.id] || (s.journeys[j.id] = { done: [], completedAt: null });
        if (!jr.done.includes(id)) jr.done.push(id);
      });
      const jr = C.store.state.journeys[j.id];
      if (!jr.completedAt && j.ids.every((x) => jr.done.includes(x))) {
        C.store.update(() => { jr.completedAt = Date.now(); });
        addXP(20, j.topic); gained += 20;
        C.toast('Journey complete: ' + j.title);
        C.bus.emit('journey-complete', j);
      }
    });
    // daily
    const picks = C.engine.dailyPicks();
    C.store.update((s) => {
      const d = s.daily[today] || (s.daily[today] = { challenge: false, journey: [], complete: false });
      if (picks.challenge.id === id) d.challenge = true;
      if (picks.journey.some((e) => e.id === id) && !d.journey.includes(id)) d.journey.push(id);
    });
    const d = C.store.state.daily[today];
    if (!d.complete && picks.journey.every((e) => d.journey.includes(e.id))) {
      C.store.update((s) => { d.complete = true; s.stats.dailyJourneys++; });
      addXP(15, null); gained += 15;
      C.toast('Daily journey complete');
      C.bus.emit('daily-complete');
    }
    P.check();
    C.bus.emit('complete', { exp, gained, first });
    return { gained, first };
  };

  P.reflect = function (id, text) {
    const ex = C.store.ex(id), exp = C.byId[id] || C.byId[id.replace('recall:', '')];
    const t = text.trim();
    C.store.update((s) => { ex.reflection = text; });
    if (t.length >= 20 && !ex.reflectedAwarded) {
      C.store.update((s) => { ex.reflectedAwarded = true; s.stats.reflections++; });
      addXP(5, exp && exp.topic);
      C.engine.signal(exp ? exp.topic : 'philosophy', 'reflect');
      C.toast('Reflection saved. +5');
      P.check();
    }
  };

  P.recall = function (of, ok) {
    C.engine.recordRecall(of, ok);
    if (ok) { addXP(3, C.byId[of].topic); }
    P.check();
  };

  /* ----- Achievements ----- */
  P.litEdges = () => C.engine.topicEdges().filter((e) => e.lit > 0).length;
  const RULES = {
    'first-spark': (s) => Object.values(s.exp).some((x) => x.done),
    'three-days': (s) => s.streak.best >= 3,
    'week-streak': (s) => s.streak.best >= 7,
    polymath: (s) => Object.values(s.topic).filter((t) => t.done > 0).length >= 6,
    renaissance: (s) => Object.values(s.topic).filter((t) => t.done > 0).length >= 12,
    contrarian: (s) => s.stats.mindChanges >= 1,
    'both-sides': (s) => s.stats.debates >= 3,
    reflective: (s) => s.stats.reflections >= 5,
    journal: (s) => s.stats.reflections >= 20,
    falsifier: (s) => s.exp['wason-lab'] && s.exp['wason-lab'].done,
    steelmanner: (s) => s.exp['apply-steelman'] && s.exp['apply-steelman'].done,
    journeyman: (s) => Object.values(s.journeys).filter((j) => j.completedAt).length >= 1,
    wayfarer: (s) => Object.values(s.journeys).filter((j) => j.completedAt).length >= 3,
    'daily-ritual': (s) => s.stats.dailyJourneys >= 3,
    'long-memory': (s) => s.stats.recallCorrect >= 10,
    'full-spectrum': (s) => s.stats.formats.length >= FORMAT_COUNT,
    cartographer: () => P.litEdges() >= 8,
    sharer: (s) => s.stats.shares >= 1,
    'first-hole': (s) => holePaths(s) >= 1,
    'deep-diver': (s) => Object.keys(s.holes).some((id) => { const hl = C.holes && C.holes.get(id); return hl && hl.paths.every((p) => s.holes[id].paths && s.holes[id].paths[p.id]); }),
    'hole-wanderer': (s) => holePaths(s) >= 25,
    'mirror-gazer': (s) => s.mirror.log.length >= 10,
    'mirror-keeper': (s) => s.mirror.log.length >= 50,
    'atlas-first': (s) => s.atlasMeta.sessions >= 1,
    'atlas-500': (s) => s.atlasMeta.total >= 500,
    'atlas-all': (s) => C.TOPICS.every((t) => s.topic[t.id] && s.topic[t.id].atlas)
  };
  function holePaths(s) { return Object.values(s.holes).reduce((a, x) => a + Object.keys(x.paths || {}).length, 0); }
  /* Called by js/atlas.js when a session finishes. */
  P.atlasDone = function (topic) {
    C.store.update((s) => { s.atlasMeta.sessions = (s.atlasMeta.sessions || 0) + 1; if (topic) C.store.tp(topic).atlas = true; });
    P.check();
  };
  /* Called by js/holes.js when a path is finished. Returns XP awarded. */
  P.holePath = function (hole, path, first) {
    const gain = first ? 6 : 1;
    addXP(gain, hole.topic); P.check();
    return gain;
  };
  P.check = function () {
    const s = C.store.state, fresh = [];
    C.ACHIEVEMENTS.forEach((a) => { if (!s.achievements[a.id] && RULES[a.id] && RULES[a.id](s)) fresh.push(a); });
    if (fresh.length) {
      C.store.update((st) => { fresh.forEach((a) => { st.achievements[a.id] = Date.now(); }); });
      fresh.forEach((a, i) => setTimeout(() => C.toast('Achievement: ' + a.name), 900 + i * 1200));
    }
    return fresh;
  };
  P.progressHint = function (a) {
    const s = C.store.state;
    const n = {
      'three-days': [s.streak.best, 3], 'week-streak': [s.streak.best, 7], polymath: [Object.values(s.topic).filter((t) => t.done > 0).length, 6], renaissance: [Object.values(s.topic).filter((t) => t.done > 0).length, 12],
      reflective: [s.stats.reflections, 5], journal: [s.stats.reflections, 20], 'both-sides': [s.stats.debates, 3], 'long-memory': [s.stats.recallCorrect, 10], 'full-spectrum': [s.stats.formats.length, FORMAT_COUNT],
      cartographer: [P.litEdges(), 8], wayfarer: [Object.values(s.journeys).filter((j) => j.completedAt).length, 3], 'daily-ritual': [s.stats.dailyJourneys, 3], 'hole-wanderer': [holePaths(s), 25], 'mirror-gazer': [s.mirror.log.length, 10], 'mirror-keeper': [s.mirror.log.length, 50], 'atlas-500': [s.atlasMeta.total, 500]
    }[a.id];
    return n ? Math.min(n[0], n[1]) + ' / ' + n[1] : null;
  };

  /* Tiny event bus */
  const subs = {};
  C.bus = { on(ev, fn) { (subs[ev] = subs[ev] || []).push(fn); }, emit(ev, d) { (subs[ev] || []).forEach((f) => { try { f(d); } catch (e) { console.error(e); } }); } };
})();
