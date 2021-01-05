const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
      filename: 'index.js',
      publicPath: 'dist'
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
              },
              {    
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: "file-loader"
              },
        ]
    }
}