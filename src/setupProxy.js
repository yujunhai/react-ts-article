const proxy = require('http-proxy-middleware')

module.exports = function(app) {
  app.use(
    proxy('/api', {
      target: 'http://yrbing.com.cn:3030',
      changeOrigin: true,
      pathRewrite: {
        '^/api': ''
      }
    })
  )
}
