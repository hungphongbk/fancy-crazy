import path from "path";
import webpack from "webpack";
import ExtractTextPlugin from "extract-text-webpack-plugin";
import UglifyJSPlugin from "uglifyjs-webpack-plugin";
import DuplicateCheck from 'duplicate-package-checker-webpack-plugin';
import merge from 'webpack-merge';
import base from './build/webpack-base.config.babel';
import combine from 'webpack-combine-loaders';
import regexCombiner from 'regex-combiner';
import _ from './build/utils';
import ShopifyPlugin from './build/plugins/shopify';
import openInEditor from 'launch-editor-middleware';

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
  entry: {
    vendor: ['vue', 'vuex', 'vue-lazyload', 'vue-match-media', 'flickity', 'vue-flickity', 'flickity-imagesloaded', '@tweenjs/tween.js', 'popper.js'],
    frontend: src + '/script.js'
  },
  output: {
    path: path.resolve(__dirname, dist),
    publicPath: publicPath,
    filename: '[name].js' + (isProduction ? '?[chunkhash]' : ''),
    chunkFilename: '[name].bundle.js?[chunkhash]',
    jsonpFunction: 'fancyCrazyJsonp'
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
          // ...(isProduction ? ['cache-loader'] : []),
          {
            loader: 'url-loader',
            options: {
              limit: 2048,
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
  externals: {
    jquery: 'jQuery'
  },
  performance: {
    hints: false
  },
  devServer: {
    contentBase: false,
    hot: true,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    publicPath: 'https://localhost:8080/',
    stats: {chunks: false},
    before(app) {
      app.use('/__open-in-editor', openInEditor('code'));
    }
  }
});

let plugins = [
  new webpack.IgnorePlugin(/(locale)/, /node_modules.+(moment)/, /blueimp-gallery-(video|youtube)/),
  new webpack.ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery',
    'window.jQuery': 'jquery',
    Popper: ['popper.js', 'default'],
    moment: 'moment'
  }),
  new webpack.DefinePlugin({
    SHOPIFY_THEME_ID: '"preview_theme_id=31911346245"',
    SSR: '"client"'
  })
];
if (process.env.NODE_ENV === 'production') {
  // module.exports.devtool = 'source-map';
  // http://vue-loader.vuejs.org/en/workflow/production.html
  plugins = plugins.concat([
    // new BundleAnalyzerPlugin({
    //   analyzerMode: 'static'
    // }),
    extractCss,
    // new webpack.IgnorePlugin(/blueimp-gallery\/js\/blueimp-gallery-(video|youtube)/),
    new DuplicateCheck(),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    new webpack.HashedModuleIdsPlugin(),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"',
      },
      DEBUG: 'false',
      PUBLIC_PATH: JSON.stringify(publicPath)
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendor",
      minChunks: Infinity,
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: "inline",
      minChunks: Infinity,
    }),
    new webpack.optimize.CommonsChunkPlugin({
      // names: ["app", "subPageA"]
      names: ["frontend"],
      // name: "frontend",
      children: true,
      minChunks: 2,
    }),
    // new webpack.SourceMapDevToolPlugin({
    //   filename: '[name].js.map',
    //   exclude: ['inline.js']
    // }),
    new UglifyJSPlugin({
      test: /\.js($|\?)/i,
      cache: true,
      parallel: false,
      sourceMap: true,
      uglifyOptions: {
        ie8: false,
        mangle: {
          properties: {
            regex: regexCombiner([
              /^([A-Z][A-Z0-9]*_)([A-Z0-9]+_?)*$/,
              /^\$(style|createElement)$/,
              // /^(options)$/,
              /^_tweens/
            ])
          }
        },
        nameCache: nameCache
      },
      extractComments: {
        banner: false,
        file: 'js.LICENSE'
      }
    }),
    ShopifyPlugin
  ]);
} else {
  // module.exports.devtool = '#eval-source-map';
  plugins = plugins.concat([
    new webpack.NamedModulesPlugin(),
    // new webpack.SourceMapDevToolPlugin({
    //   filename: '[name].js.map',
    //   exclude: ['vendor.js']
    // })
  ]);
}
module.exports.plugins = plugins;
