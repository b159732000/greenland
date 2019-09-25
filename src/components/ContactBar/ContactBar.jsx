import React, { useState, useEffect, useRef } from 'react'
import './ContactBar.scss'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';

const ContactBar = () => {
    // 從Store取出銷售資訊 (chat Reducer中)
    const storeClientInfo = useSelector(state => state.chat.clientInfo);
    const storeRealUserInfo = useSelector(state => state.chat.realUserInfo);
    // 本页State(銷售名、電話、大頭貼)
    const [salerInfo, setSalerInfo] = useState({
        name: '',
        phone: '',
        portraitUrl: ''
    })
    useEffect(() => {
        // console.log('ContactBar.state.salerInfo如下');
        // console.log(salerInfo);
        // console.log('↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑');
    }, [salerInfo])

    const [musicIsOpen, setMusicIsOpen] = useState(true);
    const audioDOM = useRef();

    // 为了自动播放音乐
    useEffect(() => {
        window.addEventListener('touchstart', forceSafariPlayAudio, false);
    }, [])
    const forceSafariPlayAudio = () => {
        if (musicIsOpen) {
            // setMusicIsOpen(true);
            if (audioDOM.current) {
                audioDOM.current.play();
            }
            document.removeEventListener('touchstart', forceSafariPlayAudio, false);//打开默认事件
        }
    }

    useEffect(() => {
        // console.log('ContactBar中讀到的store中的ClientInfo↓↓↓');
        // console.log(storeClientInfo);
        // console.log('ContactBar中讀到的store中的ClientInfo↑↑↑');

        // 将store的client资讯放到本页state salerInfo中
        if (storeClientInfo) {
            // if (storeClientInfo.nickname && storeClientInfo.phone && storeClientInfo.logo) {
            // console.log('將 sotre.clientInfo 放到 contactBar.state.salerInfo 中');
            setSalerInfo({
                ...salerInfo,
                // name: storeClientInfo.nickname,
                // phone: storeClientInfo.phone,
                // portraitUrl: storeClientInfo.logo,
                ...storeClientInfo
            })
        }

    }, [storeClientInfo])

    // 音樂按鈕點擊時觸發
    const handleMusicIconClick = () => {
        if (musicIsOpen) {
            audioDOM.current.pause();
        } else if (!musicIsOpen) {
            audioDOM.current.play();
        }
        setMusicIsOpen(!musicIsOpen);
    }

    return (
        <div className="ContactBar">

            <audio src={require('../../images/BgMusic.mp3')} ref={audioDOM} autoPlay loop></audio>

            {/* 左側 */}
            <div className="leftContainer">
                {/* 大頭貼容器 */}
                <div className="portraitContainer">
                    <img src={(storeClientInfo.logo) ? (storeClientInfo.logo) : (require('../../images/Portrait.png'))} alt="" />
                </div>
                {/* 資訊容器 */}
                <div className="infoContainer">
                    <div className="central">

                        {/* 有銷售: 後台定義的暱稱(若無暱稱則用真名) / 無銷售: 顯示無銷售 */}
                        <div className="name">{(storeClientInfo.nickname) ? ((storeClientInfo.real_name) ? (storeClientInfo.real_name) : (storeClientInfo.nickname)) : ('无法取得销售人员姓名')}</div>
                        <div className="phone">{(storeClientInfo.phone) ? (storeClientInfo.phone) : ('无法取得销售人员手机号')}</div>
                    </div>
                </div>
            </div>

            {/* 右側 */}
            <div className="rightContainer">
                {/* 圖示容器 */}
                <div className="iconContainer">
                    {/* 圖示本身 */}

                    <a href={(storeClientInfo.phone)?("tel:" + storeClientInfo.phone):("#")} className={(storeRealUserInfo.user_type <= 2)?("phone"):("phone hide")}>
                        <img src={require('../../images/ContactBar/PhoneIcon.png')} alt="" />
                    </a>

                    <div className={(storeRealUserInfo.user_type <= 2)?("messanger"):("messanger hide")}>
                        {(window.enableBackEndFunction) ? (<Link to='/GreenLand/CustomerChatPage'></Link>) : (null)}
                        <img src={require('../../images/ContactBar/MessageIcon.png')} alt="" />
                    </div>

                    <div className={"music" + ((musicIsOpen) ? "" : " musicIsNotActive")} onClick={() => handleMusicIconClick()}>
                        <img className='icon notMute' src={require('../../images/ContactBar/MusicIsOpen.png')} alt="" />
                        <img className='icon mute' src={require('../../images/ContactBar/MusicIsNotOpen.png')} alt="" />
                    </div>

                    {(storeRealUserInfo.user_type >= 3)?(<div className="backEnd">
                        {(window.enableBackEndFunction) ? (<Link to='/GreenLand/Backend/HomePage'></Link>) : (null)}
                        <img src={require('../../images/ContactBar/BackEndIcon.png')} alt="" />
                    </div>):(null)}

                </div>
            </div>

        </div>
    )
}

export default ContactBar;