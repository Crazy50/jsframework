var path = require('path');

module.exports = function(outputPath) {
  return {
    entry: __dirname + '/client/core.js',
    output: {
      path: outputPath,
      filename: 'core.js'
    },

    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          query: {
            presets: ["es2015", "react"]
          }
        }
      ],
    },

    resolve: {
      extensions: ['', '.jsx', '.js', '.json'],
      root: [
        process.cwd(),
        path.resolve(__dirname + '/client'),
        path.resolve(__dirname)
      ],
      modulesDirectories: ['node_modules'],
      packageAlias: 'browser'
    }
  };
};
