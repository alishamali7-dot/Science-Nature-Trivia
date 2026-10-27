export const colors = {
  bg: '#0B1220',
  card: '#151E31',
  cardDone: '#0F1729',
  chip: '#1D2A44',
  line: '#26324A',
  text: '#F1F5F9',
  soft: '#CBD5E1',
  muted: '#94A3B8',
  accent: '#B7F34A',
  gold: '#FFC857',
  wrong: '#FF7A6B',
  wrongBg: '#3A1A1C',
  wrongText: '#FFD6D0',
  teams: ['#3FB6FF', '#FF6B8B'],
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

// Seconds per question by age group.
export const TIME = { kids: 30, adults: 15 };
