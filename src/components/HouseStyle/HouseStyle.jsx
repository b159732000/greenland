import React, { useState } from 'react'
import './HouseStyle.scss'

import OneZeroTwoGIF from './102GIF/ImageSequenceAerialView.jsx'
import OneTwoSevenGIF from './127GIF/ImageSequenceAerialView.jsx'

const HouseStyle = () => {
    // 當前啟用的右上角Menu (Location, FullLocation, FullProject, FirstOpen)
    const [currentActivatingMenu, setCurrentActivationMenu] = useState('Location');

    // 右上角Menu按鈕按下時觸發
    const handleTopMenuClick = (selectedItem) => {
        switch (selectedItem) {
            case 'Location':
                setCurrentActivationMenu('Location');
                // goToSlideNumber(1);
                break;
            case 'FullLocation':
                if (currentActivatingMenu !== 'FullLocation') {
                    // setFullLocationActivatingSecondMenu('Day');
                }
                setCurrentActivationMenu('FullLocation');
                break;
            case 'FullProject':
                if (currentActivatingMenu !== 'FullProject') {
                    // setFullProjectActivationSecondMenu('Science');
                }
                setCurrentActivationMenu('FullProject');
                break;
            case 'FirstOpen':
                setCurrentActivationMenu('FirstOpen');
                // goToSlideNumber(4);
                break;
            default:
                break;
        }
    }

    return (
        <div className="HouseStyle">
            {/* <div className="text">此页内容更新中，敬请期待。</div> */}
            <div className="gifContainer">
                {(currentActivatingMenu === 'Location') ? (<OneZeroTwoGIF></OneZeroTwoGIF>) : (null)}
                {(currentActivatingMenu === 'FullLocation') ? (<OneTwoSevenGIF></OneTwoSevenGIF>) : (null)}
            </div>


            {/* 按鈕 */}
            <div className="menuContainer">
                {/* 區位解析 */}
                <div className={(currentActivatingMenu === 'Location') ? ("item Location") : ("item Location notActive")} onClick={() => handleTopMenuClick('Location')}>
                    <img className='activeButton' src={require('../../images/HouseStyle/Button/102On.png')} alt="" />
                    <img className='notActiveButton' src={require('../../images/HouseStyle/Button/102Off.png')} alt="" />
                </div>
                {/* 全場景區域沙盤 */}
                <div className={(currentActivatingMenu === 'FullLocation') ? ("item FullLocation") : ("item FullLocation notActive")} onClick={() => handleTopMenuClick('FullLocation')}>
                    <img className='activeButton' src={require('../../images/HouseStyle/Button/127On.png')} alt="" />
                    <img className='notActiveButton' src={require('../../images/HouseStyle/Button/127Off.png')} alt="" />
                </div>
            </div>

        </div>
    )
}

export default HouseStyle;