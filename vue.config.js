const path = require('path')
module.exports = {
  css: {
    extract: false
  },
  // 修改 src 目录 为 examples 目录
  pages: {
    index: {
      entry: 'examples/main.js'
    }
  },
  // output: {
  //   filename: 'zh-lazy-component.min.js',
  //   library: 'zh-lazy-component',
  //   libraryTarget: 'umd',
  //   umdNamedDefine: true
  // },
  // 扩展 webpack 配置，使 packages 加入编译
  chainWebpack: config => {
    config.module
      .rule('js')
      .include
      .add(path.join(__dirname, 'src'))
      .end()
      .use('babel')
      .loader('babel-loader')
      .tap(options => options)
  }
}
