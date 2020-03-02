const base = require('../../jest.config.base');
const package = require('./package');

module.exports = {
  ...base,
  name: package.name,
  displayName: package.name,
  transform: {
    '^.+\\.(css|less|sass|scss|styl|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      'jest-transform-stub'
  },
  modulePaths: ['<rootDir>/src', '<rootDir>/node_modules'],
  setupFiles: ['<rootDir>/test/jest-pretest.ts'],
  globals: {
    'ts-jest': {
      diagnostics: false,
      packageJson: 'package.json'
    }
  }
};
