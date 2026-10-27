// "Night game show": deep black-violet ground, two soft glows behind, glass cards on top.
export const colors = {
  bg: '#07070D',
  shell: 'rgba(255,255,255,0.045)', // outer frame of a double-bezel card
  hairline: 'rgba(255,255,255,0.09)',
  highlight: 'rgba(255,255,255,0.14)', // top inner edge of a card
  core: '#12121C', // inner panel of a card
  coreDone: '#0C0C14',
  line: '#2A2840',
  text: '#F5F3FF',
  soft: '#CFCBE6',
  muted: '#8F8AAE',
  accent: '#A99BFF', // violet
  gold: '#FFD166',
  right: '#3DDC97',
  rightInk: '#062A1B',
  wrong: '#FF6B81',
  wrongBg: '#2A0F17',
  wrongText: '#FFD3DA',
  glowA: '#7C5CFF',
  glowB: '#19C2B0',
  teams: ['#5EB8FF', '#FF8FB1'],
};

// Thmanyah (خط ثمانية): Sans for the interface, Serif Display for big titles.
// Custom fonts pick weight by family, not fontWeight.
export const fonts = {
  regular: 'ThmanyahSans-Regular',
  medium: 'ThmanyahSans-Medium',
  bold: 'ThmanyahSans-Bold',
  black: 'ThmanyahSans-Black',
  display: 'ThmanyahSerifDisplay-Black',
  displayBold: 'ThmanyahSerifDisplay-Bold',
};

export const fontFiles = {
  'ThmanyahSans-Regular': require('./assets/fonts/thmanyahsans-Regular.otf'),
  'ThmanyahSans-Medium': require('./assets/fonts/thmanyahsans-Medium.otf'),
  'ThmanyahSans-Bold': require('./assets/fonts/thmanyahsans-Bold.otf'),
  'ThmanyahSans-Black': require('./assets/fonts/thmanyahsans-Black.otf'),
  'ThmanyahSerifDisplay-Black': require('./assets/fonts/thmanyahserifdisplay-Black.otf'),
  'ThmanyahSerifDisplay-Bold': require('./assets/fonts/thmanyahserifdisplay-Bold.otf'),
};

// Spacing scale (4-point grid). Screens use `space.lg` as edge padding.
export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };

// Corner radii. Double-bezel cards nest `lg` inside a frame `pad` wide.
export const radius = { sm: 14, md: 22, lg: 28, full: 999 };

// Named text styles. Arabic needs generous line height for its dots and marks.
export const type = {
  display: { fontFamily: fonts.display, fontSize: 46, lineHeight: 72 },
  displayCompact: { fontFamily: fonts.display, fontSize: 38, lineHeight: 60 },
  title: { fontFamily: fonts.display, fontSize: 30, lineHeight: 48 },
  heading: { fontFamily: fonts.displayBold, fontSize: 20, lineHeight: 32 },
  question: { fontFamily: fonts.bold, fontSize: 24, lineHeight: 38 },
  questionCompact: { fontFamily: fonts.bold, fontSize: 20, lineHeight: 32 },
  questionLarge: { fontFamily: fonts.bold, fontSize: 30, lineHeight: 46 },
  body: { fontFamily: fonts.regular, fontSize: 17, lineHeight: 28 },
  label: { fontFamily: fonts.bold, fontSize: 17, lineHeight: 26 },
  button: { fontFamily: fonts.black, fontSize: 18, lineHeight: 28 },
  callout: { fontFamily: fonts.bold, fontSize: 15, lineHeight: 24 },
  caption: { fontFamily: fonts.medium, fontSize: 14, lineHeight: 22 },
  micro: { fontFamily: fonts.bold, fontSize: 12, lineHeight: 18 },
  score: { fontFamily: fonts.black, fontSize: 22, lineHeight: 30 },
  points: { fontFamily: fonts.black, fontSize: 15, lineHeight: 22 },
  hero: { fontFamily: fonts.black, fontSize: 80, lineHeight: 104 },
};

// Motion durations (ms) and curves. EASE is the iOS sheet curve; EASE_OUT is a strong ease-out for UI.
export const motion = { press: 120, fast: 180, base: 260, slow: 520 };
export const EASE = [0.32, 0.72, 0, 1];
export const EASE_OUT = [0.23, 1, 0.32, 1];

// Seconds per question by age group.
export const TIME = { kids: 30, adults: 15 };
