import { useEffect, useRef } from 'react';
import { Animated, Dimensions, Easing, StyleSheet, View } from 'react-native';

const COLORS = ['#B7F34A', '#FFC857', '#3FB6FF', '#FF6B8B', '#8B7CFF', '#2ED47A'];
const { width, height } = Dimensions.get('window');

// ponytail: 40 Animated.Views is plenty for one burst; switch to a canvas lib if we ever need hundreds.
const PIECES = Array.from({ length: 40 }, (_, i) => ({
  x: Math.random() * width,
  size: 6 + Math.random() * 8,
  color: COLORS[i % COLORS.length],
  delay: Math.random() * 600,
  duration: 2200 + Math.random() * 1600,
  drift: (Math.random() - 0.5) * 120,
  spin: (Math.random() > 0.5 ? 1 : -1) * (360 + Math.random() * 540),
}));

function Piece({ p }) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(v, { toValue: 1, duration: p.duration, delay: p.delay, easing: Easing.in(Easing.quad), useNativeDriver: true }).start();
  }, []);
  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: p.x,
        top: -20,
        width: p.size,
        height: p.size * 1.6,
        borderRadius: 2,
        backgroundColor: p.color,
        opacity: v.interpolate({ inputRange: [0, 0.85, 1], outputRange: [1, 1, 0] }),
        transform: [
          { translateY: v.interpolate({ inputRange: [0, 1], outputRange: [0, height + 40] }) },
          { translateX: v.interpolate({ inputRange: [0, 1], outputRange: [0, p.drift] }) },
          { rotate: v.interpolate({ inputRange: [0, 1], outputRange: ['0deg', `${p.spin}deg`] }) },
        ],
      }}
    />
  );
}

export default function Confetti() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {PIECES.map((p, i) => <Piece key={i} p={p} />)}
    </View>
  );
}
