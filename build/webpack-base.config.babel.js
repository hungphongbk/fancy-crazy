import path from "path";

const isProduction = process.env.NODE_ENV === 'production';
//ok
export default {
  module: {
    rules: [
      {
        test: /\.js($|\?)/,
        exclude: [
          /node_modules\/(?!(js-effect-ripple|vue-match-media|v-tooltip|my-vue-utils))/
        ],
        use: [
          "babel-loader?cacheDirectory"
        ],

      },
      {test: /\.tsx?$/, loader: "ts-loader"}
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.runtime.esm.js',
      '@settings': path.resolve(__dirname, '../static/settings'),
      '@node': path.resolve(__dirname, '../static/node-src'),
      '@google-cloud': path.resolve(__dirname, 'node_modules/@google-cloud'),
      '@': path.resolve(__dirname, '../static/src')
    },
    extensions: ['.js', '.json', '.vue', '.ts', '.tsx']
  }
};
