// import darkTheme from '@ant-design/dark-theme'
const { override, fixBabelImports, addLessLoader, addWebpackAlias, addWebpackModuleRule } = require('customize-cra')
const path = require('path')
const CompressionPlugin = require('compression-webpack-plugin')
const webpack = require('webpack')
// console.log(darkTheme)
const zgipConfig = () => config => {
  config.plugins.push(
    new CompressionPlugin({
      filename: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.(js|html|css|jsx)$/,
      threshold: 10240,
      minRatio: 0.8
    })
  )
  return config
}
// process.argv.splice(2)[0] ||
// const revisePathConfig = () => config => {
//   config.output.publicPath = '' // 默认是’/‘ 这里改成你想要的
//   return config
// }

const argvConfig = () => config => {
  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env.ENV_RGV': JSON.stringify(process.argv.splice(2)[0]) || JSON.stringify('new')
    })
  )
  return config
}

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: { '@primary-color': '#1DA57A' }
    // strictMath: true,
    // noIeCompat: true,
    // localIdentName: '[local]--[hash:base64:5]'
  }),
  addWebpackAlias({ '@': path.resolve(__dirname, 'src') }),
  // addWebpackModuleRule({
  //   loader: 'less-loader',
  //   options: {
  //     modifyVars: darkTheme
  //   }
  // }),
  argvConfig(),
  zgipConfig()
  // revisePathConfig()
)
