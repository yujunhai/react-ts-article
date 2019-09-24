import { init } from '@rematch/core'
import { reducer as reduxAsyncConnect } from 'redux-connect'
import createRematchPersist from '@rematch/persist'
import models from './modules'

function createStore() {
  // 添加的离线缓存，其实就是缓存在localStorage  主要是针对账号的问题
  const persistPlugin = createRematchPersist({
    whitelist: ['demo'],
    throttle: 50,
    version: 1
  })

  const store = init({
    models,
    redux: {
      reducers: {
        reduxAsyncConnect
      }
    },
    plugins: [persistPlugin]
  })

  return store
}

const store = createStore()
export default store
