import { init, destory } from '@/utils/snow.js'
const animate = {
  state: {
    snow:
      (sessionStorage.getItem('store') &&
        JSON.parse(sessionStorage.getItem('store')).animate &&
        JSON.parse(sessionStorage.getItem('store')).animate.snow) ||
      false
  },
  reducers: {
    setSnow(state, data) {
      return {
        ...state,
        snow: data
      }
    }
  },
  effects: (dispatch, ...rest) => ({
    async getSnow(data) {
      dispatch.animate.setSnow(data)
      if (data && !animate.state.snow) {
        init()
      } else if (!data && animate.state.snow) {
        destory()
      }
    }
  })
}

export default animate
