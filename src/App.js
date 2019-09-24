import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.scss';
import { useSelector, useDispatch } from 'react-redux'
import { Route, Switch } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import ContactBar from './components/ContactBar/ContactBar.jsx';
import NavigationBar from './components/NavigationBar/NavigationBar.jsx';
import HomePage from './components/HomePage/HomePage.jsx';
import BrandIntroduction from './components/BrandIntroduction/BrandIntroduction.jsx';
import Traffic from './components/Traffic/Traffic.jsx';
import ThreeDimention from './components/ThreeDimention/ThreeDimention.jsx';
import HouseStyle from './components/HouseStyle/HouseStyle.jsx';
import GardenTraveling from './components/GardenTraveling/GardenTraveling.jsx';
import InHouseTraveling from './components/InHouseTraveling/InHouseTraveling.jsx';
import FloorBook from './components/FloorBook/FloorBook.jsx';
import BusinessIntroduction from './components/BusinessIntroduction/BusinessIntroduction.jsx';
import CustomerChatPage from './components/CustomerChatPage/CustomerChatPage.jsx';

// 後台
import BackendContainer from './components/BackendContainer/BackendContainer.jsx';
import BackendHomePage from './components/BackendHomePage/BackendHomePage.jsx';
import BackendChatList from './components/BackendChatList/BackendChatList.jsx';
import BackendChatPage from './components/BackendChatPage/BackendChatPage.jsx';

// 微信數據
import stroage from './api/stroage';
import Cookies from 'js-cookie'
import { login, setB, GetHomeBInfo, share, GetSignP2, ShareBack } from './api/api.js'
import qs from 'qs'
import axios from 'axios'
import wx from 'weixin-js-sdk'
import { setClientInfoAction } from './actions/chatPage.js'
import { changeSceneID, set_usertype } from './actions/actions.js';

