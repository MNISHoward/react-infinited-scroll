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


const cjsConfig = Object.assign({}, config, {
  output: {
    path: paths.appBuild,
    filename: "index.js",
    publicPath: paths.publicUrlOrPath,
    library: {
      type: "umd",
      export: "default"
    }
  },
});

const esmConfig = Object.assign({}, config, {
  output: {
    path: paths.appBuild,
    filename: "static/js/esm.js",
    chunkFilename: 'static/js/[name].[contenthash:8].chunk.js',
    library: {
      type: "module"
    },
  },
  experiments: {
    outputModule: true,
  },
  externalsType: "import"
});


module.exports = cjsConfig
