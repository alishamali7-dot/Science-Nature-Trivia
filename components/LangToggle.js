import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../theme';

const OPTIONS = [
  { code: 'ar', label: 'عربي' },
  { code: 'en', label: 'English' },
];

export default function LangToggle({ lang, onChange }) {
  return (
    <View style={styles.wrap}>
      {OPTIONS.map((o) => {
        const on = o.code === lang;
        return (
          <Pressable
            key={o.code}
            onPress={() => onChange(o.code)}
            accessibilityRole="button"
            accessibilityState={{ selected: on }}
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
  wrap: { flexDirection: 'row', backgroundColor: colors.card, borderRadius: 999, padding: 4, gap: 4 },
  option: { minHeight: 40, minWidth: 72, borderRadius: 999, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12 },
  on: { backgroundColor: colors.accent },
  label: { color: colors.soft, fontSize: 15, fontFamily: fonts.bold },
  labelOn: { color: colors.bg },
});
