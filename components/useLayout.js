import { useWindowDimensions } from 'react-native';

// Screen classes: `short` phones (iPhone SE) get compact sizes; `wide` screens (tablets)
// get a centered content column and large board cards: 2 per row standing up, 3 lying down.
export default function useLayout() {
  const { width, height } = useWindowDimensions();
  const wide = width >= 700;
  return {
    width,
    height,
    short: height < 760,
    wide,
    column: wide ? 560 : undefined,
    boardColumns: wide && width > height ? 3 : 2,
  };
}
