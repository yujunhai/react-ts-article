import createApi from '../createApi'
import { serverIp } from '../server_config'

const config = {
  test: {
    url: '/game/%pageNum%/menu',
    options: {
      method: 'GET', // optional
      contentType: 'json', // optional
      errorHandler: false, // optional
      showLoading: false, // optional
      baseUrl: serverIp // optional
    }
  }
}

export default createApi(config)
