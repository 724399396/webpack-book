const merge = require("webpack-merge")
const HtmlWebpackPlugin = require("html-webpack-plugin")

const parts = require("./webpack.parts")

const commonConfig = merge([
  {
    plugins: [
      new HtmlWebpackPlugin({
        title: "Webpack demo",
      }),
    ],
  }
])

const productionConfig = merge([]);

const developmentConfig = merge([
  parts.devServer({
    host: process.env.HOST, // Defaults to `localhost`
    port: process.env.PORT, // Defaults to 8080
  }),
]);

module.exports = mode => {
  if (mode === "production") {
    return merge(commonConfig, productionConfig, { mode })
  }

  return merge(commonConfig, developmentConfig, { mode })
};
