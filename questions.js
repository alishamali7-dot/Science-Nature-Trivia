// Each question: topic, points (by difficulty), the question, the right answer and the wrong answers.
// Every text has an Arabic (ar) and English (en) version.
// Tuesday: swap this file for questions from the internet.
export const QUESTIONS = [
  {
    points: 100,
    topic: { ar: 'النبات', en: 'Plants' },
    question: { ar: 'أي غاز تمتصه النباتات من الهواء لتصنع غذاءها؟', en: 'Which gas do plants take in from the air to make food?' },
    correct: { ar: 'ثاني أكسيد الكربون', en: 'Carbon dioxide' },
    wrong: [
      { ar: 'الأكسجين', en: 'Oxygen' },
      { ar: 'النيتروجين', en: 'Nitrogen' },
      { ar: 'الهيليوم', en: 'Helium' },
    ],
  },
  {
    points: 200,
    topic: { ar: 'الفضاء', en: 'Space' },
    question: { ar: 'ما أقرب كوكب إلى الشمس؟', en: 'Which planet is closest to the Sun?' },
    correct: { ar: 'عطارد', en: 'Mercury' },
    wrong: [
      { ar: 'الزهرة', en: 'Venus' },
      { ar: 'المريخ', en: 'Mars' },
      { ar: 'الأرض', en: 'Earth' },
    ],
  },
  {
    points: 300,
    topic: { ar: 'الأرض', en: 'Earth' },
    question: { ar: 'ما أصلب مادة طبيعية؟', en: 'What is the hardest natural material?' },
    correct: { ar: 'الألماس', en: 'Diamond' },
    wrong: [
      { ar: 'الكوارتز', en: 'Quartz' },
      { ar: 'الحديد', en: 'Iron' },
      { ar: 'الجرانيت', en: 'Granite' },
    ],
  },
  {
    points: 400,
    topic: { ar: 'جسم الإنسان', en: 'Human body' },
    question: { ar: 'كم عظمة في جسم الإنسان البالغ؟', en: 'How many bones does an adult human have?' },
    correct: { ar: '206', en: '206' },
    wrong: [
      { ar: '186', en: '186' },
      { ar: '212', en: '212' },
      { ar: '230', en: '230' },
    ],
  },
  {
    points: 500,
    topic: { ar: 'الكيمياء', en: 'Chemistry' },
    question: { ar: 'ما الرمز الكيميائي للذهب؟', en: 'What is the chemical symbol for gold?' },
    correct: { ar: 'Au', en: 'Au' },
    wrong: [
      { ar: 'Ag', en: 'Ag' },
      { ar: 'Gd', en: 'Gd' },
      { ar: 'Go', en: 'Go' },
    ],
  },
];
