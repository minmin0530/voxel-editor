const presets = [
  ['@babel/preset-env', {
    targets: '> 1.00%, not dead',
    useBuiltIns: 'usage',
    corejs: 3,
  }],
];

module.exports = { presets };

