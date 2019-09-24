const proxy = require('http-proxy-middleware')

module.exports = function(app) {
  app.use(
    proxy('/ddlog', {
      target: 'http://192.168.10.121:9000/',
      changeOrigin: true,
      pathRewrite: {
        '^/log': ''
      }
    })
  )
}
