/* App shell: layout, router, theme, install + service worker */
(function () {
  const C = (window.CUR = window.CUR || {});
  const h = C.h, V = C.views;
  const A = (C.app = {});
  let currentFeed = null;

  const NAV = [
    ['discover', 'Discover', 'compass'], ['explore', 'Explore', 'grid'], ['journeys', 'Journeys', 'route'], ['saved', 'Saved', 'bookmark'],
    ['mind', 'My Mind', 'brain'], ['daily', 'Daily', 'sun'], ['profile', 'Profile', 'user']
  ];
  const TABBAR = ['discover', 'explore', 'journeys', 'daily', 'mind'];
  const SIDE_GROUPS = [['Learn', ['discover', 'explore', 'journeys', 'daily']], ['You', ['saved', 'mind', 'profile']]];

  /* ---------- Theme ---------- */
  A.applyTheme = function () {
    const p = C.store.state.prefs;
    const dark = p.theme === 'dark' || (p.theme === 'auto' && window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    document.documentElement.dataset.motion = p.reduceMotion ? 'reduce' : 'full';
    const m = document.querySelector('meta[name=theme-color]'); if (m) m.setAttribute('content', dark ? '#08080b' : '#f7f3eb');
    A.syncThemeBtn();
  };
  A.syncThemeBtn = function () {
    if (!el.theme) return;
    const dark = document.documentElement.dataset.theme === 'dark';
    C.clear(el.theme).append(C.icon(dark ? 'sun' : 'moon', 22), h('span', { text: dark ? 'Light mode' : 'Dark mode' }));
    el.theme.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
  };
  if (window.matchMedia) matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => A.applyTheme());

  /* ---------- Chrome (nav, topbar, side widgets) ---------- */
  const el = {};
  A.buildChrome = function () {
    const root = document.getElementById('app');
    C.clear(root);
    const byId = {}; NAV.forEach((n) => { byId[n[0]] = n; });
    const navLink = (id) => h('a', { class: 'nav-link', href: '#/' + id, dataset: { nav: id } }, C.icon(byId[id][2], 22), h('span', { text: byId[id][1] }));
    el.theme = h('button', { class: 'nav-link', type: 'button', onclick: () => { C.store.update((s) => { s.prefs.theme = (document.documentElement.dataset.theme === 'dark') ? 'light' : 'dark'; }); A.applyTheme(); } });
    el.side = h('aside', { class: 'sidebar', 'aria-label': 'Primary' },
      h('a', { class: 'brand', href: '#/discover', 'aria-label': 'CURIOSITY home' }, C.logo(30), h('span', { class: 'wordmark', text: 'CURIOSITY' })),
      h('nav', { class: 'side-nav' }, ...SIDE_GROUPS.map(([label, ids]) => [h('div', { class: 'nav-label', text: label }), ...ids.map(navLink)])),
      h('div', { class: 'side-foot' }, h('a', { class: 'side-level', href: '#/mind', 'aria-label': 'Your level' }), el.theme));
    A.syncThemeBtn();
    el.top = h('header', { class: 'topbar' },
      h('a', { class: 'brand compact', href: '#/discover', 'aria-label': 'CURIOSITY home' }, C.logo(26)),
      h('div', { class: 'top-center' }),
      h('div', { class: 'top-right' },
        h('a', { class: 'pill streak', href: '#/daily', 'aria-label': 'Streak' }, C.icon('flame', 16), h('b', { text: '0' })),
        h('a', { class: 'icon-btn', href: '#/saved', 'aria-label': 'Saved' }, C.icon('bookmark', 22)),
        h('a', { class: 'icon-btn', href: '#/profile', 'aria-label': 'Profile' }, C.icon('user', 22))));
    el.view = h('main', { id: 'view', tabindex: '-1' });
    el.tab = h('nav', { class: 'tabbar', 'aria-label': 'Primary' }, ...NAV.filter((n) => TABBAR.includes(n[0])).map(([id, label, ic]) => h('a', { class: 'tab', href: '#/' + id, dataset: { nav: id } }, C.icon(ic, 24), h('span', { text: label }))));
    el.right = h('aside', { class: 'rightbar', 'aria-label': 'Today' });
    root.append(el.side, h('div', { class: 'main-col' }, el.top, el.view, el.tab), el.right);
    A.updateChrome();
  };

  A.updateChrome = function () {
    if (!el.top) return;
    const st = C.progress.streak(), lv = C.progress.levelInfo(), wk = C.progress.week(), act = C.progress.todayActivity();
    el.top.querySelector('.streak b').textContent = String(st.current);
    el.top.querySelector('.streak').classList.toggle('lit', st.today);
    const sl = el.side.querySelector('.side-level');
    C.clear(sl).append(h('span', { class: 'fine', text: 'Level ' + (lv.idx + 1) }), h('b', { text: lv.name }), V.progressBar(lv.pct, 'var(--gold)'));
    // right rail
    const due = C.engine.dueRecalls().length, picks = C.engine.dailyPicks(), d = C.store.state.daily[C.dateKey()] || { journey: [] };
    const hr = new Date().getHours(), name = (C.store.state.profile.name || '').trim();
    const greet = (hr < 5 ? 'Still up' : hr < 12 ? 'Good morning' : hr < 18 ? 'Good afternoon' : 'Good evening') + (name ? ', ' + name : '');
    const cards = [
      h('div', { class: 'rb-card' }, h('div', { class: 'kicker', text: greet }), h('div', { class: 'rb-big' }, h('b', { text: String(act.done) }), h('span', { text: act.done === 1 ? 'idea explored today' : 'ideas explored today' })),
        h('div', { class: 'fine', text: st.current + ' day streak · best ' + st.best })),
      h('div', { class: 'rb-card' }, h('div', { class: 'kicker', text: 'This week' }), V.progressBar(wk.done / wk.goal, 'var(--gold)'), h('div', { class: 'fine', text: wk.done + ' / ' + wk.goal + ' experiences · ' + wk.topics + ' / ' + wk.topicGoal + ' subjects' })),
      h('a', { class: 'rb-card', href: '#/daily' }, h('div', { class: 'kicker', text: 'Daily journey' }), h('b', { text: d.complete ? 'Complete' : d.journey.length + ' of ' + picks.journey.length + ' done' }), h('span', { class: 'fine', text: d.complete ? 'Come back tomorrow.' : 'About 5 to 10 minutes' })),
      due ? h('a', { class: 'rb-card', href: '#/play/recall' }, h('div', { class: 'kicker', text: 'Memory' }), h('b', { text: due + ' check' + (due > 1 ? 's' : '') + ' due' }), h('span', { class: 'fine', text: 'Quick recall questions' })) : null,
      A.deferredInstall ? h('button', { class: 'btn ghost small', type: 'button', onclick: () => { A.deferredInstall.prompt(); A.deferredInstall = null; } }, 'Install app') : null
    ].filter(Boolean);
    C.clear(el.right).append(...cards);
  };
  let upT = null;
  C.bus.on('complete', () => { clearTimeout(upT); upT = setTimeout(A.updateChrome, 400); });
  C.store.on(() => { clearTimeout(upT); upT = setTimeout(A.updateChrome, 800); });
  window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); A.deferredInstall = e; A.updateChrome(); });

  /* ---------- Router ---------- */
  const R = (C.router = {});
  function setNav(id) {
    C.$$('[data-nav]').forEach((n) => { const on = n.dataset.nav === id; n.classList.toggle('active', on); on ? n.setAttribute('aria-current', 'page') : n.removeAttribute('aria-current'); });
  }
  function feedChrome(title, backHref, wrap, total) {
    const pos = h('span', { class: 'fh-pos' });
    const head = h('div', { class: 'feed-head' }, h('a', { class: 'icon-btn', href: backHref || '#/discover', 'aria-label': 'Back' }, C.icon('left', 22)), h('span', { class: 'fh-title', text: title }), pos);
    return { head, pos };
  }
  function mountFeed(opts, title, back, nav, tabsNode) {
    el.view.className = 'feed-mode';
    const total = opts.ids ? opts.ids.length : 0;
    let fc = null;
    if (title) fc = feedChrome(title, back);
    const feed = C.Feed(Object.assign({}, opts, { onActive: (i) => { if (fc && total) fc.pos.textContent = (i + 1) + ' / ' + total; } }));
    currentFeed = feed;
    C.clear(el.view).append(feed);
    if (fc) { el.view.append(fc.head); if (total) fc.pos.textContent = '1 / ' + total; }
    if (tabsNode) el.view.append(tabsNode);
    setNav(nav);
    if (!title) el.top.querySelector('.top-center').replaceChildren();
  }
  function discoverTabs(mode) {
    return h('div', { class: 'feed-tabs', role: 'tablist' }, h('a', { class: mode === 'foryou' ? 'on' : '', href: '#/discover', role: 'tab', 'aria-selected': String(mode === 'foryou'), text: 'For you' }), h('a', { class: mode === 'following' ? 'on' : '', href: '#/following', role: 'tab', 'aria-selected': String(mode === 'following'), text: 'Following' }));
  }
  const endCard = (title, sub, ...btns) => () => h('div', { class: 'end-inner' }, C.logo(48), h('h2', { class: 'title', text: title }), h('p', { class: 'hook', text: sub }), h('div', { class: 'row center wrap' }, ...btns));

  const routes = [
    [/^#?\/?$|^#\/discover$/, () => { mountFeed({}, null, null, 'discover', discoverTabs('foryou')); }],
    [/^#\/following$/, () => {
      const f = C.store.state.follows;
      const any = f.topics.length + f.thinkers.length + f.curators.length;
      mountFeed({ following: true, empty: () => h('div', { class: 'end-inner' }, h('h2', { class: 'title', text: any ? 'You have seen everything you follow' : 'Follow something to start' }), h('p', { class: 'hook', text: any ? 'Back to For you for more variety.' : 'Follow subjects, thinkers or demo curators and they appear here.' }), h('a', { class: 'btn primary', href: any ? '#/discover' : '#/explore' }, any ? 'For you' : 'Explore')) }, null, null, 'discover', discoverTabs('following'));
    }],
    [/^#\/explore$/, () => page(V.explore(), 'explore')],
    [/^#\/explore\/topic\/(\w+)$/, (m) => page(V.topicPage(m[1]), 'explore')],
    [/^#\/explore\/collection\/([\w-]+)$/, (m) => page(V.collectionPage(m[1]), 'explore')],
    [/^#\/explore\/curator\/(\w+)$/, (m) => page(V.curatorPage(m[1]), 'explore')],
    [/^#\/journeys$/, () => page(V.journeys(), 'journeys')],
    [/^#\/journey\/([\w-]+)$/, (m) => page(V.journeyPage(m[1]), 'journeys')],
    [/^#\/journey\/([\w-]+)\/play\/(\d+)$/, (m) => {
      const j = C.JOURNEYS.find((x) => x.id === m[1]); if (!j) return page(V.notFound(), 'journeys');
      mountFeed({ ids: j.ids, startAt: +m[2], nextLabel: 'Next step', endCard: endCard('Journey complete', j.title + ' is part of your map now.', h('a', { class: 'btn primary', href: '#/mind' }, 'See my map'), h('a', { class: 'btn ghost', href: '#/journeys' }, 'More journeys')) }, j.title, '#/journey/' + j.id, 'journeys');
    }],
    [/^#\/saved(?:\/(\w+))?$/, (m) => page(V.saved(m[1] || 'all'), 'saved')],
    [/^#\/mind$/, () => page(V.mind(), 'mind')],
    [/^#\/daily$/, () => page(V.daily(), 'daily')],
    [/^#\/daily\/play\/(\d+)$/, (m) => {
      const p = C.engine.dailyPicks();
      mountFeed({ ids: p.journey.map((e) => e.id), startAt: +m[1], nextLabel: 'Next', endCard: endCard('That is today’s journey', 'A small daily habit compounds. See you tomorrow, or keep scrolling now.', h('a', { class: 'btn primary', href: '#/discover' }, 'Keep exploring'), h('a', { class: 'btn ghost', href: '#/daily' }, 'Back to Today')) }, 'Daily journey', '#/daily', 'daily');
    }],
    [/^#\/atlas$/, () => page(V.atlasHome(), 'explore')],
    [/^#\/atlas\/topic\/(\w+)$/, (m) => page(V.atlasTopic(m[1]), 'explore')],
    [/^#\/atlas\/table\/([\w-]+)$/, (m) => page(V.atlasStudy(m[1]), 'explore')],
    [/^#\/atlas\/play\/(table|topic|mixed)\/([\w-]+)$/, (m) => page(V.atlasPlay(m[1], m[2]), 'explore')],
    [/^#\/holes$/, () => page(V.holes(), 'explore')],
    [/^#\/hole\/([\w-]+)$/, (m) => page(V.hole(m[1]), 'explore')],
    [/^#\/hole\/([\w-]+)\/([\w-]+)$/, (m) => page(V.holePath(m[1], m[2]), 'explore')],
    [/^#\/mirror$/, () => page(V.mirror(), 'mind')],
    [/^#\/profile$/, () => page(V.profile(), 'profile')],
    [/^#\/x\/([\w:-]+)$/, (m) => {
      const e = C.resolve(m[1]); if (!e) return page(V.notFound(), 'discover');
      mountFeed({ ids: [m[1]], nextLabel: 'More ideas', endCard: endCard('Keep going', 'There is always another question.', h('a', { class: 'btn primary', href: '#/discover' }, 'Open my feed'), h('a', { class: 'btn ghost', href: '#/explore' }, 'Explore')) }, e.type === 'recall' ? 'Memory check' : C.topic(e.topic).short, '#/discover', 'discover');
      // allow the takeaway's Next button to move on
    }],
    [/^#\/play\/topic\/(\w+)$/, (m) => {
      const t = C.TOPICS.find((x) => x.id === m[1]); if (!t) return page(V.notFound(), 'explore');
      const st = C.store.state;
      const ids = C.library.filter((e) => e.topic === m[1]).sort((a, b) => (st.exp[a.id] && st.exp[a.id].done ? 1 : 0) - (st.exp[b.id] && st.exp[b.id].done ? 1 : 0)).map((e) => e.id);
      mountFeed({ ids, endCard: endCard('End of ' + t.short, 'You have been through every ' + t.short.toLowerCase() + ' experience here.', h('a', { class: 'btn primary', href: '#/explore' }, 'Explore another subject')) }, t.short, '#/explore/topic/' + m[1], 'explore');
    }],
    [/^#\/play\/collection\/([\w-]+)$/, (m) => {
      const c = C.COLLECTIONS.find((x) => x.id === m[1]); if (!c) return page(V.notFound(), 'explore');
      mountFeed({ ids: c.ids, endCard: endCard('End of collection', c.title, h('a', { class: 'btn primary', href: '#/explore' }, 'More collections')) }, c.title, '#/explore/collection/' + c.id, 'explore');
    }],
    [/^#\/play\/format\/(\w+)$/, (m) => {
      const f = C.FORMATS[m[1]]; if (!f) return page(V.notFound(), 'explore');
      const ids = C.library.filter((e) => e.type === m[1]).map((e) => e.id);
      mountFeed({ ids, endCard: endCard('That is every ' + f.name.toLowerCase(), f.blurb, h('a', { class: 'btn primary', href: '#/explore' }, 'Browse other formats')) }, f.name, '#/explore', 'explore');
    }],
    [/^#\/play\/saved\/([\w-]+)$/, (m) => {
      const st = C.store.state;
      const ids = (m[1] === 'all' ? st.saved : ((st.collections.find((c) => c.id === m[1]) || { items: [] }).items)).filter((i) => C.byId[i]);
      mountFeed({ ids, endCard: endCard('End of your library', 'Nothing more saved here.', h('a', { class: 'btn primary', href: '#/saved' }, 'Back to Saved')) }, 'Saved', '#/saved', 'saved');
    }],
    [/^#\/play\/recall$/, () => {
      const ids = C.engine.dueRecalls().slice(0, 10).map((i) => 'recall:' + i);
      if (!ids.length) { C.toast('No memory checks due. Nice.'); location.hash = '#/mind'; return; }
      mountFeed({ ids, nextLabel: 'Next', endCard: endCard('Memory refreshed', 'Spaced recall is how ideas stay with you.', h('a', { class: 'btn primary', href: '#/mind' }, 'My Mind')) }, 'Memory checks', '#/mind', 'mind');
    }]
  ];

  function page(node, nav) {
    el.view.className = 'page-mode';
    C.clear(el.view).append(node);
    el.view.scrollTop = 0;
    setNav(nav);
  }

  let curHash = null;
  function route() {
    const hash = location.hash || '#/discover';
    if (currentFeed) { currentFeed.destroy(); currentFeed = null; }
    for (const [re, fn] of routes) {
      const m = hash.match(re);
      if (m) { curHash = hash; try { fn(m); } catch (e) { console.error(e); page(V.notFound(), 'discover'); } A.updateChrome(); return; }
    }
    page(V.notFound(), 'discover');
  }
  R.refresh = () => { const sc = el.view.scrollTop; route(); el.view.scrollTop = sc; };
  window.addEventListener('hashchange', () => { route(); const f = el.view.querySelector('.feed'); if (!f) el.view.focus({ preventScroll: true }); });

  /* ---------- Boot ---------- */
  A.boot = function () {
    A.applyTheme();
    A.buildChrome();
    C.store.update((s) => { s.sessions++; });
    if (!C.store.state.onboarded) { route(); C.onboarding(); } else route();
    C.progress.check();
    if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    }
  };
  document.addEventListener('DOMContentLoaded', A.boot);
})();
