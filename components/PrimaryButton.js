import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, fonts } from '../theme';

export default function PrimaryButton({ label, onPress, light }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [styles.button, light && styles.light, pressed && styles.pressed]}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { height: 60, borderRadius: 18, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  light: { backgroundColor: colors.text },
  pressed: { transform: [{ scale: 0.98 }], opacity: 0.9 },
  label: { color: colors.bg, fontSize: 19, fontFamily: fonts.black },
});
