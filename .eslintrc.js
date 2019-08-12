module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['prettier', '@typescript-eslint', 'jest'],
  env: {
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jest/recommended',
    'standard',
    'plugin:prettier/recommended',
    'prettier/@typescript-eslint',
    'prettier/standard'
  ],
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module',
    project: './tsconfig.json'
  },
  rules: {
    'prettier/prettier': 'error',
    // @typescript-eslint/no-unused-vars already warns about this
    'no-unused-vars': 'off',
    // allow declaring public members (default) without access specifiers
    '@typescript-eslint/explicit-member-accessibility': [
      'error',
      {
        accessibility: 'no-public'
      }
    ],
    // allow ommiting function return type from most places
    // warn for regular functions and accessors
    '@typescript-eslint/explicit-function-return-type': [
      'warn',
      {
        allowExpressions: true,
        allowTypedFunctionExpressions: true,
        allowHigherOrderFunctions: true
      }
    ]
  },

  overrides: [
    {
      files: ['packages/frontend/src/components/**/*.ts'],
      rules: {
        // used for generating validation messages
        'no-template-curly-in-string': 'off'
      }
    }
  ]
};
