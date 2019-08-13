module.exports = {
  semi: true,
  singleQuote: true,
  trailingComma: 'none',
  tabWidth: 2,
  overrides: [
    {
      files: '.editorconfig',
      options: { parser: 'yaml' }
    },
    {
      files: '*.html',
      options: {
        printWidth: 120
      }
    }
  ]
};
