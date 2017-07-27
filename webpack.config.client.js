var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var helpers = require('./webpack/helpers');
const { AotPlugin } = require('@ngtools/webpack');

module.exports = {
  entry: {
    polyfills: './src/polyfills.ts',
    app: './src/main.ts'
  },
  devtool: 'cheap-module-eval-source-map',
  resolve: {
    extensions: ['.ts', '.js']
  },
  output: {
    path: helpers.root('dist/'),
    publicPath: '/static',
    filename: '[name].js',
    chunkFilename: '[id].chunk.js'
  },
  module: {
    rules: [
      { test: /\.ts$/, loader: '@ngtools/webpack' },
      {
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
        loader: 'file-loader?name=assets/[name].[hash].[ext]'
      },
      {
        test: /\.css$/,
        exclude: helpers.root('src', 'app'),
        loader: ExtractTextPlugin.extract({ fallbackLoader: 'style-loader', loader: 'css-loader?sourceMap' })
      },
      {
        test: /\.css$/,
        include: helpers.root('src', 'app'),
        loader: 'raw-loader'
      }
    ]
  },
  plugins: [
    new webpack.ContextReplacementPlugin(
      // The (\\|\/) piece accounts for path separators in *nix and Windows
        /angular(\\|\/)core(\\|\/)@angular/,
      helpers.root('./src'), // location of your src
      {} // a map of your routes
    ),
    new AotPlugin({
      tsConfigPath: helpers.root('src', 'tsconfig.json'),
      skipCodeGeneration: false
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: ['app', 'polyfills']
    }),
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),
    new ExtractTextPlugin('[name].css')
  ]
};
