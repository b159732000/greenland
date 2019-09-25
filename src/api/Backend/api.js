import request from './request'

let pid = window.pid;

// 登录
export function login(data) {
  return request({
    url: '/login/login',
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

// 数据-最受欢迎户型
export function popHouse() {
  return request({
    url: '/data2/popHouse ',
    method: 'POST',
    data: {
      pids: pid
    }
  })
}
// 数据-最近交谈客户列表
export function latestTalk(data) {
  return request({
    url: '/data2/latestTalk ',
    method: 'POST',
    data: {
      pids: pid,
      section: data.section
    }
  })
}
// 数据-购买意向最高客户列表
export function mostWantBuy(data) {
  return request({
    url: '/data2/mostWantBuy ',
    method: 'POST',
    data: {
      pids: pid,
      section: data.section
    }
  })
}

// 数据-户型访问次数列表
export function houseVisitCountList(data) {
  return request({
    url: '/data2/houseVisitCountList ',
    method: 'POST',
    data: {
      pids: pid,
      section: data.section
    }
  })
}

// 数据-户型访问时间列表
export function houseVisitTimeList(data) {
  return request({
    url: '/data2/houseVisitTimeList ',
    method: 'POST',
    data: {
      pids: pid,
      section: data.section
    }
  })
}
// 数据-客源分析-各地区关注人数
export function distribution() {
  return request({
    url: '/data/distribution ',
    method: 'POST',
    data: {
      pids: pid,
    }
  })
}


// 数据-客源分析-各地区关注人数
export function VisitPeople() {
  return request({
    url: '/data2/VisitPeople ',
    method: 'POST',
    data: {
      pids: pid,
    }
  })
}

// 数据-客源分析-最关注的顾客
export function customerVisitTimeList() {
  return request({
    url: '/data2/customerVisitTimeList ',
    method: 'POST',
    data: {
      pids: pid,
    }
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
// customList
export function customList(data) {
  return request({
    url: '/custom/customList ',
    method: 'POST',
    data: {
      pids: pid,
      custom_type: 1
    }
  })
}

// 消息列表
export function HistoryList(data) {
  return request({
    url: 'message/HistoryList ',
    method: 'POST',
    data: data
  })
}
// 消息列表
export function PageVisitTime(section) {
  return request({
    url: 'data2/PageVisitTime ',
    method: 'POST',
    data: {
      pids: pid,
      section: section
    }
  })
}
// 访客列表
export function AllCustomerP2(page_size, key) {
  return request({
    url: 'custom/AllCustomerP2',
    method: 'POST',
    data: {
      pids: pid,
      page_size: page_size,
      key: key
    }
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
// 收藏访客列表
export function favoriteList(page_size, key) {
  return request({
    url: '/my/favoriteList',
    method: 'POST',
    data: {
      pid: 2,
      page_size: page_size,
      key: key
    }
  })
}

// 客源-访客 客户资料
export function infoUpdate(data) {
  return request({
    url: '/custom/infoUpdate',
    method: 'POST',
    data: data
  })
}
// 客源-访客 获取客户资料
export function getInfo(data) {
  return request({
    url: '/custom/getInfo',
    method: 'POST',
    data: data
  })
}
// 访问分析
export function visitSummary(id) {
  return request({
    url: '/custom/VisitSummaryP2',
    method: 'POST',
    data: {
      pid: pid,
      cid: id
    }
  })
}
// 访问足迹
export function visited(id) {
  return request({
    url: '/custom/visited',
    method: 'POST',
    data: {
      pids: pid,
      cid: id
    }
  })
}
// 收藏
export function favoriteCustom(id) {
  return request({
    url: '/custom/favoriteCustom',
    method: 'POST',
    data: {
      pids: pid,
      cid: id
    }
  })
}
// 收藏
export function PageVisitCount(data) {
  return request({
    url: '/data2/PageVisitCountP2',
    method: 'POST',
    data: {
      pids: pid,
      section: data.section
    }
  })
}

// 分享路径
export function VisitedTraceP2(id) {
  return request({
    url: '/custom/VisitedTraceP2',
    method: 'POST',
    data: {
      pids: pid,
      cid: id
    }
  })
}

// 消息已读
export function ClearUnread(b_openid, c_openid) {
  return request({
    url: '/message/ClearUnread',
    method: 'POST',
    data: {
      pids: pid,
      b_openid: b_openid,
      c_openid: c_openid,
    }
  })
}

// 我的 儲存个人信息到服務器
export function setStaffInfo(data) {
  return request({
    url: '/my/setStaffInfo',
    method: 'POST',
    data: data
  })
}

// 我的 從服務器取得个人信息
export function staffInfo(data) {
  return request({
    url: '/my/staffInfo',
    method: 'POST',
    data: data
  })
}