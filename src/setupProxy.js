const proxy = require('http-proxy-middleware')

module.exports = function(app) {
  app.use(
    proxy('/api', {
      target: 'http://45.32.24.99:3030/',
      changeOrigin: true,
      pathRewrite: {
        '^/api': ''
      }
    })
  )
}
