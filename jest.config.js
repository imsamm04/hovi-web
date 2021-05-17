// jest.config.js
module.exports = {
  'verbose': true,
  'reporters': [
    'default',
    [
      'jest-html-reporters',
      {
        'publicPath': './test-reports',
        'filename': 'index.html',
        'expand': true,
      },
    ],
  ],
};
