function resolveIp() {
  const mode = process.env.NODE_ENV.trim()
  if (mode === 'development') {
    return '/api'
  }
  return 'http://45.32.24.99:3030'
}
export const serverIp = resolveIp()
