module.exports = api => {
  const nodeTarget = {
    node: process.env.IN_PROTRACTOR ? 6 : 'current'
  };
  const browserTarget = {
    browsers: ['last 2 version']
  };

  const target =
    process.env.BABEL_TARGET === 'node' ? nodeTarget : browserTarget;

  api.cache.using(() => {
    // cache based on the two env vars
    return (
      'babel:' +
      process.env.BABEL_TARGET +
      ' protractor:' +
      process.env.IN_PROTRACTOR
    );
  });

  return {
    extends: '../../babel.config.js',
    presets: [
      [
        '@babel/preset-env',
        {
          useBuiltIns: 'usage',
          corejs: 3,
          targets: target,
          loose: true
        }
      ]
    ]
  };
};
