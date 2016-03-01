var path = require('path');

module.exports = {
  entry: './app.js',
  output: {
    path: './public/',
    filename: 'core.js'
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ],
  },

  resolve: {
    extensions: ['', '.jsx', '.js', '.json'],
    root: [
      __dirname
    //   path.resolve(__dirname + '/client'),
    //   path.resolve(__dirname)
    ],
    modulesDirectories: ['node_modules']
  }
};
