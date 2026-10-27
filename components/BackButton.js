import { StyleSheet } from 'react-native';
import { colors, radius } from '../theme';
import Icon from './Icon';
import Tap from './Tap';

// Round glass "back" button. The arrow points toward where reading starts (right in Arabic, left in English).
export default function BackButton({ onPress, label, dir }) {
  return (
    <Tap onPress={onPress} haptic="tap" hitSlop={4} accessibilityRole="button" accessibilityLabel={label} style={styles.btn}>
      <Icon name="chevron" size={20} strokeWidth={2.2} color={colors.text} flip={!dir.rtl} />
    </Tap>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: 44, height: 44, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.shell, borderWidth: 1, borderColor: colors.hairline,
  },
});
