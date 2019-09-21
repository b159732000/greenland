import React, { useState, useEffect, useRef } from 'react'
import './FloorBook.scss'
import Swiper from 'react-id-swiper'

const FloorBook = () => {
    // Swiper區域
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
        if (activeSlideNumber <= 3) {
            // setCurrentActivationMenu('City');
        } else if (activeSlideNumber > 3) {
            // setCurrentActivationMenu('Project');
        }
    }
    // swiper設定
    const swiperParams = {
        direction: 'vertical',
        wrapperClass: 'swiperWrapper',
        on: {
            // 'slideChange': () => { handleSlideChange() }
        }
    }
    // 在DOM中添加好幾頁swiper(透過for迴圈)
    let renderImages = () => {
        // 最終要渲染到dom中的item數列
        let items = [];
        // 重複push到items中
        for (let i = 0; i <= 23; i++) {
            items.push(
                <div key={i}>
                    <img src={require('../../images/FloorBook/Book/' + i + '.jpg')} alt="" />
                </div>
            )
        }
        // 將結果返回
        return (items);
    }

    return (
        <div className="FloorBook">
            
            {/* swiper */}
            <div className="BuildingBook">
                {/* 在css中叫做swiper-container */}
                <Swiper {...swiperParams} getSwiper={updateSwiper}>
                    {renderImages()}
                </Swiper>
            </div>

        </div>
    )
}

export default FloorBook;