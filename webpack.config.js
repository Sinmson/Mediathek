var path = require('path');
var webpack = require('webpack');
var ExtractTextWebpackPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var CleanWebpackPlugin = require('clean-webpack-plugin');

var extractPlugin = new ExtractTextWebpackPlugin({
  filename: "css/main.css"
});

module.exports = {
  entry: './src/js/main.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'js/build.js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
            // the "scss" and "sass" values for the lang attribute to the right configs here.
            // other preprocessors should work out of the box, no loader config like this necessary.
            'scss': 'vue-style-loader!css-loader!sass-loader',
            'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
          }
          // other vue-loader options go here
        }
      },
      {
        test: /\.scss$/,
        use: extractPlugin.extract({
          use: ["css-loader", "sass-loader"]
        })

      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ["es2015"]
            }
          }]
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: 'img/[name].[ext]'
        }
      },
      {
        test: /\.html$/,
        use: ["html-loader"]
      }
    ]
  },
  plugins: [
    extractPlugin,
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "src/index.html"
    })
    //new CleanWebpackPlugin(["dist"])
  ],
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map'
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}
