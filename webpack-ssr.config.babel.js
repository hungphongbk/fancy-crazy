import path               from "path";
import ExtractTextPlugin  from "extract-text-webpack-plugin";
import merge              from 'webpack-merge';
import base               from './build/webpack-base.config.babel';
import combine            from 'webpack-combine-loaders';
import _                  from './build/utils';
import VueSSRServerPlugin from 'vue-server-renderer/server-plugin';
import nodeExternals      from 'webpack-node-externals';
import webpack            from 'webpack';

const src = './static/src',
  dist = './static/dist',
  isProduction = process.env.NODE_ENV === 'production',
  publicPath = isProduction ? 'https://static.fancycrazy.com/' : 'https://localhost:8080/',
  nameCache = {};
const extractCss = new ExtractTextPlugin({
  filename: "[name].css?[contenthash]"
});

global.getLocalIdent = _.getLocalIdent;

const cssLoader = (modules = false) => ({
  loader: "css-loader",
  options: {
    autoprefixer: true,
    minimize: true,
    // localIdentName: isProduction ? '[hash:base64:7]' : '[name]__[local]___[hash:base64:5]',
    getLocalIdent: _.getLocalIdent,
    importLoaders: 2,
    camelCase: 'only',
    modules
  }
});

// console.log(_.cssLoaders(['postcss-loader', 'sass-loader'], false))

module.exports = merge(base, {
  target: 'node',
  entry: src + '/ssr.js',
  output: {
    path: path.resolve('static'),
    filename: 'ssr-bundle.js',
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          cssModules: {
            localIdentName: isProduction ? '[hash:base64:7]' : '[name]__[local]___[hash:base64:5]',
            importLoaders: 2,
            camelCase: 'only'
          },
          loaders: {
            scss: isProduction ? ExtractTextPlugin.extract({
              use: [
                // 'cache-loader',
                'css-loader',
                'postcss-loader',
                'sass-loader',
              ],
              fallback: 'vue-style-loader'
            }) : 'vue-style-loader!css-loader!sass-loader',
            i18n: '@kazupon/vue-i18n-loader',
            js: 'babel-loader?cacheDirectory',
          },
          preLoaders: {
            pug: combine([
              {
                loader: 'pug-transform-loader',
                options: {
                  scssFiles: [path.resolve(__dirname, 'static/src/scss/styles.scss')]
                }
              }
            ])
          }
        }
      },
      {
        test: /\.css$/,
        use: isProduction ? extractCss.extract({
          use: _.cssLoaders(['postcss-loader'], false),
          // use style-loader in development
          fallback: "style-loader"
        }) : [
          {loader: 'style-loader'},
          {loader: 'css-loader'}
        ]
      },
      {
        test: /\.m-css$/,
        use: isProduction ? extractCss.extract({
          use: _.cssLoaders(['postcss-loader'], true),
          // use style-loader in development
          fallback: "style-loader"
        }) : [
          {loader: 'style-loader'},
          {loader: 'css-loader'}
        ]
      },
      {
        test: /\.m-s[ac]ss($|\?)/,
        use: isProduction ? extractCss.extract({
          use: _.cssLoaders(['postcss-loader', 'sass-loader'], true),
          fallback: 'style-loader'
        }) : [
          {loader: 'style-loader'},
          cssLoader(true),
          {
            loader: 'sass-loader'
          }
        ]
      },
      {
        test: /\.s[ac]ss$/,
        use: isProduction ? extractCss.extract({
          use: _.cssLoaders(['postcss-loader', 'sass-loader'], false),
          fallback: "style-loader"
        }) : [
          {loader: 'style-loader'},
          cssLoader(false),
          {loader: 'sass-loader'}
        ]
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          ...(isProduction ? ['cache-loader'] : []),
          {
            loader: 'url-loader',
            options: {
              limit: 1024,
              name: '[sha512:hash:base64:8].[ext]'
            }
          },
          {
            loader: 'img-loader',
            options: {
              enabled: isProduction,
              svgo: {
                plugins: [
                  {removeTitle: true},
                  {convertPathData: false},
                  {convertShapeToPath: false}
                ]
              },
              pngquant: {
                speed: 2,
                quality: 80
              }
            }
          }
        ]
      },
      {
        test: /\.(eot|ttf|woff|woff2)$/,
        loader: 'file-loader',
        options: {
          name: `[sha512:hash:base64:8]${isProduction ? '' : ('-[name]')}.[ext]`
        }
      },
    ]
  },
  resolveLoader: {
    alias: {
      'pug-transform-loader': path.join(__dirname, 'build/loaders/pug-bootstrap-moduled/index.js')
    }
  },
  externals: nodeExternals({
    whitelist: [
      /\.css$/,
      'vue-flickity'
    ]
  }),
  plugins: [
    new webpack.DefinePlugin({
      SSR: '"server"'
    }),
    extractCss,
    new VueSSRServerPlugin()
  ]
});
