import React from 'react';
import './BackendHomePage.scss';
import { Link } from 'react-router-dom';
import { connect, useSelector } from 'react-redux';
import { setc_info } from '../../actions/Backend/chatPage.js';
import { popHouse, latestTalk, mostWantBuy, share, setStaffInfo, staffInfo } from '../../api/Backend/api'
import Cookies from 'js-cookie'
import stroage from '../../api/stroage';
import axios from 'axios'
import qs from 'qs'
import { login } from '../../api/Backend/api'
import QRCode from 'qrcode'

// 为了达成<<在没有数局时，显示替代文字>>，必须在此定义变数
let popularHouseListDOMElement, mountRecentlyChatListDOMElement, mountHighIntentionCustomerListDOMElement;


function mapStateToProps(state) {
    return {
        userInfo: state.chat.userInfo
    }
}

class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            QRCodeIsOpen: false,                            // QRCODE是否展開
            PopularHoseStyleIsOpen: false,                  //最受歡迎的戶型是否展開
            RencentlyChatCustomerIsOpen: false,             //最近交談的客戶是否展開
            HighPurchaseIntentionCustomerIsOpen: false,     //購買意願較高的客戶是否展開
            CustomerWebSiteUrl: 'http://hvr.isunupcg.com/GreenLand/HomePage', //微沙盤網址
            isEditingCustomerInfo: false,                   //是否正在編輯
            popularList: [],                                //户型列表
            VistorNearlyList: [],                           //交谈客户列表
            IntentionList: [],                              //意向最高客户列表
            MyclientInfo: '',                               //基本信息
            MyOtherInfo: '',                               //附属信息
            clientUserName: '',                             //用户名字
            clientUserPhone: '',                            //用户手机号
            clientUserPosition: '',                         //用户职位
        }
    }

    // 點擊黑色三角形時觸發(有三個參數可選: PopularHouse, ChatCustomer, HighIntention)
    blackTriangleOnClick(selectedItem) {
        this.changeActiveItemInnerTo(selectedItem);
    }

    getGetSignP1() {
        let _this = this
        let user_type = (stroage.get('user_type') > 2)
        share({ pid: window.pid, transfer: (!user_type && window.location.href.indexOf('b') > -1) ? 1 : 0 }).then(res => {
            var _shareid = res.data.share_id
            var _href = 'http://hvr.isunupcg.com/GreenLand/HomePage?b=' + _shareid + '&s=1'
            _this.setState({
                CustomerWebSiteUrl: _href
            }, () => this.initQrCode())
        })
    }

    // 摺疊選取的項目(有三個參數可選: PopularHouse, ChatCustomer, HighIntention)
    changeActiveItemInnerTo(selectedItem) {

        // 首先，先讀取選中的項目是否是打開的，並將boolean放入selectedItemIsOpen
        let selectedItemIsOpen;
        switch (selectedItem) {
            case 'PopularHouse':
                selectedItemIsOpen = this.state.PopularHoseStyleIsOpen;
                break;
            case 'ChatCustomer':
                selectedItemIsOpen = this.state.RencentlyChatCustomerIsOpen;
                break;
            case 'HighIntention':
                selectedItemIsOpen = this.state.HighPurchaseIntentionCustomerIsOpen;
                break;
            default:
                break;
        }

        // 如果選中項現在已經打開，則關閉；如果是未打開的，則關閉所有並打該此項
        if (selectedItemIsOpen) {
            // 關閉所有菜單
            this.setState({
                PopularHoseStyleIsOpen: false,
                RencentlyChatCustomerIsOpen: false,
                HighPurchaseIntentionCustomerIsOpen: false
            })
        } else {
            // 關閉所有菜單
            this.setState({
                PopularHoseStyleIsOpen: false,
                RencentlyChatCustomerIsOpen: false,
                HighPurchaseIntentionCustomerIsOpen: false
            })
            // 展開選中的菜單
            switch (selectedItem) {
                case 'PopularHouse':
                    this.setState({
                        PopularHoseStyleIsOpen: true,
                    })
                    break;
                case 'ChatCustomer':
                    this.setState({
                        RencentlyChatCustomerIsOpen: true,
                    })
                    break;
                case 'HighIntention':
                    this.setState({
                        HighPurchaseIntentionCustomerIsOpen: true,
                    })
                    break;
                default:
                    break;
            }
        }
    }

    //點擊QRCode時觸發
    handleQRCodeButtonOnClick() {
        //打開QRCode全螢幕
        this.setState({
            QRCodeIsOpen: true,     //目前是否展開QRCode
        })
    }

    //QRCode顯示時，點擊返回鈕時觸發
    handleQRCodeBackButtonOnClick() {
        //關閉QRCode全螢幕
        this.setState({
            QRCodeIsOpen: false,
        })
    }
    // 点击最近交谈客户
    handleRecently(item) {
        let c_info = {
            user_id: item.c_userid,
            logo: item.c_logo,
            openid: item.c_openid,
            nickname: item.nickname
        }
        this.props.setc_info(c_info)
        stroage.set('c_info', c_info)
    }
    // 点击买意愿较高客户
    handleHighIntention(item) {
        let c_info = {
            user_id: item.user_id,
            logo: item.c_logo,
            openid: item.user_name,
            nickname: item.nickname
        }
        this.props.setc_info(c_info)
        stroage.set('c_info', c_info)
    }

    //QRCode顯示時，點選網址觸發
    handleQRCodeLinkOnClick() {
        this.copyStringToClipboard(this.state.CustomerWebSiteUrl);
    }

    // 複製文字 (在此專案由handleQRCodeLinkOnClick()觸發，用來複製微沙盤連結)
    copyStringToClipboard(str) {
        // Create new element
        var el = document.createElement('textarea');
        // Set value (string to be copied)
        el.value = str;
        // Set non-editable to avoid focus and move outside of view
        el.setAttribute('readonly', '');
        el.style = { position: 'absolute', left: '-9999px' };
        document.body.appendChild(el);
        // Select text inside element
        el.select();
        // Copy text to clipboard
        document.execCommand('copy');
        // Remove temporary element
        document.body.removeChild(el);

        /* Alert the copied text */
        // alert("Copied the text: " + str);
        alert("微沙盘分享连结已复制");
    }

    // 获取最受欢迎的户型
    getPopular() {
        let _this = this
        popHouse().then(res => {
            _this.setState({
                popularList: res.data.data_list
            })
        })
    }

    // 获取最近交谈客户列表
    getVistorNearly() {
        let _this = this
        let data = {
            section: 1
        }
        latestTalk(data).then(res => {
            _this.setState({
                VistorNearlyList: res.data.data_list
            })
        })
    }

    // 获取购买意向最高客户列表
    getIntention() {
        let _this = this
        let data = {
            section: 1
        }
        mostWantBuy(data).then(res => {
            _this.setState({
                IntentionList: res.data.data_list
            })
        })
    }

    GetRequest() {
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

    componentDidMount() {
        if (window.enableWeXinLogIn) {
            var infolist = this.GetRequest()
            var _this = this
            if (!infolist.openid) {
                infolist = stroage.get('userInfo')
                if (!infolist) {
                    window.location.href = 'http://statistics.isunupcg.com/other/GetUserInfo2?redirect_url=' + encodeURIComponent(window.location.href)
                }
            }
            if (!Cookies.get('p2_token')) {
                this.mlogin(infolist)
            } else {
                this.getPopular()
                this.getVistorNearly()
                this.getIntention()
            }
            this.getGetSignP1()
            this.getstaffInfo()
        }
    }

    // 初始化QRCode
    initQrCode() {
        // 渲染QRCode
        QRCode.toCanvas(document.getElementById('qrCodeCanvas'), this.state.CustomerWebSiteUrl, { errorCorrectionLevel: 'H' }, function (error) {
            if (error) console.error(error)
            console.log('success!');
        })
    }
    getstaffInfo() {
        staffInfo().then(res => {
            this.setState({
                MyclientInfo: res.data.user_base,
                MyOtherInfo: res.data.user_info
            })
            this.clientUserName.value = res.data.user_base.real_name ? res.data.user_base.real_name : res.data.user_base.nickname
            this.clientUserPhone.value = res.data.user_base.phone || ''
            this.clientUserPosition.value = res.data.user_info.occupation || ''
        })
    }
    mlogin(item) {
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
        axios.get('http://ip-api.com/json/?fields=520191&lang=zh-CN').then(res => {
            _data.ip = res.data.query
            _data.location = res.data.country + res.data.regionName + res.data.city
            _data.login_city = res.data.city
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
                        let in30Minutes = 1 / 12;
                        Cookies.set('p2_token', res.data.access_token, { expires: in30Minutes })
                        Cookies.set('p2_redirect_home_flag', res.data.redirect_home_flag)
                        stroage.set('user_id', res.data._id)
                        stroage.set('visitData', _this.state.visitData)
                        _this.getPopular()
                        _this.getVistorNearly()
                        _this.getIntention()
                    })
                })
            })
        })

    }

    // 首頁編輯按鈕點擊觸發
    handleEditIconClick() {
        this.setState({
            isEditingCustomerInfo: true
        })
        console.log(this.state.MyOtherInfo.occupation);
    }

    // 返回微沙盤按鈕點擊觸發
    handleBackToProjectPageOnClick = () => {
        window.location = "http://hvr.isunupcg.com/RunXiShan?fromBackendPage=true";
    }

    // 編輯頁面的儲存按鈕點擊觸發
    handleSaveButtonClick() {
        if (window.enableWeXinLogIn) {
            if (!this.clientUserName.value) {
                alert('请输入姓名')
                return false
            }
            let data = {
                real_name: this.clientUserName.value,
                phone: this.clientUserPhone.value,
                occupation: this.clientUserPosition.value,
                pid: window.pid
            }
            setStaffInfo(data).then(res => {
                if (!res.res) {
                    alert('修改成功')
                    this.setState({
                        isEditingCustomerInfo: false
                    })
                    this.getstaffInfo();
                }
            })
        }
    }

    // 編輯頁面的取消按鈕點擊觸發
    handleCancelButtonClick() {
        this.setState({
            isEditingCustomerInfo: false
        })
    }

    render() {
        let MyclientInfo = this.state.MyclientInfo
        let MyOtherInfo = this.state.MyOtherInfo
        return (
            <div className={(this.state.QRCodeIsOpen) ? ("HomePageContainer qrCodeIsOpen") : ("HomePageContainer")}>

                {/* 名片 */}
                <div className="nameCard">
                    {/* 背景圖片(透明菱格紋) */}
                    <div className='bgImg'></div>

                    {/* 大頭貼 */}
                    <div className="portraitContainer">
                        <div className="portrait">
                            <img src={MyclientInfo.logo} alt="" />
                        </div>
                    </div>

                    {/* 基本資訊 */}
                    <div className="personalInfo">
                        <div className="upper">
                            <div className="name">{MyclientInfo.real_name ? MyclientInfo.real_name : MyclientInfo.nickname}</div>
                        </div>
                        <div className="bottom">
                            <div className="project">潤溪山</div>
                            <div className="line">|</div>
                            <div className="title">{(MyOtherInfo.occupation) ? (MyOtherInfo.occupation) : ("销售")}</div>
                        </div>
                    </div>
                    {/* 編輯列 */}
                    <div className="editBar">
                        {/* 編輯圖標 */}
                        <div className="editIcon" onClick={() => this.handleEditIconClick()}>
                            <svg t={1563764940578} className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id={7222} width={200} height={200}><path d="M853.333333 469.333333a42.666667 42.666667 0 0 1 85.333334 0v298.666667a170.666667 170.666667 0 0 1-170.666667 170.666667H256a170.666667 170.666667 0 0 1-170.666667-170.666667V256a170.666667 170.666667 0 0 1 170.666667-170.666667h298.666667a42.666667 42.666667 0 0 1 0 85.333334H256a85.333333 85.333333 0 0 0-85.333333 85.333333v512a85.333333 85.333333 0 0 0 85.333333 85.333333h512a85.333333 85.333333 0 0 0 85.333333-85.333333v-298.666667z m-69.76-392.618666a128 128 0 0 1 181.034667 180.992L535.125333 687.232l-150.101333 50.005333a64 64 0 0 1-80.981333-80.938666L354.133333 506.197333 783.573333 76.714667zM398.506667 642.816l90.496-30.165333 415.274666-415.274667a42.666667 42.666667 0 1 0-60.330666-60.330667l-415.274667 415.232-30.165333 90.538667z" p-id={7223} /></svg>
                        </div>
                        {/* QR CODE圖標 */}
                        <div className="qrCodeIcon" onClick={() => this.handleQRCodeButtonOnClick()}>
                            <svg t={1563414379794} className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id={58877} width={200} height={200}><path d="M48.384 45.376l412.224 0 0 84.992-412.224 0 0-84.992ZM565.44 45.376l238.656 0 0 84.992-238.656 0 0-84.992ZM891.584 45.376l86.72 0 0 86.72-86.72 0 0-86.72ZM48.384 374.4l412.224 0 0 85.056-412.224 0 0-85.056ZM45.696 45.376l84.992 0 0 412.224-84.992 0 0-412.224ZM375.616 45.376l84.992 0 0 412.224-84.992 0 0-412.224ZM189.376 200.832l115.712 0 0 115.712-115.712 0 0-115.712ZM565.44 130.368l82.752 0 0 87.232-82.752 0 0-87.232ZM804.032 130.368l90.752 0 0 160.512-90.752 0 0-160.512ZM891.584 217.6l86.72 0 0 151.872-86.72 0 0-151.872ZM651.328 282.688l152.768 0 0 109.312-152.768 0 0-109.312ZM736.832 369.408l155.392 0 0 88.128-155.392 0 0-88.128ZM565.952 372.16l85.376 0 0 85.376-85.376 0 0-85.376ZM45.696 542.784l84.992 0 0 192.576-84.992 0 0-192.576ZM130.88 717.248l91.968 0 0 92.032-91.968 0 0-92.032ZM45.696 805.632l85.184 0 0 173.056-85.184 0 0-173.056ZM217.664 542.784l261.696 0 0 105.728-261.696 0 0-105.728ZM281.344 639.104l109.184 0 0 100.48-109.184 0 0-100.48ZM370.176 717.248l109.184 0 0 174.848-109.184 0 0-174.848ZM285.44 805.632l105.088 0 0 173.056-105.088 0 0-173.056ZM197.952 869.12l102.016 0 0 109.568-102.016 0 0-109.568ZM629.184 542.784l195.264 0 0 174.464-195.264 0 0-174.464ZM871.168 542.784l107.136 0 0 107.136-107.136 0 0-107.136ZM545.088 630.016l107.136 0 0 194.304-107.136 0 0-194.304ZM716.672 692.8l107.776 0 0 111.872-107.776 0 0-111.872ZM545.088 869.12l107.136 0 0 109.568-107.136 0 0-109.568ZM802.816 892.096l175.488 0 0 86.592-175.488 0 0-86.592ZM890.56 804.672l87.744 0 0 105.728-87.744 0 0-105.728Z" p-id={58878} /></svg>
                        </div>
                        {/* 返回微沙盤 */}
                        <div className="backToProjectPage">
                            <Link to='/GreenLand/HomePage'></Link>
                            <svg t={1565836110200} className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id={7828} width={200} height={200}><path d="M981.333333 896a85.426667 85.426667 0 0 1-85.333333 85.333333h-170.666667a85.333333 85.333333 0 0 1 0-170.666666h21.333334a106.666667 106.666667 0 0 1 173.093333 3.333333 85.333333 85.333333 0 0 1 61.573333 82z m-170.666666-192V234.666667a21.333333 21.333333 0 0 1 21.333333-21.333334h64a42.713333 42.713333 0 0 1 42.666667 42.666667v448a21.333333 21.333333 0 0 1-21.333334 21.333333h-85.333333a21.333333 21.333333 0 0 1-21.333333-21.333333z m42.666666-277.333333h42.666667V341.333333h-42.666667z m0 128h42.666667V469.333333h-42.666667z m0 128h42.666667V597.333333h-42.666667z m-170.666666 85.333333a85.426667 85.426667 0 0 0-85.333334 85.333333v106.666667a21.333333 21.333333 0 0 1-21.333333 21.333333H64a21.333333 21.333333 0 0 1 0-42.666666h64v-89.5c-10.873333-4.526667-20.14-12.666667-27.04-23.953334C90.446667 808 85.333333 784.06 85.333333 752c0-31.2 5-66.666667 13.38-94.84 4.613333-15.513333 10-28.14 16.093334-37.526667C126.72 601.2 140.16 597.333333 149.333333 597.333333s22.613333 3.866667 34.526667 22.3c6.066667 9.386667 11.48 22 16.093333 37.526667C208.333333 685.333333 213.333333 720.8 213.333333 752c0 32.06-5.113333 56-15.626666 73.213333-6.9 11.293333-16.166667 19.426667-27.04 23.953334V938.666667h128V183.893333a106.666667 106.666667 0 0 1 96.053333-106.14l349.826667-34.98A21.333333 21.333333 0 0 1 768 64v647.333333a21.333333 21.333333 0 0 1-14.22 20.106667 107.12 107.12 0 0 0-43.946667 29.486667 21.333333 21.333333 0 0 1-15.893333 7.106666z m-213.333334-42.666667h-42.666666v85.333334h42.666666z m0-128h-42.666666v85.333334h42.666666z m0-128h-42.666666v85.333334h42.666666z m0-128h-42.666666v85.333334h42.666666z m0-128h-42.666666v85.333334h42.666666z m85.333334 512h-42.666667v85.333334h42.666667z m0-128h-42.666667v85.333334h42.666667z m0-128h-42.666667v85.333334h42.666667z m0-128h-42.666667v85.333334h42.666667z m0-128h-42.666667v85.333334h42.666667z m85.333333 384h-42.666667v85.333334h42.666667z m0-128h-42.666667v85.333334h42.666667z m0-128h-42.666667v85.333334h42.666667z m0-128h-42.666667v85.333334h42.666667z" fill="#333333" p-id={7829} /></svg>
                        </div>
                    </div>
                </div>

                {/* 全螢幕QRCode */}
                <div className={(this.state.QRCodeIsOpen) ? ("fullPageQRCodeContainer active") : ("fullPageQRCodeContainer")}>

                    {/* 模糊背景 */}
                    {/* <div className="blurBg">
                    </div> */}

                    {/* 黑色背景 */}
                    <div className="blackbg"></div>

                    {/* QRCODE及標題 */}
                    <div className="qrCodeContainer" onClick={() => this.handleQRCodeLinkOnClick()}>
                        {/* 標題 */}
                        <div className="textContainer">
                            <div className="text">扫码前往微沙盘</div>
                        </div>
                        {/* QRCode */}
                        <div className="qrCodePositioner">
                            <div className="qrCode">
                                {/* <img className="qrCodeSelf" src={require('../../images/HomePage/QRCode.png')} alt=""></img> */}
                                <canvas id="qrCodeCanvas"></canvas>
                            </div>
                        </div>
                    </div>

                    {/* 網址及標題 */}
                    <div className="linkContainer" onClick={() => this.handleQRCodeLinkOnClick()}>
                        <div className="text">微沙盘链接</div>
                        <div className="link">{this.state.CustomerWebSiteUrl}</div>
                    </div>

                    {/* 返回鈕 */}
                    <div className="backButtonContainer">
                        <svg xmlns="http://www.w3.org/2000/svg" width={145} height={145} viewBox="-5 -5 155 155" onClick={() => this.handleQRCodeBackButtonOnClick()}>
                            <title>資產 2</title>
                            <g id="67fd8c09-ee4a-4c7e-9976-197022cc7aa3" data-name="圖層 2">
                                <g id="0d2fd54e-aa31-4b91-ae34-45dcdaf2a0f5" data-name="圖層 1">
                                    <path className="4ad4cf6c-9e93-406d-8473-7aba87f194b2" d="M145,72.5A72.5,72.5,0,1,1,72.5,0,72.5,72.5,0,0,1,145,72.5ZM84.5,49l-24,23.32M84.5,96l-24-23.68" />
                                </g>
                            </g>
                        </svg>
                    </div>

                </div>

                {/* 輸入銷售基本資訊 */}
                <div className={(this.state.isEditingCustomerInfo) ? ("editSalerInfo") : ("editSalerInfo hide")}>

                    {/* 黑色背景 */}
                    <div className="blackBg"></div>

                    {/* 輸入表格 */}
                    <div className="formContainer">

                        {/* 請輸入妳的資訊 */}
                        <div className="topTitle">输入你的基本资料</div>

                        {/* 輸入欄位 */}
                        <div className="form">

                            {/* 名字 */}
                            <div className="name">
                                <div className="icon">
                                    <div className="svgSelf">
                                        <svg t={1565937513887} viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id={3047} width={200} height={200}><path fill="#606060" d="M667.658 536.592c80.052-50.19 133.7-138.573 133.7-240.03 0-156.773-127.094-283.869-283.868-283.869-156.785 0-283.869 127.094-283.869 283.87 0 101.457 53.647 189.838 133.7 240.029-180.608 62.537-311.123 232.28-311.123 434.165 0 19.6 15.882 35.482 35.483 35.482H943.3c19.6 0 35.482-15.88 35.482-35.482-0.002-201.885-130.517-371.628-311.125-434.165z m-363.075-240.03c0-117.583 95.32-212.903 212.905-212.903s212.905 95.32 212.905 212.903-95.32 212.903-212.904 212.903-212.906-95.32-212.906-212.902z m212.905 283.87c203.41 0 368.56 156.178 386.752 354.843H130.736C148.93 736.61 314.078 580.432 517.49 580.432z" p-id={3048} /></svg>
                                    </div>
                                </div>
                                <div className="input">
                                    <input type="text" placeholder="姓名" ref={self => this.clientUserName = self} />
                                </div>
                            </div>

                            {/* 職稱 */}
                            <div className="jobTitle">
                                <div className="icon">
                                    <div className="svgSelf">
                                        <svg t="1565939382897" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4638" width="200" height="200"><path d="M260 680h336c15.5 0 28 12.5 28 28s-12.5 28-28 28H260c-15.5 0-28-12.5-28-28s12.5-28 28-28zM736 288H568c-30.9 0-56 25.1-56 56v168c0 30.9 25.1 56 56 56h168c30.9 0 56-25.1 56-56V344c0-30.9-25.1-56-56-56z m0 224H568V344h168v168z" fill="#606060" p-id="4639"></path><path d="M904 120H120c-30.9 0-56 25.1-56 56v672c0 30.9 25.1 56 56 56h784c30.9 0 56-25.1 56-56V176c0-30.9-25.1-56-56-56z m0 728H120V176h784v672z" fill="#606060" p-id="4640"></path></svg>
                                    </div>
                                </div>
                                <div className="input">
                                    <input type="text" placeholder="职称" ref={self => this.clientUserPosition = self} />
                                </div>
                            </div>

                            {/* 手機號碼 */}
                            <div className="phoneNumber">
                                <div className="icon">
                                    <div className="svgSelf">
                                        <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="mobile" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" className="svg-inline--fa fa-mobile fa-w-10 fa-3x"><path fill="#606060" d="M192 416c0 17.7-14.3 32-32 32s-32-14.3-32-32 14.3-32 32-32 32 14.3 32 32zM320 48v416c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V48C0 21.5 21.5 0 48 0h224c26.5 0 48 21.5 48 48zm-48 410V54c0-3.3-2.7-6-6-6H54c-3.3 0-6 2.7-6 6v404c0 3.3 2.7 6 6 6h212c3.3 0 6-2.7 6-6z"></path></svg>
                                    </div>
                                </div>
                                <div className="input">
                                    <input type="text" placeholder="电话号码" ref={self => this.clientUserPhone = self} />
                                </div>
                            </div>

                        </div>

                        {/* 確認或返回按鈕 */}
                        <div className="buttonContainer">
                            {/* 取消 */}
                            <div className="cancel" onClick={() => this.handleCancelButtonClick()}><span>取消</span></div>
                            {/* 確認 */}
                            <div className="confirm" onClick={() => this.handleSaveButtonClick()}><span>储存</span></div>
                        </div>

                    </div>
                </div>
            </div>
        )
    }
}

const mapDispatchToProps = {
    setc_info
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);