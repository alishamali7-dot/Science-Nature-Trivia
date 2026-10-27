import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, fonts } from '../theme';

// A once-per-team helper button (50/50, double points).
export default function Lifeline({ label, used, usedLabel, disabled, compact, onPress }) {
  const off = used || disabled;
  return (
    <Pressable
      onPress={onPress}
      disabled={off}
      accessibilityRole="button"
      accessibilityState={{ disabled: off }}
      style={({ pressed }) => [styles.btn, compact && styles.compact, off && styles.off, pressed && styles.pressed]}
    >
      <Text style={[styles.label, compact && styles.labelCompact, off && styles.labelOff, used && styles.struck]} accessibilityLabel={used ? `${label}, ${usedLabel}` : label}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: { flexBasis: '46%', flexGrow: 1, minHeight: 46, borderRadius: 14, borderWidth: 2, borderColor: colors.gold, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8 },
  compact: { flexBasis: '22%', minHeight: 44, paddingHorizontal: 2 },
  off: { borderColor: colors.line },
  pressed: { backgroundColor: '#2A2410' },
  label: { color: colors.gold, fontSize: 15, lineHeight: 22, fontFamily: fonts.bold },
  labelCompact: { fontSize: 13, lineHeight: 20, textAlign: 'center' },
  labelOff: { color: colors.muted },
  struck: { textDecorationLine: 'line-through' },
});
