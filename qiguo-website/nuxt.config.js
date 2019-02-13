const pkg = require('./package')
const webpack = require('webpack')
module.exports = {
  mode: 'universal',

    /*
    ** Headers of the page
    */
    head: {
        title: pkg.name,
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: pkg.description }
        ],
        link: [
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
            { rel: 'stylesheet', type: 'text/css', href: '/css/tw.css' },
            { rel: 'stylesheet', type: 'text/css', href: '/css/reset.css' },
            { test: /\.less$/, loader: "style-loader!css-loader!less-loader"}
        ]
    },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#f68e4f' },

  /*
  ** Global CSS
  */
  css: [
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
      '~/plugins/iview'
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
  ],

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    plugins: [
      new webpack.ProvidePlugin({
        '$': 'jquery'
      })
    ],
    extend(config, ctx) {
      
    }
  }
}
