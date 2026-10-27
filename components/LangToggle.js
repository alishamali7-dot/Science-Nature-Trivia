import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../theme';

const OPTIONS = [
  { code: 'ar', label: 'عربي' },
  { code: 'en', label: 'EN' },
];

// Small glass pill to switch language.
export default function LangToggle({ lang, onChange }) {
  return (
    <View style={styles.wrap} accessibilityRole="radiogroup">
      {OPTIONS.map((o) => {
        const on = o.code === lang;
        return (
          <Pressable
            key={o.code}
            onPress={() => onChange(o.code)}
            accessibilityRole="radio"
            accessibilityLabel={o.code === 'en' ? 'English' : 'عربي'}
            accessibilityState={{ checked: on }}
            style={[styles.option, on && styles.on]}
          >
            <Text style={[styles.label, on && styles.labelOn]}>{o.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', backgroundColor: colors.shell, borderWidth: 1, borderColor: colors.hairline, borderRadius: 999, padding: 3, gap: 2 },
  option: { minHeight: 38, minWidth: 52, borderRadius: 999, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12 },
  on: { backgroundColor: colors.text },
  label: { color: colors.muted, fontSize: 14, fontFamily: fonts.bold },
  labelOn: { color: colors.bg },
});
