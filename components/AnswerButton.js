import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../theme';

// state: 'idle' | 'correct' | 'wrong'
export default function AnswerButton({ label, state = 'idle', disabled, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      style={({ pressed }) => [styles.button, styles[state], pressed && styles.pressed]}
    >
      <Text style={[styles.label, state === 'correct' && styles.labelDark]}>
        {state === 'correct' ? '✓  ' : state === 'wrong' ? '✗  ' : ''}
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 60,
    borderRadius: 16,
    borderWidth: 2,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  idle: { backgroundColor: colors.card, borderColor: colors.line },
  correct: { backgroundColor: colors.accent, borderColor: colors.accent },
  wrong: { backgroundColor: colors.wrongBg, borderColor: colors.wrong },
  pressed: { opacity: 0.7 },
  label: { color: colors.text, fontSize: 18, fontWeight: '600' },
  labelDark: { color: colors.bg },
});
