var path = require('path');

module.exports = function(outputPath) {
  return {
    entry: __dirname + '/client/core.js',
    output: {
      path: outputPath,
      filename: 'core.js'
    },
    resolve: {
      // extensions: ['', '.jsx', '.js', '.json'],
      root: [
        process.cwd(),
        path.resolve(__dirname + '/client'),
        path.resolve(__dirname)
      ],
      modulesDirectories: ['node_modules']
    }
  };
};
