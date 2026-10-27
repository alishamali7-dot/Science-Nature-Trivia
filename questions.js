// Categories on the board. `art` picks the illustration, `color` tints its row.
export const CATEGORIES = [
  { id: 'space', art: 'space', color: '#8B7CFF', name: { ar: 'الفضاء', en: 'Space' } },
  { id: 'animals', art: 'animals', color: '#FF9F43', name: { ar: 'الحيوانات', en: 'Animals' } },
  { id: 'plants', art: 'plants', color: '#2ED47A', name: { ar: 'النبات', en: 'Plants' } },
  { id: 'body', art: 'body', color: '#FF6B8B', name: { ar: 'جسم الإنسان', en: 'Human body' } },
  { id: 'earth', art: 'earth', color: '#3FB6FF', name: { ar: 'الأرض والمواد', en: 'Earth & matter' } },
];

// Each question: category, points (by difficulty), the question, the right answer and the wrong answers.
// Every text has an Arabic (ar) and English (en) version.
// Tuesday: swap this file for questions from the internet.
const q = (category, points, question, correct, wrong) => ({ category, points, question, correct, wrong });
const t = (ar, en = ar) => ({ ar, en });

export const QUESTIONS = {
  kids: [
    q('space', 200, t('ما الكوكب الذي نعيش عليه؟', 'Which planet do we live on?'), t('الأرض', 'Earth'),
      [t('المريخ', 'Mars'), t('القمر', 'The Moon'), t('الشمس', 'The Sun')]),
    q('space', 400, t('ما أكبر كوكب في المجموعة الشمسية؟', 'What is the biggest planet in our solar system?'), t('المشتري', 'Jupiter'),
      [t('الأرض', 'Earth'), t('المريخ', 'Mars'), t('عطارد', 'Mercury')]),
    q('animals', 200, t('أي حيوان يُلقَّب بملك الغابة؟', 'Which animal is called the king of the jungle?'), t('الأسد', 'Lion'),
      [t('الفيل', 'Elephant'), t('النمر', 'Tiger'), t('الزرافة', 'Giraffe')]),
    q('animals', 400, t('كم رِجلًا للعنكبوت؟', 'How many legs does a spider have?'), t('8'),
      [t('6'), t('10'), t('4')]),
    q('plants', 200, t('أي جزء من النبات يكون عادةً تحت التراب؟', 'Which part of a plant is usually under the ground?'), t('الجذور', 'Roots'),
      [t('الأوراق', 'Leaves'), t('الأزهار', 'Flowers'), t('الثمار', 'Fruit')]),
    q('plants', 400, t('ما الغاز الذي تعطينا إياه النباتات لنتنفس؟', 'Which gas do plants give us to breathe?'), t('الأكسجين', 'Oxygen'),
      [t('ثاني أكسيد الكربون', 'Carbon dioxide'), t('الهيليوم', 'Helium'), t('الدخان', 'Smoke')]),
    q('body', 200, t('كم إصبعًا في اليدين معًا؟', 'How many fingers are on two hands?'), t('10'),
      [t('8'), t('12'), t('5')]),
    q('body', 400, t('ما العضو الذي يضخ الدم في الجسم؟', 'Which organ pumps blood around the body?'), t('القلب', 'Heart'),
      [t('الرئتان', 'Lungs'), t('المعدة', 'Stomach'), t('الدماغ', 'Brain')]),
    q('earth', 200, t('من أي شيء يتكوّن الثلج؟', 'What is ice made of?'), t('الماء', 'Water'),
      [t('الحليب', 'Milk'), t('الرمل', 'Sand'), t('الملح', 'Salt')]),
    q('earth', 400, t('ماذا نسمي الجبل الذي يقذف الحمم؟', 'What do we call a mountain that shoots out lava?'), t('بركان', 'Volcano'),
      [t('تل', 'Hill'), t('جزيرة', 'Island'), t('صحراء', 'Desert')]),
  ],
  adults: [
    q('space', 200, t('ما أقرب كوكب إلى الشمس؟', 'Which planet is closest to the Sun?'), t('عطارد', 'Mercury'),
      [t('الزهرة', 'Venus'), t('المريخ', 'Mars'), t('الأرض', 'Earth')]),
    q('space', 400, t('كم يستغرق ضوء الشمس تقريبًا ليصل إلى الأرض؟', 'About how long does sunlight take to reach Earth?'), t('8 دقائق', '8 minutes'),
      [t('8 ثوانٍ', '8 seconds'), t('8 ساعات', '8 hours'), t('يوم كامل', 'A whole day')]),
    q('animals', 200, t('ما أسرع حيوان بري؟', 'What is the fastest land animal?'), t('الفهد الصياد', 'Cheetah'),
      [t('الأسد', 'Lion'), t('الحصان', 'Horse'), t('الغزال', 'Gazelle')]),
    q('animals', 400, t('أي حيوان ثديي يستطيع الطيران فعلًا؟', 'Which mammal can truly fly?'), t('الخفاش', 'Bat'),
      [t('السنجاب الطائر', 'Flying squirrel'), t('البطريق', 'Penguin'), t('النعامة', 'Ostrich')]),
    q('plants', 200, t('أي غاز تمتصه النباتات من الهواء لتصنع غذاءها؟', 'Which gas do plants take in to make food?'), t('ثاني أكسيد الكربون', 'Carbon dioxide'),
      [t('الأكسجين', 'Oxygen'), t('النيتروجين', 'Nitrogen'), t('الهيليوم', 'Helium')]),
    q('plants', 400, t('ما اسم العملية التي تصنع بها النباتات غذاءها من ضوء الشمس؟', 'What is the process plants use to make food from sunlight?'), t('البناء الضوئي', 'Photosynthesis'),
      [t('التنفس', 'Respiration'), t('الهضم', 'Digestion'), t('التبخر', 'Evaporation')]),
    q('body', 200, t('كم عظمة في جسم الإنسان البالغ؟', 'How many bones does an adult human have?'), t('206'),
      [t('186'), t('212'), t('230')]),
    q('body', 400, t('ما أكبر عضو في جسم الإنسان؟', 'What is the largest organ of the human body?'), t('الجلد', 'Skin'),
      [t('الكبد', 'Liver'), t('الدماغ', 'Brain'), t('الرئتان', 'Lungs')]),
    q('earth', 200, t('ما أصلب مادة طبيعية؟', 'What is the hardest natural material?'), t('الألماس', 'Diamond'),
      [t('الكوارتز', 'Quartz'), t('الحديد', 'Iron'), t('الجرانيت', 'Granite')]),
    q('earth', 400, t('ما الرمز الكيميائي للذهب؟', 'What is the chemical symbol for gold?'), t('Au'),
      [t('Ag'), t('Gd'), t('Go')]),
  ],
};
