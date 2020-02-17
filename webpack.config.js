const webpack = require('webpack')
const { resolve } = require('path')
const Dotenv = require('dotenv-webpack')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')

const isProd = process.env.NODE_ENV === 'production'

const mergeHotMiddleware = entry => {
  if (isProd) return entry

  return Object.keys(entry).reduce((res, key, index) => {
    return {
      [key]: [`webpack-hot-middleware/client?name=${key}`, entry[key]]
    }
  }, {})
}

module.exports = {
  mode: isProd ? 'production' : 'development',
  devtool: isProd ? false : 'inline-source-map',
  entry: mergeHotMiddleware({
    client: resolve('src/client.tsx')
  }),
  output: {
    filename: '[name].bundle.js',
    path: resolve('dist'),
    publicPath: '/public/'
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  plugins: [
    new CaseSensitivePathsPlugin(),
    new Dotenv(),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new ManifestPlugin(),
    new ForkTsCheckerWebpackPlugin()
  ]
}
