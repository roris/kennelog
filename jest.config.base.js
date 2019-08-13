// ref: https://github.com/facebook/jest/issues/3112#issuecomment-398581705
module.exports = {
  roots: ['<rootDir>/src', '<rootDir>/test'],
  preset: 'ts-jest',
  testRegex: '\\.(test|spec)\\.(ts|js)$',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  collectCoverage: true,
  // coverageIgnorePatterns: ['(tests/.*.mock).(jsx?|tsx?)$'],
  collectCoverageFrom: [
    'src/**/*.{js,ts}',
    '!**/*.spec.{js,ts}',
    '!**/*.test.{js,ts}',
    '!**/node_modules/**',
    '!**/test/**'
  ],
  verbose: true,

  //
  globals: {
    'ts-jest': {
      diagnostics: false
      // extends: './babel.config.js'
    }
  }
};
