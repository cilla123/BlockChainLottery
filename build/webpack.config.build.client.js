/* eslint-disable */
const HTMLPlugin = require('html-webpack-plugin')
const { GenerateSW } = require('workbox-webpack-plugin')
const AutoDllPlugin = require('autodll-webpack-plugin')
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin")
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const path = require('path')

const smp = new SpeedMeasurePlugin()

const config = smp.wrap({
  optimization: {
    minimizer: [
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  plugins: [
    // 查看打包结果日志
    // new BundleAnalyzerPlugin({
    //   analyzerMode: 'server',
    //   analyzerHost: '127.0.0.1',
    //   analyzerPort: 8888,
    //   reportFilename: 'report.html',
    //   defaultSizes: 'parsed',
    //   openAnalyzer: false,
    //   generateStatsFile: false,
    //   statsFilename: 'stats.json',
    //   logLevel: 'info',
    // }),
    new HTMLPlugin({
      template: path.join(__dirname, '../src/client/index.html'),
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      }, // 传一个html-minifier 配置object来压缩输出
      hash: true, // 如果是true，会给所有包含的script和css添加一个唯一的webpack编译hash值。这对于缓存清除非常有用
    }),
    // pwa 插件
    new GenerateSW({
      // set prefix
      cacheId: 'webpack-pwa',
      skipWaiting: true, // 强制等待中的 Service Worker 被激活
      clientsClaim: true, // Service Worker 被激活后使其立即获得页面控制权
      swDest: 'service-wroker.js', // 输出 Service worker 文件
      globPatterns: ['**/*.{html,js,css,png.jpg}'], // 匹配的文件
      globIgnores: ['service-wroker.js'], // 忽略的文件
      // 配置路由请求缓存
      runtimeCaching: [{
        urlPattern: /.*\.js/, // 匹配文件
        handler: 'networkFirst' // 网络优先
      }]
    }),
    // dll 生成
    new AutoDllPlugin({
      // 插入html
      inject: true,
      debug: true,
      filename: 'dll_[name]_[hash].js',
      entry: {
        vendor: ['react', 'react-dom', 'mobx', 'mobx-react', 'react-router', 'react-router-dom'],
      }
    }),
    // 把对JS文件的串行压缩变为开启多个子进程并行进行uglify
    new ParallelUglifyPlugin({
      workerCount: 4,
      sourceMap: false,
      uglifyJS: {
        output: {
          beautify: false, // 不需要格式化
          comments: false // 保留注释
        },
        compress: { // 压缩
          warnings: false, // 删除无用代码时不输出警告
          drop_console: true, // 删除console语句
          collapse_vars: true, // 内嵌定义了但是只有用到一次的变量
          reduce_vars: true // 提取出出现多次但是没有定义成变量去引用的静态值
        }
      }
    })
  ]
})

module.exports = config;
