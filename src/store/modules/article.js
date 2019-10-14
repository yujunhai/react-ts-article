import createApi from '../../api/article'
import store from '../index'
import constant from '@/utils/constant.js'

const article = {
  state: {
    // 文章列表
    articleFile:
      (sessionStorage.getItem('store') &&
        JSON.parse(sessionStorage.getItem('store')).article &&
        JSON.parse(sessionStorage.getItem('store')).article.articleFile) ||
      {},
    // 发布的文章列表
    publishedFile:
      (sessionStorage.getItem('store') &&
        JSON.parse(sessionStorage.getItem('store')).article &&
        JSON.parse(sessionStorage.getItem('store')).article.publishedFile) ||
      {},
    // 个人发布的文章列表
    personPublishedFile:
      (sessionStorage.getItem('store') &&
        JSON.parse(sessionStorage.getItem('store')).article &&
        JSON.parse(sessionStorage.getItem('store')).article.personPublishedFile) ||
      {},
    // 文集列表
    articleFolder:
      (sessionStorage.getItem('store') &&
        JSON.parse(sessionStorage.getItem('store')).article &&
        JSON.parse(sessionStorage.getItem('store')).article.articleFolder) ||
      {},
    // 文章内容
    articleFileContent:
      (sessionStorage.getItem('store') &&
        JSON.parse(sessionStorage.getItem('store')).article &&
        JSON.parse(sessionStorage.getItem('store')).article.articleFileContent) ||
      {}
  },
  reducers: {
    setArticleFile(state, data) {
      return {
        ...state,
        articleFile: data
      }
    },
    setPublishedFile(state, data) {
      return {
        ...state,
        publishedFile: data
      }
    },
    setPersonPublishedFile(state, data) {
      return {
        ...state,
        personPublishedFile: data
      }
    },
    setArticleFileContent(state, data) {
      return {
        ...state,
        articleFileContent: data
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
        // 新建成功就查询
        const obj = {
          limit:
            store.getState().article.articleFolder.data && store.getState().article.articleFolder.data.page.total + 1,
          offset: 0
        }
        return new Promise(resolve => resolve(dispatch.article.getArticleFolder(obj)))
      }
    },
    async createArticle(sendObj = {}) {
      const obj = {
        pathId: sendObj.pathId,
        title: sendObj.title,
        openid: store.getState().account.userInfo.openid,
        author: store.getState().account.userInfo.name
      }
      // 新建文章
      const res = await createApi.CreateArticle(obj)
      if (res.status === 200) {
        // 新建成功就查询
        const obj = {
          limit: store.getState().article.articleFile.data && store.getState().article.articleFile.data.page.total + 1,
          offset: 0,
          pathId: sendObj.pathId
        }
        return new Promise(resolve => resolve(dispatch.article.getArticleFile(obj)))
      }
    },
    // 编辑文章
    async UpdateArticleInfoById(sendObj = {}) {
      console.log(sendObj)
      const obj = {
        id: sendObj.id,
        title: sendObj.title,
        content: sendObj.content,
        pictureUrl: sendObj.pictureUrl,
        abstract: sendObj.abstract
      }
      // 新建文章
      const res = await createApi.UpdateArticleInfoById(obj)
      if (res.status === 200) {
        // 新建成功就查询
        const obj = {
          limit: store.getState().article.articleFile.data && store.getState().article.articleFile.data.page.total,
          offset: 0,
          pathId: sendObj.pathId
        }
        return new Promise(resolve => resolve(dispatch.article.getArticleFile(obj)))
      }
    },
    // 删除文集
    async deletePath(obj) {
      const res = await createApi.deletePath(obj)
      if (res.status === 200) {
        // 新建成功就查询
        const obj = {
          limit: store.getState().article.articleFolder.data.page.total - 1,
          offset: 0
        }
        dispatch.article.getArticleFolder(obj).then(() => {
          return new Promise(resolve => resolve())
        })
      }
    },
    // 删除文章
    async deleteArticle(sendObj = {}) {
      const res = await createApi.DeleteArticleById({ id: sendObj.id })
      if (res.status === 200) {
        // 新建成功就查询
        const obj = {
          limit: store.getState().article.articleFile.data.page.total - 1,
          offset: 0,
          pathId: sendObj.pathId
        }
        dispatch.article.getArticleFile(obj).then(() => {
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
          limit: store.getState().article.articleFolder.data.page.total,
          offset: 0
        }
        dispatch.article.getArticleFolder(obj).then(() => {
          return new Promise(resolve => resolve())
        })
      }
    },
    // 发布文章
    async UpdateArticleStatusById(sendObj = {}) {
      const obj = {
        id: sendObj.id,
        status: sendObj.status
      }
      const res = await createApi.UpdateArticleStatusById(obj)
      if (res.status === 200) {
        // 新建成功就查询
        const queryObj = {
          limit: store.getState().article.articleFile.data.page.total,
          offset: 0,
          pathId: sendObj.pathId,
          queryById: true,
          id: sendObj.id
        }
        dispatch.article.getPublishedFile()
        return new Promise(resolve => resolve(dispatch.article.getArticleFile(queryObj)))
      }
    },
    // 根据id查询具体文章
    async getArticleFileById(id) {
      const obj = {
        id
      }
      const res = await createApi.GetArticlesById(obj)
      if (res && res.status === 200) {
        console.log(res)
        dispatch.article.setArticleFileContent(res)
        return new Promise(resolve => resolve(res))
      }
    },
    // 清除文章内容
    async clearFileContent() {
      dispatch.article.setArticleFileContent({})
      return new Promise(resolve => resolve())
    },
    // 获取文章列表
    async getArticleFile(sendObj = {}) {
      const obj = {
        limit: sendObj.limit || constant.LIMIT,
        offset: sendObj.offset || 0,
        status: null,
        pathId: sendObj.pathId
      }
      const res = await createApi.queryFileByFolder(obj)
      if (res && res.status === 200) {
        const result = res
        if (sendObj.add === 'add') {
          const datas = store.getState().article.articleFile.data.datas
          datas.push(...res.data.datas)
          result.data.datas = datas
        }
        result.init = true
        dispatch.article.setArticleFile(result)
        if (sendObj.queryById) {
          return new Promise(resolve => resolve(dispatch.article.getArticleFileById(sendObj.id)))
        } else {
          return new Promise(resolve => resolve(result))
        }
      }
    },
    // 获取发布文章列表
    async getPublishedFile(sendObj = {}) {
      const obj = {
        limit: sendObj.limit || constant.LIMIT,
        offset: sendObj.offset || 0
      }
      const res = await createApi.publishArticleQuery(obj)
      if (res && res.status === 200) {
        const result = res
        if (sendObj.add === 'add') {
          const datas = store.getState().article.publishedFile.data.datas
          datas.push(...res.data.datas)
          result.data.datas = datas
        }
        result.init = true
        dispatch.article.setPublishedFile(result)
        return new Promise(resolve => resolve(result))
      }
    },
    // 获取个人发布文章列表
    async getPersonPublishedFile(sendObj = {}) {
      const obj = {
        openid: sendObj.openid,
        limit: sendObj.limit || constant.LIMIT,
        offset: sendObj.offset || 0
      }
      const res = await createApi.GetPublishArticlesByOpenId(obj)
      if (res && res.status === 200) {
        const result = res
        if (sendObj.add === 'add') {
          const datas = store.getState().article.personPublishedFile.data.datas
          datas.push(...res.data.datas)
          result.data.datas = datas
        }
        result.init = true
        dispatch.article.setPersonPublishedFile(result)
        return new Promise(resolve => resolve(result))
      }
    },
    // 获取文集列表
    async getArticleFolder(sendObj = {}) {
      const obj = {
        limit: sendObj.limit || constant.LIMIT,
        offset: sendObj.offset || 0,
        openid: store.getState().account.userInfo.openid
      }
      const res = await createApi.pathsInfoByOpenId(obj)
      if (res && res.status === 200) {
        const result = JSON.parse(JSON.stringify(res))
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
