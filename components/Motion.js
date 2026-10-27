import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

// Fades and slides children in when they mount. Use `delay` to stagger a list.
export function FadeIn({ delay = 0, from = 18, style, children }) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(v, { toValue: 1, duration: 420, delay, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
  }, []);
  const translateY = v.interpolate({ inputRange: [0, 1], outputRange: [from, 0] });
  return <Animated.View style={[style, { opacity: v, transform: [{ translateY }] }]}>{children}</Animated.View>;
}

// Gentle up-and-down loop for illustrations.
export function Float({ amount = 8, duration = 2600, children }) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(v, { toValue: 1, duration, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(v, { toValue: 0, duration, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, []);
  const translateY = v.interpolate({ inputRange: [0, 1], outputRange: [0, -amount] });
  return <Animated.View style={{ transform: [{ translateY }] }}>{children}</Animated.View>;
}

// Springy scale bump every time `trigger` changes (skips the first render).
export function usePop(trigger) {
  const scale = useRef(new Animated.Value(1)).current;
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    scale.setValue(1.12);
    Animated.spring(scale, { toValue: 1, friction: 4, tension: 160, useNativeDriver: true }).start();
  }, [trigger]);
  return scale;
}

// Short horizontal shake when `active` turns true.
export function useShake(active) {
  const x = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!active) return;
    Animated.sequence(
      [10, -10, 7, -7, 3, 0].map((toValue) => Animated.timing(x, { toValue, duration: 50, useNativeDriver: true })),
    ).start();
  }, [active]);
  return x;
}
