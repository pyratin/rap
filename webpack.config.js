/** @type {import('webpack').Configuration} */

import path from 'path';
import process from 'process';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

/** @type {{ [key: string]: string }} */
const pathDefinition = ['source', 'target'].reduce(
  (memo, pathFragment) => ({
    ...memo,
    [pathFragment]: path.join(process.cwd(), pathFragment, 'browser')
  }),
  {}
);

const regExpNodeModules = /node_modules/;

const exclude = [regExpNodeModules];

export default {
  entry: { bundle: [pathDefinition.source] },
  output: { path: pathDefinition.target, filename: '[name].js' },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(pathDefinition.source, 'index.html')
    }),
    new MiniCssExtractPlugin(),
    new CopyWebpackPlugin({
      patterns: ['asset'].map((pathFragment) => ({
        from: path.join(pathDefinition.source, pathFragment),
        to: path.join(pathDefinition.target, pathFragment)
      }))
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude,
        resolve: { fullySpecified: false },
        use: ['babel-loader']
      },
      {
        test: /\.scss$/,
        exclude,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      }
    ]
  },
  devServer: { hot: true, liveReload: true },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: regExpNodeModules,
          chunks: 'initial',
          name: 'vendor.bundle'
        }
      }
    }
  }
};
