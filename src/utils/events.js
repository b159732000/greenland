/* jshint esversion: 6 */
import Cookie from 'js-cookie'
import stroage from '../api/stroage'    //為了從 local storage 取得數據
import { bind } from '../api/api'
import store from './store';
import { pushMessage, setMessagelist } from '../actions/chatPage.js';

export default function events(_this, socket) {

  socket.onmessage = async function (e) {
    // json数据转换成js对象
    var res = eval('(' + e.data + ')')
    // console.log(res);

    var type = res.type || ''
    if (type !== 'ping') {
    }

    switch (type) {
      // 每15s向伺服器发送一条ping的消息
      case 'ping':
        socket.send(JSON.stringify({
          'type': 'ping',
          'client_id': Cookie.get('p2_client_id') || ''
        }))
        break

      // Events.php中返回的init类型的消息，将client_id发给后台进行uid绑定
      // 这个刚连接以后会收到一个init消息  1
      case 'init':
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

      // 接收服務器推送過來的消息，放到store內
      case 'send': // b
        console.log('執行了event.send，原始res.data[0]↓↓↓↓↓↓↓↓↓↓↓↓↓');
        console.log(res.data[0]);

        // 徐生原本有啟用的
        // _this.props.pushMessage(res.data[0])
        // 我改寫上一行 (用這行就對了)  <-- 但是現在卡在res.data[0]會傳兩次，第二次是0，有bug故未啟用
        if (res.data[0]) {
          console.log('接收服務器推送過來的消息，手動加上mine，然後放到store內');
          let tempResDataZero = res.data[0];
          tempResDataZero = {
            ...res.data[0],
            mine: false
          }
          console.log('手動加上mine後↓↓↓↓↓↓↓↓↓↓↓');
          console.log(tempResDataZero);

          // tempResDataZero = {
          //   b_openid: "oRbr0w4RNYkdxuBZvkB5oUxI7QkQ",
          //   c_openid: "oRbr0w4RNYkdxuBZvkB5oUxI7QkQ",
          //   content: "55",
          //   create_time: "1569424458",
          //   logo: "http://thirdwx.qlogo.cn/mmopen/vi_32/AcJM5WNhE04JYmoZVWbssORUTxp5ygQ1WiaX1k3Yq0V3AutJ75lZQibe3YXqY6ZKmd9iaLGf6KuAULhk0tlAZTAUA/132",
          //   mine: false,
          //   msg_id: "FV5TuFkVGnwjMjWJdiKBOZe496WvRrNd",
          //   msg_type: "text",
          //   pid: "3",
          //   status: "online"
          // }

          _this.setStoreMessageList(res.data[0]);
        }

        // _this.setStoreMessageList(tempResDataZero);

        // 徐生原本也沒用的部分
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
