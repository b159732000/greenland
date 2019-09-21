import React from 'react'
import './BrandIntroduction.scss'
import Swiper from 'react-id-swiper'

const BrandIntroduction = () => {
    // swiper設定
    const swiperParams = {
        direction: 'vertical',
        wrapperClass: 'swiperWrapper'
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
                <Swiper {...swiperParams}>
                    {renderImages()}
                </Swiper>
            </div>

        </div>
    )
}

export default BrandIntroduction;