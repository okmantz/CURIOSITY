/* Persistent state in localStorage with versioning, safe fallbacks and change events */
(function () {
  const C = (window.CUR = window.CUR || {});
  const KEY = 'curiosity.v1';
  const listeners = new Set();
  let mem = null; // in-memory fallback when storage is unavailable
  let timer = null;

  const defaults = () => ({
    v: 1,
    onboarded: false,
    profile: { name: '', handle: '', bio: '', joined: Date.now() },
    prefs: { theme: 'dark', depth: 2, weeklyGoal: 7, weeklyTopics: 4, reduceMotion: false, sound: true },
    interests: [],
    xp: 0,
    exp: {},          // per experience: {views, dwell, done, doneAt, answers, reflection, liked, box, due, correct, wrong, seenAt}
    topic: {},        // per topic: {aff, xp, done, views, skips}
    saved: [],        // ordered ids
    collections: [],  // {id, name, items:[ids], created}
    follows: { topics: [], thinkers: [], curators: [] },
    activity: {},     // dateKey -> {done, xp, topics:[]}
    streak: { current: 0, best: 0, last: null },
    daily: {},        // dateKey -> {challenge:bool, journey:[ids], complete:bool}
    journeys: {},     // id -> {done:[ids], completedAt}
    achievements: {}, // id -> ts
    stats: { reflections: 0, recallCorrect: 0, recallTotal: 0, mindChanges: 0, shares: 0, debates: 0, dailyJourneys: 0, formats: [], pairs: [] },
    lastFormats: [],
    sessions: 0,
    lastSeenDay: null
  });

  function read() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* ignore */ }
    return null;
  }
  function merge(base, over) {
    for (const k of Object.keys(over || {})) {
      if (over[k] && typeof over[k] === 'object' && !Array.isArray(over[k]) && base[k] && typeof base[k] === 'object' && !Array.isArray(base[k])) merge(base[k], over[k]);
      else base[k] = over[k];
    }
    return base;
  }
  function load() {
    const saved = read();
    mem = merge(defaults(), saved || {});
    if (!mem.profile.joined) mem.profile.joined = Date.now();
    return mem;
  }
  function flush() {
    timer = null;
    try { localStorage.setItem(KEY, JSON.stringify(mem)); } catch (e) { /* quota or private mode: keep in memory */ }
  }

  const S = (C.store = {
    get state() { return mem || load(); },
    /** Mutate state then persist + notify. */
    update(fn) {
      const r = fn(S.state);
      if (!timer) timer = setTimeout(flush, 150);
      listeners.forEach((l) => { try { l(S.state); } catch (e) { console.error(e); } });
      return r;
    },
    on(fn) { listeners.add(fn); return () => listeners.delete(fn); },
    flushNow() { if (timer) { clearTimeout(timer); } flush(); },
    reset() { mem = defaults(); flush(); listeners.forEach((l) => l(mem)); },
    exportJSON() { return JSON.stringify(S.state, null, 2); },
    importJSON(text) {
      const obj = JSON.parse(text);
      if (!obj || typeof obj !== 'object' || obj.v !== 1) throw new Error('Not a CURIOSITY export');
      mem = merge(defaults(), obj); flush(); listeners.forEach((l) => l(mem));
    },
    /** helpers */
    ex(id) {
      const s = S.state;
      return s.exp[id] || (s.exp[id] = { views: 0, dwell: 0, done: false, answers: {}, reflection: '', liked: false, box: 0, due: null, correct: 0, wrong: 0 });
    },
    tp(t) {
      const s = S.state;
      return s.topic[t] || (s.topic[t] = { aff: 0, xp: 0, done: 0, views: 0, skips: 0 });
    }
  });
  window.addEventListener('pagehide', () => S.flushNow());
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') S.flushNow(); });
  load();
})();
