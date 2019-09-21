var storage = {
  set(key, value) {
    key = 'p2_' + key
    localStorage.setItem(key, JSON.stringify(value))
  },
  get(key) {
    key = 'p2_' + key
    return JSON.parse(localStorage.getItem(key))
  },
  remove(key) {
    key = 'p2_' + key
    localStorage.removeItem(key)
  }
}
export default storage
