/* jshint esversion: 6 */
// import store from '../store/index'
// import {
//   socketurl
// } from './config'
import ReconnectingWebSocket from "reconnecting-websocket";
const SOCKETURL = 'ws://101.200.47.90:7272'

function socket (_this) {
  return new Promise(function (resolve, reject) {
    try {
      // var sockerUrl = socketurl + store.getters['chatconfig/query_url']
      var sockerUrl = SOCKETURL
      var ws = new ReconnectingWebSocket(sockerUrl)
      ws.debug = true
      ws.timeoutInterval = 5400
      ws.onopen = function () {
        console.log('WebSocket 连接已打开')
        resolve(ws)
      }
      ws.onerror = function (e) {
        // handle error event
        console.log('WebSocket 连接已断开')
        console.log(e)
      }
      ws.onclose = function (e) {
        console.log(e)
        console.log('WebSocket 连接已断开')
        reject({
          res: 1,
          msg: 'WebSocket 连接已断开'
        })
      }
    } catch (error) {
      console.error(error)
      reject({
        res: 1,
        msg: 'WebSocket 连接失败'
      })
    }
  })
}
export default socket
