const webpackConfig = require('./config/webpack.config')

const { overrideDevServer } = require('customize-cra')
module.exports = {
  webpack: webpackConfig,
  //处理跨域
  devServer: overrideDevServer((config) => {
    config.proxy = {
      '/api/': {
        target: 'http://127.0.0.1:7001/v1',
        changeOrigin: true,
        pathRewrite: { '^/api/': '/' }
      },
      '/external-api/': {
        target: 'https://jsonplaceholder.typicode.com',
        changeOrigin: true,
        pathRewrite: { '^/external-api/': '/' }
      }
    }
    return config
  })
}
