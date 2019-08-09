module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,ts}',
    '!**/*.test.{js,ts}',
    '!**/node_modules/**',
    '!**/test/**'
  ],
  coverageDirectory: '<rootDir>/test/coverage',
  coverageReporters: ['lcov'],
  globals: {
    'ts-jest': {
      diagnostics: false
    }
  },
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  testRegex: '\\.test\\.(ts|js)$'
};
