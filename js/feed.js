/* The vertical feed. Personalised + endless when driven by the engine; finite when given a list of ids. */
(function () {
  const C = (window.CUR = window.CUR || {});
  const h = C.h;

  /**
   * @param opts.ids       fixed list of experience ids (finite feed)
   * @param opts.filter    predicate for an engine-driven feed
   * @param opts.following restrict to followed subjects/thinkers
   * @param opts.startAt   index to scroll to initially
   * @param opts.endCard   fn() -> node shown after the last card of a finite feed
   * @param opts.onComplete fn(exp, info)
   * @param opts.nextLabel  label for the Next button in takeaways
   */
  C.Feed = function (opts = {}) {
    const feed = h('div', { class: 'feed', role: 'feed', 'aria-label': opts.label || 'Learning feed', tabindex: '0' });
    const cards = [];
    const exclude = new Set();
    const recent = [];
    let active = -1, loading = false, ended = false;
    const finite = !!opts.ids;
    let queue = finite ? opts.ids.slice() : null;

    function makeCard(exp, why) {
      const card = C.Card.create(exp, {
        why,
        nextLabel: opts.nextLabel || 'Next idea',
        onComplete: opts.onComplete,
        onNext: () => goTo(cards.indexOf(card) + 1)
      });
      cards.push(card); feed.append(card.el); io.observe(card.el); artIO.observe(card.el);
      return card;
    }
    function addBatch(n = 4) {
      if (loading || ended) return;
      loading = true;
      if (finite) {
        while (queue.length && n--) { const exp = C.resolve(queue.shift()); if (exp) makeCard(exp); }
        if (!queue.length) { ended = true; if (opts.endCard) { const end = h('article', { class: 'card end-card', 'aria-label': 'End of list' }, opts.endCard()); feed.append(end); } }
      } else {
        const picks = C.engine.next(n, { exclude, recent, filter: opts.filter || (opts.following ? followFilter : null), includeRecall: !opts.filter && !opts.following, noExplore: !!opts.following });
        if (!picks.length) { ended = true; feed.append(h('article', { class: 'card end-card' }, opts.empty ? opts.empty() : h('div', { class: 'end-inner' }, h('h2', { class: 'title', text: 'Nothing here yet' })))); }
        picks.forEach((p) => { makeCard(p.exp, p.why); recent.push(p.exp); });
      }
      loading = false;
    }
    function followFilter(e) {
      const f = C.store.state.follows;
      return f.topics.includes(e.topic) || (e.thinkers || []).some((t) => f.thinkers.includes(t)) || f.curators.some((cid) => (C.CURATORS.find((c) => c.id === cid) || { picks: [] }).picks.includes(e.id));
    }
    function goTo(i) {
      const el = feed.children[i];
      if (el) el.scrollIntoView({ behavior: C.reducedMotion() ? 'auto' : 'smooth', block: 'start' });
    }

    /* Which card is active? Drives dwell tracking, art rendering and endless loading. */
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting || en.intersectionRatio < 0.6) return;
        const i = cards.findIndex((c) => c.el === en.target);
        if (i < 0 || i === active) return;
        if (active >= 0 && cards[active]) cards[active].deactivate();
        active = i; cards[i].activate();
        feed.dataset.active = i;
        for (let k = i; k <= Math.min(i + 2, cards.length - 1); k++) cards[k].renderArt();
        if (!finite && i >= cards.length - 3) addBatch(4);
        opts.onActive && opts.onActive(i, cards[i]);
        hint.remove();
      });
    }, { root: feed, threshold: [0.6] });
    const artIO = new IntersectionObserver((entries) => entries.forEach((en) => { if (en.isIntersecting) { const c = cards.find((x) => x.el === en.target); c && c.renderArt(); } }), { root: feed, rootMargin: '100% 0px' });

    const hint = h('div', { class: 'swipe-hint', 'aria-hidden': 'true' }, C.icon('up', 18), h('span', { text: 'Swipe or scroll for the next idea' }));
    const wrap = h('div', { class: 'feed-wrap' }, feed, hint);

    feed.addEventListener('keydown', (e) => {
      if (e.target.closest('input,textarea,select')) return;
      if (e.key === 'ArrowDown' || e.key === 'j' || e.key === 'PageDown') { e.preventDefault(); goTo(Math.max(0, active) + 1); }
      if (e.key === 'ArrowUp' || e.key === 'k' || e.key === 'PageUp') { e.preventDefault(); goTo(Math.max(0, active - 1)); }
    });

    addBatch(finite ? 999 : 5);
    // lazy first activation: wait until attached to DOM
    requestAnimationFrame(() => {
      if (opts.startAt) { const el = feed.children[opts.startAt]; el && el.scrollIntoView({ block: 'start' }); }
      feed.focus({ preventScroll: true });
    });
    wrap.destroy = () => { io.disconnect(); artIO.disconnect(); if (active >= 0 && cards[active]) cards[active].deactivate(); C.store.flushNow(); };
    wrap.more = () => addBatch(4);
    wrap.goTo = goTo;
    return wrap;
  };
})();
