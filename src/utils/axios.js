import axios from 'axios'
import { message } from 'antd'
import store from '@/redux/store'

const config = {
  timeout: 600000
  // baseURL: process.env.REACT_APP_BASE_URL
}
Object.assign(axios.defaults, config)
axios.defaults.headers['Content-Type'] = 'application/json'

// 请求前拦截
axios.interceptors.request.use(
  (req) => {
    const { token = '' } = store.getState().storeData.userInfo || {}
    req.headers.token = token
    return req
  },
  (err) => {
    return Promise.reject(err)
  }
)

// 返回后拦截
axios.interceptors.response.use(
  ({ data }) => {
    const { results } = data
    if (results.length) {
      return {
        rows: results,
        total: 200
      }
    }
    return Promise.reject(data)
  },
  (err) => {
    message.error('网络异常')
    return Promise.reject(err)
  }
)

// post请求
axios.post = (url, params) => {
  return axios({
    method: 'post',
    url,
    data: params
  })
}

// get请求
axios.get = (url, params) => {
  return axios({
    method: 'get',
    url,
    params
  })
}

export default axios
