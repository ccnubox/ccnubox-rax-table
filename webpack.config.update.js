// webpack.config.update.js
const path = require('path');

module.exports = function update(webpackConfig) {
  webpackConfig.entry["second.bundle"] = [
    path.resolve(__dirname, "./node_modules/rax-scripts/lib/dev-utils/webpackHotDevClient.js"),
    path.resolve(__dirname, "./node_modules/rax-hot-loader/patch.js"),
    path.resolve(__dirname, "./src/second.js")
  ];
  console.log("here", webpackConfig);
  return webpackConfig;
};
