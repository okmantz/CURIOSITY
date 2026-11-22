#!/usr/bin/env python3
"""
End-to-end smoke test: plays EVERY experience through its real UI in headless Chrome,
then visits every screen. Needs: pip install playwright, and Chrome/Chromium installed.

  python3 tests/e2e.py [--chrome /usr/bin/google-chrome] [--shots out_dir]
"""
import argparse, http.server, json, os, socketserver, sys, threading, time
from playwright.sync_api import sync_playwright

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
ap = argparse.ArgumentParser()
ap.add_argument('--chrome', default=None)
ap.add_argument('--shots', default=None)
ap.add_argument('--only', default=None, help='comma-separated experience ids')
args = ap.parse_args()

class Q(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **k): super().__init__(*a, directory=ROOT, **k)
    def log_message(self, *a): pass
srv = socketserver.TCPServer(('127.0.0.1', 0), Q); PORT = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()
BASE = f'http://127.0.0.1:{PORT}/index.html'

STEP = """
() => {
  const card = document.querySelector('.card.begun');
  if (!card) return 'nocard';
  if (!card.querySelector('.takeaway').hidden) return 'done';
  const mount = card.querySelector('.tpl-mount');
  mount.querySelectorAll('textarea').forEach(t => { if (!t.disabled && t.value.length < 12) { t.value = 'A thoughtful test answer here'; t.dispatchEvent(new Event('input', {bubbles: true})); } });
  const nums = mount.querySelectorAll('input.num');
  if (nums.length) {
    window.__wi = window.__wi || 0;
    const sets = [[1, 2, 3], [9, 5, 1], [2, 4, 6]];
    const btn = [...mount.querySelectorAll('button')].find(b => b.textContent.includes('Test this triple') && !b.disabled);
    if (btn && window.__wi < 3) { const s = sets[window.__wi++]; nums.forEach((n, i) => { n.value = s[i]; }); btn.click(); return 'wason'; }
  }
  const ranges = mount.querySelectorAll('input[type=range]:not(:disabled)');
  if (ranges.length && !window.__ranged) {
    window.__ranged = true;
    ranges.forEach(r => { const mn = +r.min, mx = +r.max, st = (mx - mn) / 80; for (let v = mn; v <= mx + 1e-9; v += st) { r.value = v; r.dispatchEvent(new Event('input', {bubbles: true})); } });
    return 'ranged';
  }
  const cands = [...mount.querySelectorAll('button')].filter(b => !b.disabled && b.dataset.t !== b.textContent && !b.classList.contains('ghost') && !b.classList.contains('chosen') && !(b.classList.contains('hl') && false) && b.offsetParent !== null && !b.textContent.includes('Test this triple'));
  if (!cands.length) return 'wait';
  const b = cands[0]; b.dataset.t = b.textContent; b.click(); return 'clicked:' + (b.textContent || '').slice(0, 24);
}
"""

errors = []
def hook(page, tag):
    page.on('pageerror', lambda e: errors.append(f'[{tag}] pageerror: {e}'))
    page.on('console', lambda m: errors.append(f'[{tag}] console.{m.type}: {m.text}') if m.type == 'error' else None)

