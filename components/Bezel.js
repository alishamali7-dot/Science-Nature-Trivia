import { StyleSheet, View } from 'react-native';
import { colors } from '../theme';

// Double-bezel card: a faint glass frame holding a darker inner panel with
// concentric corners and a light top edge, like a plate set in a tray.
export default function Bezel({ radius = 28, pad = 5, ring, style, coreStyle, children, ...rest }) {
  return (
    <View
      {...rest}
      style={[styles.shell, { borderRadius: radius, padding: pad }, ring && { borderColor: ring, backgroundColor: `${ring}1F` }, style]}
    >
      <View style={[styles.core, { borderRadius: radius - pad }, coreStyle]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: { backgroundColor: colors.shell, borderWidth: 1, borderColor: colors.hairline },
  core: { flexGrow: 1, backgroundColor: colors.core, borderTopWidth: 1, borderTopColor: colors.highlight },
});
