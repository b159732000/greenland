import request from './request'
export function login(data) {
  return request({
    url: '/login/login',
    method: 'POST',
    data: data
  })
}

// 访客访问
export function visitIn(data) {
  return request({
    url: '/statistics/visitIn',
    method: 'POST',
    data: data
  })
}

export function GetSignP2(data) {
  return request({
    url: '/other/GetSignP2',
    method: 'POST',
    data: data
  })
}

// 分享
export function share(data) {
  return request({
    url: '/statistics/share',
    method: 'POST',
    data: data
  })
}


export function visitOut(data) {
  return request({
    url: '/statistics/visitOut',
    method: 'POST',
    data: data
  })
}
// socket bind
export function bind(data) {
  return request({
    url: '/api/bind ',
    method: 'POST',
    data: data
  })
}
// sendMessage C段
export function Csend(data) {
  return request({
    url: '/api/Csend ',
    method: 'POST',
    data: data
  })
}

// sendMessage B段
export function Bsend(data) {
  return request({
    url: '/api/Bsend ',
    method: 'POST',
    data: data
  })
}

export function GetHomeBInfo(data) {
  return request({
    url: '/api/GetHomeBInfo',
    method: 'POST',
    data: data
  })
}

// getHistory
export function getHistory(data) {
  return request({
    url: '/message/History ',
    method: 'POST',
    data: data
  })
}
// 分享回調
export function ShareBack(data) {
  return request({
    url: '/other/ShareBack',
    method: 'POST',
    data: data
  })
}

// 设置B端
export function setB(openid) {
  return request({
    url: '/api/setB',
    method: 'POST',
    data: {
      openid,
    }
  })
}