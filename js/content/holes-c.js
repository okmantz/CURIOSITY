/* Rabbit Holes, part C: Ethics (experience machine), Geography (maps), Thinkers (Ada), Wisdom (control). */
(function () {
  const C = (window.CUR = window.CUR || {});
  C.HOLES = C.HOLES || [];

  /* ============ ETHICS: the experience machine ============ */
  C.HOLES.push({
    id: 'good-life-machine', anchor: 'experience-machine', topic: 'ethics', title: 'Would You Plug In?',
    hook: 'A machine that can give you any experience you like. Nozick used it to ask what, besides feeling good, we want from life.',
    claim: 'A good life is one that feels good from the inside.',
    anti: 'A good life requires more than good experiences, such as real achievement and real relationships.',
    themes: ['meaning', 'justice'], related: ['control-hole', 'divine-goodness'],
    paths: [
      { id: 'nozick', kind: 'origin', title: 'Nozick’s thought experiment', blurb: 'Anarchy, State, and Utopia (1974) and the question it was built to ask.', mins: 4, nodes: [
        { t: 'read', h: 'The machine', p: ['In Anarchy, State, and Utopia (1974), the philosopher Robert Nozick asks you to imagine a machine that could give you any experience you desired. Superduper neuropsychologists could stimulate your brain so that you would think and feel you were writing a great novel, making a friend, or reading an interesting book. All the time you would be floating in a tank with electrodes attached to your brain. Should you plug in for life?'] },
        { t: 'read', h: 'What it is aimed at', p: ['Nozick wanted to test hedonism, the view that the only thing that matters for a good life is how it feels. If it were true, there would be no reason to refuse. He suggests we would refuse, and that this shows we care about something other than experiences: that we want to do certain things, to be a certain sort of person, and to be in contact with a reality deeper than man-made ones.'] },
        { t: 'choice', q: 'Which philosophical view is Nozick’s thought experiment mainly aimed at?', ans: 0, opts: [['Hedonism', 'Right. It targets the claim that pleasant experience is all that matters.'], ['Relativism', 'No.'], ['Determinism', 'No.']], why: 'Hedonism, the claim that a good life is just a pleasant stream of experiences.' },
        { t: 'mirror', n: 2, kinds: ['assume', 'origin'] }
      ] },
      { id: 'plug', kind: 'play', title: 'Make your decision', blurb: 'Plug in, stay out, or something in between. See what each choice says.', mins: 5, nodes: [
        { t: 'choice', q: 'Would you plug in for the rest of your life?', opts: [['Yes. If it feels real and wonderful, that is enough', 'A consistent hedonist answer. The strongest reply: if you couldn’t tell the difference, what would you be losing? The challenge: would you also accept it for a person you love?'], ['No. I want things to actually be true', 'This matches Nozick’s expectation. The question is whether the reason is a good one, or just a feeling of attachment to reality (a status quo bias).'], ['Only for a limited time, like a holiday', 'Many people choose this. It suggests the issue is the permanence and disconnection, not experience itself.'], ['I cannot decide', 'Honest. Nozick himself offered the case as a test of intuition rather than a proof.']] },
        { t: 'choice', q: 'Now suppose that you are already in a machine and the people who put you there offer to unplug you. Do you leave?', opts: [['Yes, I would want to know the truth', 'De Brigard (2010) found that people were far more willing to stay in the machine when told they were already in one, which suggests that our first answer was partly status quo bias.'], ['No. This life is fine as it is', 'This is the pattern De Brigard found in many participants: the reluctance to unplug is as strong as the reluctance to plug in.'], ['It depends on what the real world is like', 'Then your preference is not a flat rule about truth. It is a weighing of what each option offers.']] },
        { t: 'read', h: 'What the study did', p: ['Felipe De Brigard’s 2010 paper “If you like it, does it matter if it’s real?” reworded the case so people were told they were already in a machine and could choose to leave for the real world. Many said they would stay. That does not refute Nozick, but it shows the original result depends partly on a preference for the status quo.'] },
        { t: 'mirror', n: 2, kinds: ['assume', 'opposite'] }
      ] },
      { id: 'happiness', kind: 'compare', title: 'What psychology says about feeling good', blurb: 'The hedonic treadmill and why experiences alone may not satisfy.', mins: 5, nodes: [
        { t: 'read', h: 'The treadmill', p: ['Brickman and Campbell (1971) described the “hedonic treadmill”: people adapt to changes in circumstances, returning to a baseline of well-being. A famous 1978 study by Brickman, Coates and Janoff-Bulman compared lottery winners with accident victims and reported smaller differences in happiness than expected. The study was small, and later research suggests adaptation is partial: some events, such as long-term unemployment and the death of a spouse, leave lasting marks.'] },
        { t: 'compare', cols: [{ h: 'Hedonism', pts: ['Well-being is pleasure and absence of pain.', 'Source of the pleasure is irrelevant.', 'Machine life could be the best life.'] }, { h: 'Objective-list and desire views', pts: ['Some things are good for us beyond how they feel: knowledge, friendship, achievement.', 'Or: well-being is getting what we actually want, and we want things to be true.', 'Machine life lacks what we actually want.'] }], q: 'Which fits what you want from your own life?', note: 'Aristotle’s eudaimonia (flourishing) is an old objective view. Modern positive psychology often distinguishes hedonic well-being (feeling good) from eudaimonic well-being (purpose and growth).' },
        { t: 'mirror', n: 2, kinds: ['evidence', 'connect'] }
      ] },
      { id: 'objections', kind: 'objections', title: 'Objections to Nozick', blurb: 'Does the machine really show what he thinks it does?', mins: 5, nodes: [
        { t: 'ladder', h: 'Three replies', claim: 'Our reluctance to plug into the machine shows that experience is not all that matters.', rungs: [
          { o: 'Status quo bias: we resist because the machine is unfamiliar and frightening, not because we have a principled view. De Brigard’s results point this way.', r: 'Nozick’s defenders say the finding does not show that we have no reason to value reality, only that our intuitions are mixed. The reverse case, where people are told they are already plugged in, may add other worries (such as whether the real world is worse).', c: 'The disagreement turns on which version of the case is cleaner.' },
          { o: 'We imagine that others in the real world would suffer if we left. Our reluctance is concern for them, not for reality.', r: 'Nozick’s case is stipulated so that others can also plug in. Some people still refuse, which suggests there is more to it.', c: 'Hard to be sure what people imagine when they consider the case.' },
          { o: 'A hedonist can say the machine is a bad bet in practice: the technology might fail, and the real world offers richer and more reliable experiences.', r: 'Stipulate it is guaranteed. The objection then has to bite the bullet and accept the machine.', c: 'Some hedonists accept this and say the machine would be fine.' }
        ] },
        { t: 'mirror', n: 2, kinds: ['evidence', 'opposite'] }
      ] },
      { id: 'screens', kind: 'modern', title: 'Partial machines', blurb: 'Where do real technologies fall on Nozick’s spectrum?', mins: 4, nodes: [
        { t: 'sort', q: 'Is each of these closer to an “experience” or to “living in contact with reality”?', buckets: ['Closer to experience', 'Closer to reality'], items: [
          { t: 'Watching a film about climbing a mountain', b: 0, why: 'You get the experience of the story without doing the thing.' },
          { t: 'Climbing the mountain yourself', b: 1, why: 'You do it, and it could go wrong in real ways.' },
          { t: 'A virtual reality game with a perfect simulation', b: 0, why: 'Immersive experience with no real stakes. Closest to the machine.' },
          { t: 'Cooking a meal for a friend who comes to dinner', b: 1, why: 'You do something real, with a real person and real effects.' },
          { t: 'Scrolling a feed that shows you what you like', b: 0, why: 'Pleasant experience, little action or contact with the world.' }
        ] },
        { t: 'read', h: 'A note', p: ['None of these is bad. The point is not to condemn experiences, which are valuable, but to ask when we want something more than experience from an activity. Many everyday choices are small versions of the machine question.'] },
        { t: 'mirror', n: 2, kinds: ['connect', 'confidence'] }
      ] }
    ]
  });

  /* ============ GEOGRAPHY: maps ============ */
  C.HOLES.push({
    id: 'maps-lie', anchor: 'mercator-distortion', topic: 'geography', title: 'Every Map Lies',
    hook: 'You cannot flatten a sphere without distorting it. Which distortion you pick is a choice.',
    claim: 'A good map shows the world as it is.',
    anti: 'Every map distorts, and the distortion you pick reflects a purpose.',
    themes: ['perception', 'power'], related: ['plato-cave', 'proportion-myth'],
    paths: [
      { id: 'mercator', kind: 'origin', title: 'Why Mercator made it that way', blurb: 'A 1569 map for sailors, and why it is still everywhere.', mins: 4, nodes: [
        { t: 'read', h: 'A map built for navigation', p: ['In 1569 the Flemish cartographer Gerardus Mercator published a world map on a projection designed for sailors. On it, a line of constant compass bearing (a rhumb line) appears as a straight line, which makes it very useful for navigating by compass.', 'The price is area. The projection stretches distances more and more toward the poles, so that landmasses at high latitude look far larger than they are.'] },
        { t: 'read', h: 'Numbers to know', p: ['Africa’s area is roughly 30 million square kilometres, about 14 times that of Greenland (about 2.17 million). On a Mercator map the two look similar in size. Alaska (about 1.7 million km²) is smaller than Mexico (about 1.96 million), yet on a Mercator map Alaska looks much bigger.'] },
        { t: 'choice', q: 'Why did sailors value Mercator’s projection?', ans: 1, opts: [['It showed areas accurately', 'No. It badly distorts areas near the poles.'], ['A constant compass bearing appears as a straight line', 'Right. That made plotting a course simple.'], ['It showed the poles clearly', 'No. The poles cannot be shown at all.']], why: 'Right. Constant-bearing courses are straight lines, which is what navigators needed.' },
        { t: 'mirror', n: 1, kinds: ['assume'] }
      ] },
      { id: 'pick', kind: 'play', title: 'Choose your distortion', blurb: 'Every projection protects one thing and sacrifices another.', mins: 4, nodes: [
        { t: 'choice', q: 'You are making a wall map for a school. What matters most to you?', opts: [['Correct areas, so that countries can be compared fairly', 'An equal-area projection, such as Gall–Peters or Mollweide. Shapes get stretched, especially near the edges or poles.'], ['Correct shapes locally, so that coastlines look right', 'A conformal projection, such as Mercator. Areas swell toward the poles.'], ['A compromise: a bit wrong everywhere, nothing very wrong', 'A compromise projection such as the Winkel tripel, adopted by the National Geographic Society in 1998.'], ['Show the world as it is: use a globe', 'The only way to keep both area and shape. Less convenient for walls and screens.']] },
        { t: 'read', h: 'The theorem behind it', p: ['Gauss’s Theorema Egregium (1827) implies that a sphere cannot be flattened onto a plane without distorting distances. So every flat map of the whole Earth must distort something: area, shape, distance or direction.'] },
        { t: 'mirror', n: 2, kinds: ['assume', 'opposite'] }
      ] },
      { id: 'alternatives', kind: 'compare', title: 'Peters, Winkel and AuthaGraph', blurb: 'The famous alternatives, and the politics around them.', mins: 5, nodes: [
        { t: 'compare', cols: [{ h: 'Gall–Peters', pts: ['Equal-area. First described by James Gall in 1855; promoted by Arno Peters from 1973.', 'Shapes are stretched vertically near the equator.', 'Peters presented it as correcting a colonial bias in maps.'] }, { h: 'Winkel tripel and AuthaGraph', pts: ['Winkel tripel (1921): a compromise that keeps distortion modest everywhere.', 'AuthaGraph (Hajime Narukawa, 1999): divides the globe into pieces and unfolds it, keeping area nearly true. It won a Good Design Award in Japan in 2016.', 'Neither is perfect; each trades one error for another.'] }], q: 'Can a projection be fair?', note: 'The Peters map was controversial among cartographers, many of whom objected to its overstated claims and to the fact that Gall had done it a century earlier, but it did provoke useful discussion about what maps emphasise.' },
        { t: 'mirror', n: 2, kinds: ['evidence', 'opposite'] }
      ] },
      { id: 'objections', kind: 'objections', title: 'Does it matter?', blurb: 'Three objections to the claim that Mercator misleads us.', mins: 5, nodes: [
        { t: 'ladder', h: 'Three objections', claim: 'The dominance of the Mercator map gave people a distorted view of the world.', rungs: [
          { o: 'People know the map is distorted. Nobody really thinks Greenland is the size of Africa.', r: 'Studies and surveys suggest many people do misjudge relative sizes, though the evidence is mixed and often anecdotal. Even if we know, impressions linger.', c: 'It would take real tests of people’s size judgments to settle this.' },
          { o: 'Mercator never claimed to be a general picture of the world. It was a tool for navigation and still is.', r: 'True. The criticism is about its use in classrooms and on walls, which use it for something it was not designed for.', c: 'The blame, if any, lies with the use, not the map.' },
          { o: 'All alternatives have their own distortions. Swapping one for another does not make a fair map.', r: 'Agreed: the lesson is to match a projection to a purpose, and to show more than one.', c: 'Cartographers often recommend a globe for general impressions.' }
        ] },
        { t: 'mirror', n: 2, kinds: ['evidence', 'confidence'] }
      ] },
      { id: 'web', kind: 'modern', title: 'The map in your pocket', blurb: 'Web Mercator, and the 2018 change in Google Maps.', mins: 3, nodes: [
        { t: 'read', h: 'Why Mercator won the web', p: ['Most online maps use a variant called Web Mercator, which Google adopted around 2005. It keeps shapes right at city scale, so that streets meet at the correct angles when you zoom in. For local navigation that is exactly what you want.', 'In 2018, Google Maps on desktop switched to a 3D globe when zoomed far out, so that the world no longer appears as a flat Mercator at that scale.'] },
        { t: 'scale', q: 'How much do you think the map you see most often shapes your sense of how big places are?', left: 'Not at all', right: 'A great deal', note: 'The honest answer is probably: somewhat, and without noticing. Every map is an argument about what matters.' },
        { t: 'mirror', n: 2, kinds: ['connect', 'origin'] }
      ] }
    ]
  });

  /* ============ THINKERS: Ada Lovelace ============ */
  C.HOLES.push({
    id: 'first-programmer', anchor: 'layers-ada-lovelace', topic: 'thinkers', title: 'Ada and the Engine',
    hook: 'In 1843 a mathematician wrote the first published program for a machine that was never built, and asked whether it could ever think.',
    claim: 'Machines can only do what they are told, and never originate anything.',
    anti: 'A machine can produce results that surprise its makers and can go beyond what was explicitly programmed.',
    themes: ['knowledge', 'change'], related: ['proportion-myth', 'plato-cave'],
    paths: [
      { id: 'note-g', kind: 'origin', title: 'Note G', blurb: 'The 1843 translation, the notes and the algorithm for Bernoulli numbers.', mins: 5, nodes: [
        { t: 'read', h: 'A translation that outgrew itself', p: ['Charles Babbage designed the Analytical Engine in the 1830s, a general-purpose mechanical computer that was never completed. In 1842 the Italian engineer Luigi Menabrea published a description of it in French. Ada Lovelace, daughter of the poet Lord Byron, translated it into English in 1843 and added her own Notes, signed “A.A.L.,” which were about three times the length of the original.'] },
        { t: 'read', h: 'What Note G contains', p: ['Note G describes, in a table of operations, how the Engine would calculate Bernoulli numbers. It is widely regarded as the first published computer program. Historians debate how much of it was Lovelace’s own work and how much was Babbage’s, since he had written similar programs earlier, but the Notes themselves, especially her reflections on what the machine might do, are clearly hers.'] },
        { t: 'choice', q: 'What did Note G show how to calculate?', ans: 2, opts: [['The orbit of a comet', 'No.'], ['Prime numbers', 'No.'], ['Bernoulli numbers', 'Right. A sequence important in number theory and in the sums of powers.']], why: 'Bernoulli numbers, via a step-by-step table of the Engine’s operations.' },
        { t: 'mirror', n: 1, kinds: ['assume'] }
      ] },
      { id: 'cards', kind: 'play', title: 'Weave an algebraic pattern', blurb: 'The Jacquard loom inspired her. Try thinking in loops yourself.', mins: 4, nodes: [
        { t: 'read', h: 'The loom', p: ['Joseph-Marie Jacquard’s loom (1804) used punched cards to control which threads were lifted, so that a loom could weave complicated patterns. Babbage planned to use similar cards to feed instructions to the Analytical Engine. Lovelace wrote that the Engine “weaves algebraical patterns just as the Jacquard loom weaves flowers and leaves.”'] },
        { t: 'choice', q: 'The Engine must add the numbers 1 to 5. Which instruction plan uses a loop?', ans: 1, opts: [['Write out 1 + 2 + 3 + 4 + 5 as five separate steps', 'That works, but it grows with the size of the problem.'], ['Keep a total and a counter; add the counter to the total, increase the counter, repeat until it passes 5', 'Right. The same short set of cards can be reused. Lovelace described this kind of repetition clearly.'], ['Ask a person to do each addition', 'That is not a program.']], why: 'A loop reuses the same instructions, so a short program handles a long task. This idea was central to her analysis.' },
        { t: 'mirror', n: 2, kinds: ['assume', 'connect'] }
      ] },
      { id: 'objection', kind: 'compare', title: 'Lovelace’s objection and Turing’s answer', blurb: 'Can a machine originate anything?', mins: 5, nodes: [
        { t: 'read', h: 'Her caution', p: ['In Note G, Lovelace wrote that the Analytical Engine has no pretensions to originate anything. It can do whatever we know how to order it to perform. In 1950, in “Computing Machinery and Intelligence,” Alan Turing named this “Lady Lovelace’s Objection” and answered it.'] },
        { t: 'compare', cols: [{ h: 'Lovelace’s point', pts: ['A machine follows its instructions.', 'Any originality belongs to the programmer.', 'We should not overstate what such an engine can do.'] }, { h: 'Turing’s reply', pts: ['Machines surprise us all the time; he says they often take him by surprise.', 'Programs can learn and change their own rules.', 'Whether a surprise counts as “origination” is a question about words as much as machines.'] }], q: 'When a program does something its author did not expect, who originated it?', note: 'Modern machine learning makes this concrete: systems trained on data can show behaviour no one wrote down. Whether that counts as originating is still debated.' },
        { t: 'mirror', n: 2, kinds: ['evidence', 'opposite'] }
      ] },
      { id: 'credit', kind: 'objections', title: 'Who deserves the credit?', blurb: 'Three claims about Ada Lovelace, tested.', mins: 5, nodes: [
        { t: 'ladder', h: 'Three claims', claim: 'Ada Lovelace was the world’s first computer programmer.', rungs: [
          { o: 'Babbage wrote earlier programs for the Engine in the 1830s. She only translated and annotated.', r: 'Babbage did draft tables of operations. But Note G was published, it was longer and more developed than his earlier examples, and her notes contain ideas he did not publish.', c: 'Historians such as Bruce Collier and Doron Swade emphasise Babbage’s part; others, such as Betty Toole, defend Lovelace’s originality.' },
          { o: 'Her main insight was conceptual: the Engine could manipulate any symbols, not only numbers, and so might compose music if the rules of harmony could be expressed.', r: 'This is a strong point in her favour. She saw the machine as general-purpose, not just a calculator.', c: 'Critics say she only imagined it; she could not test the idea on a machine that did not exist.' },
          { o: 'The “first programmer” label is a modern myth made for a cause.', r: 'The label is a simplification, and “first” is always arguable. But the evidence for her significance rests on what she wrote, not on the label.', c: 'The programming language Ada (1980) was named after her by the US Department of Defense.' }
        ] },
        { t: 'mirror', n: 2, kinds: ['evidence', 'confidence'] }
      ] },
      { id: 'now', kind: 'modern', title: 'Programs that surprise', blurb: 'Where Lovelace’s line falls today.', mins: 3, nodes: [
        { t: 'sort', q: 'Does each case look more like “doing what it was told” or “surprising its makers”?', buckets: ['Doing what it was told', 'Surprising its makers'], items: [
          { t: 'A calculator adding 2 and 2', b: 0, why: 'Entirely predictable.' },
          { t: 'AlphaGo’s move 37 against Lee Sedol in 2016, which commentators called creative', b: 1, why: 'Experts did not expect the move, though it came from rules the program was trained to follow.' },
          { t: 'A spreadsheet totalling a column', b: 0, why: 'Exactly what the formula says.' },
          { t: 'A simulation that shows an unexpected pattern from simple rules (such as Conway’s Game of Life)', b: 1, why: 'The rules are simple; the behaviour is hard to predict without running it.' }
        ] },
        { t: 'mirror', n: 2, kinds: ['connect', 'origin'] }
      ] }
    ]
  });

  /* ============ WISDOM: the dichotomy of control ============ */
  C.HOLES.push({
    id: 'control-hole', anchor: 'apply-dichotomy-of-control', topic: 'wisdom', title: 'What Is Up to You?',
    hook: 'A formerly enslaved teacher in Rome began his handbook with one sentence that sorts everything you face.',
    claim: 'Peace of mind comes from caring only about what is within your control.',
    anti: 'Caring about things beyond your control is part of a full human life, and not a mistake.',
    themes: ['meaning', 'change'], related: ['good-life-machine', 'divine-goodness'],
    paths: [
      { id: 'epictetus', kind: 'origin', title: 'Epictetus and the Handbook', blurb: 'The opening of the Enchiridion, and who wrote it down.', mins: 4, nodes: [
        { t: 'read', h: 'A teacher with a limp', p: ['Epictetus (c. 50 – c. 135 CE) was born into slavery in Phrygia and taught philosophy in Rome and later Nicopolis in Greece. He wrote nothing himself. His student Arrian recorded the Discourses and compiled a short summary called the Enchiridion, or Handbook.'] },
        { t: 'read', h: 'The first lines', p: ['The Handbook begins by dividing the world in two. Some things are up to us: our opinions, impulses, desires and aversions. Others are not up to us: our body, property, reputation and office. The first are free by nature; the second are weak and dependent. Misery comes from mistaking one for the other.'] },
        { t: 'choice', q: 'Which of these does Epictetus say is up to us?', ans: 1, opts: [['Our reputation', 'He puts reputation among things not up to us.'], ['Our judgments about what happens', 'Right. How we judge events is within our power, even when the events are not.'], ['Our health', 'Not fully up to us, in his view.']], why: 'Our own judgments and choices are up to us; the outcome of events largely is not.' },
        { t: 'mirror', n: 2, kinds: ['assume', 'origin'] }
      ] },
      { id: 'sort', kind: 'play', title: 'Sort your own worries', blurb: 'Try the dichotomy on real situations, and find where it gets blurry.', mins: 4, nodes: [
        { t: 'sort', q: 'Up to me, or not up to me?', buckets: ['Up to me', 'Not up to me'], items: [
          { t: 'Whether I prepare thoroughly for an interview', b: 0, why: 'Your effort is yours.' },
          { t: 'Whether I get the job', b: 1, why: 'Others decide it, and chance plays a part.' },
          { t: 'How I respond when someone criticises me', b: 0, why: 'Your response is a choice, even if it takes practice.' },
          { t: 'What other people think of me', b: 1, why: 'You can influence it, but not control it.' },
          { t: 'The weather on the day of my wedding', b: 1, why: 'Plainly outside your power.' }
        ] },
        { t: 'read', h: 'Where it blurs', p: ['The modern Stoic William Irvine suggests a third category: things partly in our control, such as winning a tennis match. His advice is to set goals in terms of what you can do (play your best) rather than the result (win), which he calls an “internalization of goals.”'] },
        { t: 'mirror', n: 2, kinds: ['assume', 'connect'] }
      ] },
      { id: 'control', kind: 'compare', title: 'Stoic control and modern psychology', blurb: 'Locus of control, learned helplessness and CBT.', mins: 5, nodes: [
        { t: 'read', h: 'Three research traditions', p: ['Julian Rotter (1966) described locus of control, the degree to which people believe outcomes depend on their own actions. Martin Seligman’s work on learned helplessness in the 1960s and 70s showed that experiencing uncontrollable events can lead to passivity. Aaron Beck, founder of cognitive therapy, explicitly acknowledged the influence of Epictetus on the idea that our judgments of events shape our feelings.'] },
        { t: 'compare', cols: [{ h: 'The Stoic advice', pts: ['Sort things by whether they are up to you.', 'Put effort where you have influence; accept the rest calmly.', 'Change your judgments and your distress changes.'] }, { h: 'What psychology adds', pts: ['A sense of control generally supports well-being, and its loss can harm it.', 'People often misjudge what they can control, in both directions.', 'Acceptance and active problem-solving work best when matched to the situation.'] }], q: 'Which mistake would you rather watch for in yourself: trying to control too much, or giving up too soon?', note: 'This is close to the Serenity Prayer’s wish for wisdom to know the difference. The skill is not the rule but the sorting.' },
        { t: 'mirror', n: 2, kinds: ['evidence', 'connect'] }
      ] },
      { id: 'objections', kind: 'objections', title: 'The case against the dichotomy', blurb: 'Is it wisdom, or a way to avoid caring?', mins: 5, nodes: [
        { t: 'ladder', h: 'Three objections', claim: 'We should care only about what is up to us.', rungs: [
          { o: 'It can excuse passivity. If injustice is not up to me, why resist it? Stoicism seems to counsel acceptance of whatever happens.', r: 'Stoics such as Marcus Aurelius and Cato held public office and acted on duty. They say to act with full effort, and then accept the result calmly.', c: 'Critics note that this still discourages anger, which often drives reform.' },
          { o: 'Love means caring about things outside our control, such as the health of a child. A philosophy that tells us to be unmoved asks us to love less.', r: 'Epictetus advises seeing loved ones as mortal (“when you kiss your child, say you are kissing a mortal”). Stoics argue this prepares for loss rather than prevents love.', c: 'Martha Nussbaum argues that grief and fear are part of loving well and that a good life is vulnerable.' },
          { o: 'The line between what is and is not in our control is blurry and shaped by circumstances. A person with power can control more than a person without it.', r: 'This is the strongest modern objection: the advice may be easiest for those with the most freedom.', c: 'Defenders note that Epictetus spoke as someone who had been enslaved, and that he focuses on inner freedom.' }
        ] },
        { t: 'mirror', n: 2, kinds: ['evidence', 'opposite'] }
      ] },
      { id: 'practice', kind: 'modern', title: 'Practices you can try', blurb: 'Three Stoic exercises, and which one you would actually do.', mins: 4, nodes: [
        { t: 'choice', q: 'Which exercise would you actually try this week?', opts: [['The evening review (Seneca)', 'Seneca describes asking himself each night what he did well, what he did badly, and what he could do better. It is a short reflective habit with a long history.'], ['Negative visualisation (premeditatio malorum)', 'Briefly imagine things going wrong, so that you are prepared. Research on mental contrasting and premortems suggests planning for obstacles helps; dwelling on them does not.'], ['The view from above', 'Marcus Aurelius suggests picturing your worries from far overhead. It is a way of gaining perspective on how small a problem is.'], ['Voluntary discomfort', 'Seneca recommends occasionally practising with simple food and rough clothes to see that you can live with less. Its benefits are less studied than the other three.']] },
        { t: 'mirror', n: 2, kinds: ['origin', 'confidence'] }
      ] }
    ]
  });
})();
