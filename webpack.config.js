const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const MinifyPlugin = require('babel-minify-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
  entry: {
    'choosebumps': './src/js/choosebumps.js',
    'choosebumps.min': './src/js/choosebumps.js'
  },
  //devtool: 'source-map',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    library: "ChooseBumps",
    libraryExport: 'default',
    libraryTarget: "umd"
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader'
      }
    },{
      test: /\.scss$/,
      use: ExtractTextPlugin.extract({
        fallback: "style-loader",
        use: ['css-loader','sass-loader']
      })
    }]
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new ExtractTextPlugin({
      filename:  (getPath) => {
        return getPath('[name].css');
      }
    }),
    new MinifyPlugin({}, {
      test: /\.min\.js$/,
    }),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.min\.css$/,
      cssProcessorOptions: { discardComments: { removeAll: true } }
    })
  ]
};
