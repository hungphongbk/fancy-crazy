import path from "path";

const isProduction = process.env.NODE_ENV === 'production';

export default {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [
          /node_modules\/(?!(js-effect-ripple|vue-match-media|v-tooltip))/
        ],
        use: [
          "babel-loader?cacheDirectory"
        ],

      },
      {test: /\.tsx?$/, loader: "ts-loader"}
    ]
  },
  resolve: {
    extensions: ['.js', '.json', '.vue', '.ts', '.tsx'],
    alias: {
      'vue$': 'vue/dist/vue.runtime.esm.js',
      '@': path.resolve(__dirname, '../static/src'),
      '@settings': path.resolve(__dirname, '../static/settings'),
      '@node': path.resolve(__dirname, '../static/node-src')
    }
  }
};
