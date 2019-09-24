import { baseUrl } from './config.js'
import store from '../store'
import storage from '../api/stroage'
import { Indicator, MessageBox, Toast } from 'mint-ui'
const parseParams = (data) => {
  try {
    var tempArr = []
    for (var i in data) {
      var key = encodeURIComponent(i)
      var value = encodeURIComponent(data[i])
      tempArr.push(key + '=' + value)
    }
    var urlParamsStr = tempArr.join('&')
    return urlParamsStr
  } catch (err) {
    return ''
  }
}

const getwebdata = async (url = '', data = {}, type = 'POST', method = 'fetch') => {
  type = type.toUpperCase()
  if (url !== '/MXkfAgentUser/GetSignVoice') {
    url = baseUrl + url
  }

  if (type === 'GET') {
    let dataStr = '' // 数据拼接字符串
    Object.keys(data).forEach(key => {
      dataStr += key + '=' + data[key] + '&'
    })

    if (dataStr !== '') {
      dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'))
      url = url + '?' + dataStr
    }
  }
  if (window.fetch && method === 'fetch') {
    let requestConfig = {
      credentials: 'include',
      method: type,
      headers: {
        'Accept': 'application/json',
        // 'Content-Type': 'application/json'
        'Content-Type': 'application/x-www-form-urlencoded',
        'TOKEN': storage.get('token')
        // "Access-Control-Allow-Origin":"*"
        // 'Content-Type': 'multipart/form-data'
      },
      mode: 'no-cors',
      cache: 'force-cache'
    }
    let form = new FormData()
    if (type === 'POST') {
      Object.defineProperty(requestConfig, 'body', {
        value: parseParams(data)
        // value: JSON.stringify(data)
        // value: form.append("param", JSON.stringify(data))
        // value: new FormData(data)
      })
    }

    try {
      const response = await fetch(url, requestConfig)

      console.log(response)
      const responseJson = await response.json()
      if (response.status == 200) {
        if (responseJson.res != 0) {
          Toast(responseJson.msg || '服务器返回未知错误')
          return Promise.reject(Object.assign({}, responseJson))
        } else {
          return responseJson
        }
      } else {
        Toast('http返回错误错误码为：' + response.status)
        return Promise.reject(Object.assign({}, responseJson, {
          status: response.status,
          statusText: response.statusText
        }))
      }
    } catch (error) {
      Toast('错误信息为' + JSON.stringify(error))
      throw new Error(error)
    }
  } else {
    return new Promise((resolve, reject) => {
      let requestObj
      if (window.XMLHttpRequest) {
        requestObj = new XMLHttpRequest()
      } else {
        requestObj = new ActiveXObject()
      }

      let sendData = ''
      if (type === 'POST') {
        sendData = JSON.stringify(data)
      }

      requestObj.open(type, url, true)
      requestObj.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
      requestObj.send(sendData)

      requestObj.onreadystatechange = () => {
        if (requestObj.readyState == 4) {
          if (requestObj.status == 200) {
            let obj = requestObj.response
            if (typeof obj !== 'object') {
              obj = JSON.parse(obj)
            }
            if (obj.res !== 0) {
              Toast(obj.msg || '服务器返回未知错误')
              return Promise.reject(Object.assign({}, obj))
            } else {
              resolve(obj)
            }
          } else {
            Toast('http返回错误错误码为：' + requestObj.status)
            reject(requestObj)
          }
        }
      }
    })
  }
}

const dorequest = async (url = '', data = {}, type = 'POST', method = 'fetch') => {
  type = type.toUpperCase()
  if (url !== '/api/uploadVoice') {
    url = baseUrl + url
  }

  if (type === 'GET') {
    let dataStr = '' // 数据拼接字符串
    Object.keys(data).forEach(key => {
      dataStr += key + '=' + data[key] + '&'
    })

    if (dataStr !== '') {
      dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'))
      url = url + '?' + dataStr
    }
  }
  Indicator.open({
    text: '正在玩命处理中...',
    spinnerType: 'fading-circle'
  })
  if (window.fetch && method === 'fetch') {
    let requestConfig = {
      credentials: 'include',
      method: type,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'TOKEN': storage.get('token')
      },
      mode: 'cors',
      cache: 'force-cache'
    }
    if (type === 'POST') {
      Object.defineProperty(requestConfig, 'body', {
        value: parseParams(data)
      })
    }

    try {
      const response = await fetch(url, requestConfig)
      Indicator.close()
      console.log(response)
      const responseJson = await response.json()
      if (response.status === 200) {
        if (responseJson.res !== 0) {
          Toast(responseJson.msg || '服务器返回未知错误')
          return Promise.reject(Object.assign({}, responseJson))
        } else {
          return responseJson
        }
      } else {
        Toast('http返回错误错误码为：' + response.status)
        return Promise.reject(Object.assign({}, responseJson, {
          status: response.status,
          statusText: response.statusText
        }))
      }
    } catch (error) {
      Toast(JSON.stringify(error))
      throw new Error(error)
    }
  } else {
    return new Promise((resolve, reject) => {
      let requestObj
      if (window.XMLHttpRequest) {
        requestObj = new XMLHttpRequest()
      } else {
        requestObj = new ActiveXObject()
      }

      let sendData = ''
      if (type === 'POST') {
        sendData = JSON.stringify(data)
      }

      requestObj.open(type, url, true)
      requestObj.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
      requestObj.send(sendData)

      requestObj.onreadystatechange = () => {
        if (requestObj.readyState === 4) {
          Indicator.close()
          if (requestObj.status === 200) {
            let obj = requestObj.response
            if (typeof obj !== 'object') {
              obj = JSON.parse(obj)
            }
            if (obj.res !== 0) {
              if (url !== '/api/uploadVoice') {
                Toast(obj.msg || '服务器返回未知错误')
              }
              return Promise.reject(Object.assign({}, obj))
            } else {
              resolve(obj)
            }
          } else {
            Toast('http返回错误错误码为：' + requestObj.status)
            reject(requestObj)
          }
        }
      }
    })
  }
}

export default {
  getwebdata,
  dorequest
}
