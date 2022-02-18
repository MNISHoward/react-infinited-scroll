'use strict';

const moduleConfig = require('./webpack.config')('production');
const paths = require('./paths');

const config = {
  mode: 'production',
  entry: paths.libSrc,
  module: moduleConfig.module,
  resolve: moduleConfig.resolve,
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
