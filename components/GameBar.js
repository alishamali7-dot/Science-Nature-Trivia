import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../theme';
import Icon from './Icon';

// Floating glass island with Undo and Restart. Restart asks once ("Sure?") before wiping the game.
export default function GameBar({ canUndo, onUndo, onRestart, t, dir }) {
  const [confirm, setConfirm] = useState(false);

  if (confirm) {
    return (
      <View style={[styles.island, { flexDirection: dir.row }]}>
        <Text style={styles.ask}>{t.sure}</Text>
        <Pressable
          onPress={() => { setConfirm(false); onRestart(); }}
          accessibilityRole="button"
          accessibilityLabel={`${t.restart}: ${t.yes}`}
          style={({ pressed }) => [styles.round, styles.yes, pressed && styles.pressed]}
        >
          <Icon name="check" size={18} color={colors.bg} />
        </Pressable>
        <Pressable
          onPress={() => setConfirm(false)}
          accessibilityRole="button"
          accessibilityLabel={t.no}
          style={({ pressed }) => [styles.round, pressed && styles.pressed]}
        >
          <Icon name="close" size={18} color={colors.text} />
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.island, { flexDirection: dir.row }]}>
      <Pressable
        onPress={onUndo}
        disabled={!canUndo}
        accessibilityRole="button"
        accessibilityLabel={t.undo}
        accessibilityState={{ disabled: !canUndo }}
        style={({ pressed }) => [styles.action, { flexDirection: dir.row }, !canUndo && styles.off, pressed && styles.pressed]}
      >
        <Icon name="undo" size={18} color={colors.text} flip={dir.rtl} />
        <Text style={styles.label}>{t.undo}</Text>
      </Pressable>
      <View style={styles.divider} />
      <Pressable
        onPress={() => setConfirm(true)}
        accessibilityRole="button"
        accessibilityLabel={t.restart}
        style={({ pressed }) => [styles.action, { flexDirection: dir.row }, pressed && styles.pressed]}
      >
        <Icon name="restart" size={18} color={colors.text} />
        <Text style={styles.label}>{t.restartShort}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  island: {
    alignItems: 'center', gap: 4, padding: 3, borderRadius: 999,
    backgroundColor: colors.shell, borderWidth: 1, borderColor: colors.hairline,
  },
  action: { minHeight: 38, alignItems: 'center', gap: 6, paddingHorizontal: 12, borderRadius: 999 },
  off: { opacity: 0.35 },
  pressed: { backgroundColor: 'rgba(255,255,255,0.08)', transform: [{ scale: 0.97 }] },
  label: { color: colors.text, fontSize: 14, lineHeight: 22, fontFamily: fonts.bold },
  divider: { width: 1, height: 18, backgroundColor: colors.hairline },
  ask: { color: colors.text, fontSize: 14, lineHeight: 22, fontFamily: fonts.bold, paddingHorizontal: 10 },
  round: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.08)' },
  yes: { backgroundColor: colors.right },
});
