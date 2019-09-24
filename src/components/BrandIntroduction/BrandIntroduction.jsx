import React, { useState, useEffect, useRef } from 'react'
import './BrandIntroduction.scss'
import Swiper from 'react-id-swiper'

const BrandIntroduction = () => {
    // 當前啟用的右上角Menu (Brand, Space, Cooperate)
    const [currentActivatingMenu, setCurrentActivationMenu] = useState('Brand');

    // 為了讓swiper可以滑動
    useEffect(() => {
        var handler = function (e) {
            e.preventDefault();
        }
        document.addEventListener('touchmove', handler, false);//阻止默认事件
        return () => {
            document.removeEventListener('touchmove', handler, false);//打开默认事件
        }
    }, [])

    // 右上角Menu按鈕按下時觸發
    const handleTopMenuClick = (selectedItem) => {
        switch (selectedItem) {
            case 'Brand':
                setCurrentActivationMenu('Brand');
                goToSlideNumber(1);
                break;
            case 'Space':
                setCurrentActivationMenu('Space');
                goToSlideNumber(9);
                break;
            case 'Cooperate':
                setCurrentActivationMenu('Cooperate');
                goToSlideNumber(10);
                break;
            default:
                break;
        }
    }

    // swiper設定
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
    // 當slide更換時觸發
    const handleSlideChange = () => {
        let activeSlideNumber = swiperRef.current.activeIndex + 1;
        console.log(activeSlideNumber);
        if (activeSlideNumber <= 8) {
            setCurrentActivationMenu('Brand');
        } else if (activeSlideNumber === 9) {
            setCurrentActivationMenu('Space');
        } else if (activeSlideNumber === 10) {
            setCurrentActivationMenu('Cooperate');
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
        for (let i = 0; i <= 9; i++) {
            items.push(
                <div key={i}>
                    <img src={require('../../images/BrandIntroduction/Book/P2-' + i + '.png')} alt="" />
                </div>
            )
        }

        return (items);
    }

    return (
        <div className="BrandIntroduction">

            {/* 樓書swiper */}
            <div className="BuildingBook">
                {/* 在css中叫做swiper-container */}
                <Swiper {...swiperParams} getSwiper={updateSwiper}>
                    {renderImages()}
                </Swiper>
            </div>

            {/* 按鈕 */}
            <div className="menuContainer">
                {/* 綠地集團品牌 */}
                <div className={(currentActivatingMenu === 'Brand') ? ("item Location") : ("item Location notActive")} onClick={() => handleTopMenuClick('Brand')}>
                    <img className='activeButton' src={require('../../images/BrandIntroduction/Button/BrandActive.png')} alt="" />
                    <img className='notActiveButton' src={require('../../images/BrandIntroduction/Button/BrandNotActive.png')} alt="" />
                </div>
                {/* 城際空間站 */}
                <div className={(currentActivatingMenu === 'Space') ? ("item FirstOpen") : ("item FirstOpen notActive")} onClick={() => handleTopMenuClick('Space')}>
                    <img className='activeButton' src={require('../../images/BrandIntroduction/Button/SpaceActive.png')} alt="" />
                    <img className='notActiveButton' src={require('../../images/BrandIntroduction/Button/SpaceNotActive.png')} alt="" />
                </div>
                {/* 合作方集團簡介 */}
                <div className={(currentActivatingMenu === 'Cooperate') ? ("item FirstOpen") : ("item FirstOpen notActive")} onClick={() => handleTopMenuClick('Cooperate')}>
                    <img className='activeButton' src={require('../../images/BrandIntroduction/Button/CooperateActive.png')} alt="" />
                    <img className='notActiveButton' src={require('../../images/BrandIntroduction/Button/CooperateNotActive.png')} alt="" />
                </div>
            </div>

        </div>
    )
}

export default BrandIntroduction;