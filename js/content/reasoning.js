/* Philosophical Challenges, Socratic Conversations, Perspective Shifts, Debates */
(function () {
  const C = (window.CUR = window.CUR || {});
  C.library = C.library || [];
  const AGREE3 = [{ id: 'yes', label: 'Agree' }, { id: 'unsure', label: 'Not sure' }, { id: 'no', label: 'Disagree' }];

  /* ---------- Philosophical Challenges ---------- */
  C.library.push(
    {
      id: 'liars-paradox', type: 'challenge', topic: 'philosophy', diff: 2, mins: 2,
      title: '“This Sentence Is False”',
      hook: 'A single sentence that breaks logic. Philosophers have argued about it for 2,400 years.',
      links: ['science', 'literature'], thinkers: ['Eubulides', 'Alfred Tarski', 'Saul Kripke', 'Graham Priest'],
      claim: 'Consider the sentence: “This sentence is false.” It must be either true or false.',
      stances: [{ id: 'true', label: 'It is true' }, { id: 'false', label: 'It is false' }, { id: 'both', label: 'Both' }, { id: 'neither', label: 'Neither' }],
      perspectives: [
        { who: 'The puzzle', view: 'If it is true, then what it says holds, so it is false. If it is false, then what it says fails, so it is true. Either answer contradicts itself. The paradox is traditionally linked to the Greek logician Eubulides.' },
        { who: 'Alfred Tarski (1930s)', view: 'Truth for a language cannot be defined inside that language. “True” must belong to a higher-level language, so the sentence is not properly formed.' },
        { who: 'Saul Kripke (1975)', view: 'Some sentences are “ungrounded”: their truth depends on nothing but themselves. The Liar is neither true nor false, a truth-value gap.' },
        { who: 'Graham Priest', view: 'Dialetheism: the Liar is both true and false. Some contradictions are real, and logic should be redesigned so they do not explode.' }
      ],
      verdict: 'There is no consensus. Every solution gives up something precious: a universal notion of truth, the rule that every sentence is true or false, or classical logic itself. The lesson: a perfectly ordinary-looking rule of language can be inconsistent.',
      takeaway: 'A paradox is a sign that one of our “obvious” assumptions about truth is wrong. We still argue about which.',
      prompt: 'Which would you give up: the idea that every sentence is true or false, or the idea that a sentence can talk about its own truth?'
    },
    {
      id: 'zeno-motion', type: 'challenge', topic: 'science', diff: 2, mins: 2,
      title: 'You Can Never Cross the Room',
      hook: 'To reach the door you must first go halfway. And then half of what remains. Forever.',
      links: ['philosophy', 'history'], thinkers: ['Zeno of Elea', 'Aristotle'],
      claim: 'Zeno argued that because any distance can be halved endlessly, completing a journey requires infinitely many steps, so motion is impossible.',
      stances: [{ id: 'zeno', label: 'Zeno has a point' }, { id: 'unsure', label: 'Not sure' }, { id: 'wrong', label: 'Obviously wrong' }],
      perspectives: [
        { who: 'Mathematics', view: 'The infinite series 1/2 + 1/4 + 1/8 + … adds up to exactly 1. Infinitely many steps can sum to a finite distance, and take a finite time if each step takes proportionally less.' },
        { who: 'The lingering worry', view: 'Some philosophers say the sum shows the maths is consistent but not how an infinite sequence of acts can be completed. Thomson’s lamp (1954), switched on and off at ever shorter intervals, probes that doubt.' },
        { who: 'Aristotle', view: 'Distinguished potential from actual infinity: a distance can be divided endlessly, but it is not actually divided into infinitely many parts until you divide it.' },
        { who: 'Physics', view: 'Whether space and time are infinitely divisible is an open question. Some quantum-gravity proposals suggest a smallest scale, but none is established.' }
      ],
      verdict: 'Zeno was probably not trying to prove that motion is an illusion for its own sake. According to Plato, he defended his teacher Parmenides, who held that reality is a single unchanging whole, by showing that the opposite view (a plurality in motion) also leads to puzzles.',
      takeaway: 'Solving a paradox with a formula can still leave a deeper question: what is it for infinity to be “completed”?',
      prompt: 'Is a mathematical answer to a puzzle always the same as understanding it?'
    },
    {
      id: 'paradox-of-tolerance', type: 'challenge', topic: 'society', diff: 2, mins: 3,
      title: 'Must a Tolerant Society Tolerate Everything?',
      hook: 'If you tolerate those who would destroy tolerance, you may lose it. If you refuse, are you still tolerant?',
      links: ['ethics', 'philosophy', 'history'], thinkers: ['Karl Popper', 'John Rawls', 'John Stuart Mill'],
      claim: 'A truly tolerant society must tolerate absolutely everything, including intolerance.',
      stances: AGREE3,
      perspectives: [
        { who: 'Karl Popper (1945)', view: 'Unlimited tolerance leads to the disappearance of tolerance. But note his actual position: societies should not suppress intolerant views as long as they can be countered by argument. Suppression is justified only when their holders reject argument and turn to force.' },
        { who: 'John Rawls (1971)', view: 'A just society should tolerate the intolerant unless there is a real danger to its own free institutions. Limits are an act of self-preservation, not a general licence.' },
        { who: 'Mill and Brandeis', view: 'John Stuart Mill argued that suppressing opinions harms truth, because even false ideas sharpen the true. Justice Brandeis (1927) proposed that the remedy for bad speech is more speech, not enforced silence.' },
        { who: 'The sceptic’s worry', view: 'Who decides which views are too dangerous? Critics warn that any power to ban “intolerance” can be turned against whoever holds the minority view.' }
      ],
      verdict: 'Even defenders of limits tend to draw the line at action or incitement, not opinion alone. In US law that line is incitement to imminent lawless action (Brandenburg v. Ohio, 1969). Other democracies draw it elsewhere. The real disagreement is about where to draw the line, and who draws it.',
      takeaway: 'Tolerance is a principle that must decide what to do about its own enemies. Any answer has costs.',
      prompt: 'Where would you draw the line between an opinion you must tolerate and an action you need not?'
    },
    {
      id: 'golden-ratio-myth', type: 'challenge', topic: 'arts', diff: 1, mins: 2,
      title: 'Is Beauty Hiding in 1.618?',
      hook: 'The “golden ratio” supposedly explains the Parthenon, the Mona Lisa and the Great Pyramid. Does it?',
      links: ['science', 'history'], thinkers: ['Luca Pacioli', 'George Markowsky'],
      claim: 'The golden ratio (about 1.618) is the hidden secret of beauty in art and architecture.',
      stances: AGREE3,
      perspectives: [
        { who: 'The real history', view: 'Euclid described dividing a line in “extreme and mean ratio.” Luca Pacioli’s book De divina proportione (1509), illustrated by Leonardo da Vinci, praised it. The name “golden section” became common in the 19th century.' },
        { who: 'The measurements', view: 'Mathematician George Markowsky (1992) showed that many claims about the Parthenon or the pyramids depend on choosing where to measure. Pick a different edge and the ratio vanishes. Historians find no ancient evidence that builders aimed for it.' },
        { who: 'The psychology', view: 'Gustav Fechner (1876) reported a preference for rectangles near the golden ratio, but later studies were mixed. People’s preferences vary widely.' },
        { who: 'Where it is real', view: 'Some artists used it deliberately, including Salvador Dalí and Le Corbusier. And in nature, the “golden angle” (about 137.5°) really does appear in how many plants arrange leaves and seeds.' }
      ],
      verdict: 'Artists can use it on purpose, and nature sometimes does. But the claim that it is the universal secret of beauty is not supported by evidence, and many famous “examples” were found by selective measuring.',
      takeaway: 'A pattern you can find anywhere, if you are free to choose where to look, explains nothing.',
      prompt: 'What other “secrets of beauty” or success might fall apart if you check the measurements?'
    }
  );

  /* ---------- Socratic Conversations ---------- */
  C.library.push(
    {
      id: 'euthyphro-dilemma', type: 'socratic', topic: 'religion', diff: 2, mins: 3,
      title: 'Is Something Good Because God Says So?',
      hook: 'A 2,400-year-old question that every religion, and every atheist, has to answer.',
      links: ['philosophy', 'ethics'], thinkers: ['Socrates', 'Plato'],
      intro: 'Euthyphro is on his way to prosecute his own father for murder, confident he knows what piety is. Socrates asks him to say what it is. Let us follow the argument.',
      steps: [
        { q: 'Euthyphro answers: “The holy is what the gods love.” Socrates asks: do the gods love holy things because they are holy, or are holy things holy because the gods love them?', choices: [
          { label: 'The gods love them because they are holy', reply: 'Then holiness exists independently of the gods’ love, a standard even they respond to. But then what is that standard, and do the gods answer to it?' },
          { label: 'They are holy because the gods love them', reply: 'Then if the gods had loved cruelty, cruelty would have been holy. Is goodness only a matter of divine whim?' }
        ] },
        { q: 'Take the first horn: goodness comes first, and the gods recognise it. What follows?', choices: [
          { label: 'Morality stands on its own. God recognises it', reply: 'Many theologians accept this in some form. Leibniz, for instance, held that God chooses because the good is good, not the other way around.' },
          { label: 'Then God is not the ultimate source of morality, and that troubles me', reply: 'A third option has been offered: God’s own nature is the standard. God neither commands at random nor obeys something external; goodness is what God is. This is associated with Aquinas and with modern “divine nature” theories.' }
        ] },
        { q: 'Is “goodness is God’s nature” a satisfying way out?', choices: [
          { label: 'Yes, it avoids both horns', reply: 'Critics reply: if “good” just means “like God,” then “God is good” says little. And what makes God’s nature good rather than something else?' },
          { label: 'No, it only moves the problem back', reply: 'Defenders reply that every explanation has to stop somewhere. The question is whether stopping at God’s nature is any worse than stopping at an independent moral order.' }
        ] }
      ],
      conclusion: 'Plato’s Euthyphro (c. 399 BCE) does not refute religion, nor does it prove it. It forces believers and non-believers alike to say where goodness comes from, and the debate is still open.',
      takeaway: 'Wherever you place the source of goodness, you must explain why it is the right place to stop asking “why?”',
      prompt: 'Whatever you believe, what grounds your sense of right and wrong?'
    },
    {
      id: 'what-is-knowledge', type: 'socratic', topic: 'philosophy', diff: 2, mins: 3,
      title: 'What Does It Mean to Know Something?',
      hook: 'You think you know what “knowing” is. Test it against three cases.',
      links: ['science', 'psychology'], thinkers: ['Plato', 'Edmund Gettier', 'Bertrand Russell'],
      intro: 'Epistemology asks what knowledge is and how we get it. Let us try to define it step by step, as Plato does in the Theaetetus.',
      steps: [
        { q: 'You flip a coin, feel sure it will land heads, and it does. Did you know it would?', choices: [
          { label: 'Yes. I believed it and it was true', reply: 'Then every lucky guess counts as knowledge, which seems wrong. Belief plus truth is not enough.' },
          { label: 'No. It was luck', reply: 'Right. Something more is needed: a reason, or some real connection between your belief and the truth.' }
        ] },
        { q: 'Add justification: knowledge is true belief that you have good reason for. You glance at a clock that reads 2:00 and believe it is 2:00. It is 2:00, but the clock stopped exactly twelve hours ago. Do you know the time?', choices: [
          { label: 'Yes. It is true and I had good reason', reply: 'Many philosophers disagree: you are right by accident. Bertrand Russell gave a version of this stopped-clock case in 1912, and Edmund Gettier’s 1963 paper made such cases famous.' },
          { label: 'No. My belief was right by accident', reply: 'This is the Gettier problem: justified true belief can still be luck. Almost every attempt to repair the definition has met new counterexamples.' }
        ] },
        { q: 'So what is missing from the definition?', choices: [
          { label: 'A condition that rules out luck', reply: 'Some require that the belief be “safe”: you could not easily have been wrong (Sosa, Williamson). Critics find counterexamples here too.' },
          { label: 'Knowledge cannot be broken into parts at all', reply: 'Timothy Williamson’s “knowledge first” view: knowledge is a basic mental state, not belief plus extras.' },
          { label: 'Perhaps we know far less than we think', reply: 'Sceptics from the ancient Pyrrhonists to Descartes’s method of doubt press exactly this point. The challenge has never gone away.' }
        ] }
      ],
      conclusion: 'After 2,400 years, there is no agreed definition of knowledge. Yet you were able to tell good cases from bad ones. We can use a concept skilfully without being able to define it.',
      takeaway: 'Being right is not the same as knowing. Real knowledge is connected to the truth in a way luck is not.',
      prompt: 'Think of something you are sure of. How would you tell the difference between knowing it and being lucky?'
    },
    {
      id: 'what-is-courage', type: 'socratic', topic: 'ethics', diff: 2, mins: 3,
      title: 'What Is Courage?',
      hook: 'Two generals are asked to define courage. Neither can, and that is the point.',
      links: ['philosophy', 'wisdom', 'history'], thinkers: ['Socrates', 'Plato'],
      intro: 'In Plato’s Laches, two Athenian generals are asked by Socrates to say what courage is. Try answering as they do.',
      steps: [
        { q: 'Laches says: “Courage is staying at your post and fighting the enemy.” Socrates objects: some fighters, like Scythian horsemen or Spartans at Plataea, win by retreating deliberately. Were they cowards?', choices: [
          { label: 'No. Courage can include a strategic retreat', reply: 'Then courage is not one particular action. It must be something behind the action.' },
          { label: 'Retreat is always a failure of nerve', reply: 'But then those who retreated and then turned to win were cowards. Is that plausible?' }
        ] },
        { q: 'Laches revises: courage is endurance of the soul. But is it courage to endure foolishly: holding on in a hopeless fight, say, because you misjudged the danger?', choices: [
          { label: 'Yes. Endurance is endurance', reply: 'Then a reckless fool is the most courageous of all. That is hard to accept.' },
          { label: 'No. It must be wise endurance', reply: 'Good. Courage seems to need understanding. But what must the courageous person understand?' }
        ] },
        { q: 'Nicias suggests: courage is knowing what is truly to be feared and what is not. But knowing what is truly bad and good looks like knowledge of all of virtue. Is courage then the same as wisdom?', choices: [
          { label: 'Perhaps. The virtues may be unified', reply: 'This is a Socratic view: virtues are forms of knowledge. Aristotle disagreed.' },
          { label: 'No. Courage is its own thing', reply: 'Aristotle took this line: courage is a mean between cowardice and recklessness, shaped by habit, not just knowledge.' }
        ] }
      ],
      conclusion: 'The Laches ends without a definition, a dialogue deliberately left open. Plato shows that we can use a word like “courage” all our lives and not know what we mean by it.',
      takeaway: 'Courage is not fearlessness. It is the right relationship to fear, and that depends on understanding what matters.',
      prompt: 'Name the most courageous thing you have seen anyone do. What did they understand that others did not?'
    }
  );

  /* ---------- Perspective Shifts ---------- */
  C.library.push(
    {
      id: 'lost-wallet', type: 'perspectives', topic: 'ethics', diff: 1, mins: 3,
      title: 'You Find a Wallet',
      hook: 'Five hundred dollars. An ID card. Nobody saw you. Five traditions, five different reasons to act.',
      links: ['philosophy', 'society', 'thinkers'], thinkers: ['Immanuel Kant', 'John Stuart Mill', 'Aristotle', 'Confucius'],
      situation: 'You find a wallet on the street with $500 in cash and an ID card. No one is around. You are a bit short on money this month.',
      lenses: [
        { who: 'Immanuel Kant', tag: 'Duty', text: 'Ask whether you could will the rule “keep what you find when unobserved” to be universal. If everyone did, property itself would mean little. Keeping it treats the owner as a means. Return it, because it is your duty, whatever the outcome.' },
        { who: 'John Stuart Mill', tag: 'Consequences', text: 'Weigh the happiness at stake. The owner may lose far more than you would gain, and a society where found things are returned is a better one for everyone. The consequences of returning are probably best overall.' },
        { who: 'Aristotle', tag: 'Character', text: 'The question is not only “what should I do?” but “what kind of person am I becoming?” Each act strengthens a habit. A just and honest person does not need to calculate. They simply return it.' },
        { who: 'Confucian ethics', tag: 'Relationships', text: 'The Analects contrast the gentleman, who understands what is right, with the petty person, who understands what is profitable. Ethics lives in relationships: the owner is someone’s parent, neighbour, worker. Honour that web of obligations.' },
        { who: 'Ubuntu (Southern African philosophy)', tag: 'Community', text: '“A person is a person through other persons.” Your humanity is bound up with others. Harming the owner diminishes the community, and you, with it.' }
      ],
      closing: 'Notice how often the traditions agree on the action but not the reason. Where would they disagree? What if the money would save a life, or the owner were a criminal?',
      takeaway: 'Different ethical frameworks can reach the same decision for different reasons, and they split exactly in hard cases.',
      prompt: 'Which reason moved you most? Does that tell you something about how you actually decide?'
    },
    {
      id: 'someone-insults-you', type: 'perspectives', topic: 'wisdom', diff: 1, mins: 3,
      title: 'Someone Insults You',
      hook: 'The same remark, five ancient answers on how to respond.',
      links: ['psychology', 'religion', 'ethics'], thinkers: ['Epictetus', 'Aristotle', 'The Buddha'],
      situation: 'A colleague mocks your work in front of others. Your face is hot. What now?',
      lenses: [
        { who: 'Epictetus (Stoicism)', tag: 'Judgement', text: 'The insult itself cannot harm you; your judgement that it is harmful does. You cannot control what others say, only your own response. Ask: is there truth in it? If so, learn. If not, it is just noise.' },
        { who: 'Aristotle', tag: 'The mean', text: 'Anger is not bad in itself. The skill is to be angry at the right person, to the right degree, for the right reason and in the right way, and that is hard. The goal is calibrated emotion, not no emotion.' },
        { who: 'Buddhism (Dhammapada)', tag: 'Compassion', text: 'Hatred is never ended by hatred, only by love. Look at the speaker with understanding: what suffering drives someone to belittle another? Respond without feeding the cycle.' },
        { who: 'Honour cultures (anthropology)', tag: 'Reputation', text: 'In some societies, a public insult is a real threat to standing, and a firm response may be socially expected. Psychologists Nisbett and Cohen studied how “cultures of honour” shape such reactions.' },
        { who: 'Christianity (Sermon on the Mount)', tag: 'Forbearance', text: '“Turn the other cheek.” Interpretations differ: some read it as radical non-retaliation, others as a form of nonviolent resistance that refuses to be humiliated or to return violence.' }
      ],
      closing: 'Some answers change the emotion (Stoics, Buddhists). Some regulate it (Aristotle). Some respond to the social reality (honour cultures). Which do you reach for first?',
      takeaway: 'You have more than one way to respond. The skill is knowing which one the moment needs.',
      prompt: 'Which response is most natural to you, and which would stretch you most?'
    },
    {
      id: 'golden-rule-voices', type: 'perspectives', topic: 'religion', diff: 2, mins: 3,
      title: 'One Rule, Many Voices',
      hook: 'Nearly every tradition has a version of the Golden Rule. The wording differences are revealing.',
      links: ['ethics', 'history', 'philosophy'], thinkers: ['Confucius', 'Hillel'],
      situation: 'Across cultures, thinkers arrived at a similar idea of how to treat others. But they did not say exactly the same thing. Read them side by side.',
      lenses: [
        { who: 'Confucius (Analects 15.24)', tag: 'Reciprocity', text: 'Asked whether there is one word to guide a lifetime, he answered: reciprocity (shu). What you do not wish for yourself, do not impose on others.' },
        { who: 'Rabbi Hillel (Talmud, Shabbat 31a)', tag: 'The whole Torah', text: 'Asked to teach the whole Torah while standing on one foot, he said: what is hateful to you, do not do to your neighbour. The rest is commentary: go and learn.' },
        { who: 'Jesus (Matthew 7:12)', tag: 'Positive form', text: 'Do to others what you would have them do to you, stated as an active duty, not merely a prohibition.' },
        { who: 'Islamic tradition (hadith)', tag: 'Belief and empathy', text: 'A hadith says that none of you truly believes until he wishes for his brother what he wishes for himself.' },
        { who: 'Buddhism (Dhammapada 129)', tag: 'Empathy', text: 'All tremble at violence; all hold life dear. Putting yourself in the place of another, do not kill or cause another to kill.' }
      ],
      closing: 'Two forms appear: a negative one (do not do) and a positive one (do). Philosophers note limits: Kant thought it too weak to serve as a universal principle, and George Bernard Shaw joked that others’ tastes might differ from yours. Many scholars also caution against flattening distinct traditions into one.',
      takeaway: 'Different traditions converge on empathy as a basis for ethics, yet each frames it in its own way.',
      prompt: 'Where does “treat others as you want to be treated” fail? Where does it need to become “treat others as they want to be treated”?'
    }
  );

  /* ---------- Debates ---------- */
  C.library.push(
    {
      id: 'debate-presentism', type: 'debate', topic: 'history', diff: 2, mins: 4,
      title: 'Judge the Past by Today’s Standards?',
      hook: 'Should we condemn figures of history for views that were normal in their time?',
      links: ['ethics', 'society', 'philosophy'], thinkers: [],
      question: 'Should we judge historical figures by today’s moral standards?',
      sides: [
        { id: 'yes', label: 'Yes, some moral truths are not bound to an era',
          case: ['Slavery’s wrongness was recognised at the time, above all by the enslaved themselves and by abolitionists, so it was not an unknowable standard.', 'If every standard is merely local to an age, we could not call any reform progress. Judging does not mean we cannot also understand.', 'Silence about past wrongs can protect the privileged and distort memory.'],
          objection: 'Critics say this risks anachronism: it flattens history into heroes and villains, ignores how moral frameworks change, and invites complacency. What will future generations condemn in us?' },
        { id: 'no', label: 'No, judge them by the standards of their own time',
          case: ['Historians aim to understand people in context. Presentism distorts the evidence and prevents learning.', 'We should hold people responsible for what they could reasonably have known, and cultures can obscure moral truths.', 'Moral knowledge develops; blaming individuals for failing to anticipate it may be unfair.'],
          objection: 'Contemporaries disagreed too, so “the standards of the time” were never uniform. The dissenters show the wrong was knowable, and a rule against judging the past would also disarm criticism of the present.' }
      ],
      closing: 'Understanding and judging are different tasks. Good historians work hard at the first. Thoughtful citizens may do both, with humility about their own blind spots.',
      takeaway: 'To explain is not to excuse, and to judge is not to understand. We need both, kept distinct.',
      prompt: 'What belief of today do you think people a century from now will find hard to understand?'
    },
    {
      id: 'debate-free-will', type: 'debate', topic: 'philosophy', diff: 3, mins: 4,
      title: 'Is Free Will an Illusion?',
      hook: 'Your brain is physical matter. Every decision has causes. So who is really choosing?',
      links: ['psychology', 'science', 'ethics'], thinkers: ['Daniel Dennett', 'Galen Strawson', 'Peter van Inwagen'],
      question: 'Do we have free will?',
      sides: [
        { id: 'yes', label: 'Yes. Free will exists in a meaningful sense',
          case: ['Compatibilists (Dennett, Frankfurt) argue free will means acting on your own reasons without coercion, which is compatible with determinism.', 'Frankfurt-style cases suggest responsibility does not require the ability to have done otherwise.', 'Our practices of deliberating, praising and blaming work, and it is unclear we could abandon them.'],
          objection: 'Galen Strawson’s “basic argument”: you cannot be the ultimate source of your own character, since you did not choose your genes or upbringing, so ultimate responsibility is impossible. Critics say compatibilists just redefine “free.”' },
        { id: 'no', label: 'No. Free will is an illusion',
          case: ['Every event, including neural events, follows from earlier causes. You did not choose your starting point.', 'Libet-style experiments (1983) found brain activity (the readiness potential) before people reported deciding to move.', 'Randomness would not help: random choices are not controlled choices.'],
          objection: 'Libet’s result is contested: Schurger and colleagues (2012) proposed the readiness potential reflects spontaneous neural fluctuation, not a made decision. And everyday freedom, acting on your own reasons, may survive determinism.' }
      ],
      closing: 'A 2020 survey of professional philosophers found a majority leaning toward compatibilism, yet a large minority rejects it in each direction. The disagreement is partly about what “free will” should mean.',
      takeaway: 'Much of the free-will debate turns on definition: is it freedom from causes, or freedom from coercion?',
      prompt: 'If free will were an illusion, what would change about how we should treat each other?'
    },
    {
      id: 'debate-lying', type: 'debate', topic: 'ethics', diff: 2, mins: 4,
      title: 'The Murderer at the Door',
      hook: 'A killer asks where your friend is hiding. Must you tell the truth?',
      links: ['philosophy', 'history', 'wisdom'], thinkers: ['Immanuel Kant', 'Christine Korsgaard', 'W. D. Ross'],
      question: 'Is it ever morally right to lie?',
      sides: [
        { id: 'yes', label: 'Yes. Sometimes a lie is the right thing',
          case: ['If a murderer asks where your friend is, telling the truth makes you complicit in a killing.', 'Moral rules exist to serve human well-being. W. D. Ross argued duties can conflict, and the duty not to harm can outweigh the duty to be truthful.', 'Most people, across cultures, accept that some lies (to protect someone) are justified.'],
          objection: 'If everyone lies whenever they judge it beneficial, trust erodes. And we are poor judges of consequences, and often self-serving in deciding when lying is “justified.”' },
        { id: 'no', label: 'No. Honesty is a strict duty',
          case: ['Kant (1797) argued even this lie is wrong: lying corrupts the other person’s rational agency and makes all communication unreliable.', 'If lies are permitted when they seem beneficial, promises and testimony lose their value.', 'Augustine and Aquinas also held that lying is always wrong, though Aquinas allowed concealment.'],
          objection: 'A strict rule yields horrifying results, and the line between refusing to answer, misleading, and lying can seem thin. Some Kantians, like Christine Korsgaard, argue that Kant’s own principles permit lying to a murderer.' }
      ],
      closing: 'Almost everyone agrees that honesty matters hugely. The disagreement is whether it is absolute, and what to do when it collides with protecting an innocent person.',
      takeaway: 'Hard cases show that moral rules and moral outcomes can pull apart. Thinking well means understanding why.',
      prompt: 'What is the smallest lie you think is acceptable, and why does that one feel different?'
    },
    {
      id: 'debate-problem-of-evil', type: 'debate', topic: 'religion', diff: 3, mins: 4,
      title: 'Does Suffering Disprove God?',
      hook: 'Believers and sceptics have argued about this for as long as they have disagreed about anything.',
      links: ['philosophy', 'ethics', 'history'], thinkers: ['Epicurus', 'David Hume', 'Alvin Plantinga', 'John Hick'],
      question: 'Does the existence of so much suffering count strongly against the existence of God?',
      sides: [
        { id: 'yes', label: 'Yes. It is powerful evidence against God',
          case: ['The classic formulation, attributed to Epicurus and developed by Hume: if God can prevent evil but does not, God is not good; if God cannot, God is not all-powerful.', 'William Rowe’s evidential argument: some suffering, like a fawn dying slowly in a forest fire, seems pointless.', 'Natural evils (disease, disasters, animal suffering before humans existed) are not explained by human free will.'],
          objection: 'Alvin Plantinga’s free-will defence argues that the existence of both God and evil is logically consistent. Sceptical theists add that we are poorly placed to judge what is pointless.' },
        { id: 'no', label: 'No. It does not undermine belief',
          case: ['The free-will defence: a world with free creatures who sometimes choose wrongly may be more valuable than one without freedom.', 'John Hick’s “soul-making” view, drawing on Irenaeus: a challenging world allows moral and spiritual growth.', 'Sceptical theism: we cannot expect to grasp the reasons an infinite mind might have.'],
          objection: 'Critics point to horrendous evils (Marilyn McCord Adams) that seem impossible to outweigh, and say sceptical theism threatens our moral knowledge: if we cannot judge what is pointless, how can we judge anything?' }
      ],
      closing: 'Many religious traditions treat suffering less as a puzzle to be solved than as a question to live through. The Book of Job is the classic example, with the questioner never given a neat answer.',
      takeaway: 'The problem of evil is among the strongest arguments in philosophy of religion, and the best replies are also serious. Both sides repay careful reading.',
      prompt: 'Whatever your view, which argument from the other side was hardest to answer?'
    }
  );
})();
