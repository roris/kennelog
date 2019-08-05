module.exports = {
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
