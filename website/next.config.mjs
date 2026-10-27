// The game itself is the Expo app's web build, copied into public/play (see README.md).
// Next serves the home page; /play opens the game.
export default {
  async rewrites() {
    return [{ source: '/play', destination: '/play/index.html' }];
  },
};
