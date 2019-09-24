/* jshint esversion: 6 */
import Cookie from 'js-cookie'
// import playSound from './playSound'
import stroage from '../api/stroage'
import { bind } from '../api/api'
import store from './store';
import { pushMessage, setMessagelist } from '../actions/chatPage.js';
export default function events(_this, socket) {
  socket.onmessage = async function (e) {
    // json数据转换成js对象
    var res = eval('(' + e.data + ')')
    var type = res.type || ''
    if (type != 'ping') {
      // console.log(res)
    }
    switch (type) {
      case 'ping':// 会15s像后台发送一条ping的消息
        socket.send(JSON.stringify({
          'type': 'ping',
          'client_id': Cookie.get('p2_client_id') || ''
        }))
        break
      // Events.php中返回的init类型的消息，将client_id发给后台进行uid绑定
      case 'init': // 这个刚连接以后会收到一个init消息  1
        console.log('init')
        bind({
          client_id: res.data.client_id,
          // pid: stroage.get('visitData').pid,
          pid: window.pid,
          user_id: stroage.get('user_id')
        }).then(res => {
          console.log()
        })
        setInterval(function () {
          socket.send(JSON.stringify({
            'type': 'ping',
            'client_id': Cookie.get('p2_client_id')
          }))
        }, 15000)
        Cookie.set('p2_client_id', res.data.client_id)
        break
      case 'send': // b
        _this.props.pushMessage(res.data[0])
        // store.dispatch({ type: 'SETMESSAGELIST', value: res.data })
        // pushMessage(res.data[0])
        // store.commit('chatmessage/SET_MESSAGELIST', res.data[0])
        break
      case 'attention': // 接入客户  a
        console.log(res.data)
        // console.log(e);
        // store.dispatch('updateAppList',res.data);
        break
      // 当mvc框架调用GatewayClient发消息时直接alert出来
      default:
        console.log(e.data)
        // alert(e.data);
        break
    }
  }
}
