const account = {
  state: {
    isLogin:
      (sessionStorage.getItem('store') &&
        JSON.parse(sessionStorage.getItem('store')).account &&
        JSON.parse(sessionStorage.getItem('store')).account.isLogin) ||
      false,
    userInfo:
      (sessionStorage.getItem('store') &&
        JSON.parse(sessionStorage.getItem('store')).account &&
        JSON.parse(sessionStorage.getItem('store')).account.userInfo) ||
      {}
  },
  reducers: {
    setIsLogin(state, data) {
      return {
        ...state,
        isLogin: data
      }
    },
    setUserInfo(state, data) {
      return {
        ...state,
        userInfo: data
      }
    }
  },
  effects: dispatch => ({
    async setIsLoginAction(val) {
      dispatch.account.setIsLogin(val)
    },
    async setUserInfoAction(obj) {
      dispatch.account.setUserInfo(obj)
    }
  })
}

export default account
