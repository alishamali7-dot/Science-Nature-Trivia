import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, fonts } from '../theme';

// A once-per-team helper button (50/50, double points).
export default function Lifeline({ label, used, usedLabel, disabled, onPress }) {
  const off = used || disabled;
  return (
    <Pressable
      onPress={onPress}
      disabled={off}
      accessibilityRole="button"
      accessibilityState={{ disabled: off }}
      style={({ pressed }) => [styles.btn, off && styles.off, pressed && styles.pressed]}
    >
      <Text style={[styles.label, off && styles.labelOff, used && styles.struck]} accessibilityLabel={used ? `${label}, ${usedLabel}` : label}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: { flex: 1, minHeight: 46, borderRadius: 14, borderWidth: 2, borderColor: colors.gold, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8 },
  off: { borderColor: colors.line },
  pressed: { backgroundColor: '#2A2410' },
  label: { color: colors.gold, fontSize: 15, lineHeight: 22, fontFamily: fonts.bold },
  labelOff: { color: colors.muted },
  struck: { textDecorationLine: 'line-through' },
});