with sync_playwright() as p:
    kw = {'headless': True, 'args': ['--no-sandbox', '--autoplay-policy=no-user-gesture-required']}
    if args.chrome or os.path.exists('/usr/bin/google-chrome'): kw['executable_path'] = args.chrome or '/usr/bin/google-chrome'
    browser = p.chromium.launch(**kw)
    ctx = browser.new_context(viewport={'width': 390, 'height': 844}, device_scale_factor=2, is_mobile=True, has_touch=True)
    page = ctx.new_page(); hook(page, 'mobile')
    shots = args.shots
    if shots: os.makedirs(shots, exist_ok=True)
    def shot(name):
        if shots: page.screenshot(path=os.path.join(shots, name + '.png'))

    # ---------- Onboarding ----------
    page.goto(BASE); page.wait_for_selector('.onb-title'); shot('01-onboarding-welcome')
    page.click('.onb-body .btn.big'); page.wait_for_selector('.onb-chips')
    assert page.is_disabled('.onb-body .btn.big'), 'Continue should be disabled until 3 chosen'
    for t in ['Philosophy', 'History', 'Science']: page.click(f'.onb-chips >> text={t}')
    shot('02-onboarding-interests')
    page.click('.onb-body .btn.big'); page.wait_for_selector('text=How deep')
    shot('03-onboarding-depth')
    page.click('.onb-body .btn.big'); page.wait_for_selector('.card'); page.wait_for_timeout(900)
    shot('04-feed-intro')
    print('onboarding OK')

    # ---------- Feed: scroll + endless ----------
    n0 = page.eval_on_selector_all('.card', 'els => els.length')
    for i in range(7):
        page.keyboard.press('ArrowDown'); page.wait_for_timeout(450)
    n1 = page.eval_on_selector_all('.card', 'els => els.length')
    assert n1 > n0, f'feed should grow while scrolling ({n0} -> {n1})'
    print(f'endless feed OK ({n0} -> {n1} cards)')

    # ---------- Play every experience ----------
    ids = page.evaluate('CUR.library.map(e => e.id)')
    if args.only: ids = [i for i in ids if i in args.only.split(',')]
    results = []
    for eid in ids:
        page.evaluate("window.__wi = 0; window.__ranged = false;")
        page.goto(f'{BASE}#/x/{eid}'); page.wait_for_selector('.card .begin', timeout=5000)
        page.evaluate("window.__wi = 0; window.__ranged = false;")
        page.click('.card .begin')
        status = ''
        for _ in range(80):
            status = page.evaluate(STEP)
            if status == 'done': break
            page.wait_for_timeout(120 if status != 'wait' else 350)
        ok = status == 'done'
        done = page.evaluate(f"!!(CUR.store.state.exp['{eid}'] && CUR.store.state.exp['{eid}'].done)")
        results.append((eid, ok and done))
        if not (ok and done): print('  FAIL', eid, 'status=', status, 'stored=', done)
        if shots and eid in ('ship-of-theseus', 'powers-of-ten', 'debate-free-will', 'lit-ozymandias', 'sound-of-ratios', 'apply-dichotomy-of-control'):
            shot('play-' + eid)
    bad = [r for r in results if not r[1]]
    print(f'played {len(results)} experiences; {len(results) - len(bad)} completed through the UI')

    # ---------- Progression sanity ----------
    st = page.evaluate('({xp: CUR.store.state.xp, done: Object.values(CUR.store.state.exp).filter(x=>x.done).length, ach: Object.keys(CUR.store.state.achievements), lvl: CUR.progress.levelInfo().name, streak: CUR.store.state.streak.current})')
    print('state:', json.dumps(st))
    assert st['xp'] > 300 and st['done'] == len(ids) if not args.only else True
    assert 'first-spark' in st['ach'] and 'full-spectrum' in st['ach'], 'achievements should be awarded'

    # ---------- Screens ----------
    for route, sel, name in [('#/discover', '.card', 'discover'), ('#/following', '.card, .end-card', 'following'), ('#/explore', '.tiles', 'explore'), ('#/explore/topic/history', '.topic-hero', 'topic'),
                             ('#/explore/collection/mind-benders', '.list', 'collection'), ('#/explore/curator/mara', '.cur-card', 'curator'),
                             ('#/journeys', '.journey-card', 'journeys'), ('#/journey/think-clearly', '.path', 'journey'), ('#/journey/think-clearly/play/0', '.card', 'journey-play'),
                             ('#/saved', '.empty, .list', 'saved'), ('#/saved/collections', '.new-coll', 'saved-collections'), ('#/saved/notes', '.empty, .note-card', 'saved-notes'),
                             ('#/mind', '.kmap', 'mind'), ('#/daily', '.streak-banner', 'daily'), ('#/daily/play/0', '.card', 'daily-play'),
                             ('#/profile', '.settings', 'profile'), ('#/play/recall', '.card, .toast', 'recall'), ('#/play/format/debate', '.card', 'format'), ('#/play/topic/science', '.card', 'topic-play')]:
        page.goto(BASE + route); page.wait_for_selector(sel, timeout=4000); page.wait_for_timeout(500)
        shot('screen-' + name)
    print('all screens render OK')

    # ---------- Interactions: save, collections, follow, theme, search, export ----------
    page.goto(BASE + '#/x/ship-of-theseus'); page.wait_for_selector('.rail-btn')
    page.click('.rail-btn[aria-label="Save"]'); page.wait_for_selector('.toast-act'); page.click('.toast-act')
    page.wait_for_selector('.coll-sheet'); page.fill('.coll-sheet input', 'My test shelf'); page.click('.coll-sheet .btn.primary'); page.wait_for_timeout(300)
    assert page.evaluate("CUR.store.state.collections.length === 1 && CUR.store.state.collections[0].items.includes('ship-of-theseus')"), 'collection creation'
    page.keyboard.press('Escape'); page.wait_for_timeout(400)
    page.click('.rail-btn[aria-label="Reflect and discuss"]'); page.wait_for_selector('.discuss textarea'); page.fill('.discuss textarea', 'I think identity is about continuity of story.'); page.click('.discuss >> text=Save my thought'); page.wait_for_timeout(300)
    page.keyboard.press('Escape'); page.wait_for_timeout(300)
    assert page.evaluate("CUR.store.state.stats.reflections >= 1"), 'reflection stat'
    page.goto(BASE + '#/saved/collections'); page.wait_for_selector('.coll-block'); page.goto(BASE + '#/saved/notes'); page.wait_for_selector('.note-card')
    page.goto(BASE + '#/explore'); page.fill('.search', 'socrates'); page.wait_for_selector('.results .list-item'); shot('screen-search')
    page.click('.chip-cloud .chip.toggle >> nth=0'); assert page.evaluate("CUR.store.state.follows.thinkers.length === 1"), 'follow thinker'
    page.goto(BASE + '#/profile'); page.click('.seg-btn:has-text("Light")'); page.wait_for_timeout(300)
    assert page.evaluate("document.documentElement.dataset.theme") == 'light', 'light theme'; shot('screen-profile-light')
    page.goto(BASE + '#/mind'); page.wait_for_selector('.kmap'); page.evaluate("document.querySelectorAll('.kn')[1].dispatchEvent(new MouseEvent('click', {bubbles: true}))"); page.wait_for_selector('.kd-head'); shot('screen-mind-light')
    page.goto(BASE + '#/discover'); page.wait_for_selector('.card'); page.wait_for_timeout(700); shot('screen-discover-light')
    page.goto(BASE + '#/profile'); page.click('.seg-btn:has-text("Dark")')
    exp = page.evaluate('CUR.store.exportJSON()'); assert json.loads(exp)['v'] == 1
    # persistence across reload
    xp = page.evaluate('CUR.store.state.xp'); page.evaluate('CUR.store.flushNow()'); page.reload(); page.wait_for_timeout(500)
    assert page.evaluate('CUR.store.state.xp') == xp, 'progress persists after reload'
    print('interactions + persistence OK')

    # ---------- Desktop layout ----------
    d = browser.new_context(viewport={'width': 1360, 'height': 860}); dp = d.new_page(); hook(dp, 'desktop')
    dp.goto(BASE); dp.wait_for_selector('.onb-title'); dp.evaluate("CUR.store.update(s => { s.onboarded = true; s.interests = ['history','philosophy','science']; }); document.querySelector('.onb').remove(); CUR.router.refresh();")
    dp.wait_for_selector('.card'); dp.wait_for_timeout(900)
    if shots: dp.screenshot(path=os.path.join(shots, 'desktop-feed.png'))
    dp.click('.card .begin'); dp.wait_for_timeout(500)
    if shots: dp.screenshot(path=os.path.join(shots, 'desktop-card-active.png'))
    dp.goto(BASE + '#/mind'); dp.wait_for_selector('.kmap'); dp.wait_for_timeout(400)
    if shots: dp.screenshot(path=os.path.join(shots, 'desktop-mind.png'))
    # no horizontal overflow on mobile pages
    for route in ['#/explore', '#/mind', '#/profile', '#/journeys', '#/daily']:
        page.goto(BASE + route); page.wait_for_timeout(300)
        ov = page.evaluate("(() => { const v = document.getElementById('view'); return v.scrollWidth - v.clientWidth; })()")
        assert ov <= 1, f'horizontal overflow on {route}: {ov}px'
    print('layout checks OK')
    browser.close()

real = [e for e in errors if 'favicon' not in e and 'serviceWorker' not in e]
if real:
    print('\nBROWSER ERRORS:'); [print(' ', e) for e in real[:20]]
if bad or real: sys.exit(1)
print('\nALL E2E CHECKS PASSED')
