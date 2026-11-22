/* My Mind (dashboard + knowledge map), Profile, Onboarding */
(function () {
  const C = (window.CUR = window.CUR || {});
  const h = C.h, V = C.views;
  const S = () => C.store.state;
  const NS = 'http://www.w3.org/2000/svg';

  /* ---------- Rings & charts ---------- */
  function ring(pct, size, label, sub, color) {
    const r = size / 2 - 8, c = 2 * Math.PI * r;
    const wrap = h('div', { class: 'ring', style: { width: size + 'px', height: size + 'px' } });
    wrap.innerHTML = `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" aria-hidden="true"><circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="currentColor" stroke-opacity=".12" stroke-width="7"/><circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${color || 'var(--gold)'}" stroke-width="7" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - C.clamp(pct, 0, 1))}" transform="rotate(-90 ${size / 2} ${size / 2})"/></svg>`;
    wrap.append(h('div', { class: 'ring-t' }, h('b', { text: label }), sub ? h('span', { text: sub }) : null));
    return wrap;
  }

  /* ---------- Knowledge map ---------- */
  function knowledgeMap() {
    const box = h('div', { class: 'kmap-wrap' });
    const detail = h('div', { class: 'kmap-detail' });
    const W = 360, cx = W / 2, cy = W / 2, R = 130;
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', `0 0 ${W} ${W}`); svg.setAttribute('class', 'kmap'); svg.setAttribute('role', 'group'); svg.setAttribute('aria-label', 'Knowledge map of subjects and the connections between them');
    const pos = {};
    C.TOPICS.forEach((t, i) => { const a = (i / C.TOPICS.length) * Math.PI * 2 - Math.PI / 2; pos[t.id] = [cx + R * Math.cos(a), cy + R * Math.sin(a), a]; });
    const edges = C.engine.topicEdges();
    let sel = null;
    function draw() {
      svg.innerHTML = '';
      const mk = (tag, attrs) => { const el = document.createElementNS(NS, tag); Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v)); return el; };
      edges.forEach((ed) => {
        const a = pos[ed.a], b = pos[ed.b]; if (!a || !b) return;
        const hot = sel && (ed.a === sel || ed.b === sel);
        const col = C.topic(ed.a).color;
        const mx = (a[0] + b[0]) / 2 + (cx - (a[0] + b[0]) / 2) * 0.35, my = (a[1] + b[1]) / 2 + (cy - (a[1] + b[1]) / 2) * 0.35;
        svg.append(mk('path', { d: `M${a[0]} ${a[1]} Q${mx} ${my} ${b[0]} ${b[1]}`, fill: 'none', stroke: ed.lit ? col : 'currentColor', 'stroke-opacity': ed.lit ? Math.min(0.95, 0.35 + ed.lit * 0.2) : (hot ? 0.28 : 0.09), 'stroke-width': ed.lit ? 1.5 + Math.min(3, ed.lit) : 1, 'stroke-dasharray': ed.lit ? '' : '3 4' }));
      });
      C.TOPICS.forEach((t) => {
        const [x, y, a] = pos[t.id], m = C.progress.masteryInfo(t.id), r = 9 + m.lvl * 2.6, done = C.store.tp(t.id).done;
        const g = mk('g', { class: 'kn' + (sel === t.id ? ' sel' : ''), tabindex: 0, role: 'button', 'aria-label': t.short + ', mastery ' + m.name + ', ' + done + ' completed' });
        g.append(mk('circle', { cx: x, cy: y, r: r + 6, fill: t.color, 'fill-opacity': done ? 0.14 : 0.04 }));
        g.append(mk('circle', { cx: x, cy: y, r, fill: done ? t.color : 'none', 'fill-opacity': done ? 0.85 : 1, stroke: t.color, 'stroke-width': 2 }));
        const lx = cx + (R + 34) * Math.cos(a), ly = cy + (R + 30) * Math.sin(a);
        const lab = mk('text', { x: lx, y: ly + 4, 'text-anchor': Math.abs(Math.cos(a)) < 0.25 ? 'middle' : (Math.cos(a) > 0 ? 'start' : 'end'), class: 'kn-label' });
        lab.textContent = t.short; g.append(lab);
        const pick = () => { sel = sel === t.id ? null : t.id; draw(); renderDetail(); };
        g.addEventListener('click', pick); g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); } });
        svg.append(g);
      });
    }
    function renderDetail() {
      C.clear(detail);
      if (!sel) { detail.append(h('p', { class: 'fine', text: 'Solid lines are connections you have explored. Dashed lines are connections waiting to be discovered. Tap a subject to see how it links to others.' })); return; }
      const t = C.topic(sel), m = C.progress.masteryInfo(sel);
      const links = edges.filter((e) => e.a === sel || e.b === sel).map((e) => ({ other: e.a === sel ? e.b : e.a, lit: e.lit, potential: e.potential })).sort((a, b) => b.lit - a.lit || b.potential - a.potential);
      detail.append(h('div', { class: 'kd-head', style: { '--accent': t.color } }, h('b', { text: t.name }), h('span', { class: 'fine', text: m.name + ' · ' + C.store.tp(sel).done + ' completed' })),
        h('div', { class: 'chip-cloud' }, ...links.map((l) => h('a', { class: 'chip link' + (l.lit ? ' lit' : ''), href: '#/explore/topic/' + l.other, style: { '--accent': C.topic(l.other).color }, text: C.topic(l.other).short + (l.lit ? ' · ' + l.lit + ' explored' : ' · to discover') }))),
        h('a', { class: 'btn small primary', href: '#/play/topic/' + sel }, 'Scroll ' + t.short));
    }
    draw(); renderDetail();
    box.append(svg, detail);
    return box;
  }

  function heatmap() {
    const weeks = 12, today = C.dateKey(), start = C.addDays(C.weekStart(), -(weeks - 1) * 7);
    const grid = h('div', { class: 'heat', role: 'img', 'aria-label': 'Activity over the last 12 weeks' });
    for (let w = 0; w < weeks; w++) for (let d = 0; d < 7; d++) {
      const k = C.addDays(start, w * 7 + d), a = S().activity[k], n = a ? a.done : 0, future = k > today;
      grid.append(h('i', { class: 'hc l' + Math.min(4, n) + (future ? ' f' : ''), title: k + ': ' + n + ' completed', style: { gridColumn: w + 1, gridRow: d + 1 } }));
    }
    return grid;
  }

  /* ---------- My Mind ---------- */
  V.mind = function () {
    const s = S(), lv = C.progress.levelInfo(), st = C.progress.streak(), wk = C.progress.week();
    const doneTotal = Object.values(s.exp).filter((x) => x.done).length;
    const ret = C.engine.retention(), due = C.engine.dueRecalls().length;
    const root = V.page('My Mind', 'A private picture of how your thinking is growing.');
    root.append(h('section', { class: 'hero-stats' },
      h('div', { class: 'lvl' }, h('div', { class: 'lvl-name' }, h('span', { class: 'fine', text: 'Level ' + (lv.idx + 1) }), h('h2', { text: lv.name })), V.progressBar(lv.pct, 'var(--gold)'), h('span', { class: 'fine', text: lv.next ? (lv.to - lv.xp) + ' insight to ' + lv.next : 'Highest level reached' })),
      h('div', { class: 'stat-row' },
        h('div', { class: 'stat' }, h('b', { text: String(doneTotal) }), h('span', { text: 'completed' })),
        h('div', { class: 'stat' }, h('b', { text: String(st.current) }), h('span', { text: 'day streak' })),
        h('div', { class: 'stat' }, h('b', { text: String(Object.values(s.topic).filter((t) => t.done > 0).length) }), h('span', { text: 'subjects' })),
        h('div', { class: 'stat' }, h('b', { text: ret == null ? '—' : ret + '%' }), h('span', { text: 'retention' })))));

    if (V.mirrorSummary) root.append(V.mirrorSummary());
    root.append(h('h2', { class: 'sec', text: 'This week' }), h('div', { class: 'card-panel goals' },
      ring(wk.done / wk.goal, 110, wk.done + '/' + wk.goal, 'experiences'), ring(wk.topics / wk.topicGoal, 110, wk.topics + '/' + wk.topicGoal, 'subjects', 'var(--accent2)'),
      h('p', { class: 'fine', text: 'Weekly goals reward range as well as volume. Adjust them in Profile.' })));

    if (due) root.append(h('div', { class: 'card-panel due' }, h('div', {}, h('b', { text: due + ' memory check' + (due > 1 ? 's' : '') + ' due' }), h('p', { class: 'fine', text: 'Brief recall questions about what you learned earlier. They appear in your Discover feed.' })), h('a', { class: 'btn primary small', href: '#/play/recall' }, 'Do them now')));

    root.append(h('h2', { class: 'sec', text: 'Knowledge map' }), h('div', { class: 'card-panel' }, knowledgeMap()));

    root.append(h('h2', { class: 'sec', text: 'Subject mastery' }), h('div', { class: 'card-panel mastery' }, ...C.TOPICS.map((t) => { const m = C.progress.masteryInfo(t.id); return h('a', { class: 'm-row', href: '#/explore/topic/' + t.id, style: { '--accent': t.color } }, h('span', { class: 'm-name', text: t.short }), V.progressBar(m.pct), h('span', { class: 'm-lvl', text: m.name })); })));

    // Curiosity profile
    const tops = C.TOPICS.map((t) => ({ t, aff: C.store.tp(t.id).aff + (s.interests.includes(t.id) ? 1 : 0), done: C.store.tp(t.id).done })).sort((a, b) => b.aff - a.aff);
    const blind = C.TOPICS.filter((t) => C.store.tp(t.id).done === 0 && C.store.tp(t.id).views === 0);
    root.append(h('h2', { class: 'sec', text: 'Your curiosity' }), h('div', { class: 'card-panel' },
      h('div', { class: 'kicker', text: 'You gravitate towards' }), h('div', { class: 'chip-cloud' }, ...tops.slice(0, 3).map((x) => h('a', { class: 'chip link', href: '#/explore/topic/' + x.t.id, style: { '--accent': x.t.color }, text: x.t.short }))),
      h('div', { class: 'kicker', style: { marginTop: '14px' }, text: blind.length ? 'Unexplored territory' : 'Everything has been touched' }),
      blind.length ? h('div', { class: 'chip-cloud' }, ...blind.slice(0, 6).map((t) => h('a', { class: 'chip link dashed', href: '#/explore/topic/' + t.id, style: { '--accent': t.color }, text: t.short }))) : h('p', { class: 'fine', text: 'You have seen every subject. The map now rewards depth and connection.' }),
      h('p', { class: 'fine', text: 'About a third of your feed is deliberately drawn from the subjects you see least, so your interests widen and are not narrowed.' })));

    root.append(h('h2', { class: 'sec', text: 'Activity' }), h('div', { class: 'card-panel' }, heatmap(), h('p', { class: 'fine', text: 'Last 12 weeks. Darker means more completed experiences that day.' })));

    root.append(h('h2', { class: 'sec', text: 'Achievements' }), h('div', { class: 'ach-grid' }, ...C.ACHIEVEMENTS.map((a) => {
      const got = s.achievements[a.id];
      return h('div', { class: 'ach' + (got ? ' got' : '') }, h('div', { class: 'ach-ic' }, C.icon(a.icon, 22)), h('b', { text: a.name }), h('span', { class: 'fine', text: a.desc }), got ? h('span', { class: 'fine', text: new Date(got).toLocaleDateString() }) : (C.progress.progressHint(a) ? h('span', { class: 'fine', text: C.progress.progressHint(a) }) : null));
    })));
    return root;
  };

  /* ---------- Profile ---------- */
  V.profile = function () {
    const s = S(), p = s.profile, lv = C.progress.levelInfo();
    const root = V.page('Profile', 'Your settings, history and data. Everything lives on this device.');
    const nameIn = h('input', { class: 'input', value: p.name, maxlength: 30, placeholder: 'Your name', 'aria-label': 'Display name' });
    const bioIn = h('input', { class: 'input', value: p.bio, maxlength: 90, placeholder: 'A line about what you are curious about', 'aria-label': 'Bio' });
    const avatar = h('div', { class: 'avatar big', text: (p.name || 'C')[0].toUpperCase() });
    const saveProf = () => { C.store.update((st) => { st.profile.name = nameIn.value.trim(); st.profile.bio = bioIn.value.trim(); st.profile.handle = '@' + (nameIn.value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '') || 'curious'); }); avatar.textContent = (nameIn.value.trim() || 'C')[0].toUpperCase(); C.app.updateChrome(); };
    nameIn.addEventListener('input', saveProf); bioIn.addEventListener('input', saveProf);
    root.append(h('section', { class: 'profile-card' }, avatar, h('div', { class: 'pf-main' }, nameIn, bioIn, h('span', { class: 'fine', text: lv.name + ' · ' + s.xp + ' insight · joined ' + new Date(p.joined).toLocaleDateString() }))));

    const seg = (label, key, opts, cur, onPick) => h('div', { class: 'setting' }, h('label', { text: label }), h('div', { class: 'seg small' }, ...opts.map(([v, l]) => h('button', { type: 'button', class: 'seg-btn' + (cur === v ? ' on' : ''), 'aria-pressed': String(cur === v), onclick: () => { C.store.update((st) => { st.prefs[key] = v; }); onPick && onPick(v); C.router.refresh(); } }, l))));
    root.append(h('h2', { class: 'sec', text: 'Preferences' }), h('div', { class: 'card-panel settings' },
      seg('Theme', 'theme', [['dark', 'Dark'], ['light', 'Light'], ['auto', 'Auto']], s.prefs.theme, () => C.app.applyTheme()),
      seg('Depth', 'depth', [[1, 'Casual'], [2, 'Curious'], [3, 'Deep dive']], s.prefs.depth),
      seg('Weekly goal', 'weeklyGoal', [[4, '4'], [7, '7'], [10, '10'], [15, '15']], s.prefs.weeklyGoal),
      seg('Subjects per week', 'weeklyTopics', [[2, '2'], [4, '4'], [6, '6']], s.prefs.weeklyTopics),
      seg('Sound (music experiences)', 'sound', [[true, 'On'], [false, 'Off']], s.prefs.sound),
      seg('Reduce motion', 'reduceMotion', [[false, 'Off'], [true, 'On']], s.prefs.reduceMotion, () => C.app.applyTheme()),
      h('div', { class: 'setting' }, h('label', { text: 'Interests' }), h('div', { class: 'chip-cloud' }, ...C.TOPICS.map((t) => { const on = s.interests.includes(t.id); return h('button', { class: 'chip toggle' + (on ? ' on' : ''), type: 'button', 'aria-pressed': String(on), onclick: () => { C.store.update((st) => { st.interests = on ? st.interests.filter((x) => x !== t.id) : st.interests.concat(t.id); }); C.router.refresh(); } }, t.short); })))));

    const fol = s.follows;
    root.append(h('h2', { class: 'sec', text: 'Following' }), h('div', { class: 'card-panel' },
      fol.topics.length + fol.thinkers.length + fol.curators.length === 0 ? h('p', { class: 'fine', text: 'You are not following anything yet. Try Explore.' }) : h('div', { class: 'chip-cloud' },
        ...fol.topics.map((t) => h('button', { class: 'chip toggle on', type: 'button', onclick: () => { C.social.toggleFollow('topics', t); C.router.refresh(); } }, '✓ ' + C.topic(t).short)),
        ...fol.thinkers.map((t) => h('button', { class: 'chip toggle on', type: 'button', onclick: () => { C.social.toggleFollow('thinkers', t); C.router.refresh(); } }, '✓ ' + t)),
        ...fol.curators.map((t) => h('button', { class: 'chip toggle on', type: 'button', onclick: () => { C.social.toggleFollow('curators', t); C.router.refresh(); } }, '✓ ' + (C.CURATORS.find((c) => c.id === t) || { name: t }).name)))));

    const hist = Object.entries(s.exp).filter(([i, x]) => x.done && C.byId[i]).sort((a, b) => (b[1].doneAt || 0) - (a[1].doneAt || 0));
    root.append(h('h2', { class: 'sec', text: 'Learning history' }), hist.length ? h('div', { class: 'list' }, ...hist.slice(0, 30).map(([i, x]) => h('div', { class: 'hist' }, V.listItem(C.byId[i]), h('span', { class: 'fine', text: new Date(x.doneAt).toLocaleDateString() })))) : h('p', { class: 'fine', text: 'Completed experiences will appear here.' }));

    const fileIn = h('input', { type: 'file', accept: 'application/json', hidden: true });
    fileIn.addEventListener('change', () => { const f = fileIn.files[0]; if (!f) return; f.text().then((t) => { try { C.store.importJSON(t); C.toast('Progress imported'); C.app.applyTheme(); C.router.refresh(); } catch (e) { C.toast('That file is not a CURIOSITY export'); } }); });
    root.append(h('h2', { class: 'sec', text: 'Your data' }), h('div', { class: 'card-panel' },
      h('p', { class: 'fine', text: 'CURIOSITY has no accounts and no servers. Your progress is stored in this browser only. Export a backup to move it between devices.' }),
      h('div', { class: 'row wrap' },
        C.tpl.kit.btn('Export backup', () => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([C.store.exportJSON()], { type: 'application/json' })); a.download = 'curiosity-backup-' + C.dateKey() + '.json'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 3000); }, 'ghost'),
        C.tpl.kit.btn('Import backup', () => fileIn.click(), 'ghost'), fileIn,
        C.tpl.kit.btn('Replay welcome', () => { C.onboarding(true); }, 'ghost'),
        C.tpl.kit.btn('Reset everything', () => { if (confirm('Erase all progress, saves and settings on this device?')) { C.store.reset(); C.app.applyTheme(); location.hash = '#/discover'; location.reload(); } }, 'danger'))));
    root.append(h('p', { class: 'fine center', text: 'CURIOSITY v' + C.version + '. Rabbit Holes, experiences and fact tables are original and hand-written; Atlas questions are generated from those tables. Quoted passages are in the public domain.' }));
    return root;
  };

  /* ---------- Onboarding ---------- */
  C.onboarding = function (replay) {
    const sel = new Set(replay ? S().interests : []);
    let step = 0, depth = S().prefs.depth, goal = S().prefs.weeklyGoal;
    const back = h('div', { class: 'onb', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Welcome to CURIOSITY' });
    const body = h('div', { class: 'onb-body' });
    const dots = h('div', { class: 'onb-dots' });
    back.append(h('div', { class: 'onb-art', html: C.art({ id: 'onboard', topic: 'philosophy' }) }), body, dots);
    document.body.append(back);
    const finish = () => {
      C.store.update((st) => { st.onboarded = true; st.interests = Array.from(sel); st.prefs.depth = depth; st.prefs.weeklyGoal = goal; sel.forEach((t) => { C.store.tp(t).aff += 1; }); });
      back.classList.add('out'); setTimeout(() => back.remove(), 400); C.app.updateChrome();
      if (location.hash.startsWith('#/discover') || location.hash === '' || location.hash === '#/') C.router.refresh(); else location.hash = '#/discover';
    };
    const render = () => {
      C.clear(body); C.clear(dots);
      for (let i = 0; i < 3; i++) dots.append(h('i', { class: i === step ? 'on' : '' }));
      if (step === 0) {
        body.append(h('div', { class: 'onb-logo' }, C.logo(64)), h('h1', { class: 'onb-title', text: 'Scroll to think.' }),
          h('p', { class: 'onb-sub', text: 'A feed where every idea asks something of you: a choice, a guess, a paradox. Five minutes here should leave your mind a little larger.' }),
          h('ul', { class: 'onb-points' }, h('li', { text: 'Swipe up for the next idea. Tap to begin one.' }), h('li', { text: 'No likes to chase. Understanding, reflection and range earn progress.' }), h('li', { text: 'Everything stays on your device. No account needed.' })),
          C.tpl.kit.btn('Begin', () => { step = 1; render(); }, 'primary big'));
      } else if (step === 1) {
        body.append(h('h2', { class: 'onb-h', text: 'What draws you in?' }), h('p', { class: 'onb-sub', text: 'Pick at least three. They seed your feed. We will also mix in subjects you did not pick, on purpose.' }));
        const grid = h('div', { class: 'onb-chips' });
        const btn = C.tpl.kit.btn('Continue', () => { step = 2; render(); }, 'primary big'); btn.disabled = sel.size < 3;
        C.TOPICS.forEach((t) => {
          const b = h('button', { class: 'chip toggle big' + (sel.has(t.id) ? ' on' : ''), type: 'button', 'aria-pressed': String(sel.has(t.id)), style: { '--accent': t.color }, onclick: () => { sel.has(t.id) ? sel.delete(t.id) : sel.add(t.id); b.classList.toggle('on', sel.has(t.id)); b.setAttribute('aria-pressed', String(sel.has(t.id))); btn.disabled = sel.size < 3; count.textContent = sel.size + ' selected'; } }, h('i', { style: { background: t.color } }), t.short);
          grid.append(b);
        });
        const count = h('span', { class: 'fine', text: sel.size + ' selected' });
        body.append(grid, h('div', { class: 'row between' }, h('button', { class: 'btn ghost small', type: 'button', onclick: () => { sel.clear(); C.shuffle(C.TOPICS.map((t) => t.id)).slice(0, 4).forEach((x) => sel.add(x)); render(); } }, 'Surprise me'), count), btn);
      } else {
        body.append(h('h2', { class: 'onb-h', text: 'How deep do you like to go?' }));
        const seg1 = h('div', { class: 'opts' }, ...[[1, 'Casual', 'Short, clear, approachable'], [2, 'Curious', 'A balance of ease and challenge'], [3, 'Deep dive', 'Harder ideas and subtler arguments']].map(([v, l, d]) => h('button', { class: 'opt' + (depth === v ? ' chosen' : ''), type: 'button', onclick: () => { depth = v; render(); } }, h('span', { class: 'opt-text' }, h('b', { text: l }), h('br'), h('span', { class: 'fine', text: d })))));
        const seg2 = h('div', { class: 'seg' }, ...[[4, 'Light: 4'], [7, 'Steady: 7'], [10, 'Keen: 10']].map(([v, l]) => h('button', { type: 'button', class: 'seg-btn' + (goal === v ? ' on' : ''), onclick: () => { goal = v; render(); } }, l)));
        body.append(seg1, h('h3', { class: 'onb-h2', text: 'Weekly goal (experiences)' }), seg2, h('p', { class: 'fine', text: 'Streaks never punish a missed day. You can change all of this later.' }), C.tpl.kit.btn('Open my feed', finish, 'primary big'));
      }
    };
    render();
  };
})();
