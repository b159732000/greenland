/*
 *获取当前日期前N天或后N日期(N = day)
 *type:1：前；2：后
 */
export function GetDate (day, type) {
  if (!type) {
    type = 1
  }
  var zdate = new Date()
  var edate
  if (type === 1) {
    edate = new Date(zdate.getTime() - (day * 24 * 60 * 60 * 1000))
  } else {
    edate = new Date(zdate.getTime() + (day * 24 * 60 * 60 * 1000))
  }

  return edate.getTime()
}
/*
 *格式化时间
 *type:1：年/月/日；2：月/日 时:分；3：今天 时:分；4：昨天 时:分；
 */
export function TimeMask (time) {
  if (!time) {
    // console.log('error: 错误的 last_chat_time');
    return ''
  }

  var t = time.toString()
  t = t.length > 10 ? t * 1 : t * 1000

  return t
}
export function formatNumber (n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
export function formatTime (time, type, j) {
  time = TimeMask(time)

  if (!time) {
    return ''
  }

  var date = new Date(time)
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()

  if (!j) {
    j = '/'
  }

  if (type == 1) {
    return [year, month, day].map(formatNumber).join(j)
  }
  if (type == 2) {
    return [month, day].map(formatNumber).join(j) + ' ' + [hour, minute].map(formatNumber).join(':')
  }
  if (type == 3) {
    return '今天' + ' ' + [hour, minute].map(formatNumber).join(':')
  }
  if (type == 4) {
    return '昨天' + ' ' + [hour, minute].map(formatNumber).join(':')
  }

  return [year, month, day].map(formatNumber).join(j) + ' ' + [second, hour, minute].map(formatNumber).join(':')
}

export function DiaplayTime (time) {
  time = TimeMask(time)
  if (!time) {
    return ''
  }
  var today = formatTime(new Date().getTime(), 1) // 获取当天的年月日
  var zdate = formatTime(GetDate(1, 1), 1) // 获取一天前的年月日
  var orday = formatTime(time, 1)

  if (orday == today) {
    return formatTime(time, 3)
  }

  if (orday == zdate) {
    return formatTime(new Date(time).getTime(), 4)
  }

  return formatTime(time, 2)

}

// 超出48小时验证
export function over48hours (time) {
  time = TimeMask(time)

  if (!time) {
    return ''
  }

  var beforeTime = 2 * 24 * 60 * 60 * 1000
  var currentTime = new Date().getTime()
  var resultTime = currentTime - time

  if (resultTime > beforeTime) {
    return true
  } else {
    return false
  }
}
