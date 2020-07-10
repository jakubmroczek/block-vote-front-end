const path = require('path');

module.exports = {
  mode: 'development',
  entry: { app: ['./src/App.jsx'] },
  output: {
    filename: 'app.bundle.js',
    path: path.resolve(__dirname, 'public'),
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: 'babel-loader',
      },
    ],
  },
  optimization: {
    splitChunks: {
      name: 'vendor',
      chunks: 'all',
    },
  },
  devtool: 'source-map',
  // Woraround for truffle not finding the fs
  node: {
    fs: 'empty',
  },
};
