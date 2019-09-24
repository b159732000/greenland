import { setStore, getStore, removeStore } from './util'
export const setmessagelist = (key, list) => {
  getStore('kflist').then(res => {
    if (res) {
      let indexc
      let b = res.find((value, index, arr) => {
        if (Object.keys(value)[0] == key) {
          indexc = index
          return value
        }
      })
      if (b) {
        let a = [...b[key], ...list]
        let d = {}
        d[key] = a
        res[indexc] = d
      } else {
        let d = {}
        d[key] = list
        res.push(d)
      }
      setStore('kflist', res)
    } else {
      let d = {}
      d[key] = list
      setStore('kflist', [d])
    }
  })
}
export const getmessagelist = (key) => {
  return getStore('kflist').then(res => {
    if (res) {
      let indexc
      let b = res.find((value, index, arr) => {
        if (Object.keys(value)[0] == key) {
          indexc = index
          return value
        }
      })
      if (b) {
        return b[key]
      } else {
        return false
      }
    } else {
      return false
    }
  })
}
export const setunreadlist = (key) => {
  getStore('unreadlist').then(res => {
    if (res) {
      let indexc
      let b = res.find((value, index, arr) => {
        if (Object.keys(value)[0] == key) {
          indexc = index
          return value
        }
      })
      if (b) {
        res[indexc][key] = res[indexc][key] + 1
      } else {
        let d = {}
        d[key] = 1
        res.push(d)
      }
      setStore('unreadlist', res)
    } else {
      let d = {}
      d[key] = 1
      setStore('unreadlist', [d])
    }
  })
}
export const getunreadlist = (key) => {
  return getStore('unreadlist').then(res => {
    if (key) {
      if (res) {
        let indexc
        let b = res.find((value, index, arr) => {
          if (Object.keys(value)[0] == key) {
            indexc = index
            return value
          }
        })
        if (b) {
          return b[key]
        } else {
          return false
        }
      } else {
        return false
      }
    } else {
      if (res) {
        return res
      } else {
        return false
      }
    }
  })
}
export const clearunreadlist = (key) => {
  return getStore('unreadlist').then(res => {
    if (res) {
      let indexc
      let b = res.find((value, index, arr) => {
        if (Object.keys(value)[0] == key) {
          indexc = index
          return value
        }
      })
      if (b) {
        let temp = res.splice(indexc, 1)
        setStore('unreadlist', temp)
      } else {
        return false
      }
    } else {
      return false
    }
  })
}
