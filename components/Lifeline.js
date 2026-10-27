import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, fonts } from '../theme';
import Icon from './Icon';

// A once-per-team helper as a small glass pill with a thin icon.
export default function Lifeline({ label, icon, used, usedLabel, disabled, compact, onPress, dir }) {
  const off = used || disabled;
  return (
    <Pressable
      onPress={onPress}
      disabled={off}
      accessibilityRole="button"
      accessibilityLabel={used ? `${label}, ${usedLabel}` : label}
      accessibilityState={{ disabled: off }}
      style={({ pressed }) => [styles.btn, compact && styles.compact, { flexDirection: compact ? 'column' : dir.row }, off && styles.off, pressed && styles.pressed]}
    >
      <Icon name={icon} size={compact ? 16 : 18} color={off ? colors.muted : colors.gold} />
      <Text style={[styles.label, compact && styles.labelCompact, off && styles.labelOff, used && styles.struck]} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexBasis: '46%', flexGrow: 1, minHeight: 48, borderRadius: 999, alignItems: 'center', justifyContent: 'center', gap: 8, paddingHorizontal: 10,
    backgroundColor: 'rgba(255,209,102,0.07)', borderWidth: 1, borderColor: 'rgba(255,209,102,0.32)',
  },
  compact: { flexBasis: '22%', minHeight: 52, borderRadius: 18, gap: 2, paddingHorizontal: 2 },
  off: { backgroundColor: colors.shell, borderColor: colors.hairline },
  pressed: { transform: [{ scale: 0.97 }], backgroundColor: 'rgba(255,209,102,0.16)' },
  label: { color: colors.gold, fontSize: 14, lineHeight: 22, fontFamily: fonts.bold },
  labelCompact: { fontSize: 12, lineHeight: 18 },
  labelOff: { color: colors.muted },
  struck: { textDecorationLine: 'line-through' },
});
