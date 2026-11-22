/* Rabbit Holes, part B: Psychology, Science, Society, Arts. */
(function () {
  const C = (window.CUR = window.CUR || {});
  C.HOLES = C.HOLES || [];

  /* ============ PSYCHOLOGY: confirmation ============ */
  C.HOLES.push({
    id: 'confirmation-trap', anchor: 'wason-lab', topic: 'psychology', title: 'The Confirmation Trap',
    hook: 'We test ideas by looking for what agrees with them. Peter Wason showed how well that goes.',
    claim: 'Good thinkers look for evidence that could prove them wrong.',
    anti: 'Looking for confirming evidence is a sensible way to test ideas.',
    themes: ['knowledge', 'uncertainty'], related: ['probability-traps', 'plato-cave'],
    paths: [
      { id: 'experiments', kind: 'origin', title: 'Wason’s two experiments', blurb: 'The 2-4-6 task (1960) and the four-card selection task (1966).', mins: 5, nodes: [
        { t: 'read', h: 'The 2-4-6 task', p: ['In 1960 the British psychologist Peter Wason gave people the triple 2, 4, 6 and told them it followed a rule. They could propose their own triples and be told whether each fit. Most tested things like 8, 10, 12 and 20, 22, 24, announced “increase by two,” and were wrong. The real rule was simply “any ascending numbers.” Few tried triples that would break their guess, such as 5, 3, 1.'] },
        { t: 'choice', q: 'In Wason’s 2-4-6 task, what was the actual rule?', ans: 1, opts: [['Numbers increasing by two', 'That was the typical guess.'], ['Any three numbers in ascending order', 'Right. The common guess was narrower than the rule, and tests of the guess could only ever say “yes.”'], ['Three even numbers', 'No. Odd numbers also fit.']], why: 'Right. Any ascending sequence fits. People confirmed a narrower rule that was true of their examples but not of the rule.' },
        { t: 'read', h: 'The selection task', p: ['In 1966 Wason introduced the four-card task. Four cards show E, K, 4, 7. Each has a letter on one side and a number on the other. The rule: “If a card has a vowel on one side, it has an even number on the other.” Which cards must you turn over to test the rule?'] },
        { t: 'choice', q: 'Which cards must be turned to test the rule?', ans: 2, opts: [['E only', 'E is needed, but not enough.'], ['E and 4', 'The most common answer, found in only a minority of people. The 4 cannot falsify the rule: whatever is on its back, the rule holds.'], ['E and 7', 'Right. E could have an odd number (breaking the rule), and 7 could have a vowel (breaking the rule). The card 4 and K cannot break it.'], ['All four', 'Not necessary.']], why: 'E and 7. Those are the only cards that could break the rule. Fewer than 10% of people typically choose this pair.' },
        { t: 'mirror', n: 2, kinds: ['assume', 'evidence'] }
      ] },
      { id: 'pub', kind: 'play', title: 'The same logic, in a bar', blurb: 'Change the story and people suddenly get it right.', mins: 4, nodes: [
        { t: 'choice', q: 'The rule: “If a person is drinking beer, they must be over 20.” Four people: one drinking beer, one drinking cola, one aged 25, one aged 16. Whom must you check?', ans: 2, opts: [['The beer drinker and the 25-year-old', 'The 25-year-old cannot be breaking the rule, whatever they are drinking.'], ['The cola drinker and the 16-year-old', 'The cola drinker cannot be breaking the rule.'], ['The beer drinker and the 16-year-old', 'Right. Those are the only two who could be violating it.']], why: 'The beer drinker and the 16-year-old. The logic is identical to the card task, but most people find this version easy (Griggs and Cox, 1982).' },
        { t: 'read', h: 'Why would that be?', p: ['Cosmides and Tooby proposed that humans have evolved a skill for spotting cheaters on social contracts. Others argue the effect comes from familiarity or from how we reason about permission and obligation. The finding is solid; the explanation is debated.'] },
        { t: 'mirror', n: 2, kinds: ['connect', 'assume'] }
      ] },
      { id: 'popper', kind: 'compare', title: 'Falsification vs. everyday reasoning', blurb: 'What Popper asked of scientists and what Wason found in people.', mins: 4, nodes: [
        { t: 'compare', cols: [{ h: 'Popper’s ideal', pts: ['A claim is scientific if some observation could refute it.', 'The best test is one most likely to fail if the idea is wrong.', 'Confirming instances prove little.'] }, { h: 'What people tend to do', pts: ['Look for cases that fit.', 'Prefer “positive tests”: examples the hypothesis predicts.', 'Rarely design a test that could sink their own idea.'] }], q: 'Which describes how you usually check an idea you like?', note: 'Wason’s work was partly inspired by Popper. Later work (Klayman and Ha, 1987) showed that positive tests are often efficient when a hypothesis is narrow, so the habit is not simply a mistake.' },
        { t: 'mirror', n: 2, kinds: ['evidence', 'opposite'] }
      ] },
      { id: 'argumentative', kind: 'objections', title: 'Is it really a bug?', blurb: 'The case that “myside bias” is a feature of reasoning.', mins: 5, nodes: [
        { t: 'ladder', h: 'Pressing the standard story', claim: 'Confirmation bias is a flaw in human reasoning that we should try to remove.', rungs: [
          { o: 'Mercier and Sperber (2011) argue that reasoning evolved to persuade others and evaluate their arguments, not to find truth alone. For that job, finding the best case for your side is exactly right.', r: 'On that view, bias is cured by groups: individuals argue for sides, and the group sorts them. Bad conditions are those with no real disagreement.', c: 'Critics reply that individuals also deliberate alone to reach decisions and need self-correction.' },
          { o: 'Looking for confirming cases is often efficient. When a hypothesis is rare, testing where it predicts a yes is the best use of effort.', r: 'True in many settings. The trap appears when the hypothesis is too narrow, or when there is no cost to a wrong yes.', c: 'So the lesson is not “never confirm” but “check where you might be wrong.”' },
          { o: 'Debiasing training does not stick. People who know about the bias still show it.', r: 'Some techniques work modestly, such as “consider the opposite” (Lord, Lepper and Preston, 1984). Structural fixes may beat willpower: red teams, pre-registered predictions, adversarial collaboration.', c: 'Whether individuals can reliably debias themselves is debated.' }
        ] },
        { t: 'mirror', n: 2, kinds: ['evidence', 'confidence'] }
      ] },
      { id: 'habits', kind: 'modern', title: 'Habits that make you easier to prove wrong', blurb: 'Five working tools, and a quick test of which you would use.', mins: 4, nodes: [
        { t: 'choice', q: 'Which habit would you actually use to check a belief you care about?', opts: [['Ask what observation would show I am wrong, and go looking for it', 'The most direct approach. It works best when you decide what would count before you look.'], ['Write down my prediction before seeing the result', 'Stops hindsight from rewriting your memory (hindsight bias).'], ['Ask a friend to argue the other side for ten minutes', 'A cheap red team. It works only if the friend is willing to disagree.'], ['Imagine it is a year later and I was wrong, and explain why (a premortem)', 'Gary Klein’s technique. It makes it socially acceptable to voice doubts.'], ['Read the best opposing source rather than a summary of it', 'Steelmanning: restate the opposing view well enough that its holder would accept your version.']] },
        { t: 'mirror', n: 2, kinds: ['origin', 'confidence'] }
      ] }
    ]
  });

  /* ============ SCIENCE: probability traps ============ */
  C.HOLES.push({
    id: 'probability-traps', anchor: 'predict-monty-hall', topic: 'science', title: 'Probability’s Traps',
    hook: 'Three doors and a goat started an argument among mathematicians. Why intuition fails here, and where it fails you in daily life.',
    claim: 'When you are sure about a probability, you can usually trust that feeling.',
    anti: 'Our feelings about probability are systematically unreliable, even among experts.',
    themes: ['uncertainty', 'knowledge'], related: ['confirmation-trap', 'justice-behind-veil'],
    paths: [
      { id: 'history', kind: 'origin', title: 'The Monty Hall problem’s history', blurb: 'From a 1975 letter to a 1990 magazine column and thousands of angry readers.', mins: 4, nodes: [
        { t: 'read', h: 'The puzzle', p: ['Three doors: behind one is a car, behind the others goats. You pick a door. The host, who knows where the car is, opens a different door to reveal a goat, then offers you the chance to switch. Should you?'] },
        { t: 'read', h: 'The scandal', p: ['The problem appeared in a 1975 letter by Steve Selvin to the journal The American Statistician. It became famous in 1990, when Marilyn vos Savant answered a reader’s version in her Parade column, saying you should switch: it wins two-thirds of the time. She received thousands of letters, many from people with doctorates, insisting she was wrong. The mathematician Paul Erdős, as the story is told, was convinced only after seeing a computer simulation.'] },
        { t: 'choice', q: 'If you always switch, what proportion of the time do you win the car?', ans: 2, opts: [['One half', 'The most common intuition, but it ignores that the host’s action carries information.'], ['One third', 'That is the chance if you stay.'], ['Two thirds', 'Right. Your first pick is right one time in three. Switching wins whenever your first pick was wrong, which is two times in three.']], why: 'Two thirds. Staying wins only when your first guess was right, which is one time in three.' },
        { t: 'mirror', n: 1, kinds: ['assume'] }
      ] },
      { id: 'sim', kind: 'play', title: 'Run the experiment', blurb: 'Play 100 games with each strategy and watch the numbers.', mins: 4, nodes: [
        { t: 'sim', id: 'monty' },
        { t: 'mirror', n: 2, kinds: ['evidence', 'confidence'] }
      ] },
      { id: 'variants', kind: 'compare', title: 'Change the host, change the answer', blurb: 'Monty Hall vs. “Monty Fall”: why the host’s knowledge matters.', mins: 5, nodes: [
        { t: 'compare', cols: [{ h: 'Monty Hall (host knows)', pts: ['The host always opens a goat door, never your door.', 'He is forced by the rules to avoid the car.', 'His choice carries information, so switching wins 2/3 of the time.'] }, { h: 'Monty Fall (host guesses)', pts: ['The host opens one of the other two doors at random.', 'Sometimes he might reveal the car.', 'If it happens to be a goat, staying and switching win equally often: 1/2 each.'] }], q: 'Does it matter to your decision whether the host knew?', note: 'The odds depend on the process that produced the information, not just the information. Always ask: how did I come to see this?' },
        { t: 'choice', q: 'With 100 doors, you pick one, and the host opens 98 goat doors, leaving yours and one other. Switch?', ans: 0, opts: [['Switch. The other door carries the chance that was not on my first pick', 'Yes. Your first pick has a 1% chance. The other door holds the other 99%.'], ['Either is equal', 'The scaled-up version makes the logic hard to miss.']], why: 'Switch: it wins 99 times out of 100. Many people who resist the 3-door version find this one obvious.' },
        { t: 'mirror', n: 2, kinds: ['assume', 'opposite'] }
      ] },
      { id: 'objections', kind: 'objections', title: '“It’s obviously 50-50”', blurb: 'The three strongest objections, and why they fail.', mins: 4, nodes: [
        { t: 'ladder', h: 'Taking the doubters seriously', claim: 'Two doors remain, so each must be a 50% chance.', rungs: [
          { o: 'Two doors are left and one has the car. Therefore 50-50.', r: 'Two outcomes are not always equally likely. Your door started with a one-in-three chance, and nothing the host did could make it more likely, because he never opens your door.', c: 'If a coin were weighted, two outcomes would not mean 50-50 either.' },
          { o: 'The host’s action is irrelevant. He had to show a goat.', r: 'Exactly why it matters: he had to avoid the car. If your first pick was wrong (2/3), he has only one door he can open, which means the remaining door has the car.', c: 'Monty Fall makes the difference visible: change the host’s rule and the odds change.' },
          { o: 'Probabilities of a single game do not mean much. It either is or is not behind the door.', r: 'True of any single event. A probability describes the strategy’s long-run result: over many games switching wins about twice as often.', c: 'The simulation shows exactly this.' }
        ] },
        { t: 'mirror', n: 2, kinds: ['evidence', 'confidence'] }
      ] },
      { id: 'bayes', kind: 'modern', title: 'The same trap in a clinic', blurb: 'A positive test, and the number most doctors and patients get wrong.', mins: 5, nodes: [
        { t: 'read', h: 'A screening test', p: ['A disease affects 1% of people. A test detects it 90% of the time when present. It also gives a false positive in 9% of healthy people. You test positive. What is the chance you have the disease?'] },
        { t: 'choice', q: 'What is the probability you have the disease, roughly?', ans: 0, opts: [['About 9%', 'Right. Of 1,000 people, 10 have the disease and 9 of them test positive. Of the 990 healthy people, about 89 also test positive. So 9 of roughly 98 positives are genuine: around 9%.'], ['About 50%', 'This feels reasonable but ignores how rare the disease is.'], ['About 90%', 'The most common answer, even among doctors in studies by Gigerenzer. It confuses “90% of sick people test positive” with “90% of positives are sick.”']], why: 'About 9%. The base rate (1%) matters: most positives come from the large group who are healthy.' },
        { t: 'read', h: 'A better way to think', p: ['Gerd Gigerenzer found that framing in natural frequencies (“9 out of 98 people with a positive test have it”) rather than percentages greatly improves understanding, for doctors and patients alike. Bayes’ theorem is the formula, but counting people is the intuition.'] },
        { t: 'mirror', n: 2, kinds: ['connect', 'origin'] }
      ] }
    ]
  });

  /* ============ SOCIETY: justice ============ */
  C.HOLES.push({
    id: 'justice-behind-veil', anchor: 'veil-of-ignorance', topic: 'society', title: 'Justice Behind the Veil',
    hook: 'If you designed society without knowing who you would be in it, what rules would you choose?',
    claim: 'A fair society is one that you would accept without knowing your place in it.',
    anti: 'What people have earned or freely acquired matters more than what a rational chooser would pick.',
    themes: ['justice', 'power'], related: ['republic-falls', 'good-life-machine'],
    paths: [
      { id: 'rawls', kind: 'origin', title: 'Rawls’s original position', blurb: 'A Theory of Justice (1971) and the two principles.', mins: 4, nodes: [
        { t: 'read', h: 'The thought experiment', p: ['In A Theory of Justice (1971), the American philosopher John Rawls asks us to imagine choosing the basic rules of society from an “original position” behind a “veil of ignorance.” You do not know your class, race, sex, talents, religion or even your own idea of the good life. Because you could be anyone, Rawls argues, you would choose rules that are fair to everyone.'] },
        { t: 'read', h: 'What would they choose?', p: ['Rawls argues for two principles. First: equal basic liberties for all. Second: social and economic inequalities are allowed only if (a) they attach to positions open to all under fair equality of opportunity, and (b) they work to the greatest benefit of the least advantaged, the “difference principle.”'] },
        { t: 'choice', q: 'According to Rawls’s difference principle, when is inequality justified?', ans: 1, opts: [['When it increases the total wealth of society', 'That is closer to a utilitarian rule.'], ['When it benefits the least advantaged members of society', 'Right. Inequality is permissible only if the worst-off are better off than they would be under equality.'], ['When it reflects people’s merit', 'Rawls doubts that talents are deserved, since they are partly a matter of luck.']], why: 'Right. Inequalities must work to the benefit of the least advantaged.' },
        { t: 'mirror', n: 2, kinds: ['assume', 'evidence'] }
      ] },
      { id: 'choose', kind: 'play', title: 'Pick a society', blurb: 'Three societies, one random assignment. Which do you choose?', mins: 4, nodes: [
        { t: 'read', h: 'The setup', p: ['Three societies each have three equal-sized groups: a bottom, a middle and a top (in thousands of dollars a year). You are assigned to one group at random, with equal chance of each.', 'A: 10 / 30 / 50 (average 30)   B: 20 / 25 / 30 (average 25)   C: 5 / 40 / 90 (average 45)'] },
        { t: 'choice', q: 'Which society do you choose, not knowing where you will land?', opts: [['A', 'A moderate choice. Neither the safest nor the highest average.'], ['B', 'This is what Rawls’s maximin reasoning recommends: it has the best worst case (20). John Harsanyi disagreed.'], ['C', 'This is what expected-value reasoning recommends: the highest average (45). Harsanyi argued rational people choose by average utility. Rawls replied that this ignores the stakes of the worst outcome.']] },
        { t: 'read', h: 'What you just did', p: ['If you chose B, you reasoned like Rawls (maximin: maximise the minimum). If C, you reasoned like Harsanyi (maximise expected utility). Neither is irrational. They give different weight to protecting the worst-off and to risk. The question is whether fairness is about how bad the bottom is or about how good things are overall.'] },
        { t: 'mirror', n: 2, kinds: ['assume', 'confidence'] }
      ] },
      { id: 'nozick', kind: 'compare', title: 'Rawls vs. Nozick', blurb: 'Fairness of the outcome, or fairness of the process?', mins: 5, nodes: [
        { t: 'compare', cols: [{ h: 'Rawls (patterned justice)', pts: ['Justice is judged by the overall shape of society and the position of the worst-off.', 'Talents and birth are arbitrary from a moral view, so their rewards are not simply deserved.', 'Redistribution is justified if it benefits the least advantaged.'] }, { h: 'Nozick (entitlement)', pts: ['Anarchy, State, and Utopia (1974): what matters is whether holdings arose through just acquisition and voluntary transfer.', 'Wilt Chamberlain argument: if everyone freely pays to watch a star play, the resulting inequality seems fair, and any pattern will be upset by free exchanges.', 'Taxing earnings is akin to forced labour (a controversial claim).'] }], q: 'Which test of justice seems closer to yours: how a society’s shares look, or how they came about?', note: 'The two thinkers wrote just three years apart at Harvard and set the terms of debate in political philosophy.' },
        { t: 'mirror', n: 2, kinds: ['evidence', 'opposite'] }
      ] },
      { id: 'objections', kind: 'objections', title: 'Objections to the veil', blurb: 'Communitarians, incentive-minded critics and capability theorists.', mins: 5, nodes: [
        { t: 'ladder', h: 'Four objections', claim: 'Principles of justice are those that rational people would choose behind a veil of ignorance.', rungs: [
          { o: 'Michael Sandel: the veil assumes a self with no ties or loyalties. But our identities are shaped by family, community and tradition, so a person stripped of all that is not a real chooser.', r: 'Rawls replied that the veil is a device for fairness, not a theory of the self. Critics reply that it still needs a thin picture of persons.', c: 'The debate between liberal and communitarian thinkers continued through the 1980s.' },
          { o: 'G. A. Cohen: if the talented demand extra pay as an incentive to work, they are holding the rest hostage. A truly just society would not need such incentives.', r: 'Defenders say incentives are real in any society, and justice must work with human motives as they are.', c: 'Cohen replies that ideals should be argued without compromise, and then compromises made explicit.' },
          { o: 'Amartya Sen: what matters is what people can actually do and be, not just resources. Equal income does not mean equal capability (a disabled person needs more).', r: 'Rawls’s “primary goods” already include some of these. Sen replies that they do not go far enough.', c: 'Sen and Nussbaum’s capability approach influenced the UN’s Human Development Index.' },
          { o: 'The veil only covers members of one society. What about people elsewhere, and future generations?', r: 'Rawls later extended his ideas to international relations in The Law of Peoples (1999), with more limited duties than many readers expected.', c: 'Cosmopolitan critics such as Charles Beitz and Thomas Pogge argued for a global original position.' }
        ] },
        { t: 'mirror', n: 2, kinds: ['evidence', 'opposite'] }
      ] },
      { id: 'luck', kind: 'modern', title: 'The lottery of birth', blurb: 'How much of your position is luck? The data and your own view.', mins: 4, nodes: [
        { t: 'scale', q: 'How much of where you are in life do you think came from luck rather than effort?', left: 'Almost all effort', right: 'Almost all luck', note: 'Nearly everyone’s answer is a mix. The interesting part is that both are real, and that we tend to see our own effort more easily than our luck.' },
        { t: 'read', h: 'A number', p: ['In a widely cited 2015 paper, the economist Branko Milanovic found that country of birth and parental income class together explained about 60% of the variation in individual incomes around the world in 2008. Where and to whom you were born is a large part of the global income lottery.', 'That does not mean effort is irrelevant, or that every one of the 40% is deserved. It does suggest why Rawls’s thought experiment asks you to take the lottery seriously.'] },
        { t: 'mirror', n: 2, kinds: ['connect', 'origin'] }
      ] }
    ]
  });

  /* ============ ARTS: proportion ============ */
  C.HOLES.push({
    id: 'proportion-myth', anchor: 'golden-ratio-myth', topic: 'arts', title: 'Proportion: Where the Golden Ratio Is, and Isn’t',
    hook: 'It is said to be in the Parthenon, the Mona Lisa and your face. Most of that is myth. The rest is stranger.',
    claim: 'Beauty is built from mathematical proportions, such as the golden ratio.',
    anti: 'Beauty varies with culture and context, and no single ratio makes things beautiful.',
    themes: ['beauty', 'perception'], related: ['plato-cave', 'first-programmer'],
    paths: [
      { id: 'what', kind: 'origin', title: 'What the golden ratio actually is', blurb: 'Euclid’s “extreme and mean ratio,” Pacioli and the Renaissance.', mins: 4, nodes: [
        { t: 'read', h: 'The number', p: ['Two quantities are in the golden ratio when their sum is to the larger as the larger is to the smaller. The value is (1 + √5) / 2, about 1.618, called phi (φ). Euclid described the construction in the Elements (c. 300 BCE) as division in “extreme and mean ratio.”'] },
        { t: 'read', h: 'How it got its glamour', p: ['In 1509 the friar Luca Pacioli published De divina proportione, illustrated by Leonardo da Vinci. The name “golden section” became common only in the nineteenth century. In the twentieth, Le Corbusier built his Modulor (1948) system of proportions on it, and Dalí used it in The Sacrament of the Last Supper (1955).'] },
        { t: 'choice', q: 'Which of these has a well-established connection to the golden ratio?', ans: 2, opts: [['The proportions of the Parthenon', 'Not supported. The claim depends on picking which parts to measure.'], ['The Mona Lisa’s face', 'No documented intent, and the measurements fit only if you choose where to draw the rectangle.'], ['The ratio of consecutive Fibonacci numbers', 'Right. The ratio 13/8, 21/13, 34/21 and so on approaches 1.618 as the numbers grow, a mathematical fact.']], why: 'Right. The Fibonacci ratios converge on φ. The Parthenon and Mona Lisa claims are far weaker.' },
        { t: 'mirror', n: 2, kinds: ['assume', 'origin'] }
      ] },
      { id: 'test', kind: 'play', title: 'The rectangle test', blurb: 'Pick the most pleasing shape, then see how people did in the lab.', mins: 4, nodes: [
        { t: 'choice', q: 'Four rectangles, ratios 1 : 1 (A), 1 : 1.2 (B), 1 : 1.618 (C) and 1 : 2 (D). Which looks the most pleasing to you?', opts: [['A: the square', 'Squares are stable but few people choose them as most pleasing in these studies.'], ['B: a little wider than square', 'Common in some studies.'], ['C: the golden rectangle', 'Gustav Fechner reported in the 1860s–70s that more people preferred rectangles near the golden ratio than any other.'], ['D: twice as wide as tall', 'Chosen by a minority in classic studies.']] },
        { t: 'read', h: 'What the lab found', p: ['Fechner’s experiments in the 1860s and 1870s found that people tended to pick rectangles close to the golden ratio, but later studies found weaker or inconsistent preferences, strongly affected by the choice set and by how the task is run. The effect is real in some samples and slight in many. It is far from a law of beauty.'] },
        { t: 'mirror', n: 2, kinds: ['evidence', 'confidence'] }
      ] },
      { id: 'nature', kind: 'compare', title: 'Real patterns and attached myths', blurb: 'Where φ shows up in nature, and where it is sold.', mins: 4, nodes: [
        { t: 'compare', cols: [{ h: 'Real appearances', pts: ['Sunflower seed spirals often follow Fibonacci counts, because a turn of about 137.5° (the golden angle) packs seeds evenly.', 'Fibonacci ratios converge on φ in pure mathematics.', 'Some designers deliberately use φ-based grids.'] }, { h: 'Weak or false claims', pts: ['The Parthenon and the pyramids were built using φ (no evidence of intent).', 'Human faces and bodies have φ ratios (measurements vary and are cherry-picked).', 'Famous paintings are composed on φ (depends on where you draw the lines).'] }], q: 'What makes a claim of “hidden proportion” convincing?', note: 'Mario Livio’s The Golden Ratio (2002) surveys the evidence and concludes that many popular claims fail. When you can choose which lengths to compare, you can find 1.6 almost anywhere.' },
        { t: 'mirror', n: 2, kinds: ['evidence', 'opposite'] }
      ] },
      { id: 'objections', kind: 'objections', title: 'Is beauty mathematical at all?', blurb: 'Three objections to the idea that proportion makes beauty.', mins: 5, nodes: [
        { t: 'ladder', h: 'Three objections', claim: 'Beauty comes from mathematical proportion.', rungs: [
          { o: 'Taste varies by culture and era. Japanese aesthetics prize asymmetry and imperfection (wabi-sabi), while Western classical art prized symmetry.', r: 'A defender can allow that ratios matter in some traditions without claiming one ratio applies everywhere. The Pythagorean tradition tied musical consonance to simple ratios, which does seem to be widely heard as pleasant.', c: 'Even consonance preferences differ across cultures, as ethnomusicological work such as McDermott and colleagues (2016) indicates.' },
          { o: 'Hume: “Beauty is no quality in things themselves: it exists merely in the mind which contemplates them.”', r: 'Kant tried to find a middle path: judgments of beauty feel universal, though they rest on feeling rather than rules.', c: 'Philosophers still argue whether beauty is in the object, the viewer, or the encounter.' },
          { o: 'If proportion mattered so much, it would predict great art. But the great works we love often break the rules.', r: 'Rules are guides for craftsmen, not guarantees. Artists as different as Michelangelo and Picasso studied proportion and then departed from it.', c: 'Knowing the ratio does not explain why one Mona Lisa moves us and a copy does not.' }
        ] },
        { t: 'mirror', n: 2, kinds: ['assume', 'opposite'] }
      ] },
      { id: 'design', kind: 'modern', title: 'Proportion in the things you use', blurb: 'Typography, screens and the rule of thirds.', mins: 3, nodes: [
        { t: 'read', h: 'Everyday ratios', p: ['Paper sizes follow a ratio of √2 (about 1.414), chosen not for beauty but so that halving a sheet gives the same shape (the A-series, standardised in Germany in 1922). Widescreen video uses 16:9 as a compromise between older formats. The “rule of thirds” in photography is a rule of thumb, and Reynolds’s 1783 mention is often cited as an early formulation.'] },
        { t: 'scale', q: 'How much do you think the proportions of the design affect whether you find something beautiful?', left: 'Barely at all', right: 'Enormously', note: 'Evidence suggests proportion matters, but alongside familiarity, color, context and meaning. It is one voice in the chorus.' },
        { t: 'mirror', n: 2, kinds: ['connect', 'origin'] }
      ] }
    ]
  });
})();
