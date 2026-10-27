import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../theme';
import Bezel from './Bezel';
import Icon from './Icon';
import Illustration from './Illustration';

// A selectable double-bezel card for setup choices (mode, age group).
// With `art`, the card stacks: picture on top, then title and hint.
export default function OptionCard({ title, hint, art, selected, compact, onPress, dir }) {
  const check = (
    <View style={[styles.check, selected && styles.checkOn]}>
      {selected && <Icon name="check" size={14} color={colors.bg} strokeWidth={2.2} />}
    </View>
  );
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      style={({ pressed }) => [styles.flex, pressed && styles.pressed]}
    >
      <Bezel radius={24} ring={selected ? colors.accent : undefined} coreStyle={art ? [styles.stack, compact && styles.stackCompact] : [styles.row, { flexDirection: dir.row }]}>
        {art ? (
          <>
            <View style={[styles.stackTop, { flexDirection: dir.row }]}>
              <Illustration name={art} size={compact ? 30 : 40} />
              {check}
            </View>
            <Text style={[styles.title, dir.text]}>{title}</Text>
            {hint && <Text style={[styles.hint, dir.text]}>{hint}</Text>}
          </>
        ) : (
          <>
            <Text style={[styles.title, styles.flex, dir.text]}>{title}</Text>
            {check}
          </>
        )}
      </Bezel>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  pressed: { transform: [{ scale: 0.98 }] },
  row: { minHeight: 58, alignItems: 'center', gap: 10, paddingHorizontal: 14 },
  stack: { padding: 12, gap: 4 },
  stackCompact: { padding: 10, gap: 0 },
  stackTop: { justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  title: { color: colors.text, fontSize: 17, lineHeight: 26, fontFamily: fonts.bold },
  hint: { color: colors.muted, fontSize: 13, lineHeight: 20, fontFamily: fonts.regular },
  check: { width: 22, height: 22, borderRadius: 11, borderWidth: 1, borderColor: colors.hairline, alignItems: 'center', justifyContent: 'center' },
  checkOn: { backgroundColor: colors.accent, borderColor: colors.accent },
});
