import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { colors, radius, space } from '../theme';
import Icon from './Icon';
import { usePop, useShake } from './Motion';
import Tap from './Tap';
import Txt from './Txt';

// One answer: a row with its letter (أ ب ج د / A B C D) in a nested circle.
// state: 'idle' | 'correct' | 'wrong'. `removed` = taken out by 50/50.
export default function AnswerButton({ label, letter, state = 'idle', removed, disabled, compact, onPress, dir }) {
  const pop = usePop(state === 'correct');
  const shake = useShake(state === 'wrong');
  const ink = state === 'correct' ? colors.rightInk : state === 'wrong' ? colors.wrongText : colors.text;
  const off = disabled || removed;
  return (
    <Animated.View style={[state === 'correct' ? pop : shake, removed && styles.removed]}>
      <Tap
        onPress={onPress}
        disabled={off}
        accessibilityRole="button"
        accessibilityLabel={`${letter} ${label}`}
        accessibilityState={{ disabled: off }}
        style={[styles.row, compact && styles.compact, styles[state], { flexDirection: dir.row }]}
      >
        <View style={[styles.badge, state !== 'idle' && styles.badgeOn]}>
          {state === 'idle' ? (
            <Txt variant="callout" color="muted">{letter}</Txt>
          ) : (
            <Icon name={state === 'correct' ? 'check' : 'close'} size={16} color={ink} strokeWidth={2} />
          )}
        </View>
        <Txt variant="label" color={ink} style={[styles.label, dir.text, removed && styles.struck]}>{label}</Txt>
      </Tap>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 58, borderRadius: radius.md, borderCurve: 'continuous', borderWidth: 1,
    paddingStart: space.sm, paddingEnd: space.lg, paddingVertical: space.xs, alignItems: 'center', gap: space.md,
  },
  compact: { minHeight: 50 },
  idle: { backgroundColor: colors.core, borderColor: colors.hairline, borderTopColor: colors.highlight },
  correct: { backgroundColor: colors.right, borderColor: colors.right },
  wrong: { backgroundColor: colors.wrongBg, borderColor: colors.wrong },
  removed: { opacity: 0.22 },
  badge: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.06)' },
  badgeOn: { backgroundColor: 'rgba(255,255,255,0.22)' },
  label: { flex: 1 },
  struck: { textDecorationLine: 'line-through' },
});
