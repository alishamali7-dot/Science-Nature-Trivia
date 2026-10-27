import { StyleSheet, View } from 'react-native';
import { colors, fonts, radius } from '../theme';
import Tap from './Tap';
import Txt from './Txt';

const OPTIONS = [
  { code: 'ar', label: 'عربي', name: 'عربي' },
  { code: 'en', label: 'EN', name: 'English' },
];

// Small glass segmented control to switch language.
export default function LangToggle({ lang, onChange }) {
  return (
    <View style={styles.wrap} accessibilityRole="radiogroup">
      {OPTIONS.map((o) => {
        const on = o.code === lang;
        return (
          <Tap
            key={o.code}
            onPress={() => onChange(o.code)}
            haptic={on ? undefined : 'select'}
            accessibilityRole="radio"
            accessibilityLabel={o.name}
            accessibilityState={{ checked: on }}
            style={[styles.option, on && styles.on]}
          >
            <Txt variant="caption" color={on ? 'bg' : 'muted'} style={styles.bold} maxFontSizeMultiplier={1.3}>{o.label}</Txt>
          </Tap>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', backgroundColor: colors.shell, borderWidth: 1, borderColor: colors.hairline, borderRadius: radius.full, padding: 3, gap: 2 },
  option: { minHeight: 40, minWidth: 52, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12 },
  on: { backgroundColor: colors.text },
  bold: { fontFamily: fonts.bold },
});
