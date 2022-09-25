'use strict'
const merge = require('webpack-merge')
const devEnv = require('./dev.env')

module.exports = merge(devEnv, {
  NODE_ENV: '"production"',
  ROOT_PATH: 'test',
  BASE_API: '"https://api.zlhyyx.com"'
})
