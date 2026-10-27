import { StyleSheet, Text } from 'react-native';
import { colors } from '../theme';

export default function ScoreBadge({ score }) {
  return <Text style={styles.badge}>Score {score}</Text>;
}

const styles = StyleSheet.create({
  badge: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    backgroundColor: '#1C4232',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    overflow: 'hidden',
  },
});
