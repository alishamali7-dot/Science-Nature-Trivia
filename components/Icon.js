import { View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

// Thin-line icons (1.6 stroke). `flip` mirrors directional icons for Arabic.
const PATHS = {
  arrow: ['M5 12h14', 'M13 6l6 6-6 6'],
  undo: ['M9 14L4 9l5-5', 'M4 9h10.5a5.5 5.5 0 0 1 0 11H11'],
  restart: ['M3.5 12a8.5 8.5 0 1 0 2.6-6.1', 'M3.5 4v5h5'],
  check: ['M5 12.5l4.5 4.5L19 7'],
  close: ['M6 6l12 12', 'M18 6L6 18'],
  repeat: ['M17 3l3 3-3 3', 'M4 11V9a3 3 0 0 1 3-3h13', 'M7 21l-3-3 3-3', 'M20 13v2a3 3 0 0 1-3 3H4'],
  pit: ['M4 16.5c0-2 3.6-3.5 8-3.5s8 1.5 8 3.5-3.6 3.5-8 3.5-8-1.5-8-3.5Z', 'M12 3v7', 'M9 7.5l3 3 3-3'],
  phone: ['M5.5 4h3.2l1.8 4.5-2.3 1.4a11 11 0 0 0 5.9 5.9l1.4-2.3 4.5 1.8v3.2a1.8 1.8 0 0 1-1.9 1.8A15.5 15.5 0 0 1 3.7 5.9 1.8 1.8 0 0 1 5.5 4Z'],
  half: ['M12 3.5v17'],
};

export default function Icon({ name, size = 20, color = '#fff', flip = false, strokeWidth = 1.6 }) {
  return (
    <View aria-hidden pointerEvents="none">
      <Svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={flip ? { transform: [{ scaleX: -1 }] } : undefined}
      >
        {name === 'half' && <Circle cx="12" cy="12" r="8.5" />}
        {(PATHS[name] || []).map((d) => <Path key={d} d={d} />)}
      </Svg>
    </View>
  );
}
