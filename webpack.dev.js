module.exports = {
  devtool: 'cheap-module-source-map',
  entry: [
    './src/index.js'
  ],
  output: {
    path: './dist/assets',
    filename: '[name].bundle.js',
    sourceMapFilename: '[name].map'
  },
  module: {
    loaders: [{
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        presets: ['react', 'es2015', 'stage-1']
      }
    }]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  devServer: {
    historyApiFallback: true,
    contentBase: './'
  }
};
