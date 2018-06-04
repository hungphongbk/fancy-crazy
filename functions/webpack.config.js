const path = require('path');
const nodeExternals = require('webpack-node-externals');
//import webpack from 'webpack';

module.exports = {
  mode: 'production',
  target: 'node',
  context: process.cwd(),
  entry: {
    index: path.resolve(__dirname, 'app/index.js')
  },
  output: {
    path: __dirname,
    filename: 'index.js',
    libraryTarget: "umd"
  },
  module: {
    rules: [
      {test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"},
      // {test: /\.json$/, loader: "json-loader"}
    ]
  },
  node: {
    __filename: true,
    __dirname: true
  },
  externals: [nodeExternals()]
};
