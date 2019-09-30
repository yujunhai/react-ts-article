import createApi from '../createApi'

const config = {
  // 查询发布的文章
  publishArticleQuery: {
    url: '/article/GetPublishArticles',
    options: {
      showLoading: false
      // method: 'GET' // optional
    }
  },
  // 新建文集
  createPath: {
    url: '/article/createPath',
    options: {
      method: 'POST' // optional
    }
  },
  // 编辑文集
  renamePath: {
    url: '/article/renamePath',
    options: {
      method: 'POST' // optional
    }
  },
  // 删除文集
  deletePath: {
    url: '/article/deletePath',
    options: {
      method: 'POST' // optional
    }
  },
  // 查询文集
  pathsInfoByOpenId: {
    url: '/article/pathsInfoByOpenId',
    options: {
      showLoading: false
    }
  },
  // 查询文章
  queryFileByFolder: {
    url: '/article/GetArticlesByPath',
    options: {
      showLoading: false
    }
  }
}

export default createApi(config)
