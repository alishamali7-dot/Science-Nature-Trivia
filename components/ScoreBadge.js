import { StyleSheet, Text } from 'react-native';
import { colors, fonts } from '../theme';

export default function ScoreBadge({ score, label }) {
  return <Text style={styles.badge}>{score} {label}</Text>;
}

const styles = StyleSheet.create({
  badge: {
    color: colors.gold, backgroundColor: colors.chip, fontSize: 16, fontFamily: fonts.black,
    paddingVertical: 4, paddingHorizontal: 14, borderRadius: 999, overflow: 'hidden',
  },
});
