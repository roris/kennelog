module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  transform: {
    '^.+\\.(css|less|sass|scss|styl|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      'jest-transform-stub',
    '^.+\\.ts$': 'ts-jest'
  },
  moduleNameMapper: {
    'aurelia-(.*)': '<rootDir>/node_modules/aurelia-$1'
  },
  modulePaths: ['<rootDir>/src', '<rootDir>/node_modules'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  testRegex: '\\.spec\\.(ts|js)$',
  setupFiles: ['<rootDir>/test/jest-pretest.ts'],

  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,ts}',
    '!**/*.spec.{js,ts}',
    '!**/node_modules/**',
    '!**/test/**'
  ],
  coverageDirectory: '<rootDir>/test/coverage-jest',
  coverageReporters: ['lcov', 'json', 'text', 'html']
};
