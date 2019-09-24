const models = []
const req = require.context('./', true, /^(?!\.\/index).*\.js$/)
req.keys().forEach(key => {
  const obj = req(key).default
  models.push(...obj)
})

export default models
