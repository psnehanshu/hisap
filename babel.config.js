module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Inline Drizzle's .sql migration files as strings.
      ['inline-import', { extensions: ['.sql'] }],
      // Reanimated/worklets must stay last.
      'react-native-worklets/plugin',
    ],
  };
};
