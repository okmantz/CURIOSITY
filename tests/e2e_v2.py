#!/usr/bin/env python3
"""
E2E for Atlas, Rabbit Holes and the Mirror: walks every authored hole path and every derived hole's
first screens, plays Atlas sessions and a drill card, and checks the Mirror records answers.

  python3 tests/e2e_v2.py [--chrome /usr/bin/google-chrome]
"""
import argparse, http.server, os, socketserver, sys, threading
from playwright.sync_api import sync_playwright

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
ap = argparse.ArgumentParser(); ap.add_argument('--chrome', default=None); args = ap.parse_args()

class Q(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **k): super().__init__(*a, directory=ROOT, **k)
    def log_message(self, *a): pass
srv = socketserver.TCPServer(('127.0.0.1', 0), Q); PORT = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()
BASE = f'http://127.0.0.1:{PORT}/index.html'
errors = []

# One generic "do the next thing" step for a hole path. Returns what it did.
WALK = """
() => {
  const body = document.querySelector('.path-body');
  const next = document.querySelector('.path-nav .btn.primary');
  if (!body) return 'nobody';
  if (document.querySelector('.path-run .panel h3') && !next) return 'finished';
  if (next && !next.disabled) { next.click(); return 'continue'; }
  const cands = [...body.querySelectorAll('button, .opt')].filter(b => !b.disabled && b.dataset.t !== (b.textContent || '').trim() && !b.classList.contains('locked') && !b.closest('[inert]'));
  if (!cands.length) return 'wait';
  const label = (b) => (b.textContent || '').trim();
  const pri = cands.find(b => /^(Check my sorting|Next objection|Done|Reveal|Continue)/.test(label(b))) || cands[0];
  // sort rows: click first bucket of every row before checking
  const rowBtn = cands.find(b => b.closest('.sort-row'));
  const b = rowBtn || pri;
  b.dataset.t = label(b); b.click(); return 'click:' + label(b).slice(0, 20);
}
"""

