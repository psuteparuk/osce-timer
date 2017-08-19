import {
  HOST,
  PORT,
  root,
  src,
} from './config';

// Webpack Plugins
import CleanWebpackPlugin from 'clean-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import * as webpack from 'webpack';

export default ((env) => {
  const config = {};

  const IS_DEV = env !== 'prod';
  const IS_PROD = env === 'prod';

  config.devtool = IS_PROD ? 'source-map' : 'cheap-module-source-map';

  config.cache = IS_DEV;

  config.entry = {
    main: src('main.js'),
  };

  config.output = {
    path: root('dist'),
    filename: IS_PROD ? '[name].[chunkhash].bundle.js' : '[name].bundle.js',
    chunkFilename: IS_PROD ? '[id].[chunkhash].chunk.js' : '[id].chunk.js',
  };

  config.resolve = {
    extensions: ['.js', '.json'],
  };

  config.plugins = (() => {
    const plugins = [
      new CleanWebpackPlugin(['dist'], {
        root: root(),
      }),
      new HtmlWebpackPlugin({
        template: src('index.html'),
        inject: 'body',
      }),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(IS_DEV ? 'development' : 'production'),
        },
        __DEV__: IS_DEV,
      }),
    ];

    if (IS_PROD) {
      plugins.push(
        new webpack.LoaderOptionsPlugin({
          minimize: true,
        }),
        new webpack.optimize.UglifyJsPlugin({
          beautify: false,
          comments: false,
          compressor: {
            screw_ie8: true,
            warnings: false,
          },
          mangle: {
            keep_fnames: true,
            screw_ie8: true,
          },
        }),
      );
    }

    return plugins;
  })();

  config.module = {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          cacheDirectory: IS_DEV,
        },
        exclude: /node_modules/,
      },
      {
        test: /\.html$/,
        loader: 'raw',
        exclude: src('index.html'),
      },
    ],
  };

  if (IS_DEV) {
    config.devServer = {
      host: HOST,
      port: PORT,
      contentBase: root('dist'),
      historyApiFallback: true,
      inline: true,
    };
  }

  return config;
});
