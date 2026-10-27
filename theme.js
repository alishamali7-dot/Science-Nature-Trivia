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

// Spring-like easing used by every entrance and press animation.
export const EASE = [0.32, 0.72, 0, 1];

// Seconds per question by age group.
export const TIME = { kids: 30, adults: 15 };
