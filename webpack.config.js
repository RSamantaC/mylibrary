const path = require('path');

module.exports = {
  entry: {
    main: ['./src/js/index.js']
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
      
    ]
  },
  resolve: {
    extensions: ['.js']
  },
  devServer: {
    static: './public/'
  }
};
