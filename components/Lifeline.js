import { StyleSheet } from 'react-native';
import { colors, fonts, radius, space } from '../theme';
import Icon from './Icon';
import Tap from './Tap';
import Txt from './Txt';

// A once-per-team helper: a small gold pill with a thin icon.
export default function Lifeline({ label, icon, used, usedLabel, disabled, compact, onPress, dir }) {
  const off = used || disabled;
  return (
    <Tap
      onPress={onPress}
      haptic="select"
      disabled={off}
      outer={[styles.outer, compact && styles.outerCompact]}
      accessibilityRole="button"
      accessibilityLabel={used ? `${label}, ${usedLabel}` : label}
      accessibilityState={{ disabled: off }}
      style={[styles.btn, compact && styles.compact, { flexDirection: compact ? 'column' : dir.row }, off && styles.off]}
    >
      <Icon name={icon} size={compact ? 16 : 18} color={off ? colors.muted : colors.gold} />
      <Txt
        variant={compact ? 'micro' : 'caption'}
        color={off ? 'muted' : 'gold'}
        style={[styles.label, used && styles.struck]}
        numberOfLines={1}
        maxFontSizeMultiplier={1.3}
      >
        {label}
      </Txt>
    </Tap>
  );
}

const styles = StyleSheet.create({
  outer: { flexBasis: '46%', flexGrow: 1 },
  outerCompact: { flexBasis: '22%' },
  btn: {
    minHeight: 48, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center', gap: space.sm, paddingHorizontal: 10,
    backgroundColor: 'rgba(255,209,102,0.07)', borderWidth: 1, borderColor: 'rgba(255,209,102,0.32)',
  },
  compact: { minHeight: 52, borderRadius: 18, borderCurve: 'continuous', gap: 2, paddingHorizontal: 2 },
  off: { backgroundColor: colors.shell, borderColor: colors.hairline },
  label: { fontFamily: fonts.bold },
  struck: { textDecorationLine: 'line-through' },
});
