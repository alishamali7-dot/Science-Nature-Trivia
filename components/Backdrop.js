import { StyleSheet, View } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import { colors } from '../theme';

// Two soft light glows behind everything (fixed, never scrolls, no touches).
// Sized to the screen view, not the window: on Android edge-to-edge the window height leaves out
// the navigation bar, which left a plain black strip at the bottom.
export default function Backdrop() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Svg width="100%" height="100%">
        <Defs>
          <RadialGradient id="a" cx="85%" cy="8%" rx="70%" ry="45%">
            <Stop offset="0" stopColor={colors.glowA} stopOpacity="0.38" />
            <Stop offset="1" stopColor={colors.glowA} stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="b" cx="5%" cy="92%" rx="75%" ry="45%">
            <Stop offset="0" stopColor={colors.glowB} stopOpacity="0.22" />
            <Stop offset="1" stopColor={colors.glowB} stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Rect width="100%" height="100%" fill={colors.bg} />
        <Rect width="100%" height="100%" fill="url(#a)" />
        <Rect width="100%" height="100%" fill="url(#b)" />
      </Svg>
    </View>
  );
}
