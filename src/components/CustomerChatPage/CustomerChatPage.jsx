import React, { useState, useEffect, useRef } from "react";
import "./CustomerChatPage.scss";
import { Bsend, getHistory } from "../../api/Backend/api";
import { Csend } from '../../api/api'
import { getUuid } from "../../utils/util.js";
import { exports } from "../../utils/webmain";
import socket from '../../utils/socket';
import events from '../../utils/events';
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setMessagelist, pushMessage, setSocket, clearMessageList } from "../../actions/chatPage.js";
import store from "../../utils/store";
import stroage from "../../api/stroage";
import { DiaplayTime, over48hours } from "../../utils/diaplayTime";

// local storage clientInfo 使用者資訊
let clientInfo = {
    "_id": "134",
    "user_name": "oRbr0w4RNYkdxuBZvkB5oUxI7QkQ",
    "unionid": "",
    "nickname": "James 呂國禾",
    "logo": "http://thirdwx.qlogo.cn/mmopen/vi_32/AcJM5WNhE04JYmoZVWbssORUTxp5ygQ1WiaX1k3Yq0V3AutJ75lZQibe3YXqY6ZKmd9iaLGf6KuAULhk0tlAZTAUA/132",
    "wechat_logo": null,
    "user_type": "3",
    "share_count": "0",
    "qr_img_url": null,
    "real_name": "打打打",
    "phone": "7777766666",
    "sex": "1",
    "country": "中国",
    "province": "台湾",
    "city": "高雄市",
    "pid": "2",
    "create_time": "1564471447",
    "update_time": null
}
// local storage userInfo 銷售數據
let userInfo = {
    "user_name": "oRbr0w4RNYkdxuBZvkB5oUxI7QkQ",
    "pid": 3,
    "c_share_userid": "27",
    "b_share_userid": "27",
    "ip": "",
    "logo": "http://thirdwx.qlogo.cn/mmopen/vi_32/AcJM5WNhE04JYmoZVWbssORUTxp5ygQ1WiaX1k3Yq0V3AutJ75lZQibe3YXqY6ZKmd9iaLGf6KuAULhk0tlAZTAUA/132",
    "nickname": "James 呂國禾",
    "sex": "1",
    "country": "中国",
    "province": "台湾",
    "city": "高雄市",
    "visit_from": 1,
    "openid": "oRbr0w4RNYkdxuBZvkB5oUxI7QkQ",
    "phone": "7777766666",
    "clentName": "James 呂國禾",
    "clentOpenId": "oRbr0w4RNYkdxuBZvkB5oUxI7QkQ",
    "clentImg": "http://thirdwx.qlogo.cn/mmopen/vi_32/AcJM5WNhE04JYmoZVWbssORUTxp5ygQ1WiaX1k3Yq0V3AutJ75lZQibe3YXqY6ZKmd9iaLGf6KuAULhk0tlAZTAUA/132",
    "isAdmin": "3"
}

