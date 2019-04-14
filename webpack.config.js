var path = require('path')
var webpack = require('webpack')
var UglifyJsPlugin = require("uglifyjs-webpack-plugin");
var outputFileName = 'bundle'

var config = {
  context: path.resolve(__dirname, './'),

  entry: ['./src/index.ts'],

  output: {
    // output to './dist' folder 
    path: path.resolve(__dirname, 'dist'),

    // with filename
    filename: 'Scripts/' + outputFileName + '.js',

    // mark /dist/ folder as a public path so index.html can reach it
    // github pages /Coins/dist/
    publicPath: '/Coins/dist/'
  },

  // webpack-dev-server config, see: https://webpack.github.io/docs/webpack-dev-server.html
  devServer: {
    contentBase: './',
    hot: true,
    inline: true,
    port: 8080
  },

  // http://webpack.github.io/docs/configuration.html#devtool
  devtool: '#eval-source-map',

  resolve: {
    extensions: ['.js', '.ts'],
    alias: {
      'vue$': 'vue/dist/vue.common.js'
    }
  },

  module: {
    rules: [
      { test: /\.html$/, loader: 'html-loader' },
      {
        test: /\.(s*)css$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      // Fonts
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff',
        query: {
          name: 'Content/images/[name].[hash:8].[ext]'
        }
      }, {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader',
        query: {
          name: 'fonts/[name].[hash:8].[ext]'
        }
      },
      // Load images.
      {
        test: /\.(gif|jpe?g|png)$/,
        loader: 'url-loader?limit=25000',
        query: {
          limit: 10000,
          name: 'Content/images/[name].[hash:8].[ext]'
        }
      },
    ]
  },

  plugins: [
    // HMR issue, see: https://github.com/webpack/webpack/issues/1151
    new webpack.HotModuleReplacementPlugin()
  ]

}

// When use in production (npm run build)
if (process.env.NODE_ENV === 'production') {

  // You may want to use different name for production
  // config.output.filename = outputFileName + '.min.js'

  // still need babel for production stage since uglifyJs not support es6
  config.module.rules = (config.module.rules || []).concat([
    { test: /\.ts(x?)$/, loader: 'babel-loader?presets[]=es2015!ts-loader' },
    { test: /\.js$/, loader: 'babel-loader', query: { presets: ['es2015'] } }
  ])

  config.devtool = '#source-map'

  // https://vuejs.org/guide/deployment.html
  config.plugins = (config.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new UglifyJsPlugin({
      uglifyOptions: {
        warnings: false,
        ie8: false,
        output: {
          comments: false
        }
      }
    }),
    new webpack.optimize.OccurrenceOrderPlugin()
  ])

} else {

  config.module.rules = config.module.rules.concat([
    { test: /\.ts(x?)$/, loader: 'ts-loader' }
  ])

}


module.exports = config
