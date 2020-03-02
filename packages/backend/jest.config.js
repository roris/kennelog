const base = require('../../jest.config.base');
const package = require('./package');

module.exports = {
  ...base,
  name: package.name,
  displayName: package.name,
  transformIgnorePatterns: ['node_modules/?!@tensorflow/'],
  globals: {
    'ts-jest': {
      diagnostics: false,
      packageJson: 'package.json'
    }
  }
};
