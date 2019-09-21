import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.scss';
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

// 微信數據
import stroage from './api/stroage';
import Cookies from 'js-cookie'
import { login, setB } from './api/api.js'
import qs from 'qs'
import axios from 'axios'

// App.js主要內容
const App = () => {
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
    // 如果是銷售分享的話，保存銷售ID
    if (infolist.b) {
      stroage.set('B', infolist.b)
    }
    // 判斷是否有公眾號授權，若有才執行用微信登入後專屬的功能
    var _this = this
    if (!infolist.openid) {
      infolist = stroage.get('userInfo')
      if (!infolist) {
        window.location.href = 'http://statistics.isunupcg.com/other/GetUserInfo2?redirect_url=' + encodeURIComponent(window.location.href)
      }
    }
    // 判斷是不是要設置成為銷售(B端)
    if (infolist1.operd == 'setAdviser') {
      setB(infolist.openid).then(res => {
        if (!res.res) _this.mlogin(infolist)
      })
    }
    // 判斷是否有登入，若有就進行相關操作
    if (!Cookies.get('p2_token')) {
      mlogin(infolist)
    } else {
      if (this.props.sceneId) {
        this.visitOut()
      }
      _this.getClentInfo()
      _this.getGetSignP1()
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
    return theRequest;
  }

  const mlogin = (item) => {
    let _this = this
    let _data = {
      user_name: item.openid || item.user_name,
      pid: 2,
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
          visitIn(_this.props.pageIDlist[_this.state.currentPage])
          Cookies.set('p2_token', res.data.access_token, { expires: in30Minutes })
          if (!stroage.get('userInfo')) stroage.set('userInfo', _data)
          _this.getClentInfo()
          _this.getGetSignP1()
          stroage.set('user_id', res.data._id)
          stroage.set('visitData', _this.state.visitData)
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
  // 接入微信數據 !!!!!!!!!!!!!!!!!!!!!!!!!!!!

  return (
    <div className="App">

      {/* <svg t={1568864596587} className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id={644} width={200} height={200}><path stroke="red" stroke-width="20" d="M936.1 361H665.7V87.8c0-13.3-10.7-24-24-24H88c-13.3 0-24 10.7-24 24v846.9c0 13.3 10.7 24 24 24h848.2c13.3 0 24-10.7 24-24V385c-0.1-13.3-10.8-24-24.1-24zM617.5 489.9h-41.1c-12.3 0-23.5 10-24.4 22.2-1 14.1 10.1 25.8 23.9 25.8h126.7c12.3 0 23.5-10 24.4-22.2 1-14.1-10.1-25.8-23.9-25.8H665V409h241.1c3.3 0 6 2.7 6 6v489.7c0 3.3-2.7 6-6 6l-241.1-0.2V664.7c0-12.3-10-23.5-22.2-24.4-14.1-1-25.8 10.1-25.8 23.9v246.3H118c-3.3 0-6-2.7-6-6V536h311.8c12.3 0 23.5-10 24.4-22.2 1-14.1-10.1-25.8-23.9-25.8H112V117.8c0-3.3 2.7-6 6-6h493.7c3.3 0 6 2.7 6 6v173.9" p-id={645} /></svg> */}

      <ContactBar></ContactBar>
      <NavigationBar></NavigationBar>

      <Route render={(location) => (
        <TransitionGroup>
          <CSSTransition appear={true} key={location.key} timeout={{ enter: 1000, exit: 1000 }} classNames="cssTransition">
            <Switch>
              <Route exact path='/GreenLand' component={HomePage} />
              <Route path='/GreenLand/HomePage' component={HomePage} />
              <Route path='/GreenLand/BrandIntroduction' component={BrandIntroduction} />
              <Route path='/GreenLand/Traffic' component={Traffic} />
              <Route path='/GreenLand/ThreeDimention' component={ThreeDimention} />
              <Route path='/GreenLand/HouseStyle' component={HouseStyle} />
              <Route path='/GreenLand/GardenTraveling' component={GardenTraveling} />
              <Route path='/GreenLand/InHouseTraveling' component={InHouseTraveling} />
              <Route path='/GreenLand/FloorBook' component={FloorBook} />
              <Route path='/GreenLand/BusinessIntroduction' component={BusinessIntroduction} />
            </Switch>
          </CSSTransition>
        </TransitionGroup>
      )} />

    </div>
  );
}

export default App;
