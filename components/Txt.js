import { Text } from 'react-native';
import { colors, type } from '../theme';

// The one text component: a named style from `type`, a color from `colors` (or a raw value).
export default function Txt({ variant = 'body', color = 'text', style, ...props }) {
  return <Text style={[type[variant], { color: colors[color] || color }, style]} {...props} />;
}
