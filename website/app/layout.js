import { Playfair_Display, Readex_Pro } from 'next/font/google';
import './globals.css';

const display = Playfair_Display({ subsets: ['latin'], weight: ['700', '900'], variable: '--display' });
const body = Readex_Pro({ subsets: ['latin'], weight: ['400', '500', '700'], variable: '--body' });

export const metadata = {
  title: 'Science Challenge',
  description: 'A Science & Nature trivia game for kids and adults. Six categories, 36 new questions every game, team helpers.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
