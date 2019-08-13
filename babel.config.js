module.exports = api => {
  api.cache(true);

  return {
    presets: [['@babel/preset-env'], '@babel/preset-typescript'],
    plugins: [
      ['@babel/plugin-proposal-decorators', { legacy: true }],
      ['@babel/plugin-proposal-class-properties', { loose: true }],
      '@babel/plugin-proposal-object-rest-spread',
      '@babel/plugin-proposal-numeric-separator'
    ],
    ignore: ['node_modules']
  };
};
