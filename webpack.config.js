const path = require('path');

module.exports = {
    mode: 'production',
    entry: './src/game.js',
    output: {
      filename: 'game.js',
      publicPath: 'dist'
    }
  }