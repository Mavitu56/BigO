module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [['module:react-native-dotenv', {
          moduleName: '@env',
          path: '.env',
          safe: false,
          allowUndefined: true,
        }],
    ['react-native-worklets-core/plugin'],
    'react-native-reanimated/plugin', // sempre por último
  ],
};