with sync_playwright() as p:
    kw = {'headless': True, 'args': ['--no-sandbox']}
    if args.chrome or os.path.exists('/usr/bin/google-chrome'): kw['executable_path'] = args.chrome or '/usr/bin/google-chrome'
    br = p.chromium.launch(**kw)
    ctx = br.new_context(viewport={'width': 390, 'height': 844}, is_mobile=True, has_touch=True)
    page = ctx.new_page()
    page.on('pageerror', lambda e: errors.append(f'pageerror: {e}'))
    page.on('console', lambda m: errors.append(f'console.{m.type}: {m.text}') if m.type == 'error' and 'favicon' not in m.text else None)
    page.goto(BASE); page.wait_for_selector('.onb-title')
    page.evaluate("CUR.store.update(s => { s.onboarded = true; s.interests = ['history','philosophy','science']; }); document.querySelector('.onb').remove();")

    # ---- screens ----
    for route, sel in [('#/atlas', '.atlas-tables, .tiles, .list'), ('#/atlas/topic/history', 'h1, h2'), ('#/holes', '.tiles'), ('#/mirror', '.page'), ('#/mind', '.kmap'), ('#/explore', '.doors')]:
        page.goto(BASE + route); page.wait_for_selector(sel, timeout=4000); page.wait_for_timeout(250)
    print('new screens render OK')

    # ---- Atlas: study + play every table's first session ----
    tids = page.evaluate('CUR.ATLAS.map(t => t.id)')
    for tid in tids:
        page.goto(BASE + f'#/atlas/table/{tid}'); page.wait_for_selector('.study-row, .page', timeout=4000)
    print(f'atlas study pages OK ({len(tids)} tables)')
    for topic in page.evaluate('CUR.TOPICS.map(t => t.id)'):
        page.goto(BASE + f'#/atlas/play/topic/{topic}'); page.wait_for_selector('.atlas-run, .atlas-slot, .opt', timeout=4000)
        for _ in range(60):
            st = page.evaluate("""() => {
              const run = document.querySelector('.page'); if (!run) return 'x';
              const fin = [...document.querySelectorAll('.verdict-line')].some(v => /of \\d+/.test(v.textContent)) && document.querySelector('.btn.ghost.small, .btn.primary.small');
              if (fin && document.body.textContent.includes('Session')) return 'done';
              const nx = [...document.querySelectorAll('button')].find(b => !b.disabled && /^(Next|Finish|See results|Continue)/.test(b.textContent.trim()) );
              if (nx) { nx.click(); return 'next'; }
              const inp = document.querySelector('input.num, input[type=range]');
              const sub = [...document.querySelectorAll('button')].find(b => !b.disabled && /^(Check|Lock|Submit|Answer)/.test(b.textContent.trim()));
              if (sub) { sub.click(); return 'submit'; }
              const o = [...document.querySelectorAll('.opt, .chip.toggle')].find(b => !b.disabled && !b.dataset.t);
              if (o) { o.dataset.t = '1'; o.click(); return 'opt'; }
              return 'wait';
            }""")
            if st == 'done': break
            page.wait_for_timeout(60)
        page.wait_for_timeout(100)
    meta = page.evaluate('CUR.store.state.atlasMeta')
    assert meta['total'] > 20, f'atlas should record answers ({meta})'
    print('atlas sessions OK', meta)

    # ---- Rabbit holes: walk every authored path ----
    holes = page.evaluate('CUR.HOLES.map(h => [h.id, h.paths.map(p => p.id)])')
    bad = []
    for hid, paths in holes:
        page.goto(BASE + f'#/hole/{hid}'); page.wait_for_selector('.door', timeout=4000)
        for pid in paths:
            page.goto(BASE + f'#/hole/{hid}/{pid}'); page.wait_for_selector('.path-body', timeout=4000)
            res = ''
            for _ in range(400):
                res = page.evaluate(WALK)
                if res == 'finished': break
                page.wait_for_timeout(25 if res != 'wait' else 120)
            ok = page.evaluate(f"!!(CUR.store.state.holes['{hid}'] && CUR.store.state.holes['{hid}'].paths['{pid}'])")
            if not ok: bad.append((hid, pid, res)); print('  FAIL', hid, pid, res)
    print(f'walked {sum(len(x[1]) for x in holes)} authored paths; {len(bad)} failed')

    # ---- Derived holes: every experience opens, and its first path runs ----
    ids = page.evaluate('CUR.library.map(e => e.id)')
    dbad = []
    for eid in ids:
        page.goto(BASE + f'#/hole/{eid}'); 
        try: page.wait_for_selector('.door', timeout=4000)
        except Exception: dbad.append(eid); print('  no doors for', eid); continue
        pid = page.evaluate("document.querySelector('.door').getAttribute('href').split('/').pop()")
        page.goto(BASE + f'#/hole/{eid}/{pid}'); page.wait_for_selector('.path-body', timeout=4000)
        res = ''
        for _ in range(300):
            res = page.evaluate(WALK)
            if res == 'finished': break
            page.wait_for_timeout(25 if res != 'wait' else 100)
        if res != 'finished': dbad.append(eid); print('  derived path stuck', eid, res)
    print(f'derived holes checked: {len(ids)}; {len(dbad)} failed')

    # ---- Mirror records and profile renders ----
    n = page.evaluate('CUR.store.state.mirror.log.length')
    assert n >= 10, f'mirror should have recorded answers from the paths ({n})'
    page.goto(BASE + '#/mirror'); page.wait_for_selector('.page'); page.wait_for_timeout(300)
    page.goto(BASE + '#/mind'); page.wait_for_selector('.kmap')
    print('mirror OK:', n, 'answers recorded;', page.evaluate("Object.keys(CUR.store.state.achievements).join(',')"))

    # ---- Drill card ----
    d = page.evaluate("CUR.makeDrill('history', 'e2e')")
    assert d and d['type'] == 'drill'
    page.goto(BASE + '#/x/' + d['id']); page.wait_for_selector('.card .begin'); page.click('.card .begin')
    for _ in range(40):
        st = page.evaluate("""() => {
          const nx = [...document.querySelectorAll('.card button')].find(b => !b.disabled && /^(Next question|Finish)/.test(b.textContent.trim()));
          if (nx) { nx.click(); return 'next'; }
          const o = [...document.querySelectorAll('.card .opt, .card .chip.toggle')].find(b => !b.disabled && !b.dataset.t);
          if (o) { o.dataset.t = '1'; o.click(); return 'opt'; }
          const sub = [...document.querySelectorAll('.card button')].find(b => !b.disabled && !b.dataset.t && /^(Check|Lock|Submit)/.test(b.textContent.trim()));
          if (sub) { sub.dataset.t = '1'; sub.click(); return 'sub'; }
          return document.querySelector('.card.completed') ? 'done' : 'wait';
        }""")
        if st == 'done': break
        page.wait_for_timeout(80)
    assert page.evaluate("!!document.querySelector('.card.completed')"), 'drill card should complete'
    print('drill card OK')

    # ---- feed still works and can include drills ----
    page.goto(BASE + '#/discover'); page.wait_for_selector('.card')
    for i in range(12): page.keyboard.press('ArrowDown'); page.wait_for_timeout(150)
    # ---- overflow ----
    for route in ['#/atlas', '#/holes', '#/hole/plato-cave', '#/mirror', '#/explore']:
        page.goto(BASE + route); page.wait_for_timeout(300)
        ov = page.evaluate("(() => { const v = document.getElementById('view'); return v.scrollWidth - v.clientWidth; })()")
        assert ov <= 1, f'horizontal overflow on {route}: {ov}px'
    print('layout OK')
    br.close()

if errors: print('\nBROWSER ERRORS:'); [print(' ', e) for e in sorted(set(errors))[:25]]
if bad or dbad or errors: sys.exit(1)
print('\nE2E v2 PASSED')
