import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, fonts } from '../theme';

// state: 'idle' | 'correct' | 'wrong'
export default function AnswerButton({ label, state = 'idle', disabled, onPress, dir }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      style={({ pressed }) => [styles.button, styles[state], pressed && styles.pressed]}
    >
      <Text style={[styles.label, dir.text, state === 'correct' && styles.dark, state === 'wrong' && styles.wrongText]}>
        {state === 'correct' ? '✓  ' : state === 'wrong' ? '✗  ' : ''}
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { minHeight: 60, borderRadius: 18, borderWidth: 2, paddingHorizontal: 20, justifyContent: 'center' },
  idle: { backgroundColor: colors.card, borderColor: colors.line },
  correct: { backgroundColor: colors.accent, borderColor: colors.accent },
  wrong: { backgroundColor: colors.wrongBg, borderColor: colors.wrong },
  pressed: { transform: [{ scale: 0.98 }], opacity: 0.85 },
  label: { color: colors.text, fontSize: 18, lineHeight: 28, fontFamily: fonts.bold },
  dark: { color: colors.bg },
  wrongText: { color: colors.wrongText },
});
