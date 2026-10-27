import Svg, { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';

// Hand-drawn vector art per category, plus a hero scene for the start screen.
export default function Illustration({ name, size = 64 }) {
  const Art = ART[name] || ART.space;
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <Art />
    </Svg>
  );
}

const Star = ({ x, y, r = 2.5, c = '#FFF5C2' }) => (
  <Path d={`M${x} ${y - r * 2}L${x + r * 0.6} ${y - r * 0.6}L${x + r * 2} ${y}L${x + r * 0.6} ${y + r * 0.6}L${x} ${y + r * 2}L${x - r * 0.6} ${y + r * 0.6}L${x - r * 2} ${y}L${x - r * 0.6} ${y - r * 0.6}Z`} fill={c} />
);

const ART = {
  space: () => (
    <G>
      <Circle cx="50" cy="50" r="46" fill="#241D5C" />
      <Star x={22} y={26} /><Star x={78} y={22} r={2} /><Star x={80} y={74} r={1.8} />
      <Circle cx="50" cy="52" r="22" fill="#8B7CFF" />
      <Circle cx="43" cy="45" r="6" fill="#A79BFF" />
      <Circle cx="58" cy="60" r="4" fill="#6D5DF0" />
      <Ellipse cx="50" cy="54" rx="38" ry="9" fill="none" stroke="#FFC857" strokeWidth="4" transform="rotate(-18 50 54)" />
    </G>
  ),
  animals: () => (
    <G>
      <Circle cx="50" cy="50" r="46" fill="#4A2A12" />
      <Ellipse cx="50" cy="62" rx="17" ry="14" fill="#FF9F43" />
      <Ellipse cx="29" cy="44" rx="7" ry="9" fill="#FFB86B" transform="rotate(-20 29 44)" />
      <Ellipse cx="42" cy="32" rx="7" ry="9.5" fill="#FFB86B" />
      <Ellipse cx="58" cy="32" rx="7" ry="9.5" fill="#FFB86B" />
      <Ellipse cx="71" cy="44" rx="7" ry="9" fill="#FFB86B" transform="rotate(20 71 44)" />
    </G>
  ),
  plants: () => (
    <G>
      <Circle cx="50" cy="50" r="46" fill="#0F3B28" />
      <Rect x="28" y="70" width="44" height="14" rx="5" fill="#C9763E" />
      <Path d="M50 72 C50 58 50 50 50 40" stroke="#2ED47A" strokeWidth="4" strokeLinecap="round" fill="none" />
      <Path d="M50 52 C36 52 27 42 26 30 C40 30 50 38 50 52Z" fill="#2ED47A" />
      <Path d="M50 44 C62 44 72 34 74 22 C60 22 50 30 50 44Z" fill="#7BEFA8" />
      <Circle cx="76" cy="20" r="5" fill="#FFC857" />
    </G>
  ),
  body: () => (
    <G>
      <Circle cx="50" cy="50" r="46" fill="#4A1626" />
      <Path d="M50 78 C24 60 18 46 22 36 C26 24 42 22 50 34 C58 22 74 24 78 36 C82 46 76 60 50 78Z" fill="#FF6B8B" />
      <Path d="M24 52 L38 52 L43 42 L50 62 L56 48 L60 52 L76 52" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </G>
  ),
  earth: () => (
    <G>
      <Circle cx="50" cy="50" r="46" fill="#0E3550" />
      <Path d="M30 40 L40 26 L60 26 L70 40 L50 78Z" fill="#3FB6FF" />
      <Path d="M30 40 L70 40 L50 78Z" fill="#7FD0FF" />
      <Path d="M40 26 L50 40 L60 26" stroke="#0E3550" strokeWidth="2" fill="none" strokeLinejoin="round" />
      <Path d="M30 40 L50 78 L70 40" stroke="#0E3550" strokeWidth="2" fill="none" strokeLinejoin="round" />
      <Star x={76} y={26} r={2.6} c="#FFFFFF" /><Star x={24} y={66} r={1.8} c="#BDE8FF" />
    </G>
  ),
  oceans: () => (
    <G>
      <Circle cx="50" cy="50" r="46" fill="#0B3B3A" />
      <Path d="M22 60 C40 40 64 40 76 54 C64 68 40 72 22 60Z" fill="#2DD4BF" />
      <Path d="M74 54 L88 44 L86 64Z" fill="#2DD4BF" />
      <Circle cx="34" cy="54" r="3.5" fill="#0B3B3A" />
      <Circle cx="56" cy="26" r="3" fill="#9FF3E7" /><Circle cx="64" cy="18" r="2" fill="#9FF3E7" />
      <Path d="M14 80 Q26 72 38 80 T62 80 T86 80" stroke="#5EEAD4" strokeWidth="3.5" fill="none" strokeLinecap="round" />
    </G>
  ),
  hero: () => (
    <G>
      <Circle cx="50" cy="50" r="48" fill="#16142B" />
      <Star x={18} y={24} r={2} /><Star x={84} y={18} r={2.4} /><Star x={88} y={66} r={1.6} /><Star x={14} y={72} r={1.5} />
      <Ellipse cx="50" cy="50" rx="40" ry="14" fill="none" stroke="#3FB6FF" strokeWidth="2" opacity="0.7" transform="rotate(30 50 50)" />
      <Ellipse cx="50" cy="50" rx="40" ry="14" fill="none" stroke="#FF6B8B" strokeWidth="2" opacity="0.7" transform="rotate(-30 50 50)" />
      <Circle cx="50" cy="50" r="18" fill="#8B7CFF" />
      <Circle cx="44" cy="44" r="5" fill="#A79BFF" />
      <Path d="M58 60 C58 52 64 46 72 46 C72 54 66 60 58 60Z" fill="#2ED47A" />
      <Circle cx="84" cy="38" r="4" fill="#FFC857" />
      <Circle cx="17" cy="58" r="3.5" fill="#B7F34A" />
    </G>
  ),
};
