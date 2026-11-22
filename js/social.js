/* Social layer. Everything here is LOCAL ONLY and labelled as such.
   The adapter interface is deliberately small so a real backend (Supabase, Firebase, your own API)
   can replace LocalAdapter later without touching the UI. See docs/ARCHITECTURE.md. */
(function () {
  const C = (window.CUR = window.CUR || {});

  /** Interface every adapter implements:
   *  sampleDistribution(expId, key, labels) -> {labels, pct[], n, simulated:boolean}
   *  submitResponse(expId, key, value)      -> Promise<void>
   *  follow(kind, id) / unfollow(kind, id)  -> Promise<void>
   *  isFollowing(kind, id)                  -> boolean
   *  publishCollection(collection)          -> Promise<{url}|null>
   */
  const LocalAdapter = {
    name: 'local',
    isRealCommunity: false,
    sampleDistribution(expId, key, labels) {
      // Deterministic, seeded demo distribution. NOT real user data.
      const r = C.rng(expId + ':' + key);
      const raw = labels.map(() => 0.4 + r() * 1.6);
      const sum = raw.reduce((a, b) => a + b, 0);
      const pct = raw.map((x) => Math.round((x / sum) * 100));
      const drift = 100 - pct.reduce((a, b) => a + b, 0);
      pct[0] += drift;
      return { labels, pct, n: 0, simulated: true };
    },
    submitResponse() { return Promise.resolve(); }, // stored locally by the store; nothing leaves the device
    isFollowing(kind, id) { return C.store.state.follows[kind].includes(id); },
    follow(kind, id) {
      C.store.update((s) => { if (!s.follows[kind].includes(id)) s.follows[kind].push(id); });
      return Promise.resolve();
    },
    unfollow(kind, id) {
      C.store.update((s) => { s.follows[kind] = s.follows[kind].filter((x) => x !== id); });
      return Promise.resolve();
    },
    publishCollection() { return Promise.resolve(null); } // needs a backend
  };

  C.social = { adapter: LocalAdapter, use(a) { C.social.adapter = a; } };
  C.social.sample = (...a) => C.social.adapter.sampleDistribution(...a);
  C.social.toggleFollow = (kind, id) => {
    const a = C.social.adapter;
    const on = a.isFollowing(kind, id);
    on ? a.unfollow(kind, id) : a.follow(kind, id);
    return !on;
  };
  C.social.isFollowing = (k, id) => C.social.adapter.isFollowing(k, id);

  /** Share a discovery: deep link + optional image card. Uses the Web Share API where available. */
  C.social.link = (id) => location.origin + location.pathname + '#/x/' + id;
  C.social.share = async function (exp) {
    const url = C.social.link(exp.id);
    const text = '“' + exp.takeaway + '” — ' + exp.title + ' on CURIOSITY';
    const done = () => { C.store.update((s) => { s.stats.shares++; }); C.progress && C.progress.check(); };
    try {
      if (navigator.share) { await navigator.share({ title: exp.title, text, url }); done(); return; }
    } catch (e) { if (e && e.name === 'AbortError') return; }
    try { await navigator.clipboard.writeText(text + '\n' + url); C.toast('Link copied to clipboard'); done(); }
    catch (e) { C.sheet('Share this discovery', C.h('div', {}, C.h('p', { text: text }), C.h('input', { class: 'input', value: url, readonly: true, onfocus: (ev) => ev.target.select() }))); done(); }
  };

  /** Render a shareable PNG card with the takeaway (no external services). */
  C.social.shareImage = function (exp) {
    const T = C.TOPICS.find((t) => t.id === exp.topic);
    const cv = document.createElement('canvas'); cv.width = 1080; cv.height = 1350;
    const g = cv.getContext('2d');
    g.fillStyle = '#0b0b0e'; g.fillRect(0, 0, 1080, 1350);
    const grad = g.createRadialGradient(780, 260, 20, 780, 260, 900);
    grad.addColorStop(0, T.color + '55'); grad.addColorStop(1, '#0b0b0e00');
    g.fillStyle = grad; g.fillRect(0, 0, 1080, 1350);
    g.strokeStyle = T.color + '66'; g.lineWidth = 2;
    for (let i = 1; i < 9; i++) { g.beginPath(); g.arc(780, 260, i * 90, 0, Math.PI * 2); g.stroke(); }
    g.fillStyle = T.color; g.font = '600 30px system-ui, sans-serif'; g.fillText(T.short.toUpperCase(), 90, 130);
    g.fillStyle = '#ece8df'; g.font = '600 68px Georgia, serif';
    wrap(g, exp.title, 90, 640, 900, 80, 3);
    g.font = '400 42px Georgia, serif'; g.fillStyle = '#c9c4b8';
    wrap(g, exp.takeaway, 90, 900, 900, 58, 6);
    g.fillStyle = '#c9a45c'; g.font = '600 34px system-ui, sans-serif'; g.fillText('CURIOSITY', 90, 1250);
    g.fillStyle = '#8a8579'; g.font = '400 28px system-ui, sans-serif'; g.fillText('Scroll to think.', 90, 1294);
    function wrap(ctx, text, x, y, maxW, lh, maxLines) {
      const words = text.split(' '); let line = ''; let n = 0;
      for (const w of words) {
        const test = line ? line + ' ' + w : w;
        if (ctx.measureText(test).width > maxW && line) { ctx.fillText(line, x, y); y += lh; line = w; if (++n >= maxLines) return; } else line = test;
      }
      ctx.fillText(line, x, y);
    }
    return new Promise((res) => cv.toBlob(res, 'image/png'));
  };
  C.social.shareImageFlow = async function (exp) {
    const blob = await C.social.shareImage(exp);
    const file = new File([blob], 'curiosity-' + exp.id + '.png', { type: 'image/png' });
    try {
      if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], title: exp.title }); return; }
    } catch (e) { if (e && e.name === 'AbortError') return; }
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = file.name; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  };
})();
