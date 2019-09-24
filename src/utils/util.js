/* jshint esversion: 6 */
// import localforage from './localforage'

import {
  GetDate,
  formatNumber,
  TimeMask
} from './diaplayTime'

/* export function getWechatappId() {
  return store.state.user.wechatapp_id;
}

export function getSockerUrl() {
  var sockerUrl = SOCKETURL + '?wechatapp_id=' + store.state.user.wechatapp_id + '&user_id=' + USER_ID;
  return sockerUrl;
} */

export function getCustomerTimes () {
  var arr = [{
    label: '昨天',
    value: '',
    day: 1,
    text: '昨天',
    desc: '较前一日'
  }, {
    label: '近7天',
    value: '',
    day: 7,
    text: '近7天',
    desc: '较前一周'
  }, {
    label: '近1个月',
    value: '',
    day: 30,
    text: '近1个月',
    desc: '较前一月'
  }, {
    label: '近1年',
    value: '',
    day: 365,
    text: '近1年',
    desc: '较前一年'
  }, {
    label: '自定义时间范围',
    value: '',
    day: -1,
    text: '自定义时间范围',
    desc: '较前一周期'
  }]
  for (var i = 0; i < arr.length; i++) {
    var StarTime = new Date(GetDate(arr[i].day))
    var EndTime = new Date(GetDate(1))
    // 开始时间
    var StartDay = [StarTime.getFullYear(), StarTime.getMonth() + 1, StarTime.getDate()].map(formatNumber).join('-')
    // 结束时间
    var EndDay = [EndTime.getFullYear(), EndTime.getMonth() + 1, EndTime.getDate()].map(formatNumber).join('-')

    if (arr[i].day === 0) {
      arr[i].value = [EndDay, EndDay].join(' / ')
    } else if (arr[i].day === 1) {
      arr[i].value = [StartDay, StartDay].join(' / ')
    } else if (arr[i].day > 1) {
      arr[i].value = [StartDay, EndDay].join(' / ')
    }
  }

  return {
    list: arr,
    select: arr[0].value
  }
}

export const setStore = async (name, content) => {
  if (!name) return
  // localforage.setItem(name, content)
}

export const isWeiXin = () => {
  var ua = window.navigator.userAgent.toLowerCase(); if (ua.match(/MicroMessenger/i) == 'micromessenger') { return true } else { return false }
}

// uuid (隨機替每一條essage訊息生成專屬id)
export const getUuid = (len, radix) => {
  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
  var uuid = [],
    i
  radix = radix || chars.length

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix]
  } else {
    // rfc4122, version 4 form
    var r

    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
    uuid[14] = '4'

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random() * 16
        uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r]
      }
    }
  }
  return uuid.join('')
}

/**
 * 获取localStorage
 */
export const getStore = async name => {
  if (!name) return
  // return localforage.getItem(name)
}

/**
 * 删除localStorage
 */
export const removeStore = async name => {
  if (!name) return
  // localforage.removeItem(name)
}

/**
 * 获取style样式
 */
export const getStyle = (element, attr, NumberMode = 'int') => {
  let target
  // scrollTop 获取方式不同，没有它不属于style，而且只有document.body才能用
  if (attr === 'scrollTop') {
    target = element.scrollTop
  } else if (element.currentStyle) {
    target = element.currentStyle[attr]
  } else {
    target = document.defaultView.getComputedStyle(element, null)[attr]
  }
  // 在获取 opactiy 时需要获取小数 parseFloat
  return NumberMode == 'float' ? parseFloat(target) : parseInt(target)
}

// // 上传图片
// export function uploadImage (options) {
//   var headers = function () {
//     if (options.headers) {
//       return options.headers
//     }
//     return {
//       'TOKEN': store.state.chatconfig.token
//     }
//   }
//   var withCredentials = function () {
//     if (options.withCredentials) {
//       return options.withCredentials
//     }
//     return false
//   };
//   var filename = options.filename || 'file'
//   var extraData = options.extraData || null
//   var file = options.file || ''

//   ajaxUploader({
//     action: options.url,
//     headers: headers(),
//     withCredentials: withCredentials,
//     file: file,
//     data: extraData,
//     filename: filename,
//     onProgress: e => {
//       if (typeof options.onProgress === 'function') {
//         options.onProgress(e)
//       }
//     },
//     onSuccess: res => {
//       if (typeof options.onSuccess === 'function') {
//         options.onSuccess(res)
//       }
//     },
//     onError: err => {
//       if (typeof options.onError === 'function') {
//         options.onError(err)
//       }
//     }
//   })
// }
// // 上传语音
// export function uploadVoice (options) {
//   var headers = function () {
//     if (options.headers) {
//       return options.headers
//     }
//     return {
//       'TOKEN': store.state.chatconfig.token
//     }
//   }
//   var withCredentials = function () {
//     if (options.withCredentials) {
//       return options.withCredentials
//     }
//     return false
//   };
//   var filename = options.filename || 'file'
//   var extraData = options.extraData || null
//   var file = options.file || ''

//   ajaxVoice({
//     action: options.url,
//     headers: headers(),
//     withCredentials: withCredentials,
//     file: file,
//     data: extraData,
//     filename: filename,
//     onProgress: e => {
//       if (typeof options.onProgress === 'function') {
//         options.onProgress(e)
//       }
//     },
//     onSuccess: res => {
//       if (typeof options.onSuccess === 'function') {
//         options.onSuccess(res)
//       }
//     },
//     onError: err => {
//       if (typeof options.onError === 'function') {
//         options.onError(err)
//       }
//     }
//   })
// }
