//用于修改webpack默认配置
const {
  override,
  addWebpackAlias,
  fixBabelImports,
  addLessLoader,
  addPostcssPlugins
} = require('customize-cra')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const webpack = require('webpack')
const path = require('path')
const WebpackBar = require('webpackbar')
const darkThemeVars = require('antd/dist/dark-theme')
const {addReactRefresh} = require('customize-cra-react-refresh')
// 分析打包大小
const addAnalyze = () => (config) => {
  let plugins = [new BundleAnalyzerPlugin({analyzerPort: 7777})]
  config.plugins = [...config.plugins, ...plugins]
  return config
}

// 打包体积优化
const addOptimization = () => (config) => {
  if (process.env.NODE_ENV === 'production') {
    config.optimization = {
      splitChunks: {
        chunks: 'all',
        minSize: 30000,
        maxSize: 0,
        minChunks: 1,
        maxAsyncRequests: 5,
        maxInitialRequests: 3,
        automaticNameDelimiter: '~',
        name: true,
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: 10
          },
          default: {
            minChunks: 2,
            priority: -10,
            reuseExistingChunk: true
          }
        }
      }
    }

    // 关闭sourceMap
    config.devtool = false
    // 添加js打包gzip配置
    config.plugins.push(
      new CompressionWebpackPlugin({
        test: /\.js$|\.css$/,
        threshold: 1024
      }),
      new webpack.optimize.AggressiveMergingPlugin(), //合并块
      new webpack.optimize.ModuleConcatenationPlugin(),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production')
        // 标题或其他...
      })
    )
  }
  return config
}

// 添加webpack编译进度条
const addWebpackBar = () => (config) => {
  let plugins = [new webpack.ProgressPlugin(), new WebpackBar()]
  config.plugins = [...config.plugins, ...plugins]
  return config
}

module.exports = override(
  // addAnalyze(),
  addWebpackBar(),
  // 配置路径别名
  addWebpackAlias({
    '@': path.resolve('src')
  }),
  addOptimization(),
  addReactRefresh(),
  // 针对antd 实现按需打包：根据import来打包 (使用babel-plugin-import)
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true //自动打包相关的样式 默认为 style:'css'
  }),
  // 使用less-loader对源码重的less的变量进行重新制定，设置antd自定义主题
  addLessLoader({
    lessOptions: {
      javascriptEnabled: true,
      modifyVars: {
        hack: `true;@import "${require.resolve(
          'antd/lib/style/color/colorPalette.less'
        )}";`,
        ...darkThemeVars,
        '@primary-color': '#6e41ff',
        // 'primary-color': '#1DA57A', // 无效
        '@link-color': '#1DA57A'
      },
      modules: {
        localIdentName: '[local]--[hash:base64:5]' // use less-modules
      }
    }
  }),
  // 如果使用 高版本的 CRA 只需要在项目根目录加入 postcss.config.js 文件即可
  addPostcssPlugins([
    require('tailwindcss')('./tailwind.config.js') // 默认路径为根目录/tailwind.config.js, 此处可以不指定
    // require('autoprefixer') // 需要兼容性处理 https://github.com/postcss/postcss/wiki/PostCSS-8-for-end-users
  ])
  // adjustStyleLoaders(({ use: [, css, postcss, resolve, processor] }) => {
  //   css.options.sourceMap = true // css-loader
  //   postcss.options.sourceMap = true // postcss-loader
  //   // when enable pre-processor,
  //   // resolve-url-loader will be enabled too
  //   if (resolve) {
  //     resolve.options.sourceMap = true // resolve-url-loader
  //   }
  //   // pre-processor
  //   if (processor && processor.loader.includes('less-loader')) {
  //     processor.options.sourceMap = true // less-loader
  //   }
  // })
)
