import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, fonts, radius, space } from '../theme';
import Icon from './Icon';
import Tap from './Tap';
import Txt from './Txt';

// Glass island with Undo and Restart. Restart asks once ("Sure?") before wiping the game.
export default function GameBar({ canUndo, onUndo, onRestart, t, dir }) {
  const [confirm, setConfirm] = useState(false);

  if (confirm) {
    return (
      <View style={[styles.island, { flexDirection: dir.row }]}>
        <Txt variant="caption" style={styles.ask} accessibilityLiveRegion="polite">{t.sure}</Txt>
        <Tap
          onPress={() => { setConfirm(false); onRestart(); }}
          haptic="heavy"
          accessibilityRole="button"
          accessibilityLabel={`${t.restart}: ${t.yes}`}
          style={[styles.round, styles.yes]}
        >
          <Icon name="check" size={18} color={colors.bg} />
        </Tap>
        <Tap onPress={() => setConfirm(false)} accessibilityRole="button" accessibilityLabel={t.no} style={styles.round}>
          <Icon name="close" size={18} color={colors.text} />
        </Tap>
      </View>
    );
  }

  return (
    <View style={[styles.island, { flexDirection: dir.row }]}>
      <Tap
        onPress={onUndo}
        haptic="tap"
        disabled={!canUndo}
        accessibilityRole="button"
        accessibilityLabel={t.undo}
        accessibilityState={{ disabled: !canUndo }}
        style={[styles.action, { flexDirection: dir.row }, !canUndo && styles.off]}
      >
        <Icon name="undo" size={18} color={colors.text} flip={dir.rtl} />
        <Txt variant="caption" style={styles.bold} maxFontSizeMultiplier={1.3}>{t.undo}</Txt>
      </Tap>
      <View style={styles.divider} />
      <Tap
        onPress={() => setConfirm(true)}
        accessibilityRole="button"
        accessibilityLabel={t.restart}
        style={[styles.action, { flexDirection: dir.row }]}
      >
        <Icon name="restart" size={18} color={colors.text} />
        <Txt variant="caption" style={styles.bold} maxFontSizeMultiplier={1.3}>{t.restartShort}</Txt>
      </Tap>
    </View>
  );
}

const styles = StyleSheet.create({
  island: {
    alignItems: 'center', gap: space.xs, padding: 3, borderRadius: radius.full,
    backgroundColor: colors.shell, borderWidth: 1, borderColor: colors.hairline,
  },
  action: { minHeight: 40, alignItems: 'center', gap: 6, paddingHorizontal: space.md, borderRadius: radius.full },
  off: { opacity: 0.35 },
  bold: { fontFamily: fonts.bold },
  divider: { width: 1, height: 18, backgroundColor: colors.hairline },
  ask: { fontFamily: fonts.bold, paddingHorizontal: 10 },
  round: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.08)' },
  yes: { backgroundColor: colors.right },
});
