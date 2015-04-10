var path = require('path');
module.exports = {
    entry: {
      main: './src/js/main.js'
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js',
        publicPath: "dist/",
      chunkFilename: '[chunkhash].js'
    },
    module: {
        loaders: [
            { test: path.join(__dirname, 'src/js'),
              loader: 'babel-loader' }
        ]
    },
    plugins: []
};