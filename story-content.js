
// ============================================================
// story-content.js
// research narrative, citations, diagrams, and sample text.
// ============================================================

var STORY_CONTENT = {
  title: "The Negotiation of Language",
  subtitle: "A research translation project created for Phase Transition 2026",
  sampleText: `A conversation rarely gives every word the same amount of work to do. A small group of familiar words returns again and again, while a much larger collection appears only when a particular person, place, or idea enters the story. In a letter, a recipe, a travel diary, or a note to a friend, the pattern is not planned in advance. It grows from the repeated choices people make as they try to be understood without spending more effort than they need to.

Imagine a person describing a long walk through a city after rain. They leave the station beneath a sky that is still the color of metal, turn toward the river, and follow the bright windows of shops as they begin to close. A bicycle leans against a railing. A bus sighs at the curb. In the market, a baker lifts a tray from the oven, and the warm smell of bread travels farther than the sound of traffic. None of these details has to be important to every reader. Together, however, they make a place feel specific, and the words that carry those details may appear only once.

Other words do a quieter kind of work. They connect one thought to another, point back to a person already mentioned, or help a sentence move from a beginning toward its end. Because these small words are useful in many situations, they are likely to recur. A writer may use them without noticing, just as a reader may pass over them while following the larger idea. Repetition does not make a word meaningless. It simply gives a few words many opportunities to appear.

If we count each distinct word and sort the counts from largest to smallest, the most frequent item takes the first rank, the next most frequent takes the second, and so on. The list often starts with a steep drop. A handful of words account for many appearances, while the rest form a long tail of words seen less often. On a graph with logarithmic scales, that uneven distribution can resemble a straight, descending line. The shape is striking, but a resemblance is only a description. It does not tell us by itself why the words ended up in that order.

One possible explanation begins with the work of a speaker. A speaker may prefer a short, familiar signal because it is quick to produce and easy to reuse. A listener, meanwhile, needs enough information to distinguish one meaning from another. If every meaning shares the same signal, speaking is effortless but listening becomes difficult. If every meaning receives a completely separate signal, understanding may be easy but the system becomes cumbersome. Communication lives between those extremes, where the two sides continually adapt to one another.

This is not the only way to think about the pattern. A random process can also generate word-like units with highly unequal frequencies. Random typing is useful because it shows that a skewed curve can arise from a simple mechanism; it is not a faithful model of how people write, and it does not prove that language is random. Work on coding theory adds another twist: under a particular non-singular coding scheme, random typing can itself be described as an optimal coding process. The assumptions matter as much as the curve.

The connection between frequency and length raises a related question. If a word is common, people have many chances to learn it and use it efficiently. A short form may save effort, but only while context keeps the meaning recoverable. Researchers call the tendency for more frequent words to be shorter the law of abbreviation. It is connected to, but not identical with, the rank-frequency pattern in the chart. Frequency can be compared with length, with rank, or with the information carried by a word; each comparison asks a different question.

Now imagine measuring the same text in a different way. Instead of asking how often a word occurs, ask how long its signal is. Instead of comparing length with frequency, compare it with the word's rank or probability. These views can be related by mathematical models of coding and compression. Some recent work proposes that several familiar language patterns may belong to one broader family: systems can sit near, rather than exactly at, different coding optima and still produce related regularities. That is a proposal to test, not a law that every language must obey.

The sample on this screen is deliberately longer than a short prompt, because a frequency ranking is easier to see when there are enough observations to form a tail. Still, every passage has a genre, a vocabulary, and a way of dividing text into words. A different sample may produce a different slope. Changing punctuation rules, language, or the amount of text can change the result too. The graph describes this passage under this simple counting rule; it does not grade the writer or measure the quality of an idea.

As you move through the experience, keep two questions in view. First, what pattern does the sample show? Second, what extra evidence would help explain how that pattern emerged? A chart can invite those questions, and a model can make one answer precise. Neither replaces the work of comparing assumptions with observations. The negotiation is not a single point where every speaker and listener agrees forever. It is a useful way to study how choices, constraints, and shared understanding can shape the language we use.`,
  references: [
    {
      id: 1,
      citation: "Ferrer-i-Cancho & Sole (2003)",
      title: "Least effort and the origins of scaling in human language",
      publication: "Proceedings of the National Academy of Sciences, 100(3), 788-791",
      href: "https://doi.org/10.1073/pnas.0335980100"
    },
    {
      id: 2,
      citation: "Ferrer-i-Cancho, Bentz & Seguin (2019; revised 2020)",
      title: "Optimal coding and the origins of Zipfian laws",
      publication: "arXiv:1906.01545 (v4, 2020); journal version, Journal of Quantitative Linguistics (2022)",
      href: "https://arxiv.org/abs/1906.01545"
    },
    {
      id: 3,
      citation: "Ferrer-i-Cancho (2025), preprint",
      title: "On the class of coding optimality of human languages and the origins of Zipf's law",
      publication: "arXiv:2505.20015 (v5, 2 September 2025)",
      href: "https://arxiv.org/abs/2505.20015"
    }
  ],
  languageEvidence: {
    sampleSize: 986,
    reportedSharePercent: 14
  },
  scenes: [
    {
      title: "Begin with a passage",
      kicker: "01 . YOUR TEXT",
      summary: "Write a little, paste a passage in English, or use the 500+ word sample.",
      body: "This experience counts word frequencies. A larger sample makes the rare-word tail easier to see, but you do not need to write 500 words yourself. Try your own text, copy and paste another English passage, or select the sample. The text is cleared when you replay.",
      note: "At least 30 words, up to 6,000 characters.",
      references: []
    },
    {
      title: "The long tail",
      kicker: "02 . RANK AND FREQUENCY",
      summary: "Your words are sorted from most frequent to least frequent.",
      body: "Your words sit on a chart with logarithmic scales, where each equal step represents a multiplication rather than a fixed increase. If the dots form a roughly straight, descending path, researchers call it a Zipf-like rank-frequency pattern. The shorthand p(rank) ~ rank^(-alpha) describes how quickly the counts fall, with alpha as the slope. The slope is a visual summary of the distribution.",
      note: "A shorter text may have a noisy tail",
      references: [1, 3]
    },
    {
      title: "A familiar shape",
      kicker: "03 . COMPARISON",
      summary: "Long tails can appear in more than one kind of system.",
      body: "The curves alongside yours are generated examples, not measurements of cities, music, or websites. Similar shapes can motivate a shared question, but they do not establish that the systems share a cause. Sampling, the units being counted, and the model used to generate a curve all matter.",
      note: "Similarity is a starting point for comparison, not proof of a universal mechanism.",
      references: [1, 2, 3]
    },
    {
      title: "One question, several mechanisms",
      kicker: "04 . THE EXPLANATION",
      summary: "The pattern is clear. What assumptions could produce it?",
      body: "You have seen the pattern in your own words. Now the harder question: where does it come from? Ferrer-i-Cancho and Sole model communication as a balance between two costs, the effort of saying less versus the effort of understanding more. Near a transition in their model, a Zipf-like distribution appears. But other mechanisms can produce the same shape. Random processes, coding constraints, and even how you choose to count can all yield similar curves. Hover over each card to explore the competing explanations.",
      note: "The paper proposes a specific model. It does not show that every Zipf-like curve has the same origin.",
      references: [1, 2, 3]
    },
    {
      title: "Signals and meanings",
      kicker: "05 . A COMMUNICATION MODEL",
      summary: "Each side of the channel has a cost. Watch them compete.",
      body: "You are watching a simplified model of communication. On one side, a speaker chooses signals to send. On the other, a listener tries to recover what those signals mean. If the speaker reuses one signal for everything, speaking costs almost nothing, but the listener cannot tell meanings apart. If the speaker assigns a unique signal to every meaning, the listener's job becomes easy, but the system grows large and costly to maintain. Ferrer-i-Cancho and Sole frame this as a game in the 2003 paper. Each side has a cost function, and the balance between them determines how signals and meanings associate. The effort meters below the diagram track this shifting balance. In the model, a Zipf-like distribution of signal frequencies appears near the point where neither side dominates completely.",
      note: "The diagram is a schematic translation of the paper's cost functions, not a recording of real speech.",
      references: [1]
    },
    {
      title: "The transition zone",
      kicker: "06 . BALANCING COSTS",
      summary: "Move the slider to explore how the toy model changes as the two costs shift.",
      body: "Move the slider and watch how the curve responds. A narrow middle band is coded as the model's transition zone, where the simulation draws a Zipf-like curve. The value near 0.41 is a visual parameter in this interactive demo, not a measured constant or a value estimated from the paper.",
      note: "The transition is a result of this simplified model, not a promise that real languages share one threshold.",
      references: [1]
    },

    {
      title: "When random typing enters",
      kicker: "07 . A CODING SURPRISE",
      summary: "Random-looking text can produce an uneven frequency curve. That does not settle why language does.",
      body: "What you just watched was a toy demo of random letter generation. The real result is more precise: Ferrer-i-Cancho, Bentz, and Seguin derive the law of abbreviation from optimal coding under stated rules. They also show that non-singular coding combined with a maximum-entropy assumption can produce a Zipf-like rank-frequency distribution. Their random-typing result depends on a specific coding setup; the animation here is only a simplified illustration.",
      note: "A mechanism that can produce a pattern is not, by itself, evidence that it produced the pattern in human language.",
      references: [2, 3]
    },
    {
      title: "Four linked regularities",
      kicker: "08 . A PROPOSED FRAMEWORK",
      summary: "Four related views connect frequency, rank, probability, and signal length.",
      body: "The four nodes on the constellation each represent a different way to measure the same data: frequency against rank, length against frequency, length against rank, and length against probability. The 2025 preprint proposes that these views are connected through a class where signal lengths differ in a straight-line way from two theoretical coding baselines. The offset need not be small. The framework has testable conditions, but it is not proof of one settled cause or a claim that all languages belong to the class.",
      note: "The four regularities are connected in a proposed framework, and not truly established as one and only universal cause.",
      references: [2, 3]
    },
    {
      title: "A reported cross-language count",
      kicker: "09 . {languageCount} LANGUAGES",
      summary: "Earlier research reported the law of abbreviation across {languageCount} languages. The 2025 preprint cites this evidence.",
      body: "This is not the same pattern you saw earlier. The first chart measured rank and frequency, tracking how often words appear. This scene measures something related but different: common words tend to be shorter. Researchers call it the law of abbreviation. A 2025 preprint cites earlier studies reporting this tendency across {languageCount} languages, roughly {languageShare}% of the world's documented languages. The bar filling on screen represents that reported count, not raw measurements. Your own passage is measured alongside them.",
      note: "This is prior evidence reported in the preprint's introduction, not a new {languageCount}-language analysis in that paper.",
      references: [3]
    },
    {
      title: "Where the model stops",
      kicker: "10 . BOUNDARIES AND EXCEPTIONS",
      summary: "The evidence across communication systems is mixed. There is no simple universal boundary.",
      body: "Does this pattern belong only to humans? The 2025 preprint compares frequency distributions across species. Some, including rhesus monkeys, certain dolphin calls, and warbling vireo songs, show exponential curves that drop off too steeply to be Zipfian. Watch each one approach the human reference line, then fall away. Others are harder to classify. Dolphin whistles and humpback whale song sit in an uncertain zone, close enough to raise questions but not close enough to settle them. Every curve on screen is schematic, not fitted to recordings.",
      note: "A Zipf-like line alone cannot establish compression, optimality, or a shared evolutionary explanation.",
      references: [3]
    },
    {
      title: "Carry the question forward",
      kicker: "11 . YOUR READING",
      summary: "Return to your passage with a pattern to notice and an explanation still to test.",
      body: "The percentage shown is an exploratory fit for this short sample. It is not a score, a statistical test, or a verdict about your writing. The comparison below gives context: where your passage sits relative to a theoretical ideal, a typical English text, and random noise. The negotiation between effort and clarity never stops. It shapes every sentence you write, including the ones you typed here. If something in this experience made you think differently, the space below is yours.",
      note: "Your input stays in this browser and is cleared when you replay.",
      references: [1, 2, 3]
    }
  ],
  researchMap: {
    title: "How the research develops",
    introduction: "Three papers approach the same broad pattern from different angles. The later work builds on ideas in the field; it does not turn the earlier models into a single proven cause.",
    showOnScenes: [3, 7, 10],
    steps: [
      { period: "2003 . PUBLISHED MODEL", title: "Balance two communication costs", body: "Ferrer-i-Cancho and Sole model the effort of sending signals and the effort of understanding them. A Zipf-like pattern appears near a transition in their model.", connection: "Starts with the communication problem", referenceId: 1 },
      { period: "2019-2022 . CODING THEORY", title: "Ask what efficient codes predict", body: "Ferrer-i-Cancho, Bentz, and Seguin derive links between code length and frequency under specified coding rules, including a carefully qualified random-typing result.", connection: "Adds formal coding assumptions", referenceId: 2 },
      { period: "2025 . PREPRINT", title: "Propose a broader testable class", body: "Ferrer-i-Cancho proposes a class where real signal lengths differ in a straight-line way from two ideal coding baselines, linking rank, probability, and length. It remains a proposal to test, not a settled cause.", connection: "Connects the patterns; leaves tests open", referenceId: 3 }
    ]
  },
  visualCopy: {
    chartLabels: {
      rank: "log(rank)",
      frequency: "log(freq)",
      referenceSlope: "slope = -1",
      clickPrompt: "click to continue",
      typingHint: "start typing anything...",
      wordUnit: "words",
      languageUnit: "languages",
      userCurve: "your words",
      idealCurve: "ideal Zipf (slope = -1)",
      fitInsufficient: "not enough distinct words for a useful fit",
      fitPrefix: "Zipf-like fit (exploratory): ",
      wordCountPrefix: "you typed "
    },
      frameworkTitle: "one optimization, four laws",
      frameworkSubtitle: "compression",
      framework: [
    "you have seen Zipf's law; frequency falls with rank. but this is only the beginning.",
    "common words tend to be short, rare words tend to be long. brevity follows the same optimization pressure.",
    "longer constructs break into shorter parts. Menzerath's law, another face of the same constraint.",
    "frequent words carry more meanings. the pattern repeats across every dimension of language."
    ],
    ready: "your words are about to reveal a pattern...",
    reveal: {
      sorting: "watch your words arrange themselves...",
      tail: "a few words appear often; many others form a long tail.",
      headline: "a Zipf-like pattern"
    },
    comparison: [
      "the curves beside yours show city populations following a similar long tail. These are illustrations, not raw data.",
      "different domains can show related shapes, but similarity between curves does not tell you they share a cause.",
      "this comparison opens a question you can test: what assumptions could produce each pattern?"
    ],
    question: {
      heading: "why?",
      prompt: "You have seen the pattern. Now the hard question: what makes it happen?",
      cards: [
        {
          label: "WHY",
          title: "speakers and listeners negotiate",
          body: "The 2003 model proposes that language balances two costs, the effort of speaking versus the effort of understanding. Near the balance point, a Zipf-like curve appears."
        },
        {
          label: "WHAT IF",
          title: "random keys produce the same shape",
          body: "A random process can make tokens with unequal frequencies. The shape looks similar, but similarity alone cannot tell you if language is random or structured."
        },
        {
          label: "HOW",
          title: "efficient codes predict the pattern",
          body: "Optimal compression under specific coding rules produces Zipf-like curves. The 2019 paper connects this to random typing, but the assumptions matter as much as the result."
        },
        {
          label: "CAVEAT",
          title: "counting methods shape the result",
          body: "How you segment text, which units you count, and how much data you have can all change the curve. Part of what looks like a pattern may come from the measurement."
        }
      ],
      beamLabel: "same shape, different assumptions",
      phaseOneNarrative: "At least four different explanations can produce a curve like this. The tricky part: telling them apart.",
      lens: "a communication game.",
      answer: "one useful lens is a game of signals and meanings."
    },
    communication: [
      "a speaker sends signals along the channel. A listener on the other end recovers their meaning.",
      "one signal for everything is easy to produce, but hard to interpret.",
      "one signal per meaning is clear, but makes the system more costly.",
      "in this model, a balance between speaker and listener costs can produce a Zipf-like distribution."
    ],
    transition: [
      "move the slider to change the balance between speaker and listener costs.",
      "the middle band in this demo is illustrative; its slider value is not a measurement from the paper."
    ],
    randomTyping: [
      "what if a simple random process made word-like tokens?",
      "the random-letter simulation creates tokens; now compare their frequencies.",
      "random typing can be an optimal coding process under specific assumptions. A similar curve alone does not explain human language."
    ],
    randomTypingHeadline: "A pattern is not an explanation.",
    randomTypingTitle: "random typing as a model",
    randomTypingLegend: "random-letter demo",
    zipfReferenceLabel: "ideal Zipf reference (model)",
    framework: "the four regularities are connected in a proposed coding framework, not established as one universal cause.",
    languageCount: "a 2025 preprint reports earlier evidence for the law of abbreviation in {languageCount} languages ({languageShare}%). The bar shows the count, not raw measurements.",
    languageDetails: [
      "a separate pattern: frequency and signal length",
      "the preprint reports earlier support in {languageCount} languages ({languageShare}%)",
      "abbreviation is distinct from rank-frequency Zipf's law",
      "the bar encodes the reported count, not raw measurements"
    ],
    abbreviationBar: {
      title: "the law of abbreviation",
      userLabel: "your passage",
      countLabel: "{languageCount} languages reported"
    },
    boundaryLabel: "illustrative profiles",
    boundary: "watch how different species compare to the human reference curve. These profiles are schematic, not fitted to animal recordings.",
    boundaryNarration: [
    "the 2003 model predicts Zipf's law should be uniquely human; it emerges from a game only language plays.",
    "most animal communication follows exponential distributions, not power laws. the curves fall away too fast.",
    "but dolphins and humpback whales show something closer to Zipf's law. the evidence is debated, not settled.",
    "this is the boundary; where optimization ends and something else begins. or perhaps where it begins again.",
    "the question remains open. the model draws a line, but nature does not always respect theoretical borders."
    ],
    boundaryProfiles: {
      exponential: ["rhesus monkey key-signs", "dolphin tonemes", "warbling vireo calls"],
      mixed: ["dolphin whistles, mixed reports", "humpback song, mixed reports"]
    },
    ending: {
      title: "The Negotiation of Language",
      subtitle: "A research translation project created for Phase Transition 2026",
      takeaway: "The negotiation between effort and clarity never stops. It shapes every sentence you write, including the ones you typed here.",
      textFieldPrompt: "If something here changed how you think about language, this space is yours.",
      exploreSources: "explore the sources",
      replayPrompt: "replay with different text",
      benchmarks: {
        ideal: { label: "perfect Zipf", value: "100%" },
        typical: { label: "average English text", range: "80-85%" },
        random: { label: "random typing", range: "40-55%" }
      }
    }
  },
  comparisonExamples: [
    { label: "city populations", exponent: 1.07, maxFrequency: 8000 },
    { label: "music note frequencies", exponent: 0.95, maxFrequency: 6000 },
    { label: "website visits", exponent: 0.9, maxFrequency: 7000 }
  ],
  laws: [
    { name: "Zipf's law", subtitle: "frequency vs rank", exponent: 1.0, x: 0.25, y: 0.3 },
    { name: "Brevity law", subtitle: "frequency vs length", exponent: 0.8, x: 0.75, y: 0.3 },
    { name: "Menzerath's law", subtitle: "whole vs parts", exponent: 0.6, x: 0.25, y: 0.7 },
    { name: "Meaning distribution", subtitle: "frequency vs probability", exponent: 0.9, x: 0.75, y: 0.7 }
  ],
  languageHistogram: {
  binWidth: 0.05,
  totalLanguages: 986,
  bins: [
    { center: 0.625, count: 0 },
    { center: 0.675, count: 2 },
    { center: 0.725, count: 9 },
    { center: 0.775, count: 26 },
    { center: 0.825, count: 64 },
    { center: 0.875, count: 91 },
    { center: 0.925, count: 135 },
    { center: 0.975, count: 140 },
    { center: 1.025, count: 173 },
    { center: 1.075, count: 132 },
    { center: 1.125, count: 90 },
    { center: 1.175, count: 61 },
    { center: 1.225, count: 37 },
    { center: 1.275, count: 18 },
    { center: 1.325, count: 7 },
    { center: 1.375, count: 0 },
    { center: 1.425, count: 1 },
    { center: 1.475, count: 0 }
  ],
  notableLanguages: [
    { label: "English", exponent: 1.01 },
    { label: "Mandarin", exponent: 0.97 },
    { label: "Arabic", exponent: 1.05 },
    { label: "Finnish", exponent: 0.87 },
    { label: "Japanese", exponent: 0.93 }
  ]
},
};
