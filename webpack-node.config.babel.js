import path from "path";

import merge from 'webpack-merge';
import base  from './build/webpack-base.config.babel';

export default merge(base, {
  target: 'node',
  entry: {
    'app': './static/node-src/app.js'
  },
  output: {
    path: path.resolve(__dirname, './static/node'),
    filename: '[name].js',
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, "server"), // your scripts
          path.resolve(__dirname, "node_modules/query-string"),
          // path.resolve(__dirname, "node_modules/query-string")
        ],
        use: [
          {
            loader: 'babel-loader?cacheDirectory',
            options: {
              babelrc: false,
              presets: [
                ['env', {
                  loose: true
                }]
              ],
              plugins: [
                'transform-object-rest-spread',
                'transform-runtime',
                'transform-regenerator',
                'transform-async-functions',
                'transform-decorators-legacy',
                "transform-flow-strip-types"
              ]
            }
          },
          "remove-hashbag-loader"
        ]
      }
    ]
  },
  node: {
    __filename: true,
    __dirname: true
  },
  resolveLoader: {
    alias: {
      "remove-hashbag-loader": path.join(__dirname, "./webpack/remove-hashbag-loader")
    }
  },
  externals: Object.keys(require('./package.json').dependencies),
  performance: {
    hints: false
  }
});
