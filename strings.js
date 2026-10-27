import { I18nManager } from 'react-native';

export const STRINGS = {
  ar: {
    category: 'علوم وطبيعة',
    title: 'تحدّي العلوم',
    tagline: 'خمس فئات، وكل سؤال له نقاط حسب صعوبته.',
    steps: ['اختر فئة من اللوحة', 'جاوب من أربعة خيارات', 'اجمع أكبر عدد من النقاط'],
    start: 'ابدأ',
    pts: 'نقطة',
    pick: 'اختر سؤالك',
    pickHint: 'كلما زادت النقاط زادت الصعوبة',
    right: 'صح! +',
    wrong: 'خطأ، الجواب: ',
    toBoard: 'رجوع للوحة',
    seeScore: 'شوف النتيجة',
    final: 'النتيجة النهائية',
    outOf: 'من ١٥٠٠ نقطة',
    correctOf: ' من ٥ إجابات صحيحة',
    v5: 'ممتاز! عالِم حقيقي',
    v3: 'شغل حلو، كمّل',
    v0: 'جرّب مرة ثانية',
    again: 'العب مرة ثانية',
  },
  en: {
    category: 'Science & Nature',
    title: 'Science Challenge',
    tagline: 'Five categories. Every question is worth points by how hard it is.',
    steps: ['Pick a category on the board', 'Answer from four choices', 'Collect as many points as you can'],
    start: 'Start',
    pts: 'pts',
    pick: 'Pick your question',
    pickHint: 'More points means harder',
    right: 'Correct! +',
    wrong: 'Wrong — the answer is ',
    toBoard: 'Back to board',
    seeScore: 'See score',
    final: 'Final score',
    outOf: 'out of 1500 points',
    correctOf: ' of 5 correct',
    v5: 'Perfect — real scientist!',
    v3: 'Nice work, keep going',
    v0: 'Give it another try',
    again: 'Play again',
  },
};

// Layout direction per language. If the phone itself runs RTL, React Native already
// flips 'row' and swaps left/right, so we only flip when the app language differs.
export function dirFor(lang) {
  const rtl = lang === 'ar';
  const flip = rtl !== I18nManager.isRTL;
  return {
    rtl,
    row: flip ? 'row-reverse' : 'row',
    text: { textAlign: flip ? 'right' : 'left', writingDirection: rtl ? 'rtl' : 'ltr' },
  };
}
