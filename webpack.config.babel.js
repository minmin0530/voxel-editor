import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const webpackConfig = (env) => {
  const mode = env.environment || 'development';
  const config = {
    entry: {
      index: './src/index.js',
    },
    mode,
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
      https: false,
      port: 9000,
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
        template: './index.html',
        chunks: ['index'],
      }),
    ],
  };
  return config;
};

export default webpackConfig;