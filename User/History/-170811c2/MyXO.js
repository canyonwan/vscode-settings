const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const IS_DEV = process.env.NODE_ENV !== 'production'
/**
 * @todo 开发环境配置
 * 某些实用工具， plugins 和 loaders 都只能在构建生产环境时才有用
 * 在开发时使用 UglifyJsPlugin 来压缩和修改代码是没有意义的,不压缩
 */

const DEVELOPMENT = (webpackConfig) => {
  /**
   * @todo 启用 eval-source-map 更好的测试
   * 每个模块使用 eval() 执行，并且 source map 转换为 DataUrl 后添加到 eval() 中。
   * 初始化 source map 时比较慢，但是会在重新构建时提供比较快的速度，并且生成实际的文件。
   * 行数能够正确映射，因为会映射到原始代码中。它会生成用于开发环境的最佳品质的 source map。
   */

  webpackConfig.store.set('devtool', 'eval-source-map')
  webpackConfig.plugin('html').tap(([options]) => [
    Object.assign(options, {
      minify: false,
      chunksSortMode: 'none'
    })
  ])

  webpackConfig.plugin('BundleAnalyzerPlugin').use(BundleAnalyzerPlugin)

  return webpackConfig
}

/**
 * @todo 生产环境配置
 * 每个额外的 loader/plugin 都有启动时间。尽量少使用不同的工具
 */

const PRODUCTION = (webpackConfig) => {
  /**
   * @todo 不需要启用 source-map，去除 console 的情况下 source-map 根本没用，还浪费大量时间和空间
   * 详情见：https://webpack.js.org/configuration/devtool/#devtool
   */
  webpackConfig.store.set('devtool', '')
  webpackConfig.plugin('html').tap(([options]) => [
    Object.assign(options, {
      minify: {
        removeComments: true,
        removeCommentsFromCDATA: true,
        collapseWhitespace: true,
        conservativeCollapse: false,
        collapseInlineTagWhitespace: true,
        collapseBooleanAttributes: true,
        removeRedundantAttributes: true,
        removeAttributeQuotes: false,
        removeEmptyAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
        minifyJS: true,
        minifyCSS: true
      },
      cache: true, // 仅在文件被更改时发出文件
      hash: true, // true则将唯一的webpack编译哈希值附加到所有包含的脚本和CSS文件中,这对于清除缓存很有用
      scriptLoading: 'defer', // 现代浏览器支持非阻塞javascript加载（'defer'）,以提高页面启动性能。
      inject: true, // true所有javascript资源都将放置在body元素的底部
      chunksSortMode: 'none'
    })
  ])

  return webpackConfig
}
module.exports = {
  pages: {
    home: 'src/home-views/main.ts',
    manage: 'src/views/main.ts'
  },
  // publicPath: '/',
  css: {
    loaderOptions: {
      less: {
        globalVars: {},
        modifyVars: {
          'primary-color': '#0E78DC',
          'link-color': '#1463EF',
          'border-radius-base': '5px',
          'heading-color': '#222222',
          'error-color': '#D02902',
          'input-height-base': '29px',
          'input-padding-vertical-base': '3px',
          'form-item-margin-bottom': '13px',
          'tree-node-selected-bg': '#F3F9FF',
          'tree-title-height': '28px'
        },
        srouceMap: IS_DEV,
        lessOptions: {
          javascriptEnabled: true
        }
      }
    }
  },
  devServer: {
    port: 2104, // 端口号
    https: false, // https:{type:Boolean}
    open: true // 置自动启动浏览器
    // proxyTable: {
    //   '/api': {
    //     target: 'http://192.168.124.23:15000',
    //     changeOrigin: true
    //   }
    // }
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: ['./src/styles/index.less']
    }
  },
  /**
   * @description 去掉 console信息
   *  config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true;
   *  html-webpack-plugin插件配置详情见 https://github.com/jantimon/html-webpack-plugin#options
   */
  configureWebpack: (config) => {
    config.optimization = {
      splitChunks: {
        chunks: 'all',
        minSize: 3000, // （默认值：30000）块的最小大小。
        minChunks: 1, //（默认值：1）在拆分之前共享模块的最小块数
        maxAsyncRequests: 5, //（默认值为5）按需加载时并行请求的最大数量
        maxInitialRequests: 6, // （默认值为3）入口点的最大并行请求数
        automaticNameDelimiter: '-',
        name: true,
        cacheGroups: {
          lodash: {
            name: 'lodash',
            test: /[\\/]node_modules[\\/]lodash[\\/]/,
            priority: 20
          },
          vue: {
            name: 'vue',
            test: /[\\/]node_modules[\\/]vue[\\/]/
          },
          vuex: {
            name: 'vuex',
            test: /[\\/]node_modules[\\/]vuex[\\/]/
          },
          'vuex-presistedstate': {
            name: 'vuex-presistedstate',
            test: /[\\/]node_modules[\\/]vuex-presistedstate[\\/]/
          },
          'vue-router': {
            name: 'vue-router',
            test: /[\\/]node_modules[\\/]vue-router[\\/]/
          },
          'ant-design-vue': {
            name: 'ant-design-vue',
            test: /[\\/]node_modules[\\/]ant-design-vue[\\/]/
          },
          moment: {
            name: 'moment',
            test: /[\\/]node_modules[\\/]moment[\\/]/,
            priority: 40
          }
        }
      }
    }
    // [
    // Fix: Error: listen EADDRINUSE: address already in use 127.0.0.1:8888
    // new BundleAnalyzerPlugin({
    //   analyzerPort: process.env.VUE_CLI_MODERN_BUILD ? 8888 : 9999 // Prevents build errors when running --modern
    // })
    // ]
  },
  chainWebpack: (config) => {
    config.resolve.symlinks(true)

    if (process.env.use_analyzer) {
      config.plugin('webpack-bundle-analyzer').use(BundleAnalyzerPlugin)
    }
    config
      .plugin('html')
      .use('html')
      .tap((args) => {
        args[0].title = '行政执法云监督平台'
        return args
      })
    IS_DEV ? DEVELOPMENT(config) : PRODUCTION(config)
  },
  productionSourceMap: false,
  lintOnSave: true
}
