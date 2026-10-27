// app.json holds the settings; this only adds the website path when building the web version
// for the Next.js site (EXPO_BASE_URL=/play), so the phone app and local dev are unchanged.
export default ({ config }) => ({
  ...config,
  experiments: { ...config.experiments, baseUrl: process.env.EXPO_BASE_URL || undefined },
});
