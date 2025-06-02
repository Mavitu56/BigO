module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    ['react-native-worklets-core/plugin'],
    'react-native-reanimated/plugin', // sempre por último
  ],
};