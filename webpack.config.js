//* I have changed this to allow us to import css and scss
//* Files directly into components on the front end. ~Brynn
module.exports = {
  entry: ["./client/index.js"],
  output: {
    path: __dirname,
    filename: "./public/bundle.js",
  },
  // mode: 'development',
  context: __dirname,
  devtool: "source-map",
  resolve: {
    extensions: [".js", ".jsx", ".css", ".scss"],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-react"],
        },
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },
};
//* In case you wanted to see the old config
//* I did not delete it!
// module.exports = {
//   entry: [
//     './client/index.js'
//   ],
//   output: {
//     path: __dirname,
//     filename: './public/bundle.js'
//   },
//   devtool: 'source-map',
//   module: {
//     rules: [
//       {
//         test: /\.jsx?$/,
//         exclude: /node_modules/,
//         loader: 'babel-loader',
//         options: {
//           presets: [
//             '@babel/preset-react'
//           ]
//         }
//       }
//     ]
//   }
// }
