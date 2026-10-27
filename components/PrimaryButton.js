import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, fonts } from '../theme';

// variant: 'accent' (default) | 'light' | 'ghost'
export default function PrimaryButton({ label, onPress, variant = 'accent' }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [styles.button, styles[variant], pressed && styles.pressed]}
    >
      <Text style={[styles.label, variant === 'ghost' && styles.ghostLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { height: 60, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  accent: { backgroundColor: colors.accent },
  light: { backgroundColor: colors.text },
  ghost: { borderWidth: 2, borderColor: colors.line },
  pressed: { transform: [{ scale: 0.98 }], opacity: 0.9 },
  label: { color: colors.bg, fontSize: 19, lineHeight: 28, fontFamily: fonts.black },
  ghostLabel: { color: colors.text },
});
