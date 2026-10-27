import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../theme';
import Illustration from './Illustration';

// A big selectable card for setup choices (mode, age group).
export default function OptionCard({ title, hint, art, selected, onPress, dir }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      style={({ pressed }) => [styles.card, selected && styles.on, pressed && styles.pressed]}
    >
      <View style={[styles.inner, { flexDirection: dir.row }]}>
        {art && <Illustration name={art} size={40} />}
        <View style={styles.text}>
          <Text style={[styles.title, dir.text, selected && styles.titleOn]}>{title}</Text>
          {hint && <Text style={[styles.hint, dir.text]}>{hint}</Text>}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, minHeight: 64, borderRadius: 18, borderWidth: 2, borderColor: colors.line, backgroundColor: colors.card, padding: 14, justifyContent: 'center' },
  on: { borderColor: colors.accent, backgroundColor: '#1B2A1F' },
  pressed: { transform: [{ scale: 0.98 }] },
  inner: { alignItems: 'center', gap: 10 },
  text: { flex: 1 },
  title: { color: colors.text, fontSize: 17, lineHeight: 26, fontFamily: fonts.bold },
  titleOn: { color: colors.accent },
  hint: { color: colors.muted, fontSize: 13, lineHeight: 20, fontFamily: fonts.regular },
});
