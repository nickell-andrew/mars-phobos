var path = require('path');
module.exports = {
    entry: {
      main: './src/main.js'
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js',
        publicPath: "dist/",
      chunkFilename: '[chunkhash].js'
    },
    module: {
        loaders: [
            { test: path.join(__dirname, 'src'),
              loader: 'babel-loader' }
        ]
    },
    plugins: []
};