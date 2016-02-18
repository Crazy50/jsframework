var path = require('path');

module.exports = function(outputPath) {
  return {
    entry: __dirname + '/client/core.js',
    output: {
      path: outputPath,
      filename: 'core.js'
    },
    resolve: {
      root: [
        path.resolve('./client')
      ],
      fallback: [
        path.resolve('./')
      ]
    }
  };
};
