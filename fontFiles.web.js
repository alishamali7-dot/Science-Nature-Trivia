// Website build: the Thmanyah license forbids redistributing its files, so the public site loads
// open Google Fonts from Google's servers under the same family names (Readex Pro for the interface,
// Playfair Display for big titles). The phone app keeps Thmanyah (fontFiles.js).
const gstatic = 'https://fonts.gstatic.com/s/';
const readex = (file) => `${gstatic}readexpro/v27/SLXnc1bJ7HE5YDoGPuzj_dh8uc7wUy8ZQQyX2KY8TL${file}.ttf`;
const playfair = (file) => `${gstatic}playfairdisplay/v40/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PK${file}.ttf`;

export const fontFiles = {
  'ThmanyahSans-Regular': readex('0kGZN6blTC4USmgg'),
  'ThmanyahSans-Medium': readex('0kGZN6blTC00Smgg'),
  'ThmanyahSans-Bold': readex('0kGZN6blTCBkOmgg'),
  'ThmanyahSans-Black': readex('0kGZN6blTCBkOmgg'),
  'ThmanyahSerifDisplay-Black': playfair('fsukDQ'),
  'ThmanyahSerifDisplay-Bold': playfair('eiukDQ'),
};
