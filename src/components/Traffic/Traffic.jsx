import React, { useState, useEffect, useRef } from 'react'
import './Traffic.scss'
import Swiper from 'react-id-swiper'

const Traffic = () => {
    // STATE
    // 當前啟用的右上角Menu (City, Project)
    const [currentActivatingMenu, setCurrentActivationMenu] = useState('City');

    const TrafficDOM = useRef(null);

    useEffect(()=>{
        var handler = function(e){
            e.preventDefault();
            }
            document.addEventListener('touchmove', handler, false);//阻止默认事件
            return()=>{
                document.removeEventListener('touchmove', handler, false);//打开默认事件
            }
    }, [])

    // 右上角Menu按鈕按下時觸發
    const handleTopMenuClick = (selectedItem) => {
        switch (selectedItem) {
            case 'City':
                setCurrentActivationMenu('City');
                goToSlideNumber(1);
                break;
            case 'Project':
                setCurrentActivationMenu('Project');
                goToSlideNumber(4);
                break;
            default:
                break;
        }
    }

    // Swiper控制
    const [swiper, updateSwiper] = useState();
    const goNext = () => {
        if (swiper !== null) {
            swiper.slideNext();
        }
    }
    const goPrev = () => {
        if (swiper !== null) {
            swiper.slidePrev();
        }
    }
    const goToSlideNumber = (selectedNumber) => {
        if (swiper !== null) {
            swiper.slideTo(selectedNumber - 1);
        }
    }

    // 定義swiperRef為一個容器，可裝載任何東西
    const swiperRef = useRef();
    // 每次畫面有東西更新時，都會將最新的swiper放進這個容器中
    swiperRef.current = swiper;

    // 為了提供給swiper params裡面的callback使用
    useEffect(() => {
    }, [])

    // 當slide更換時觸發
    const handleSlideChange = () => {
        let activeSlideNumber = swiperRef.current.activeIndex + 1;
        console.log(activeSlideNumber);
        if (activeSlideNumber <= 3) {
            setCurrentActivationMenu('City');
        } else if (activeSlideNumber > 3) {
            setCurrentActivationMenu('Project');
        }
    }

    // swiper設定
    const swiperParams = {
        direction: 'vertical',
        wrapperClass: 'swiperWrapper',
        on: {
            'slideChange': () => { handleSlideChange() }
        }
    }

    // 在DOM中添加好幾頁swiper(透過for迴圈)
    let renderImages = () => {
        // 最終要渲染到dom中的item數列
        let items = [];
        // 重複push到items中
        for (let i = 1; i <= 7; i++) {
            items.push(
                <div key={i}>
                    <img src={require('../../images/Traffic/Book/P3-' + i + '.jpg')} alt="" />
                </div>
            )
        }
        // 將結果返回
        return (items);
    }

    return (
        <div className="Traffic" ref={TrafficDOM}>

            <div className="logo">
                <img src={require('../../images/Logo.png')} alt=""/>
            </div>

            {/* swiper */}
            <div className="BuildingBook">
                {/* 在css中叫做swiper-container */}
                <Swiper {...swiperParams} getSwiper={updateSwiper}>
                    {renderImages()}
                </Swiper>
            </div>

            {/* 按鈕 */}
            <div className="menuContainer">
                {/* 城市區位 */}
                <div className={(currentActivatingMenu === 'City') ? ("item city") : ("item city notActive")} onClick={() => handleTopMenuClick('City')}>
                    <img className='activeButton' src={require('../../images/Traffic/Button/CityButtonActive.png')} alt="" />
                    <img className='notActiveButton' src={require('../../images/Traffic/Button/CityButtonNotActive.png')} alt="" />
                </div>
                {/* 項目區位 */}
                <div className={(currentActivatingMenu === 'Project') ? ("item project") : ("item project notActive")} onClick={() => handleTopMenuClick('Project')}>
                    <img className='activeButton' src={require('../../images/Traffic/Button/ProjectButtonActive.png')} alt="" />
                    <img className='notActiveButton' src={require('../../images/Traffic/Button/ProjectButtonNotActive.png')} alt="" />
                </div>
            </div>

        </div>
    )
}

export default Traffic;