module.exports = {
  entry: './src/dictator.js',
  output: {
    path: './public/js',
    filename: 'dictator.js'
  },
  module: {
    loaders: [
      { 
        test: /\.js/, exclude: /node_modules/, 
        loader: 'babel',
        query: { presets: ['es2015'] }
      }
    ]
  }
};