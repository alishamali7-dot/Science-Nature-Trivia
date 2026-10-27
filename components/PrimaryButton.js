import { StyleSheet, View } from 'react-native';
import { colors, radius, space } from '../theme';
import Icon from './Icon';
import Tap from './Tap';
import Txt from './Txt';

// Pill button with its icon nested in its own circle ("button in button").
// variant: 'solid' (light pill, the main action) | 'ghost' (glass outline, a secondary action)
export default function PrimaryButton({ label, onPress, variant = 'solid', icon = 'arrow', haptic = 'tap', dir }) {
  const ink = variant === 'ghost' ? colors.text : colors.bg;
  return (
    <Tap
      onPress={onPress}
      haptic={haptic}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[styles.button, styles[variant], { flexDirection: dir?.row || 'row' }]}
    >
      <Txt variant="button" color={ink}>{label}</Txt>
      {icon && (
        <View style={[styles.bubble, variant === 'ghost' && styles.bubbleGhost]}>
          <Icon name={icon} size={18} color={ink} flip={icon === 'arrow' && dir?.rtl} />
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
  solid: { backgroundColor: colors.text },
  ghost: { backgroundColor: colors.shell, borderWidth: 1, borderColor: colors.hairline },
  bubble: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(7,7,13,0.08)', alignItems: 'center', justifyContent: 'center' },
  bubbleGhost: { backgroundColor: 'rgba(255,255,255,0.08)' },
});
