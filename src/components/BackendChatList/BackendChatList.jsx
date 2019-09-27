import React, { useState, useEffect } from 'react';
import './BackendChatList.scss';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { setReciverList, setc_info } from '../../actions/Backend/chatPage.js';
import { DiaplayTime, over48hours } from '../../utils/diaplayTime'
import { HistoryList } from '../../api/Backend/api'
import stroage from '../../api/Backend/stroage'

// 为了达成<<在没有数局时，显示替代文字>>，必须在此定义变数
let messageListDOMElement;

const BakcendMessageList = (props) => {
    // state
    const [historyList, setHistoryList] = useState([{ nickname: '1', content: '2', create_time: '3', }]);
    const [currentPage, setCurrentPage] = useState(0);
    // store
    const storeHistoryList = useSelector(state => state.chat.reciverList);
    const storeCInfo = useSelector(state => state.chat.c_info);             // 顧客資訊
    // dispatch
    const dispatch = useDispatch();
    const setStoreReciverList = (value) => dispatch(setReciverList(value));
    const setStoreCInfo = (value) => dispatch(setc_info(value));

    useEffect(() => {
        if (window.enableWeiXinLogIn) {
            getHistoryList()
        }
    }, [])

    // 取得歷史聊天紀錄
    const getHistoryList = () => {
        let data = {
            'pids': window.pid,
            current_page: currentPage,                      //
            other_openid: stroage.get('userInfo').openid,   //銷售人員的open_id
        }

        console.log('傳送以下data給伺服器，取得所有聊天紀錄清單↓↓↓↓↓↓')
        console.log(data);
        console.log('↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑')

        // 取得伺服器回傳的所有聊天紀錄清單，並放到Store Reciver List
        HistoryList(data).then(res => {
            setCurrentPage(currentPage+1);
            console.log('取得伺服器回傳的所有聊天紀錄清單，並放到Store Reciver List↓↓↓↓↓↓')
            console.log(res.data);
            console.log('↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑')
            setStoreReciverList(res.data);
        })
    }

    // 跳轉到 chatPage 前，將選定的顧客訊息放入 store c_info
    const toChatPage = (item) => {
        let c_info = {
            user_id: item.user_id,
            logo: item.logo,
            openid: item.c_openid,
            nickname: item.nickname
        }
        setStoreCInfo(c_info)
        stroage.set('c_info', c_info)
        console.log(c_info);
        console.log('跳轉到 chatPage 前，將選定的顧客訊息放入 store c_info')
    }

    useEffect(()=>{

        console.log(storeCInfo);
    }, [storeCInfo])

    // 渲染對話紀錄
    const mountChatList = () => {
        // 如果store的HistoryList為空，則不做任何渲染
        if (!storeHistoryList) return;

        // 
        if (storeHistoryList.length === 0) {
            messageListDOMElement = function () {
                return (
                    <div className="noChatListText">尚未与任何顾客交谈</div>
                )
            }()
        } else {
            messageListDOMElement = storeHistoryList.map((item, index) => {
                return (
                    <div onClick={() => handleMessageListItemOnClick(item)} key={index}>
                        <li className={item.unread_num > 0 ? "chatSelfContainer notReadYet show" : "chatSelfContainer show"} key={index}>
                            {/* 大頭貼 */}
                            <div className="portraitContainer">
                                <img src={item.logo} alt="" />
                            </div>
                            {/* 中間(名字和對話內容) */}
                            <div className="centerContainer">
                                {/* 為了將名字和對話內容上下置中 */}
                                <div className="centerInnerContainer">
                                    {/* 名字 */}
                                    <div className="upper">
                                        <div className="name">{item.nickname}</div>
                                    </div>
                                    {/* 對話內容 */}
                                    <div className="bottom">
                                        <div className="chatText">{item.content}</div>
                                        <div className="dot"></div>
                                        <div className="timeStamp">{DiaplayTime(item.create_time)}</div>
                                    </div>
                                </div>
                            </div>
                            {/* 右側未讀藍點 */}
                            <div className={item.unread_num > 0 ? 'dotContainer' : 'dotContainer hide'}>
                                <div className="dot"></div>
                            </div>
                        </li>
                    </div>
                )
            })
        }
    }

    // 將選定的顧客推送至store, 然後跳轉到聊天頁面
    const handleMessageListItemOnClick = (item) => {
        toChatPage(item);
        // setTimeout(()=>{
            props.history.push('/GreenLand/Backend/ChatPage');
        // }, 1000)
        // browserHistory.push('/GreenLand/Backend/ChatPage')
    }

    // let reciverList = storeHistoryList || []

    return (
        <div className="MessageListContainer">

            {/* 標題 */}
            <div className="logoContainer">
                <div className="logo">
                    绿地 | 聊天记录
                    </div>
            </div>

            {/* 除了標題以外的內容 */}
            <div className="innerContainer">
                {/* 搜索列 */}
                {/* <div className="searchBarContainer">
                        <div className="searchBarBg">
                            <div className="icon">
                                <svg aria-hidden="true" focusable="false" data-prefix="fal" data-icon="search" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="svg-inline--fa fa-search fa-w-16 fa-lg"><path fill="currentColor" d="M508.5 481.6l-129-129c-2.3-2.3-5.3-3.5-8.5-3.5h-10.3C395 312 416 262.5 416 208 416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c54.5 0 104-21 141.1-55.2V371c0 3.2 1.3 6.2 3.5 8.5l129 129c4.7 4.7 12.3 4.7 17 0l9.9-9.9c4.7-4.7 4.7-12.3 0-17zM208 384c-97.3 0-176-78.7-176-176S110.7 32 208 32s176 78.7 176 176-78.7 176-176 176z" className=""></path></svg>
                            </div>
                            <input type="text" name="請輸入用戶名">

                            </input>
                        </div>
                    </div> */}

                {/* 對話紀錄 */}
                <div className="chatList">
                    <ul className="chatUlContainer">
                        {/* 每一筆聊天紀錄，notReadYet表示未讀，show代表顯示此筆紀錄 */}
                        {mountChatList()}
                        {messageListDOMElement}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default BakcendMessageList;