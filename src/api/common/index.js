import createApi from '../createApi'

const config = {
  // 上传文集
  uploadFile: {
    url: '/common/uploadFile',
    options: {
      showLoading: false,
      method: 'POST', // optional
      contentType: 'formData'
    }
  }
}

export default createApi(config)
