/* Extra interactive simulations for Rabbit Holes. Loads after holes.js. */
(function () {
  const C = window.CUR, H = C.holes, h = C.h, kit = C.tpl.kit;

  H.sims.monty = function (api) {
    const root = h('div', { class: 'hn monty' });
    const tally = { stay: [0, 0], swap: [0, 0] }; // [wins, games]
    let phase = 0, car = 0, pick = -1, open = -1, played = 0;
    const board = h('div', { class: 'opts three' }), msg = h('p', { class: 'fine' }), stats = h('div', { class: 'panel' }), ctl = h('div', { class: 'row' });
    const rate = (a) => (a[1] ? Math.round((100 * a[0]) / a[1]) + '% (' + a[0] + '/' + a[1] + ')' : 'no games yet');
    const showStats = () => {
      stats.replaceChildren(kit.kicker('Your results'), h('p', { text: 'Staying: ' + rate(tally.stay) }), h('p', { text: 'Switching: ' + rate(tally.swap) }));
    };
    const reset = () => {
      phase = 0; car = Math.floor(Math.random() * 3); pick = -1; open = -1;
      msg.textContent = 'Pick a door. One hides a car; two hide goats.';
      draw();
    };
    const label = (i) => {
      if (phase === 0) return 'Door ' + (i + 1);
      if (phase === 1) return i === open ? 'Door ' + (i + 1) + ': goat' : 'Door ' + (i + 1) + (i === pick ? ' (your pick)' : '');
      return 'Door ' + (i + 1) + (i === car ? ': car' : ': goat') + (i === pick ? ' (final)' : '');
    };
    const draw = () => {
      board.replaceChildren();
      for (let i = 0; i < 3; i++) {
        const b = h('button', { class: 'opt' + (phase === 2 && i === car ? ' right' : '') + (phase === 1 && i === open ? ' wrong' : ''), type: 'button' }, label(i));
        b.disabled = phase === 2 || (phase === 1 && i === open);
        b.addEventListener('click', () => {
          if (phase === 0) {
            pick = i;
            const choices = [0, 1, 2].filter((d) => d !== pick && d !== car);
            open = choices[Math.floor(Math.random() * choices.length)];
            phase = 1; msg.textContent = 'The host, who knows where the car is, opens door ' + (open + 1) + ': a goat. Stay with door ' + (pick + 1) + ' or switch?'; draw();
          } else if (phase === 1) {
            const final = i, switched = final !== pick, key = switched ? 'swap' : 'stay';
            // clicking the picked door = stay; the other closed door = switch
            const won = final === car; tally[key][1]++; if (won) tally[key][0]++;
            pick = final; phase = 2; played++;
            msg.textContent = (won ? 'You won the car. ' : 'A goat. ') + (switched ? 'You switched.' : 'You stayed.');
            draw(); showStats();
            if (played >= 5) api.done();
          }
        });
        board.append(b);
      }
    };
    const again = kit.btn('Play another round', reset, 'ghost');
    const auto = kit.btn('Run 1,000 games of each strategy', () => {
      let s = 0, w = 0;
      for (let g = 0; g < 1000; g++) {
        const c = Math.floor(Math.random() * 3), p = Math.floor(Math.random() * 3);
        const o = [0, 1, 2].filter((d) => d !== p && d !== c)[0]; // host opens a goat door
        const sw = [0, 1, 2].filter((d) => d !== p && d !== o)[0];
        if (p === c) s++; if (sw === c) w++;
      }
      ctl.parentNode.append(kit.panel(kit.kicker('1,000 simulated games'), h('p', { text: 'Always stay: ' + s + ' wins (' + (s / 10).toFixed(1) + '%).' }), h('p', { text: 'Always switch: ' + w + ' wins (' + (w / 10).toFixed(1) + '%).' }), h('p', { class: 'fine', text: 'Expect about 33% and 67%. Switching wins exactly when your first pick was a goat, which happens two times in three.' })));
      api.done();
    }, 'primary');
    ctl.append(again, auto);
    root.append(kit.kicker('Monty Hall'), board, msg, stats, ctl);
    showStats(); reset();
    return root;
  };
})();