// App.js主要內容
const App = (props) => {
  const dispatch = useDispatch();

  // 销售人员资讯
  // 設定store中的clientInfo
  const setClientInfo = (value) => dispatch(setClientInfoAction(value));  // setClientInfo = dispatch({type: 'SETCLIENTINFO', value: value})
  const set_userType = (value) => dispatch(set_userType(value));

  const [clientInfo, setStateClientInfo] = useState();
  useEffect(() => {
    console.log('本頁state Client更改成功，新值為↓↓↓' + clientInfo);
    console.log(clientInfo);
    console.log('本頁state Client更改成功，新值為↑↑↑' + clientInfo);
  }, [clientInfo])

  useEffect(() => {
    if (window.enableWeiXinLogIn) {
      getWeiXinData();    //使用的是上面const的getWeixinData()
    }
  }, [])

  // 接入微信數據 !!!!!!!!!!!!!!!!!!!!!!!!!!!!
  const [visitData, setVisitData] = useState();
  const getWeiXinData = () => {
    console.log('開始接入微信數據 (程式在App.js中執行)')
    var infolist = GetRequest()
    var infolist1 = GetRequest()

    console.log('從網址取得夾帶的數據如下↓↓↓');
    console.log(infolist1);
    console.log('從網址取得夾帶的數據如上↑↑↑');

    // 1. 如果是銷售分享的話，保存銷售ID到local storage B中
    if (infolist.b) {
      stroage.set('B', infolist.b)
      console.log('是銷售分享的，儲存銷售ID到local storage的B中，值如下↓↓↓');
      console.log(stroage.get('B'));
      console.log('↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑');
    }
    // 2. 判斷是否有公眾號授權，若有才執行用微信登入後專屬的功能(即從if 3.開始執行)，若無則跳轉到取得授權頁
    var _this = this
    if (!infolist.openid) {
      infolist = stroage.get('userInfo')
      if (!infolist) {
        window.location.href = 'http://statistics.isunupcg.com/other/GetUserInfo2?redirect_url=' + encodeURIComponent(window.location.href)
      }
    }
    // 3. 判斷是否有登入，若有就進行相關操作
    if (!Cookies.get('p2_token')) {
      // 利用網址含的資訊，取得存在伺服器的銷售數據
      mlogin(infolist)
    } else {
      // if (this.props.sceneId) {
      //   this.visitOut()
      // }
      getClentInfo();
      getGetSignP1()
    }
    // 4. 判斷是不是要設置成為銷售(B端)
    if (infolist1.operd === 'setAdviser') {
      setB(infolist.openid).then(res => {
        if (!res.res) _this.mlogin(infolist)
      })
    }
  }

  // 取得網址夾帶的資訊
  const GetRequest = () => {
    var url = decodeURI(window.location.search); //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
      var str = url.substr(1);
      var strs = str.split("&");
      for (var i = 0; i < strs.length; i++) {
        theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
      }
    }
    if (theRequest.openid) { }
    console.log("從網址取得的訊息↓↓↓");
    console.log(theRequest);
    console.log("↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑");
    return theRequest;
  }

  // 取得存在伺服器的銷售數據
  const mlogin = (item) => {
    let _this = this
    let _data = {
      user_name: item.openid || item.user_name,
      pid: window.pid,
      c_share_userid: '',
      b_share_userid: '',
      c_share_id: item.c,
      b_share_id: item.b,
      ip: '',
      location: item.location,
      logo: item.headimgurl,
      nickname: item.nickname,
      sex: item.sex,
      country: item.country,
      province: item.province,
      city: item.city,
      visit_from: item.s || 1,
    }
    // axios.get('http://ip-api.com/json/?fields=520191&lang=zh-CN').then(res => {
    //     _data.ip = res.data.query
    //     _data.location = res.data.country + res.data.regionName + res.data.city
    //     _data.login_city = res.data.city
    _data.openid = _data.user_name
    let _datas = qs.stringify({
      'share_id': _data.c_share_id,
      'ptype': 2
    })
    axios.post('http://statistics.isunupcg.com/other/getShareUserid', _datas).then(res => {
      let $data1 = res.data.data
      _data.c_share_userid = res.data.data.share_userid
      if (!Cookies.get('p2_clientInfo')) {
        Cookies.set('p2_clientInfo', $data1.user_info, { expires: 360 })
      }
      let _data1 = qs.stringify({
        'share_id': _data.b_share_id,
        'ptype': 2
      })
      axios.post('http://statistics.isunupcg.com/other/getShareUserid', _data1).then(res => {
        let $data = res.data.data
        _data.b_share_userid = res.data.data.share_userid
        _data.phone = $data.user_info.phone
        _data.clentName = $data.user_info.nickname
        _data.clentOpenId = $data.user_info.user_name
        _data.clentImg = $data.user_info.logo
        login(_data).then(res => {
          _data.isAdmin = res.data.user_type;
          let user_type = res.data.user_type;
          setVisitData({
            pid: _data.pid,
            page_id: _data.pid,
            c_share_userid: _data.c_share_userid,
            b_share_userid: _data.b_share_userid,
            c_share_id: _data.c_share_id,
            b_share_id: _data.b_share_id,
          })
          let in30Minutes = 1 / 12;
          console.log('login success');
          Cookies.set('p2_user_type', user_type)
          // visitIn(_this.props.pageIDlist[_this.state.currentPage])
          Cookies.set('p2_token', res.data.access_token, { expires: in30Minutes })
          if (!stroage.get('userInfo')) stroage.set('userInfo', _data)
          getClentInfo()
          getGetSignP1()
          stroage.set('user_id', res.data._id)
          // stroage.set('visitData', _this.state.visitData)
        })
      })
    })
    // })
  }

  // 告訴伺服器我當前訪問哪一頁
  const visitIn = (page_id) => {
    let _this = this
    _this.state.visitData.page_id = page_id
    visitIn(_this.state.visitData).then(res => {
      _this.setState({
        page_id: res.data.vid
      })
      _this.props.changeSceneID(res.data.vid)
      console.log('visitIn');
    })
  }

  // 取得銷售資訊(姓名、大頭貼網址...)，並放在Store, State, cookies, local storage中。
  const getClentInfo = () => {
    let _this = this
    var infolist = GetRequest()
    console.log(infolist);

    // 從storage中取得分享出來的銷售的ID
    let b_id = infolist.b ? (infolist.b) : (stroage.get('B') ? stroage.get('B') : 0);

    // 取得銷售資訊，並放到Store, State, cookies, local storage中。
    GetHomeBInfo({ ptype: 2, b_shareid: b_id }).then(res => {
      setClientInfo(res.data.b_user_info);    //設定Store中的clientInfo
      Cookies.set('clientInfo', res.data.b_user_info, { expires: 360 })
      stroage.set('clientInfo', res.data.b_user_info)
      set_usertype(Cookies.set('p2_user_type'))
      setStateClientInfo(res.data.b_user_info);   //設定本頁state中的clientInfo
    })
  }

  // 分享的资讯
  const getGetSignP1 = () => {
    let _this = this
    let user_type = (Cookies.get('p2_user_type') > 2)
    var infolist = GetRequest()
    share({ pid: 2, transfer: (!user_type && window.location.href.indexOf('b') > -1) ? 1 : 0 }).then(res => {
      var _shareid = res.data.share_id
      var short_key = res.data.short_key
      var _href = 'http://hvr.isunupcg.com/RunXiShan?b=' + (user_type ? _shareid : (stroage.get('B') || 0)) + '&c=' + (!user_type ? _shareid : 0)
      console.log('share success');
      console.log(_href);
      GetSignP2({ url: window.location.href }).then(res => {
        wx.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: res.msg.appId, // 必填，公众号的唯一标识
          timestamp: res.msg.timestamp, // 必填，生成签名的时间戳
          nonceStr: res.msg.nonceStr, // 必填，生成签名的随机串
          signature: res.msg.signature, // 必填，签名，见附录1
          jsApiList: ["showMenuItems", "onMenuShareTimeline", "onMenuShareAppMessage", "updateAppMessageShareData", "updateTimelineShareData"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });
        wx.ready(function () {
          wx.checkJsApi({
            jsApiList: ["showMenuItems"],
            success: function (res) {
              wx.showMenuItems({
                menuList: [
                  "menuItem:share:appMessage",
                  "menuItem:share:timeline"
                ]
              });
            }
          });
          wx.onMenuShareTimeline({ ////朋友圈
            title: "绿地 - 城际空间站楼盘鉴赏", // 分享标题
            desc: "点击即可线上看房，并立即与销售联系。", // 分享描述
            link: 'http://hvr.isunupcg.com/GreenLand?' + short_key, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: 'https://greenlandmedia.oss-cn-shenzhen.aliyuncs.com/ShareLogo.png', // 分享图标
            success: function (res) {
              console.log(res);
              // 用户确认分享后执行的回调函数
              console.log("分享成功！！！");
              ShareBack({ share_id: _shareid, share_url: _href + '&s=2' }).then(res => {
              })
            },
            cancel: function () {
              // 用户取消分享后执行的回调函数
              console.log("取消分享！！！");
            }
          });
          wx.onMenuShareAppMessage({ //朋友
            title: "绿地 - 城际空间站楼盘鉴赏", // 分享标题
            desc: "点击即可线上看房，并立即与销售联系。", // 分享描述
            link: 'http://hvr.isunupcg.com/GreenLand?' + short_key, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: 'https://greenlandmedia.oss-cn-shenzhen.aliyuncs.com/ShareLogo.png', // 分享图标
            type: "", // 分享类型,music、video或link，不填默认为link
            dataUrl: "", // 如果type是music或video，则要提供数据链接，默认为空
            success: function () {
              // 用户确认分享后执行的回调函数
              console.log("分享成功！！！");
              ShareBack({ share_id: _shareid, share_url: _href + '&s=1' }).then(res => { })
            },
            cancel: function () {
              // 用户取消分享后执行的回调函数
              console.log("取消分享！！！");
            }
          });
        })
      })
    })
  }
  // 接入微信數據 !!!!!!!!!!!!!!!!!!!!!!!!!!!!

  // 判斷當前是否在Backend中
  const [currentIsInBackend, updateCurrentIsInBackend] = useState(false);
  useEffect(() => {
    let indexOfBackend = props.location.pathname.indexOf('Backend');
    if (indexOfBackend >= 0) {
      updateCurrentIsInBackend(true);
    } else {
      updateCurrentIsInBackend(false);
    }
  }, [props.location])

  return (
    <div className="App">

      {/* <svg t={1568864596587} className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id={644} width={200} height={200}><path stroke="red" stroke-width="20" d="M936.1 361H665.7V87.8c0-13.3-10.7-24-24-24H88c-13.3 0-24 10.7-24 24v846.9c0 13.3 10.7 24 24 24h848.2c13.3 0 24-10.7 24-24V385c-0.1-13.3-10.8-24-24.1-24zM617.5 489.9h-41.1c-12.3 0-23.5 10-24.4 22.2-1 14.1 10.1 25.8 23.9 25.8h126.7c12.3 0 23.5-10 24.4-22.2 1-14.1-10.1-25.8-23.9-25.8H665V409h241.1c3.3 0 6 2.7 6 6v489.7c0 3.3-2.7 6-6 6l-241.1-0.2V664.7c0-12.3-10-23.5-22.2-24.4-14.1-1-25.8 10.1-25.8 23.9v246.3H118c-3.3 0-6-2.7-6-6V536h311.8c12.3 0 23.5-10 24.4-22.2 1-14.1-10.1-25.8-23.9-25.8H112V117.8c0-3.3 2.7-6 6-6h493.7c3.3 0 6 2.7 6 6v173.9" p-id={645} /></svg> */}

      {/* 如果處於後台中，隱藏銷售人員資訊列、前端NavigationBar、顯示後端NavigationBar */}
      {(currentIsInBackend) ? (null) : (<NavigationBar></NavigationBar>)}
      {(currentIsInBackend) ? (null) : (<ContactBar></ContactBar>)}
      {(currentIsInBackend) ? (<BackendContainer></BackendContainer>) : (null)}

      <Route render={(location) => (
        <TransitionGroup>
          {/* <CSSTransition appear={true} key={location.key} timeout={{ enter: 1000, exit: 1000 }} classNames="cssTransition"> */}
          <Switch>
            <Route exact path='/GreenLand' exact component={HomePage} />
            <Route path='/GreenLand/HomePage' component={HomePage} />
            <Route path='/GreenLand/BrandIntroduction' component={BrandIntroduction} />
            <Route path='/GreenLand/Traffic' component={Traffic} />
            <Route path='/GreenLand/ThreeDimention' component={ThreeDimention} />
            <Route path='/GreenLand/HouseStyle' component={HouseStyle} />
            <Route path='/GreenLand/GardenTraveling' component={GardenTraveling} />
            <Route path='/GreenLand/InHouseTraveling' component={InHouseTraveling} />
            <Route path='/GreenLand/FloorBook' component={FloorBook} />
            <Route path='/GreenLand/BusinessIntroduction' component={BusinessIntroduction} />
            <Route path='/GreenLand/CustomerChatPage' component={CustomerChatPage} />

            <Route path='/GreenLand/Backend/HomePage' component={BackendHomePage} />
            <Route path='/GreenLand/Backend/MessageList' component={BackendChatList} />
            <Route path='/GreenLand/Backend/ChatPage' component={BackendChatPage} />
          </Switch>
          {/* </CSSTransition> */}
        </TransitionGroup>
      )} />

    </div>
  );
}

export default App;
