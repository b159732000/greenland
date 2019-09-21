import React from 'react'
import './ContactBar.scss'

const ContactBar = () => {
    return (
        <div className="ContactBar">

            {/* 左側 */}
            <div className="leftContainer">
                {/* 大頭貼容器 */}
                <div className="portraitContainer">
                    <img src={require('../../images/Portrait.png')} alt="" />
                </div>
                {/* 資訊容器 */}
                <div className="infoContainer">
                    <div className="central">
                        <div className="name">小王</div>
                        <div className="phone">123xxxxxxxx</div>
                    </div>
                </div>
            </div>

            {/* 右側 */}
            <div className="rightContainer">
                {/* 圖示容器 */}
                <div className="iconContainer">
                    {/* 圖示本身 */}
                    <div className="phone">
                        <img src={require('../../images/ContactBar/PhoneIcon.png')} alt=""/>
                    </div>
                    <div className="messanger">
                        <img src={require('../../images/ContactBar/MessageIcon.png')} alt=""/>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default ContactBar;