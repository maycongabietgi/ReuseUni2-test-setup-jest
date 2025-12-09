module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['./jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(' +
      '@react-native|' +
      'react-native|' +
      'react-native-linear-gradient|' +
      '@react-navigation/native|' +
      '@react-navigation/native-stack|' +
      'react-native-safe-area-context' +
    ')/)',
  ],
  moduleNameMapper: {
    '\\.(png|jpg|jpeg|gif)$': '<rootDir>/__mocks__/fileMock.js',
  },
};
