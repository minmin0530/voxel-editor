import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

const webpackConfig = (env) => {
  console.log(env);
  const config = {
    entry: {
      index: './src/index.js',
    },
    output: {
      path: `${__dirname}/dist/`,
      filename: '[name].js',
    },
    devServer: {
      contentBase: `${__dirname}/dist/`,
      liveReload: true,
      open: true,
      openPage: 'index.html',
      host: 'localhost',
      https: true,
      port: 9000,
    },
    resolve: {
      alias: {
        userEnv$: path.resolve(__dirname, `.env/${env.environment}.js`),
      },
    },
    module: {
      rules: [
        {
          test: /.html$/,
          loader: 'html-loader',
        },
        {
          test: /\.js$/,
          enforce: 'pre',
          exclude: /node_modules/,
          loader: 'eslint-loader',
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
      ],
    },
    plugins: [
      new webpack.ProvidePlugin({
        'THREE': 'three/build/three',
      }),
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: './src/templates/index.html',
        chunks: ['index'],
      }),
      new CopyWebpackPlugin([
        {
          from: 'assets',
          to: 'assets',
        },
        {
          from: 'src/php',
          to: '',
        },
      ]),
    ],
  };
  return config;
};

export default webpackConfig;