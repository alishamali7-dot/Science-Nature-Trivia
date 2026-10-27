import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../theme';
import Icon from './Icon';
import { usePop, useShake } from './Motion';

// One answer: a glass pill with its letter (أ ب ج د / A B C D) in a nested circle.
// state: 'idle' | 'correct' | 'wrong'. `removed` = taken out by 50/50.
export default function AnswerButton({ label, letter, state = 'idle', removed, disabled, compact, onPress, dir }) {
  const scale = usePop(state === 'correct');
  const shakeX = useShake(state === 'wrong');
  const ink = state === 'correct' ? colors.rightInk : state === 'wrong' ? colors.wrongText : colors.text;
  return (
    <Animated.View style={{ transform: [{ scale }, { translateX: shakeX }], opacity: removed ? 0.22 : 1 }}>
      <Pressable
        onPress={onPress}
        disabled={disabled || removed}
        accessibilityRole="button"
        accessibilityLabel={`${letter} ${label}`}
        accessibilityState={{ disabled: disabled || removed }}
        style={({ pressed }) => [
          styles.button,
          compact && styles.compact,
          styles[state],
          { flexDirection: dir.row },
          pressed && styles.pressed,
        ]}
      >
        <View style={[styles.badge, state !== 'idle' && styles.badgeOn]}>
          {state === 'idle' ? (
            <Text style={styles.letter}>{letter}</Text>
          ) : (
            <Icon name={state === 'correct' ? 'check' : 'close'} size={16} color={ink} strokeWidth={2} />
          )}
        </View>
        <Text style={[styles.label, dir.text, { color: ink }, removed && styles.struck]}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 58, borderRadius: 22, borderWidth: 1, paddingStart: 8, paddingEnd: 18, alignItems: 'center', gap: 12,
  },
  compact: { minHeight: 50 },
  idle: { backgroundColor: colors.core, borderColor: colors.hairline, borderTopColor: colors.highlight },
  correct: { backgroundColor: colors.right, borderColor: colors.right },
  wrong: { backgroundColor: colors.wrongBg, borderColor: colors.wrong },
  pressed: { transform: [{ scale: 0.98 }], backgroundColor: '#191927' },
  badge: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.06)' },
  badgeOn: { backgroundColor: 'rgba(255,255,255,0.22)' },
  letter: { color: colors.muted, fontSize: 15, lineHeight: 22, fontFamily: fonts.bold },
  label: { flex: 1, fontSize: 18, lineHeight: 28, fontFamily: fonts.bold },
  struck: { textDecorationLine: 'line-through' },
});
