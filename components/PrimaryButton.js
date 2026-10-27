import { StyleSheet, View } from 'react-native';
import { colors, radius, space } from '../theme';
import Icon from './Icon';
import Tap from './Tap';
import Txt from './Txt';

// Pill button with its icon nested in its own circle ("button in button").
// variant: 'solid' (light pill, the main action) | 'ghost' (glass outline, a secondary action)
// size: 'md' (default) | 'sm' (shorter, for a secondary action on short screens)
// icon: 'chevron' (go forward, flips for Arabic) | 'play' (start playing; violet, never flips) | 'restart'
export default function PrimaryButton({ label, onPress, variant = 'solid', size = 'md', icon = 'chevron', haptic = 'tap', dir }) {
  const ink = variant === 'ghost' ? colors.text : colors.bg;
  const play = icon === 'play';
  return (
    <Tap
      onPress={onPress}
      haptic={haptic}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[styles.button, size === 'sm' && styles.buttonSm, styles[variant], { flexDirection: dir?.row || 'row' }]}
    >
      <Txt variant="button" color={ink}>{label}</Txt>
      {!!icon && (
        <View style={[styles.bubble, size === 'sm' && styles.bubbleSm, variant === 'ghost' && styles.bubbleGhost, play && styles.bubblePlay]}>
          <Icon
            name={icon}
            size={play ? 24 : 18}
            color={play ? '#FFFFFF' : ink}
            strokeWidth={icon === 'chevron' ? 2.2 : 1.6}
            flip={icon === 'chevron' && dir?.rtl}
          />
        </View>
      )}
    </Tap>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 60, borderRadius: radius.full, paddingStart: space.xl, paddingEnd: space.sm,
    alignItems: 'center', justifyContent: 'space-between',
  },
  buttonSm: { minHeight: 48, paddingEnd: 6 },
  solid: { backgroundColor: colors.text },
  ghost: { backgroundColor: colors.shell, borderWidth: 1, borderColor: colors.hairline },
  bubble: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(7,7,13,0.08)', alignItems: 'center', justifyContent: 'center' },
  bubbleSm: { width: 36, height: 36, borderRadius: 18 },
  bubbleGhost: { backgroundColor: 'rgba(255,255,255,0.08)' },
  bubblePlay: { backgroundColor: colors.glowA, boxShadow: '0 4px 12px rgba(124, 92, 255, 0.45)' },
});
