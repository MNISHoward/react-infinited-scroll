'use strict';

const moduleConfig = require('./webpack.config')('production');
const paths = require('./paths');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const config = {
  mode: 'production',
  entry: paths.libSrc,
  module: moduleConfig.module,
  resolve: moduleConfig.resolve,
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].[contenthash:8].css',
      chunkFilename: '[name].[contenthash:8].chunk.css',
    }),
  ],
  optimization: moduleConfig.optimization,
  externals: {
    'react': 'react',
    'react-dom': 'react-dom'
  }
};


module.exports = Object.assign({}, config, {
  output: {
    path: paths.appBuild,
    filename: "index.js",
    publicPath: paths.publicUrlOrPath,
    library: 'react-infinited-scroll',
    libraryTarget: 'umd'
  },
});
