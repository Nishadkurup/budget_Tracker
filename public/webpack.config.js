const WebpackPwaManifest = require('webpack-pwa-manifest');
const path = require('path');

const config = {
    entry: {
        app: "./index.js",
        db: "./db.js",
    },
    output: {
        publicPath: "",
        path: __dirname + '/dist',
        filename: '[name].bundle.js',
    },
    mode: 'development',
    module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env'],
              },
            },
          },
        ],
      },
      plugins: [
        new WebpackPwaManifest({
          fingerprints: false,
          name: 'Budget Tracker App',
          short_name: 'Budget Tracker',
          description: 'An application that allows you to tarck your budget on the go.',
          background_color: '#01579b',
          theme_color: '#ffffff',
          'theme-color': '#ffffff',
          start_url: '/',
          icons: [
            {
              src: path.resolve('icons/icon-192x192.png'),
              sizes: [96, 128, 192, 256, 384, 512],
              destination: path.join('assets', 'icons'),
            },
          ],
        }),
      ],  

}
module.exports = config;
   