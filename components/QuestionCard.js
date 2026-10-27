import { StyleSheet, View } from 'react-native';
import { colors, radius, space } from '../theme';
import Bezel from './Bezel';
import Illustration from './Illustration';
import { Float } from './Motion';
import Txt from './Txt';

// The question in a double-bezel card. `note` shows a helper message (two tries, pit, call a friend).
export default function QuestionCard({ category, question, points, ptsLabel, note, compact, large, dir, lang }) {
  return (
    <Bezel radius={30} coreStyle={[styles.core, compact && styles.coreCompact]}>
      <View style={[styles.top, { flexDirection: dir.row }]}>
        <Float amount={4}>
          <Illustration name={category.art} size={compact ? 40 : 48} />
        </Float>
        <Txt variant="callout" color={category.color} style={[styles.flex, dir.text]}>{category.name[lang]}</Txt>
        <View style={styles.points}>
          <Txt variant="points" color="gold" maxFontSizeMultiplier={1.3}>{points} {ptsLabel}</Txt>
        </View>
      </View>
      <Txt variant={compact ? 'questionCompact' : large ? 'questionLarge' : 'question'} style={dir.text}>{question}</Txt>
      {!!note && <Txt variant="caption" color="gold" style={dir.text} accessibilityLiveRegion="polite">{note}</Txt>}
    </Bezel>
  );
}

const styles = StyleSheet.create({
  core: { padding: space.lg + 2, gap: space.md + 2 },
  coreCompact: { padding: space.md + 2, gap: space.sm },
  top: { alignItems: 'center', gap: space.md },
  flex: { flex: 1 },
  points: {
    borderRadius: radius.full, paddingHorizontal: space.md, paddingVertical: 3,
    backgroundColor: 'rgba(255,209,102,0.12)', borderWidth: 1, borderColor: 'rgba(255,209,102,0.35)',
  },
});
