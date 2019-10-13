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
  // 新建文章
  CreateArticle: {
    url: '/article/CreateArticle',
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
  // 发布文章
  UpdateArticleStatusById: {
    url: '/article/UpdateArticleStatusById',
    options: {
      method: 'PUT', // optional
      showLoading: false
    }
  },
  // 删除文集
  deletePath: {
    url: '/article/deletePath',
    options: {
      method: 'POST' // optional
    }
  },
  // 删除文章
  DeleteArticleById: {
    url: '/article/DeleteArticleById',
    options: {
      method: 'DELETE' // optional
    }
  },
  // 编辑文章
  UpdateArticleInfoById: {
    url: '/article/UpdateArticleInfoById',
    options: {
      method: 'PUT', // optional
      showLoading: false
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
  },
  // 查询某个人发布的文章
  GetPublishArticlesByOpenId: {
    url: '/article/GetPublishArticlesByOpenId',
    options: {
      showLoading: false
    }
  },
  // 查询具体文章
  GetArticlesById: {
    url: '/article/GetArticlesById',
    options: {
      showLoading: false
    }
  }
}

export default createApi(config)
