import React from 'react';
import './CustomerChatPage.scss';
import { Csend, getHistory } from '../../api/api'
import { getUuid } from '../../utils/util.js'
import { exports } from '../../utils/webmain'
import socket from '../../utils/socket';
import events from '../../utils/events';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { setMessagelist, pushMessage, setSocket } from '../../actions/chatPage.js';
import store from '../../utils/store';
import stroage from '../../api/stroage';
import { DiaplayTime, over48hours } from '../../utils/diaplayTime'

function mapStateToProps(state) {
    return {
        messagelist: state.chat.messagelist,
        clientInfo: state.chat.clientInfo,
        socket: state.chat.socket
    }
}

class ChatPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: '',
            messagelist: [],
            b_openid: '',
            c_openid: '',
            avatarUrl: '',
            current_page: 0,
            my_info: '',
            clientInfo: '',
            debugConsole: 'debugDefault'
        }
    }
    componentDidMount() {
        if (window.enableWeXinLogIn) {
            let _this = this
            if (!this.props.socket) {
                socket(_this).then((socket) => {
                    _this.props.setSocket(socket)
                    events(_this, socket)
                })
            }
            setTimeout(() => {
                this.dialogContainer.scrollTop = this.dialogContainer.scrollHeight;
                this.setState({
                    b_openid: stroage.get('clientInfo').user_name,
                    c_openid: stroage.get('userInfo').user_name,
                    avatarUrl: stroage.get('userInfo').logo,
                    my_info: stroage.get('userInfo'),
                    clientInfo: stroage.get('clientInfo'),
                }, () => {
                    _this.getHistory()
                })
            }, 400);
        }


    }
    componentDidUpdate(prevProps) {
        if (prevProps.messagelist.length != this.props.messagelist.length) {
            this.dialogContainer.scrollTop = this.dialogContainer.scrollHeight;
        }
    }
    // 返回上頁鈕點擊觸發
    handleBackButtonClick() {
        this.props.history.goBack();
    }
    getHistory() {
        let _this = this
        getHistory({
            pids: window.pid,
            current_page: _this.state.current_page,
            other_openid: _this.state.clientInfo.user_name // open_id
        }).then(res => {
            if (res.data) {
                _this.props.setMessagelist(res.data.reverse())
            }
        })
    }
    structureMessage(t, m) {
        // 构建 message 对象
        var that = this
        var message = {}
        var uuid = getUuid(32)
        message.msg_id = uuid
        message.pid = window.pid
        message.b_openid = this.state.clientInfo.user_name
        message.c_openid = this.state.my_info.user_name
        message.mine = true
        message.create_time = Date.parse(new Date()) / 1000
        message.logo = this.state.my_info.logo
        message.mine = true
        message.fail = false
        message.name = stroage.get('userInfo').nickname
        message.msg_type = t
        if (t == 'text') {
            message.content = m.message
        }
        if (t == 'image') {
            message.content = m.image_url
            message.image_url = m.image_url
            message.PicUrl = m.image_url
        }
        return message
    }

    dosendmessage(message) {
        var that = this
        Csend(message).then(res => {
        })

    }
    input_change(e) {
        this.setState({ message: e.target.value })
    }

    sendmsg() {
        var _this = this
        var message = this.structureMessage('text', {
            message: this.state.message
        })
        if (this.state.message !== '') {
            if (exports.ios && exports.isUC) {
                setTimeout(function () {
                    _this.props.pushMessage(message)
                    _this.dosendmessage(message)
                }, 500)
            } else {
                _this.props.pushMessage(message)
                _this.dosendmessage(message)
            }
            _this.setState({
                message: ''
            })
        }
    }

    handleKeydown(e) {
        // if (e.keyCode === 13) {
        //   this.sendmsg();
        // }
    }

    handleSendButtonClick() {
        this.sendmsg();
    }

    // 點擊通話按鈕觸發
    handlePhoneIconClick() {
        if (!this.state.clientInfo.phone) {
            alert('销售顾问未设置手机号码');
        }
        // alert(this.state.clientInfo.phone);
    }

    // 從輸入框移開時觸發
    handleInputFocusOut = () => {
        let userAgent = navigator.userAgent || navigator.vendor || window.opera;
        if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {

        //     window.addEventListener('focusout', function () {

        //         //软键盘收起的事件处理

                setTimeout(() => {
                    window.scrollTo(0, document.documentElement.scrollTop || document.body.scrollTop);
                })

        //     });
        //     this.setState({
        //         debugConsole: 'success'
        //     })
        }
    }

    render() {
        var messagelist = this.props.messagelist;
        var clientInfo = this.state.clientInfo;
        return (
            <div className="ChatPageContainer">
                {/* 頂部固定列 */}
                <div className="topContainer">
                    {/* 回上一頁 */}
                    <div className="backButtonContainer" onClick={() => this.handleBackButtonClick()}>
                        <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="chevron-left" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512" className="svg-inline--fa fa-chevron-left fa-w-8 fa-3x"><path className="" fill="currentColor" d="M231.293 473.899l19.799-19.799c4.686-4.686 4.686-12.284 0-16.971L70.393 256 251.092 74.87c4.686-4.686 4.686-12.284 0-16.971L231.293 38.1c-4.686-4.686-12.284-4.686-16.971 0L4.908 247.515c-4.686 4.686-4.686 12.284 0 16.971L214.322 473.9c4.687 4.686 12.285 4.686 16.971-.001z"></path></svg>
                    </div>
                    {/* 大頭貼和姓名 */}
                    <div className="centerContainer">
                        {/* 大頭貼 */}
                        <div className="portraitContainer">
                            <img src={clientInfo.logo} alt="" />
                        </div>
                        {/* 姓名 */}
                        <div className="name">{clientInfo.real_name}</div>
                    </div>
                    {/* info按鈕 */}
                    {/* <a href={clientInfo.phone} className="infoContainer" onClick={() => this.handlePhoneIconClick()}> */}
                    {/* <a href={(clientInfo.phone)?("tel:" + clientInfo.phone):("#")} className="infoContainer" onClick={() => this.handlePhoneIconClick()}> */}
                        {/* <svg t="1564129591979" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4920" width="200" height="200"><path d="M911.929 696.144c-91.373-57.534-105.296-65.56-137.443-60.479-32.15 5.073-41.701 11.973-87.968 76.969-6.538 7.983-68.614 104.042-291.387-109.954C231.8 434.268 280.165 373.155 311.069 333.545c26.874-25.096 57.019-36.228 61.48-81.069 1.927-20.647-0.735-62.959-68.543-155.899-45.442-66.374-54.479-71.689-84.811-72.301-30.332-0.602-78.674 14.414-128.369 54.479-49.147 33.02-64.307 71.722-69.552 117.08-5.537 57.181-16.444 250.748 228.847 521.05 245.294 270.306 562.346 328.422 672.831 251.728 47.599-33.778 86.488-108.888 88.165-157.229 5.966-33.349-7.815-57.716-99.188-115.24z" p-id="4921"></path></svg>                        <svg aria-hidden="true" focusable="false" data-prefix="fal" data-icon="info-circle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="svg-inline--fa fa-info-circle fa-w-16 fa-3x"><path className="" fill="currentColor" d="M256 40c118.621 0 216 96.075 216 216 0 119.291-96.61 216-216 216-119.244 0-216-96.562-216-216 0-119.203 96.602-216 216-216m0-32C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm-36 344h12V232h-12c-6.627 0-12-5.373-12-12v-8c0-6.627 5.373-12 12-12h48c6.627 0 12 5.373 12 12v140h12c6.627 0 12 5.373 12 12v8c0 6.627-5.373 12-12 12h-72c-6.627 0-12-5.373-12-12v-8c0-6.627 5.373-12 12-12zm36-240c-17.673 0-32 14.327-32 32s14.327 32 32 32 32-14.327 32-32-14.327-32-32-32z"></path></svg> */}
                    {/* </a> */}
                </div>

                {/* 對話紀錄及聊天方塊 */}
                <div className="chatPageInnerContainer">
                    {/* 對話紀錄 */}
                    <div className="dialogContainer" ref={self => this.dialogContainer = self}>
                        <ul>
                            {
                                messagelist.map((item) => {
                                    return (
                                        <li className={item.mine ? 'mySentence' : 'yourSentence'} key={item.msg_id}>
                                            {/* 姓名列 */}
                                            <div className="nameBarContainer">
                                                {/* 大頭貼 */}
                                                <div className="portraitContainer">
                                                    <img src={item.logo} alt="" />
                                                </div>
                                                {/* 姓名 */}
                                                {/* <div className="name">{item.name}</div> */}
                                            </div>
                                            {/* 文字列 */}
                                            <div className="textContainer">
                                                <div className="text">{item.content}</div>
                                            </div>
                                            {/* 時間列 */}
                                            <div className="timeContainer">
                                                <div className="time">{DiaplayTime(item.create_time)}</div>
                                            </div>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>

                    {/* 文字輸入方塊 */}
                    <div className="textBoxContainer">
                        {/* 外框 */}
                        <div className="innerContainer">
                            {/* 輸入列 */}
                            <div className="searchBarContainer">
                                <div className="searchBarBg">
                                    <div className="icon">
                                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="keyboard" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className="svg-inline--fa fa-keyboard fa-w-18 fa-3x"><path className="" fill="currentColor" d="M528 448H48c-26.51 0-48-21.49-48-48V112c0-26.51 21.49-48 48-48h480c26.51 0 48 21.49 48 48v288c0 26.51-21.49 48-48 48zM128 180v-40c0-6.627-5.373-12-12-12H76c-6.627 0-12 5.373-12 12v40c0 6.627 5.373 12 12 12h40c6.627 0 12-5.373 12-12zm96 0v-40c0-6.627-5.373-12-12-12h-40c-6.627 0-12 5.373-12 12v40c0 6.627 5.373 12 12 12h40c6.627 0 12-5.373 12-12zm96 0v-40c0-6.627-5.373-12-12-12h-40c-6.627 0-12 5.373-12 12v40c0 6.627 5.373 12 12 12h40c6.627 0 12-5.373 12-12zm96 0v-40c0-6.627-5.373-12-12-12h-40c-6.627 0-12 5.373-12 12v40c0 6.627 5.373 12 12 12h40c6.627 0 12-5.373 12-12zm96 0v-40c0-6.627-5.373-12-12-12h-40c-6.627 0-12 5.373-12 12v40c0 6.627 5.373 12 12 12h40c6.627 0 12-5.373 12-12zm-336 96v-40c0-6.627-5.373-12-12-12h-40c-6.627 0-12 5.373-12 12v40c0 6.627 5.373 12 12 12h40c6.627 0 12-5.373 12-12zm96 0v-40c0-6.627-5.373-12-12-12h-40c-6.627 0-12 5.373-12 12v40c0 6.627 5.373 12 12 12h40c6.627 0 12-5.373 12-12zm96 0v-40c0-6.627-5.373-12-12-12h-40c-6.627 0-12 5.373-12 12v40c0 6.627 5.373 12 12 12h40c6.627 0 12-5.373 12-12zm96 0v-40c0-6.627-5.373-12-12-12h-40c-6.627 0-12 5.373-12 12v40c0 6.627 5.373 12 12 12h40c6.627 0 12-5.373 12-12zm-336 96v-40c0-6.627-5.373-12-12-12H76c-6.627 0-12 5.373-12 12v40c0 6.627 5.373 12 12 12h40c6.627 0 12-5.373 12-12zm288 0v-40c0-6.627-5.373-12-12-12H172c-6.627 0-12 5.373-12 12v40c0 6.627 5.373 12 12 12h232c6.627 0 12-5.373 12-12zm96 0v-40c0-6.627-5.373-12-12-12h-40c-6.627 0-12 5.373-12 12v40c0 6.627 5.373 12 12 12h40c6.627 0 12-5.373 12-12z"></path></svg>
                                    </div>
                                    <input type="text" name="請輸入用戶名" value={this.state.message} placeholder="Message..." onChange={this.input_change.bind(this)} onKeyDown={this.handleKeydown.bind(this)} onBlur={() => this.handleInputFocusOut()}></input>
                                    <div className="sendIcon" onClick={() => this.handleSendButtonClick()}>
                                        {/* <svg
                                            t={1565149415861}
                                            className="icon"
                                            viewBox="0 0 1024 1024"
                                            version="1.1"
                                            xmlns="http://www.w3.org/2000/svg"
                                            p-id={1983}
                                            width={200}
                                            height={200}
                                        >
                                            <path
                                                d="M1008.00076 6.285714q18.857143 13.714286 15.428571 36.571429l-146.285714 877.714286q-2.857143 16.571429-18.285714 25.714285-8 4.571429-17.714286 4.571429-6.285714 0-13.714286-2.857143l-258.857142-105.714286-138.285715 168.571429q-10.285714 13.142857-28 13.142857-7.428571 0-12.571428-2.285714-10.857143-4-17.428572-13.428572T365.715046 987.428571v-199.428571l493.714285-605.142857-610.857142 528.571428-225.714286-92.571428q-21.142857-8-22.857143-31.428572-1.142857-22.857143 18.285714-33.714285L969.143617 5.142857q8.571429-5.142857 18.285714-5.142857 11.428571 0 20.571429 6.285714z"
                                                p-id={1984}
                                            />
                                        </svg> */}
                                        <span className="sendText">传送</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* dubug */}
                {/* {(!window.enableWeXinLogIn) ? (<div className="debugConsole">{this.state.debugConsole}</div>) : (null)} */}

            </div>
        )
    }
}

const mapDispatchToProps = {
    setMessagelist,
    pushMessage,
    setSocket
}
export default connect(mapStateToProps, mapDispatchToProps)(ChatPage);