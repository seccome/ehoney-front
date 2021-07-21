/* eslint-disable */
const path = require('path')
const packageConfig = require('./package.json')
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin')

// 版本号取package.json
const APP_VERSION = packageConfig.version
const APP_NAME = packageConfig.name

// 打包目录
const OUTPUT_DIR = 'dist'

// resolve方法
function resolve(dir) {
  return path.join(__dirname, '.', dir)
}
// console.log('MODE', MODE)
// 获取参数
const getGroupId = () => {
  return getArgv('groupId') || ''
}

const getArgv = (name) => {
  const findIndex = process.argv.findIndex(v => v === `--${name}`)
  if (findIndex === -1) return ''
  const value = process.argv[findIndex + 1]

  return value
}
module.exports = {
  outputDir: OUTPUT_DIR,
  publicPath: '/decept-defense',
  assetsDir: 'static',
  indexPath: 'index.html',
  crossorigin: 'anonymous',
  lintOnSave: false,
  chainWebpack: config => {
    config.optimization.minimizer('terser').tap(args => {
      args[0].terserOptions.compress.drop_console = true
      args[0].terserOptions.compress.drop_debugger = true

      return args
    })

    // 修改CopyWebpackPlugin
    config.plugin('copy').tap(args => {
      args[0][0].to = path.resolve(__dirname, `./${OUTPUT_DIR}`)

      return args
    })

    // 优化
    config.plugins.delete('prefetch')
    config.plugins.delete('preload')

    // 修改 process.env
    config.plugin('define').tap(definitions => {
      const opt = {}
      const groupId = JSON.stringify(getGroupId())
      const baseUrl = getArgv('baseUrl')
      if (groupId) {
        opt.groupId = groupId
      }
      if (baseUrl) {
        opt.VUE_APP_API_URL = JSON.stringify(baseUrl+'/deceptdefense/api')
      }
      Object.assign(definitions[0]['process.env'], opt)

      return definitions
    })
  },
}
