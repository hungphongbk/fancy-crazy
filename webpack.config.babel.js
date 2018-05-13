import path              from "path";
import webpack           from "webpack";
import ExtractTextPlugin from "extract-text-webpack-plugin";
import UglifyJSPlugin    from "uglifyjs-webpack-plugin";
// import {WebpackCloudFlareSync} from "hungphongbk-utils";
import merge             from 'webpack-merge';
import base              from './build/webpack-base.config.babel';
import incstr            from 'incstr';
import combine           from 'webpack-combine-loaders';
import regexCombiner     from 'regex-combiner';

const src = './static/src',
  dist = './static/dist',
  isProduction = process.env.NODE_ENV === 'production',
  publicPath = isProduction ? 'https://static.fancycrazy.com/' : 'https://localhost:8080/',
  nameCache = {};
const extractCss = new ExtractTextPlugin({
  filename: "[name].css?[contenthash]"
});

//region CSS Minimize Scoping
const createUniqueIdGenerator = () => {
  const index = {};

  const generateNextId = incstr.idGenerator({
    // Removed "d" letter to avoid accidental "ad" construct.
    // @see https://medium.com/@mbrevda/just-make-sure-ad-isnt-being-used-as-a-class-name-prefix-or-you-might-suffer-the-wrath-of-the-558d65502793
    alphabet: 'abcefghijklmnopqrstuvwxyz0123456789'
  });

  return (name) => {
    if (index[name]) {
      return index[name];
    }

    let nextId;

    do {
      // Class name cannot start with a number.
      nextId = generateNextId();
    } while (/^[0-9]/.test(nextId));

    index[name] = generateNextId();

    return index[name];
  };
};

const idLocal = createUniqueIdGenerator();

const generateScopedName = (localName, resourcePath) => {
  const componentName = resourcePath.split('/').slice(-2, -1);
  if (/^col-/.test(localName))
    return 'col-' + idLocal(localName);
  return idLocal(componentName).toUpperCase() + idLocal(localName);
};
//endregion

const cssLoader = (modules = false) => ({
  loader: "css-loader",
  options: {
    autoprefixer: true,
    minimize: true,
    // localIdentName: isProduction ? '[hash:base64:7]' : '[name]__[local]___[hash:base64:5]',
    getLocalIdent: (context, localIdentName, localName) => {
      return generateScopedName(localName, context.resourcePath);
    },
    importLoaders: 2,
    camelCase: 'only',
    modules
  }
});

module.exports = merge(base, {
  entry: {
    vendor: ['vue', 'vuex', 'vuex-router-sync', 'vue-i18n', 'vue-lazyload', 'vue-match-media', 'vue-responsive', 'mobile-detect', 'flickity', 'vue-flickity', 'flickity-imagesloaded'],
    frontend: src + '/script.js'
  },
  output: {
    path: path.resolve(__dirname, dist),
    publicPath: publicPath,
    filename: '[name].js' + (isProduction ? '?[chunkhash]' : ''),
    chunkFilename: '[name].bundle.js?[chunkhash]',
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
                'cache-loader',
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
          use: [cssLoader(false), 'postcss-loader'],
          // use style-loader in development
          fallback: "style-loader"
        }) : [
          {loader: 'style-loader'},
          {loader: 'css-loader'}
        ]
      },
      {
        test: /\.m-s[ac]ss$/,
        use: isProduction ? extractCss.extract({
          use: [
            'cache-loader',
            cssLoader(true),
            'postcss-loader',
            'sass-loader'
          ],
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
          use: [
            'cache-loader',
            cssLoader(false),
            'postcss-loader',
            'sass-loader'],
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
    stats: {chunks: false}
  }
});

let plugins = [
  extractCss,
  new webpack.IgnorePlugin(/(locale)/, /node_modules.+(moment)/),
  new webpack.ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery',
    'window.jQuery': 'jquery',
    Popper: ['popper.js', 'default'],
    moment: 'moment'
  }),
];
if (process.env.NODE_ENV === 'production') {
  // http://vue-loader.vuejs.org/en/workflow/production.html
  plugins = plugins.concat([
    // new BundleAnalyzerPlugin({
    //   analyzerMode: 'static'
    // }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      getLocalIdent: (context, localIdentName, localName) => {
        return generateScopedName(localName, context.resourcePath);
      }
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
    new UglifyJSPlugin({
      test: /\.js($|\?)/i,
      cache: true,
      parallel: false,
      uglifyOptions: {
        ie8: false,
        mangle: {
          properties: {
            regex: regexCombiner([
              /^([A-Z]+_)([A-Z]+_?)+$/,
              /^\$(style|createElement)$/
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
  ]);
} else {
  module.exports.devtool = 'source-map';
  plugins = plugins.concat([
    new webpack.NamedModulesPlugin(),
    new webpack.SourceMapDevToolPlugin({
      filename: '[name].js.map',
      exclude: ['vendor.js']
    })
  ]);
}
module.exports.plugins = plugins;
