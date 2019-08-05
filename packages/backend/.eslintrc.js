module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'promise'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jest/recommended',
    'plugin:promise/recommended',
    'standard',
    'prettier',
    'prettier/@typescript-eslint'
  ],
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module',
    project: './tsconfig.json'
  },
  env: {
    node: true
  },
  rules: {
    semi: ['error', 'always'],
    indent: ['error', 2],
    quotes: ['error', 'single'],
    // explicitly specifying public becomes annoying after a while
    '@typescript-eslint/explicit-member-accessibility': [
      'warn',
      {
        accessibility: 'no-public'
      }
    ],
    // allow function return type deduction
    '@typescript-eslint/explicit-function-return-type': [
      'error',
      { allowExpressions: true, allowTypedFunctionExpressions: true }
    ]
  }
};