const CustomerChatPage = (props) => {
    // Ref
    const dialogContainerDOM = useRef();
    // State
    const [message, setMessage] = useState('');
    const [messagelist, setMessagelist] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [bOpenID, setBOpenID] = useState();               // 銷售ID
    const [cOpenID, setCOpenID] = useState();               // 顧客ID
    const [avataUrl, setAvataUrl] = useState();             // 屬於每一條訊息的大頭貼
    // Store
    const storeMessageList = useSelector(state => state.chat.messagelist);  // 聊天頁面的聊天文字
    const storeCInfo = useSelector(state => state.chat.c_info);             // 顧客資訊
    const storeClientInfo = useSelector(state => state.chat.clientInfo);    // 銷售資訊
    const storeSocket = useSelector(state => state.socket);
    // Dispatch
    const dispatch = useDispatch();
    const setStoreMessageList = (value) => dispatch(pushMessage(value));    // 更新聊天頁面的聊天文字
    const setStoreSocket = (value) => dispatch(setSocket(value));
    const clearStoreMessageList = () => dispatch(clearMessageList());

    useEffect(() => {
        if (window.enableWeiXinLogIn) {
            let _this = {
                setStoreMessageList: (value) => setStoreMessageList(value),
            };

            if (!storeSocket) {
                socket(_this).then((socket) => {
                    setStoreSocket(socket);
                    events(_this, socket);
                })
            }

            setTimeout(() => {
                setBOpenID(stroage.get('clientInfo').user_name);   //使用者ID
                setCOpenID(stroage.get('userInfo').user_name);     //銷售ID
                setAvataUrl(stroage.get('userInfo').logo);         //銷售大頭貼
            }, 400);
        }

        return () => {
            console.log('離開 CustomerChatPage, 清空 store message list');
            // setStoreMessageList([]);
            clearStoreMessageList();
        }
    }, [])


    useEffect(() => {
        thisPageGetHistory();
    }, [bOpenID, cOpenID, avataUrl])

    // useEffect(() => {
    //     // console.log(storeCInfo);
    //     // console.log(storeMessageList);
    //     dialogContainerDOM.current.scrollTop = dialogContainerDOM.current.scrollHeight;
    // }, [storeCInfo, storeMessageList])

    // 當 store messageList 有新訊息，將對話框容器捲到最下方
    useEffect(() => {
        dialogContainerDOM.current.scrollTop = dialogContainerDOM.current.scrollHeight;
    }, [storeMessageList.length]);

    useEffect(()=>{
        console.log('store.MessageList↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓')
        console.log(storeMessageList);
        console.log('↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑')
    }, [storeMessageList])

    useEffect(() => {
        // console.log('目前state的message↓↓↓');
        // console.log(message);
        // console.log('↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑');
    }, [message]);

    // 返回上頁鈕點擊觸發
    const handleBackButtonClick = () => {
        props.history.goBack();
    }

    // 取得歷史聊天紀錄，並放到 Store MessageList 中
    const thisPageGetHistory = () => {
        // console.log('開始取得歷史聊天紀錄，向伺服器傳遞以下數據↓↓↓');
        // console.log({
        //     pids: window.pid,
        //     current_page: currentPage,
        //     other_openid: storeClientInfo.user_name     //聊天對象的openid (store.chat.client)
        // })
        // console.log('↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑')

        getHistory({
            pids: window.pid,
            current_page: currentPage,
            other_openid: storeClientInfo.user_name     //聊天對象的openid (store.chat.client)
        }).then(res => {
            // console.log('從伺服器取得的歷史聊天紀錄↓↓↓');
            // console.log(res.data);
            // console.log('↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑')

            if (res.data) {
                clearStoreMessageList();
                setStoreMessageList(res.data.reverse());
            }
        });
    }

    // 每次輸入文字，都即時更新到 state message 中
    const input_change = (e) => {
        setMessage(e.target.value)
    }

    // 傳送鈕點擊觸發
    const handleSendButtonClick = () => {
        sendmsg();
    }

    // 傳送訊息
    const sendmsg = () => {
        // 使用 state 中的 message 內容，建立一個 message object
        let tempMessage = structureMessage("text", { message: message });

        console.log(tempMessage);
        // b_openid: "oRbr0w4RNYkdxuBZvkB5oUxI7QkQ"
        // c_openid: "oRbr0w4RNYkdxuBZvkB5oUxI7QkQ"
        // content: "7283"
        // create_time: 1569400300
        // fail: false
        // logo: "http://thirdwx.qlogo.cn/mmopen/vi_32/AcJM5WNhE04JYmoZVWbssORUTxp5ygQ1WiaX1k3Yq0V3AutJ75lZQibe3YXqY6ZKmd9iaLGf6KuAULhk0tlAZTAUA/132"
        // mine: true
        // msg_id: "It9WAFuZQXLzabE4BTv20IYlRErYUSzw"
        // msg_type: "text"
        // name: "James 呂國禾"
        // pid: 2

        // 如果state message有內容，則檢驗目前是甚麼裝置
        // 接著傳送當前的訊息物件到伺服器
        if (message !== "") {
            if (exports.ios && exports.isUC) {
                setTimeout(function () {
                    // 更新這段訊息到store中
                    setStoreMessageList(tempMessage);
                    // 向伺服器傳這段訊息
                    dosendmessage(tempMessage);
                }, 500);
            } else {
                // 更新這段訊息到store中
                setStoreMessageList(tempMessage);
                // 向伺服器傳這段訊息
                dosendmessage(tempMessage);
            }

            // 清空 state message
            setMessage('');
        }
    }

    // 建立message
    const structureMessage = (t, m) => {
        // 构建 message 对象
        var that = this;
        var message = {};

        // 隨機替每一條essage訊息生成專屬id
        var uuid = getUuid(32);

        message.msg_id = uuid;
        message.pid = window.pid;
        message.b_openid = bOpenID;     // 銷售ID
        message.c_openid = cOpenID;     // 顧客ID
        message.create_time = Date.parse(new Date()) / 1000;
        message.logo = avataUrl;        // 此條訊息的大頭貼
        message.mine = true;            // 這條訊息是我傳的
        message.fail = false;
        message.msg_type = t;           // 訊息類型 (文字, 圖片)
        message.name = stroage.get('userInfo').nickname;

        if (t === "text") {
            message.content = m.message;
        }
        if (t === "image") {
            message.content = m.image_url;
            message.image_url = m.image_url;
            message.PicUrl = m.image_url;
        }
        return message;
    }

    // 真正的傳訊息到伺服器
    const dosendmessage = (value) => {
        // console.log('傳送這次輸入的文字到伺服器，文字內容如下↓↓↓');
        // console.log(value);
        // console.log('↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑');
        Csend(value).then(res => { });
    }

    // enter鈕點擊觸發
    const handleKeydown = (e) => {
        // if (e.keyCode === 13) {
        //   this.sendmsg();
        // }
    }

    // 從輸入框移開時觸發
    const handleInputFocusOut = () => {
        let userAgent = navigator.userAgent || navigator.vendor || window.opera;
        if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
            // window.addEventListener('focusout', function () {
            //软键盘收起的事件处理
            setTimeout(() => {
                window.scrollTo(0, document.documentElement.scrollTop || document.body.scrollTop);
            })
            // });
        }
    }

    // store.subscribe(() => { });

    return (
        <div className="ChatPageContainer">
            {/* 頂部固定列 */}
            <div className="topContainer">
                {/* 回上一頁 */}
                <div
                    className="backButtonContainer"
                    onClick={() => handleBackButtonClick()}
                >
                    <svg
                        aria-hidden="true"
                        focusable="false"
                        data-prefix="far"
                        data-icon="chevron-left"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 256 512"
                        className="svg-inline--fa fa-chevron-left fa-w-8 fa-3x"
                    >
                        <path
                            className=""
                            fill="currentColor"
                            d="M231.293 473.899l19.799-19.799c4.686-4.686 4.686-12.284 0-16.971L70.393 256 251.092 74.87c4.686-4.686 4.686-12.284 0-16.971L231.293 38.1c-4.686-4.686-12.284-4.686-16.971 0L4.908 247.515c-4.686 4.686-4.686 12.284 0 16.971L214.322 473.9c4.687 4.686 12.285 4.686 16.971-.001z"
                        />
                    </svg>
                </div>
                {/* 大頭貼和姓名 */}
                <div className="centerContainer">
                    {/* 大頭貼 */}
                    <div className="portraitContainer">
                        {/* <img src={storeClientInfo.logo} alt="" /> */}
                        <img src={(storeClientInfo.logo) ? (storeClientInfo.logo) : (require('../../images/Portrait.png'))} alt="" />
                    </div>
                    {/* 姓名 */}
                    {/* <div className="name">{storeCInfo.nickname}</div> */}
                    <div className="name">{(storeClientInfo.nickname) ? ((storeClientInfo.real_name) ? (storeClientInfo.real_name) : (storeClientInfo.nickname)) : ('销售人员')}</div>
                </div>
                {/* info按鈕 */}
                <Link to="/RunXiShan_BackEnd/CustomerInfo" className="infoContainer">
                    <svg
                        aria-hidden="true"
                        focusable="false"
                        data-prefix="fal"
                        data-icon="info-circle"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        className="svg-inline--fa fa-info-circle fa-w-16 fa-3x"
                    >
                        <path
                            className=""
                            fill="currentColor"
                            d="M256 40c118.621 0 216 96.075 216 216 0 119.291-96.61 216-216 216-119.244 0-216-96.562-216-216 0-119.203 96.602-216 216-216m0-32C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm-36 344h12V232h-12c-6.627 0-12-5.373-12-12v-8c0-6.627 5.373-12 12-12h48c6.627 0 12 5.373 12 12v140h12c6.627 0 12 5.373 12 12v8c0 6.627-5.373 12-12 12h-72c-6.627 0-12-5.373-12-12v-8c0-6.627 5.373-12 12-12zm36-240c-17.673 0-32 14.327-32 32s14.327 32 32 32 32-14.327 32-32-14.327-32-32-32z"
                        />
                    </svg>
                </Link>
            </div>

            {/* 對話紀錄及聊天方塊 */}
            <div className="chatPageInnerContainer">
                {/* 對話紀錄 */}
                <div className="dialogContainer" ref={dialogContainerDOM}>
                    <ul>
                        {storeMessageList.map(item => {
                            return (
                                <li className={item.mine ? "mySentence" : "yourSentence"} key={item.msg_id}>
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
                                        <div className="time">
                                            {DiaplayTime(item.create_time)}
                                        </div>
                                    </div>
                                </li>
                            )
                        })}
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
                                    <svg
                                        aria-hidden="true"
                                        focusable="false"
                                        data-prefix="fas"
                                        data-icon="keyboard"
                                        role="img"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 576 512"
                                        className="svg-inline--fa fa-keyboard fa-w-18 fa-3x"
                                    >
                                        <path
                                            className=""
                                            fill="currentColor"
                                            d="M528 448H48c-26.51 0-48-21.49-48-48V112c0-26.51 21.49-48 48-48h480c26.51 0 48 21.49 48 48v288c0 26.51-21.49 48-48 48zM128 180v-40c0-6.627-5.373-12-12-12H76c-6.627 0-12 5.373-12 12v40c0 6.627 5.373 12 12 12h40c6.627 0 12-5.373 12-12zm96 0v-40c0-6.627-5.373-12-12-12h-40c-6.627 0-12 5.373-12 12v40c0 6.627 5.373 12 12 12h40c6.627 0 12-5.373 12-12zm96 0v-40c0-6.627-5.373-12-12-12h-40c-6.627 0-12 5.373-12 12v40c0 6.627 5.373 12 12 12h40c6.627 0 12-5.373 12-12zm96 0v-40c0-6.627-5.373-12-12-12h-40c-6.627 0-12 5.373-12 12v40c0 6.627 5.373 12 12 12h40c6.627 0 12-5.373 12-12zm96 0v-40c0-6.627-5.373-12-12-12h-40c-6.627 0-12 5.373-12 12v40c0 6.627 5.373 12 12 12h40c6.627 0 12-5.373 12-12zm-336 96v-40c0-6.627-5.373-12-12-12h-40c-6.627 0-12 5.373-12 12v40c0 6.627 5.373 12 12 12h40c6.627 0 12-5.373 12-12zm96 0v-40c0-6.627-5.373-12-12-12h-40c-6.627 0-12 5.373-12 12v40c0 6.627 5.373 12 12 12h40c6.627 0 12-5.373 12-12zm96 0v-40c0-6.627-5.373-12-12-12h-40c-6.627 0-12 5.373-12 12v40c0 6.627 5.373 12 12 12h40c6.627 0 12-5.373 12-12zm96 0v-40c0-6.627-5.373-12-12-12h-40c-6.627 0-12 5.373-12 12v40c0 6.627 5.373 12 12 12h40c6.627 0 12-5.373 12-12zm-336 96v-40c0-6.627-5.373-12-12-12H76c-6.627 0-12 5.373-12 12v40c0 6.627 5.373 12 12 12h40c6.627 0 12-5.373 12-12zm288 0v-40c0-6.627-5.373-12-12-12H172c-6.627 0-12 5.373-12 12v40c0 6.627 5.373 12 12 12h232c6.627 0 12-5.373 12-12zm96 0v-40c0-6.627-5.373-12-12-12h-40c-6.627 0-12 5.373-12 12v40c0 6.627 5.373 12 12 12h40c6.627 0 12-5.373 12-12z"
                                        />
                                    </svg>
                                </div>
                                <input type="text" name="請輸入用戶名" value={message} placeholder="Message..." onChange={(e) => input_change(e)} onKeyDown={handleKeydown} onBlur={() => handleInputFocusOut()} />
                                <div className="sendIcon" onClick={() => handleSendButtonClick()}>
                                    <span className="sendText">传送</span>
                                    {/*<svg
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
                                        </svg>*/}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CustomerChatPage;
