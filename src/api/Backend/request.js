import Qs from 'qs'
import axios from 'axios'
import stroage from './stroage'
import Cookie from 'js-cookie'
// import router from '../router'
var root = 'http://statistics.isunupcg.com'
const service = axios.create({
  // baseURL: process.env.BASE_API, // api的base_url
  baseURL: root, // api的base_url
  timeout: 600000, // 请求超时时间
  transformRequest: [function (data) {
    data = Qs.stringify(data)
    return data
  }],
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

// request拦截器
service.interceptors.request.use(config => {
  let token = Cookie.get('p2_token')
  // let token = stroage.get('token')
  if (token) {
    // token = token // 把token加入到默认请求参数中
    config.headers.common['token'] = token
  } else {
    // if (config.url != '/login/login') {
    // window.location.href = 'http://hvr.isunupcg.com/RunXiShan'
    // }
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
    /**
     * res为非0是抛错 可结合自己业务进行修改
     */
    const status = response.status
    const res = response.data

    if (status === 200 || status === 201) {
      if (res.res === 0) {
        return Promise.resolve(res)
      } else if (res.res === 1) {
        // MessageBox.alert(res.msg)
        return Promise.reject(res)
      } else if (res.res === 2) {
        return Promise.resolve(res)
      } else if (res.res === 1002 || res.res === 1003) { // res = 1003 1002 等
        // 写入错误信息
        ErrorCb(res.msg)
        // MessageBox.alert('登录异常，请重新登录')
        Cookie.remove('p2_token')
        Cookie.remove('user_type')
        // window.location.href = 'http://hvr.isunupcg.com/RunXiShan'
        return Promise.reject(res)
      }
    } else {
      // 写入错误信息
      ErrorCb('网络连接出错, error_code: ' + status)
      return Promise.reject(res)
    }
  },
  error => {
    // ErrorCb('网络连接出错')
    console.log('err' + error) // for debug
    return Promise.reject(error)
  }
)

// 写入错误信息
function ErrorCb(msg) {
  // MessageBox.alert(msg)
  Cookie.set('error_msg', msg)
  // 导航到错误页面
}
export default service
