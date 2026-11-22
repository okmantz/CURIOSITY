/* Thought Experiments + Interactive History */
(function () {
  const C = (window.CUR = window.CUR || {});
  C.library = C.library || [];
  C.library.push(
    {
      id: 'ship-of-theseus', type: 'thought', topic: 'philosophy', diff: 1, mins: 2,
      title: 'The Ship That Never Sinks',
      hook: 'Replace every plank of a ship, one at a time. When the last one is swapped, is it still the same ship?',
      links: ['science', 'ethics'], thinkers: ['Plutarch', 'Thomas Hobbes'],
      scenario: 'Athens kept the ship of the hero Theseus for centuries. As planks rotted, they were replaced with fresh timber, until (ancient writers report) not one original plank remained. Now imagine a collector has quietly saved every discarded plank and rebuilds the original ship from them. Two ships sit in the harbour. Which one is the ship of Theseus?',
      choices: [
        { id: 'a', label: 'The repaired ship that sailed the whole time', result: 'You treat identity as continuity: a thing stays itself through gradual change, as a river or a person does. Your own body renews much of its material over the years, and you still count as you.', lens: 'Aristotle would say what makes it a ship is its form and function, not any particular wood.' },
        { id: 'b', label: 'The ship rebuilt from the original planks', result: 'You treat identity as original matter. Notice the cost: by that rule, you may not be quite the person you were at ten, since much of your body’s material has turned over.', lens: 'Hobbes raised this twist in the 17th century and noticed it threatens the first answer.' },
        { id: 'c', label: 'Neither, or both, in different senses', result: 'You see that “same” can mean same history, same material, or same function. Many philosophers think the puzzle dissolves once you say which sense you mean. Others think that is a dodge.', lens: 'Contemporary philosophers often defend this kind of “it depends what you mean” answer.' },
        { id: 'd', label: 'There is no fact of the matter. We decide by convention', result: 'On this view identity questions are settled by purpose: a court deciding who owns the ship, a museum deciding which to display. Critics reply that this makes identity too easy to bend.', lens: 'Conventionalists treat the puzzle like a rule of a game, not a discovery.' }
      ],
      lenses: [
        { who: 'Plutarch', view: 'Recorded the puzzle in his Life of Theseus (c. 100 CE), noting that philosophers argued both sides.' },
        { who: 'John Locke', view: 'Argued that identity depends on the kind of thing: an organism persists through changing matter; a person persists through continuous consciousness.' },
        { who: 'Derek Parfit', view: 'Argued that for persons, what matters is psychological continuity, not strict identity.' }
      ],
      takeaway: '“Same” has several meanings. Identity can follow matter, form, or continuous history.',
      prompt: 'What makes you the same person you were ten years ago?'
    },
    {
      id: 'experience-machine', type: 'thought', topic: 'ethics', diff: 1, mins: 2,
      title: 'The Experience Machine',
      hook: 'A machine offers you a perfect life, indistinguishable from reality. Would you plug in for good?',
      links: ['psychology', 'philosophy'], thinkers: ['Robert Nozick'],
      scenario: 'Neuroscientists offer to plug you into a machine that gives you any experiences you choose: great achievements, deep friendships, discovery, love. You would float in a tank, unaware you were in it. Others are free to plug in as well. Do you plug in for life?',
      choices: [
        { id: 'in', label: 'Plug in. The experience is what matters', result: 'If feeling good is the only thing that matters, you have chosen well, and hedonists like Bentham would agree. Yet most people asked this question decline, which is the puzzle.', lens: 'Hedonism: pleasant experience is the only thing good in itself.' },
        { id: 'out', label: 'Stay in reality', result: 'You are with most people surveyed, and with Robert Nozick, who devised the case in 1974 to argue that we care about more than experiences: we want to do things, to be certain kinds of people, and to be in contact with reality.', lens: 'Nozick: three things we want beyond experience: doing, being, and contact with a deeper reality.' },
        { id: 'holiday', label: 'A short visit is fine. Not for life', result: 'A bounded visit feels like a film. What your intuition protects is your real life carrying on outside it.', lens: 'Notice how the answer changes when the machine replaces your life vs. interrupts it.' },
        { id: 'together', label: 'Only if everyone I love comes too', result: 'This reveals you care about relationships. But are they still real relationships if everyone’s experiences are manufactured? The machine may simulate the very thing you want.', lens: 'Aristotle: a good life is activity lived with real others, not just a feeling.' }
      ],
      lenses: [
        { who: 'Robert Nozick', view: 'Introduced the machine in Anarchy, State, and Utopia (1974) as an objection to pure hedonism.' },
        { who: 'Felipe De Brigard (2010)', view: 'Found that people were far more willing to stay in the machine when told they were already in one, suggesting some reluctance is plain status-quo bias.' },
        { who: 'Aristotle', view: 'For him, flourishing (eudaimonia) is a life of virtuous activity, not a stream of feelings.' }
      ],
      takeaway: 'Most of us want a life that is real, not merely one that feels good. Yet part of that reluctance may be bias.',
      prompt: 'If you resisted the machine, what exactly would you be afraid of losing?'
    },
    {
      id: 'veil-of-ignorance', type: 'thought', topic: 'society', diff: 2, mins: 2,
      title: 'Design a Society Blindfolded',
      hook: 'You write the rules for a whole society. Then you are assigned a place in it at random.',
      links: ['ethics', 'philosophy', 'history'], thinkers: ['John Rawls'],
      scenario: 'You must design the laws, economy and opportunities of a society. There is a catch: afterwards you will be assigned your position at random. You might be rich or poor, healthy or disabled, gifted or ordinary. Which design do you choose?',
      choices: [
        { id: 'a', label: 'Maximise the total wealth, however unequally shared', result: 'You are betting on the average. If you land at the bottom, the bet could be brutal. Utilitarian thinkers such as John Harsanyi argued a rational chooser would maximise expected well-being.', lens: 'Harsanyi: choose the society with the best average prospects.' },
        { id: 'b', label: 'Equal outcomes for everyone', result: 'You remove the risk of ending up at the bottom, but if some inequality would raise everyone’s position, strict equality gives that up.', lens: 'Egalitarian: fairness means equal shares unless there is a strong reason not to.' },
        { id: 'c', label: 'A strong guaranteed floor. Inequality only if it helps the worst-off', result: 'This is Rawls’s “difference principle.” He argued people behind the veil would choose it because they cannot know the odds and the downside is severe.', lens: 'Rawls: judge a society by how it treats its least advantaged members.' },
        { id: 'd', label: 'Maximise freedom and property rights; accept whatever results', result: 'Robert Nozick argued justice depends on how holdings arise (fair acquisition and voluntary transfer), not on any desired pattern of distribution.', lens: 'Nozick: redistribution to achieve a pattern violates individual rights.' }
      ],
      lenses: [
        { who: 'John Rawls', view: 'A Theory of Justice (1971): fair principles are those we would choose if we did not know our place in society.' },
        { who: 'Robert Nozick', view: 'Anarchy, State, and Utopia (1974) answered from the libertarian side: the veil ignores how people come to deserve or own things.' },
        { who: 'Michael Sandel', view: 'Argued that the idea of choosing with no identity or attachments is unrealistic: who we are shapes what justice requires.' }
      ],
      takeaway: 'Fair rules are easier to see when you do not know which side of them you will stand on.',
      prompt: 'Which of your own opinions about fairness would survive if you did not know your own position?'
    },
    {
      id: 'marys-room', type: 'thought', topic: 'philosophy', diff: 3, mins: 2,
      title: 'Mary Has Never Seen Red',
      hook: 'A scientist who knows every physical fact about colour has never seen any. What happens when she steps outside?',
      links: ['science', 'psychology'], thinkers: ['Frank Jackson', 'Daniel Dennett'],
      scenario: 'Mary is a brilliant scientist who has spent her life in a black-and-white room, learning everything physical there is to know about colour vision: every wavelength, every neural pathway. One day she steps outside and sees a ripe red tomato. Does she learn something new?',
      choices: [
        { id: 'a', label: 'Yes. She learns what red looks like', result: 'Frank Jackson (1982) used this to argue that physical facts leave something out: the felt quality of experience, or “qualia.” If so, a purely physical description of the mind is incomplete.', lens: 'The knowledge argument against physicalism.' },
        { id: 'b', label: 'No new fact, only a new ability', result: 'David Lewis and Laurence Nemirow suggested she gains know-how (to imagine and recognise red) not new information. Knowing how to ride a bike is not another fact about bikes.', lens: 'The ability hypothesis.' },
        { id: 'c', label: 'Yes, but it is an old fact in a new form', result: 'Another reply: she learns a familiar physical fact under a new mode of presentation, as when you learn that the Morning Star is the Evening Star.', lens: 'The phenomenal-concept strategy.' },
        { id: 'd', label: 'We cannot trust the thought experiment', result: 'Daniel Dennett argued that we cannot really imagine knowing everything physical, so the intuition that she must learn something is unreliable.', lens: 'Dennett: the story smuggles in an impossible premise.' }
      ],
      lenses: [
        { who: 'Frank Jackson', view: 'Proposed the argument in 1982, and later changed his mind and rejected it.' },
        { who: 'Thomas Nagel', view: 'In “What Is It Like to Be a Bat?” (1974) argued that subjective experience resists objective description.' },
        { who: 'Daniel Dennett', view: 'Argued that consciousness can be explained without mysterious extra facts, and that intuitions like Mary’s mislead us.' }
      ],
      takeaway: 'Knowing everything about a thing may leave out what it is like to experience it. Or may not. Philosophers still disagree.',
      prompt: 'Is there anything you know that you could never fully explain to someone who had not experienced it?'
    }
  );

  /* ---------- Interactive History ---------- */
  C.library.push(
    {
      id: 'crossing-the-rubicon', type: 'history', topic: 'history', diff: 2, mins: 3,
      title: 'The River Caesar Crossed',
      hook: 'January, 49 BCE. One decision at a small river will end a 450-year-old republic.',
      links: ['society', 'thinkers'], thinkers: ['Julius Caesar'],
      date: 'January 49 BCE', role: 'You are Julius Caesar, on the border of your province',
      facts: [
        'Your term as governor of Gaul is ending. While you command an army, the law shields you from prosecution.',
        'Your enemies in the Senate, backed by Pompey, demand you give up your command and return as a private citizen, where you could be put on trial.',
        'The Rubicon marks the edge of your province. Crossing it with an army is treason.'
      ],
      options: [
        { id: 'disband', label: 'Disband the army and return to Rome', think: 'You would be trusting the Republic’s courts. Caesar and his allies feared that his rivals would use prosecution and emergency powers to ruin him politically.' },
        { id: 'cross', label: 'Cross with one legion and march on Italy', think: 'Fast, risky and illegal. Speed was his advantage: his enemies had not fully mobilised.' },
        { id: 'wait', label: 'Keep negotiating and wait', think: 'Already tried. Caesar had proposed that both he and Pompey lay down arms. Hardliners in the Senate rejected compromise.' }
      ],
      actual: 'cross',
      outcome: 'Caesar crossed in January 49 BCE with a single legion. The ancient historian Suetonius reports he declared “the die is cast.” Pompey and much of the Senate fled Rome within weeks. Four years of civil war followed. Caesar became dictator, was assassinated in 44 BCE, and the Republic never recovered; his heir Augustus built an empire on its ruins.',
      why: 'The Republic relied on generals obeying civilian authority. Once one successfully broke that norm, others learned it could be done. Historians often cite this as how institutions fail: not by one blow, but when restraint stops being credible.',
      takeaway: 'Republics rarely die in a single dramatic moment. They die when the rules that restrain power stop being believed.',
      prompt: 'Which modern rules depend on people choosing restraint when they could get away without it?',
      sources: 'Suetonius, Plutarch, Caesar’s own Civil War'
    },
    {
      id: 'cuban-missile-crisis', type: 'history', topic: 'society', diff: 2, mins: 3,
      title: 'Thirteen Days in October',
      hook: 'Photographs show Soviet missiles ninety miles from Florida. You have hours to decide.',
      links: ['history', 'ethics'], thinkers: ['John F. Kennedy'],
      date: '16 October 1962', role: 'You are the US President',
      facts: [
        'U-2 spy-plane photographs show Soviet nuclear missile sites under construction in Cuba.',
        'Your military advisers are divided: some urge air strikes or an invasion; others warn of escalation.',
        'Neither side wants war. Neither can be seen to back down.'
      ],
      options: [
        { id: 'strike', label: 'Air strikes on the missile sites', think: 'Advisers warned that strikes could not guarantee destroying every missile. We now know the Soviet force in Cuba also held tactical nuclear weapons, so an attack could have met a far deadlier response than planners assumed.' },
        { id: 'invade', label: 'Full invasion of Cuba', think: 'This would have meant killing Soviet personnel directly. The same hidden tactical nuclear weapons made it far riskier than it looked.' },
        { id: 'quarantine', label: 'A naval “quarantine” plus negotiation', think: 'A middle path: show resolve, keep further options open, and leave Moscow room to step back.' },
        { id: 'quiet', label: 'Private diplomacy only', think: 'It avoids a public confrontation but risks looking weak while the missiles become operational.' }
      ],
      actual: 'quarantine',
      outcome: 'Kennedy announced a naval quarantine on 22 October. Soviet ships halted short of the line. After thirteen tense days, Khrushchev agreed to remove the missiles in exchange for a public US pledge not to invade Cuba, and a secret understanding that US missiles in Turkey would later be withdrawn.',
      why: 'Declassified records show the closest moment was not planned. On 27 October, Soviet submarine B-59, under pressure from US depth charges, nearly fired a nuclear torpedo. Launching required agreement among senior officers, and Vasily Arkhipov is credited with opposing it (accounts differ on details).',
      takeaway: 'Catastrophe was avoided by leaders leaving each other an exit, and by individuals who said no at the critical moment.',
      prompt: 'When have you seen a disagreement end well because someone left the other side a way out?',
      sources: 'Declassified ExComm recordings; Cold War historiography'
    },
    {
      id: 'ragusa-quarantine', type: 'history', topic: 'history', diff: 1, mins: 2,
      title: 'Forty Days: The Birth of Quarantine',
      hook: 'Nobody knew what caused the plague. One city invented a defence anyway.',
      links: ['science', 'society'], thinkers: [],
      date: '1377', role: 'You are on the council of Ragusa (modern Dubrovnik)',
      facts: [
        'The plague has returned to ports around the Mediterranean. Your city’s wealth depends on trade.',
        'Germ theory is five centuries away. But you have noticed the disease travels with people and ships.',
        'Ships from affected ports are approaching.'
      ],
      options: [
        { id: 'open', label: 'Let ships dock as usual', think: 'Trade continues, but you gamble the whole city on luck.' },
        { id: 'ban', label: 'Ban every ship from affected ports', think: 'Safe on paper, ruinous in practice: your economy relies on those routes.' },
        { id: 'hold', label: 'Hold arrivals in isolation for a fixed time before entry', think: 'A compromise: preserve trade, buy time to see whether illness appears.' }
      ],
      actual: 'hold',
      outcome: 'In 1377 Ragusa’s Great Council ordered arrivals from plague-affected areas to wait for thirty days before entering the city (a “trentino”). Other Italian cities later extended the wait to forty days, the quaranta giorni that gives us the word “quarantine.”',
      why: 'Public-health practice began as action under uncertainty. The numbers were probably practical or symbolic, not scientifically derived, yet the principle (separate the possibly infected and wait) proved sound.',
      takeaway: 'You can act wisely before you understand a cause, if you are willing to watch the evidence and adjust.',
      prompt: 'What decisions in your life must be made before you know the full story?',
      sources: 'Dubrovnik archives; histories of Mediterranean public health'
    },
    {
      id: 'trial-of-socrates', type: 'history', topic: 'thinkers', diff: 2, mins: 3,
      title: 'You Are on the Jury of Socrates',
      hook: 'Athens, 399 BCE. A seventy-year-old man who asks awkward questions is on trial for his life.',
      links: ['philosophy', 'society', 'ethics'], thinkers: ['Socrates', 'Plato'],
      date: '399 BCE', role: 'You are one of 500 Athenian jurors',
      facts: [
        'Socrates is charged with impiety (not honouring the city’s gods) and corrupting the young.',
        'Athens recently lost the Peloponnesian War and survived a brutal oligarchic coup. Some of Socrates’ former associates were involved.',
        'Socrates says his questioning is a service to the city, and refuses to plead for mercy.'
      ],
      options: [
        { id: 'acquit', label: 'Not guilty', think: 'You treat the charges as a pretext or a misunderstanding. Many modern readers sympathise.' },
        { id: 'guilty-death', label: 'Guilty, and the penalty should be death', think: 'You accept the prosecution’s case that his teaching harms the city.' },
        { id: 'guilty-lesser', label: 'Guilty, but a lesser penalty (fine or exile)', think: 'You find some fault but not a capital crime. Athenian law let the defendant propose an alternative penalty.' }
      ],
      actual: 'guilty-death',
      outcome: 'Socrates was convicted by a narrow margin: in Plato’s account, a shift of about thirty votes would have acquitted him. For the penalty, the prosecution proposed death. Socrates first suggested free meals for life as a public benefactor, and then a modest fine. The jury voted for death by a larger margin. He refused offers to escape and drank hemlock.',
      why: 'Historians still debate whether the case was religious, political, or both. Our main sources, Plato and Xenophon, were his devoted students, so we hear mostly one side. The trial remains the classic question: how should a free society treat those who disturb its certainties?',
      takeaway: 'The verdict reveals as much about a society as about its accused.',
      prompt: 'What opinions are uncomfortable in your own community, and how are they treated?',
      sources: 'Plato, Apology and Crito; Xenophon, Apology'
    }
  );
})();
