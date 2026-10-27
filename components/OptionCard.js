import { StyleSheet, View } from 'react-native';
import { colors, space } from '../theme';
import Bezel from './Bezel';
import Icon from './Icon';
import Illustration from './Illustration';
import Tap from './Tap';
import Txt from './Txt';

// A selectable double-bezel card for setup choices (mode, age group).
// With `art`, the card stacks: picture on top, then title and hint.
export default function OptionCard({ title, hint, art, selected, compact, onPress, dir }) {
  const check = (
    <View style={[styles.check, selected && styles.checkOn]}>
      {selected && <Icon name="check" size={14} color={colors.bg} strokeWidth={2.2} />}
    </View>
  );
  return (
    <Tap
      onPress={onPress}
      haptic="select"
      outer={styles.flex}
      accessibilityRole="radio"
      accessibilityLabel={hint ? `${title}, ${hint}` : title}
      accessibilityState={{ checked: selected }}
    >
      <Bezel radius={24} ring={selected ? colors.accent : undefined} coreStyle={art ? [styles.stack, compact && styles.stackCompact] : [styles.row, { flexDirection: dir.row }]}>
        {art ? (
          <>
            <View style={[styles.stackTop, { flexDirection: dir.row }]}>
              <Illustration name={art} size={compact ? 30 : 40} />
              {check}
            </View>
            <Txt variant="label" style={dir.text}>{title}</Txt>
            {hint && <Txt variant="caption" color="muted" style={[styles.hint, dir.text]}>{hint}</Txt>}
          </>
        ) : (
          <>
            <Txt variant="label" style={[styles.flex, dir.text]}>{title}</Txt>
            {check}
          </>
        )}
      </Bezel>
    </Tap>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  row: { minHeight: 58, alignItems: 'center', gap: space.md, paddingHorizontal: space.lg },
  stack: { padding: space.md, gap: space.xs },
  stackCompact: { padding: 10, gap: 0 },
  stackTop: { justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: space.xs },
  hint: { fontSize: 13, lineHeight: 20 },
  check: { width: 22, height: 22, borderRadius: 11, borderWidth: 1, borderColor: colors.hairline, alignItems: 'center', justifyContent: 'center' },
  checkOn: { backgroundColor: colors.accent, borderColor: colors.accent },
});
