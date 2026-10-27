import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../theme';
import Icon from './Icon';

// Pill button with its arrow nested in its own circle ("button in button").
// variant: 'solid' (default, light pill) | 'accent' (violet) | 'ghost' (glass outline)
export default function PrimaryButton({ label, onPress, variant = 'solid', icon = 'arrow', dir }) {
  const ink = variant === 'ghost' ? colors.text : colors.bg;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [styles.button, styles[variant], { flexDirection: dir?.row || 'row' }, pressed && styles.pressed]}
    >
      <Text style={[styles.label, { color: ink }]}>{label}</Text>
      {icon && (
        <View style={[styles.bubble, variant === 'ghost' && styles.bubbleGhost]}>
          <Icon name={icon} size={18} color={ink} flip={icon === 'arrow' && dir?.rtl} />
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 60, borderRadius: 999, paddingStart: 26, paddingEnd: 8, alignItems: 'center', justifyContent: 'space-between',
  },
  solid: { backgroundColor: colors.text },
  accent: { backgroundColor: colors.accent },
  ghost: { backgroundColor: colors.shell, borderWidth: 1, borderColor: colors.hairline },
  pressed: { transform: [{ scale: 0.98 }] },
  label: { fontSize: 18, lineHeight: 28, fontFamily: fonts.black },
  bubble: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(7,7,13,0.08)', alignItems: 'center', justifyContent: 'center' },
  bubbleGhost: { backgroundColor: 'rgba(255,255,255,0.08)' },
});
