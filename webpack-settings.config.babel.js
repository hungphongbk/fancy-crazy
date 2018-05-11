import path from "path";
import webpack from "webpack";
import HTMLWebpackPlugin from "html-webpack-plugin";
import UglifyJSPlugin from "uglifyjs-webpack-plugin";
import {BundleAnalyzerPlugin} from "webpack-bundle-analyzer";
import S3Plugin from "webpack-s3-plugin";
import {WebpackCloudFlareSync} from "hungphongbk-utils";
import merge from 'webpack-merge'
import base from './build/webpack-base.config.babel'
import ExtractTextPlugin from "extract-text-webpack-plugin";

const src = './static/settings',
  dist = './static/dist',
  isProduction = process.env.NODE_ENV === 'production',
  publicPath = isProduction ? 'https://static.letbuynow.com/' : 'https://localhost:8081/';

module.exports = merge(base, {
  entry: {
    'settings-vendor': ['vue', 'vuex', 'vuex-router-sync'],
    'settings-index': src + '/index.js'
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
            localIdentName: '[hash:base64:7]',
            importLoaders: 2,
            camelCase: 'only'
          },
          loaders: {
            scss: 'vue-style-loader!css-loader!sass-loader',
            i18n: '@kazupon/vue-i18n-loader',
            js: 'babel-loader?cacheDirectory'
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          {loader: 'style-loader'},
          {loader: 'css-loader'}
        ]
      },
      {
        test: /\.s[ac]ss$/,
        use: [
          {loader: 'style-loader'},
          {loader: 'css-loader'},
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
          name: '[sha512:hash:base64:8].[ext]'
        }
      },
    ]
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
    publicPath: 'https://localhost:8081/',
    stats: {chunks: false}
  }
});

let plugins = [
  new webpack.IgnorePlugin(/(locale)/, /node_modules.+(moment)/),
  new webpack.ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery',
    'window.jQuery': 'jquery',
    Popper: ['popper.js', 'default'],
    moment: 'moment'
  }),
  new HTMLWebpackPlugin({
    filename: 'settings.html',
    template: path.resolve(src, 'settings.html')
  })
];
if (process.env.NODE_ENV === 'production') {
  // http://vue-loader.vuejs.org/en/workflow/production.html
  plugins = plugins.concat([
    // new BundleAnalyzerPlugin({
    //   analyzerMode: 'static'
    // }),
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
      name: "settings-vendor",
      minChunks: Infinity,
    }),
    new UglifyJSPlugin({
      test: /\.js($|\?)/i,
      cache: true,
      parallel: true,
      uglifyOptions: {
        ie8: false
      }
    }),
    new S3Plugin({
      // Exclude uploading of html
      include: /.*\.(css|js|html)/,
      // s3Options are required
      s3Options: {
        accessKeyId: 'AKIAJKOMHMXCZZKYWKIA',
        secretAccessKey: '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',
        region: 'ap-southeast-1'
        // signatureVersion: 'v2'
      },
      s3UploadOptions: {
        Bucket: 'static.letbuynow.com',
        Key(filename) {
          return filename.split('?')[0]
        }
      }
    }),
    WebpackCloudFlareSync({
      zoneId: 'f194859ddc3666c9fdf6a83a6adb3e02',
      watchAssets: ['settings-vendor.js', 'settings-frontend.js', 'settings.html'],
      manifestFile: path.resolve(__dirname, 'static/current.json'),
      baseCloudFlareUrl: 'https://static.letbuynow.com/'
    })
    // Ssr(App)
  ])
} else {
  module.exports.devtool = 'source-map';
  plugins = plugins.concat([
    new webpack.NamedModulesPlugin(),
    new webpack.SourceMapDevToolPlugin({
      filename: '[name].js.map',
      exclude: ['settings-vendor.js']
    })
  ]);
}
module.exports.plugins = plugins;
