const path = require('path');

module.exports = {
  target: 'node',
  entry: './src/app.js',
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'app.bundle.js',
  },
}