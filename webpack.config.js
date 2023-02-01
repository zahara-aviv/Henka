const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const devMode = process.env.NODE_ENV !== "production";

module.exports = {
  mode: process.env.NODE_ENV,
  entry: ["./client/index.js"],
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "build"),
  },
  devtool: "eval-source-map",
  module: {
    rules: [
      {
        test: /.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      {
        test: /\.s?[ac]ss$/,
        use: [
          // Creates `style` nodes from JS strings
          //"style-loader",
          devMode ? "style-loader" : MiniCssExtractPlugin.loader,
          // Translates CSS into CommonJS
          { loader: "css-loader", options: { url: false, sourceMap: true } },
          // "postcss-loader",
          // Compiles Sass to CSS
          { loader: "sass-loader", options: { sourceMap: true } },
        ],
      },
      {
        test: /\.html$/i,
        use: "html-loader",
      },
      {
        test: /\.(jpe?g|png)$/i,
        type: "asset/resource",
        generator: {
          filename: "images/[name]-[hash][ext]",
        },
        use: [
          {
            loader: "image-webpack-loader",
            options: {
              pngquant: {
                quality: [0.9, 0.95],
              },
            },
          },
        ],
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 10kb
          },
        },
      },
    ],
  },
  devServer: {
    hot: true,
    liveReload: false,
    proxy: {
      "/": "http://localhost:3000",
    },
    static: {
      publicPath: "/",
      directory: path.resolve(__dirname),
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "index.html",
    }),
  ].concat(
    devMode
      ? []
      : [
          new MiniCssExtractPlugin({
            filename: "style.css",
          }),
        ]
  ),
  resolve: {
    alias: { "react-dom": "@hot-loader/react-dom" },
  },
};
