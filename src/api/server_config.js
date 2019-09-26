function resolveIp() {
  const mode = process.env.NODE_ENV.trim()
  if (mode === 'development') {
    return '/api'
  }
  return 'http://yrbing.com.cn:3030'
}
export const serverIp = resolveIp()
