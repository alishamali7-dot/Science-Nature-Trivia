import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import { colors } from '../theme';

// Two soft light glows behind everything (fixed, never scrolls, no touches).
export default function Backdrop() {
  const { width, height } = useWindowDimensions();
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Svg width={width} height={height}>
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
        <Rect width={width} height={height} fill={colors.bg} />
        <Rect width={width} height={height} fill="url(#a)" />
        <Rect width={width} height={height} fill="url(#b)" />
      </Svg>
    </View>
  );
}
