// 使用严格模式，更多严格模式可以查看
// [阮一峰老师的es标准入门](http://es6.ruanyifeng.com/?search=%E4%B8%A5%E6%A0%BC%E6%A8%A1%E5%BC%8F&x=0&y=0#docs/function#%E4%B8%A5%E6%A0%BC%E6%A8%A1%E5%BC%8F)
'use strict'
//引入node的path模块
const path = require('path')

// 引入工具函数
const utils = require('./utils')

// 引入配置文件，也就是config/index.js文件
const config = require('../config')

// 引入vue-loader的配置文件
const vueLoaderConfig = require('./vue-loader.conf')

// 定义获取绝对路径函数
function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

// 创建eslint配置
const createLintingRule = () => ({
  test: /\.(js|vue)$/,
  loader: 'eslint-loader',
  // 执行顺序，前置，还有一个选项是post是后置
  // 把 eslint-loader 的执行顺序放到最前面，防止其它 Loader 把处理后的代码交给 eslint-loader 去检查
  enforce: 'pre',
  // 包含文件夹
  include: [resolve('src'), resolve('test')],
  options: {
    // 使用友好的eslint提示插件
    formatter: require('eslint-friendly-formatter'),
    // eslint报错提示是否显示以遮罩形式显示在浏览器中
    // 这里showEslintErrorsInOverlay配置是false
    emitWarning: !config.dev.showEslintErrorsInOverlay
  }
})

module.exports = {
  // 运行环境的上下文，就是实际的目录，也就是项目根目录
  context: path.resolve(__dirname, '../'),
  // 入口
  entry: {
    app: './src/main.js'
  },
  // 输出
  output: {
    // 路径 这里是根目录下的dist
    path: config.build.assetsRoot,
    // 文件名
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      // 这里是 /，但要上传到github pages等会路径不对，需要修改为./
      ? config.build.assetsPublicPath
      // 这里配置是 /
      : config.dev.assetsPublicPath
  },
  // Webpack 在启动后会从配置的入口模块出发找出所有依赖的模块，Resolve 配置 Webpack 如何寻找模块所对应的文件。
  resolve: {  //解析模块的可选项
    // 配置了这个，对应的扩展名可以省略
    extensions: ['.js', '.vue', '.json'],
    alias: {  //模快别名列表
      // 给定对象的键后的末尾添加 $，以表示精准匹配 node_modules/vue/dist/vue.esm.js
      // 引用 import Vue from 'vue'就是引入的这个文件最后export default Vue 导出的Vue;
      // 所以这句可以以任意大写字母命名 比如：import V from 'vue'
      'vue$': 'vue/dist/vue.esm.js',
      // src别名 比如 ：引入import HelloWorld from '@/components/HelloWorld'
      '@': resolve('src'),
    }
  },
  // 定义一些文件的转换规则
  module: {     //模块的相关配置
    rules: [    //根据文件的后缀提供一个loader,解析规则
      // 是否使用eslint 这里配置是true
      ...(config.dev.useEslint ? [createLintingRule()] : []),
      {
        test: /\.vue$/,
        // vue-loader中文文档：https://vue-loader-v14.vuejs.org/zh-cn/
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        // js文件使用babel-loader转换
        test: /\.js$/,
        loader: 'babel-loader',   //es6 => es5
        include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
      },
      {
        // 图片文件使用url-loader转换
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          // 限制大小10000B(bytes)以内，转成base64编码的dataURL字符串
          limit: 10000,
          // 输出路径 img/名称.7位hash.扩展名
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        // 视频文件使用url-loader转换
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        // 图标字体使用url-loader转换
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  // 这里的node是一个对象，其中每个属性都是 Node.js 全局变量或模块的名称，每个 value 是以下其中之一
  // empty 提供空对象。
  // false 什么都不提供。
  // 更多查看 中文文档：https://webpack.docschina.org/configuration/node/
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    // 防止webpack注入一些polyfill 因为Vue已经包含了这些。
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
}
