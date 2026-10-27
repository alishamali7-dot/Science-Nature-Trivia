import { Animated, Pressable, StyleSheet, Text } from 'react-native';
import { colors, fonts } from '../theme';
import { usePop, useShake } from './Motion';

// state: 'idle' | 'correct' | 'wrong'. `removed` = taken out by 50/50.
export default function AnswerButton({ label, state = 'idle', removed, disabled, compact, onPress, dir }) {
  const scale = usePop(state === 'correct');
  const shakeX = useShake(state === 'wrong');
  return (
    <Animated.View style={{ transform: [{ scale }, { translateX: shakeX }], opacity: removed ? 0.25 : 1 }}>
      <Pressable
        onPress={onPress}
        disabled={disabled || removed}
        accessibilityRole="button"
        accessibilityState={{ disabled: disabled || removed }}
        style={({ pressed }) => [styles.button, compact && styles.compact, styles[state], pressed && styles.pressed]}
      >
        <Text style={[styles.label, dir.text, state === 'correct' && styles.dark, state === 'wrong' && styles.wrongText, removed && styles.struck]}>
          {state === 'correct' ? '✓  ' : state === 'wrong' ? '✗  ' : ''}
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: { minHeight: 58, borderRadius: 18, borderWidth: 2, paddingHorizontal: 20, justifyContent: 'center' },
  compact: { minHeight: 48 },
  idle: { backgroundColor: colors.card, borderColor: colors.line },
  correct: { backgroundColor: colors.accent, borderColor: colors.accent },
  wrong: { backgroundColor: colors.wrongBg, borderColor: colors.wrong },
  pressed: { transform: [{ scale: 0.98 }], opacity: 0.85 },
  label: { color: colors.text, fontSize: 18, lineHeight: 30, fontFamily: fonts.bold },
  dark: { color: colors.bg },
  wrongText: { color: colors.wrongText },
  struck: { textDecorationLine: 'line-through' },
});
