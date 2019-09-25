import createApi from '../createApi'

const config = {
  register: {
    url: '/account/register',
    options: {
      method: 'POST' // optional
    }
  },
  login: {
    url: '/account/login',
    options: {
      method: 'POST' // optional
    }
  }
}

export default createApi(config)
