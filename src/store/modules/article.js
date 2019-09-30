import createApi from '../../api/article'
import store from '../index'

const article = {
  state: {
    articleFile:
      (sessionStorage.getItem('store') &&
        JSON.parse(sessionStorage.getItem('store')).article &&
        JSON.parse(sessionStorage.getItem('store')).article.articleFile) ||
      {},
    articleFolder:
      (sessionStorage.getItem('store') &&
        JSON.parse(sessionStorage.getItem('store')).article &&
        JSON.parse(sessionStorage.getItem('store')).article.articleFolder) ||
      {}
  },
  reducers: {
    setArticleFile(state, data) {
      return {
        ...state,
        articleFile: data
      }
    },
    setArticleFolder(state, data) {
      return {
        ...state,
        articleFolder: data
      }
    }
  },
  effects: dispatch => ({
    async createPath(obj) {
      // 新建文集
      const res = await createApi.createPath(obj)
      if (res.status === 200) {
        console.log(article)
        // 新建成功就查询
        const obj = {
          limit: 10,
          offset:
            (store.getState().article.articleFolder.data &&
              store.getState().article.articleFolder.data.datas &&
              store.getState().article.articleFolder.data.datas.length) ||
            0,
          add: 'add'
        }
        dispatch.article.getArticleFolder(obj).then(() => {
          return new Promise(resolve => resolve())
        })
      }
    },
    // 删除文集
    async deletePath(obj) {
      const res = await createApi.deletePath(obj)
      if (res.status === 200) {
        // 新建成功就查询
        const obj = {
          limit: store.getState().article.articleFolder.data.datas.length - 1,
          offset: 0
        }
        dispatch.article.getArticleFolder(obj).then(() => {
          return new Promise(resolve => resolve())
        })
      }
    },
    // 编辑文集
    async renamePath(obj) {
      const res = await createApi.renamePath(obj)
      if (res.status === 200) {
        // 新建成功就查询
        const obj = {
          limit: store.getState().article.articleFolder.data.datas.length,
          offset: 0
        }
        dispatch.article.getArticleFolder(obj).then(() => {
          return new Promise(resolve => resolve())
        })
      }
    },
    async getArticleFile(sendObj = {}) {
      const obj = {
        limit: sendObj.limit || 10,
        offset: sendObj.offset || 0,
        status: null,
        pathId: sendObj.pathId
      }
      const res = await createApi.queryFileByFolder(obj)
      if (res && res.status === 200) {
        const result = res
        if (obj.add === 'add') {
          const datas = store.getState().article.articleFile.data.datas
          datas.push(...res.data.datas)
          result.data.datas = datas
        }
        result.init = true
        dispatch.article.setArticleFile(result)
        return new Promise(resolve => resolve(result))
      }
    },
    async getArticleFolder(sendObj = {}) {
      const obj = {
        limit: sendObj.limit || 10,
        offset: sendObj.offset || 0,
        openid: JSON.parse(sessionStorage.getItem('userInfo')).openid
      }
      const res = await createApi.pathsInfoByOpenId(obj)
      if (res && res.status === 200) {
        const result = res
        if (sendObj.add === 'add') {
          const datas = store.getState().article.articleFolder.data.datas
          datas.push(...res.data.datas)
          result.data.datas = datas
        }
        result.init = true
        dispatch.article.setArticleFolder(result)
        return new Promise(resolve => resolve(result))
      }
    }
  })
}

export default article
