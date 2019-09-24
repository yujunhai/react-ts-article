function resolveIp() {
  const mode = process.env.NODE_ENV.trim()
  if (mode === 'development') {
    return '/api'
  }
  return 'http://http://45.32.24.99'
}
export const serverIp = resolveIp()
