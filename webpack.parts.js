const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const PurityCSSPlugin = require("purifycss-webpack")

exports.devServer = ({
    host,
    port
} = {}) => ({
  devServer: {
    stats: "errors-only",
    host: host,
    port: port,
    open: true,
    overlay: true
  }
});

exports.loadCSS = ({ include, exclude } = {}) => ({
  module: {
    rules: [
      {
        test: /\.css$/,
        include,
        exclude,

        use: ["style-loader", "css-loader"],
      },
    ],
  },
});

exports.extractCSS = ({ include, exclude, use = []}) => {
  const plugin = new MiniCssExtractPlugin({
      filename: "[name].css"
  });

  return {
    module: {
      rules: [
        {
          test: /\.css$/,
          include,
          exclude,

          use: [
            MiniCssExtractPlugin.loader
          ].concat(use),
        },
      ],
    },
    plugins: [plugin]
  }
}

exports.purifyCSS = ({ paths }) => ({
  plugins: [new PurityCSSPlugin({ paths })]
})
