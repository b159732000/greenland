import React, { useState, useEffect } from 'react'
import './NavigationBar.scss'
import { NavLink } from 'react-router-dom';

const NavigationBar = () => {
    // STATE
    // 當前啟用第幾個menu (1, 2)
    const [currentActiveMenuNumber, setCurrentActiveMenuNumber] = useState(1);

    return (
        <div className="NavigationBar">

            {/* 第一個menu */}
            <div className={(currentActiveMenuNumber === 1) ? ("menuContainer first") : ("menuContainer first hide")}>
                {/* 一般頁面按鈕 */}
                <NavLink to='/GreenLand/HomePage' activeClassName="active" className="item page">
                    <div className="bg"></div>
                    <div className="upper">
                        <img src={require('../../images/NavigationBar/HomePage.png')} alt="" />
                    </div>
                    <div className="bottom">
                        <div className="text">首页</div>
                    </div>
                </NavLink>
                <NavLink to='/GreenLand/BrandIntroduction' activeClassName="active" className="item page">
                    <div className="bg"></div>
                    <div className="upper">
                        <img src={require('../../images/NavigationBar/BrandIntroduction.png')} alt="" />
                    </div>
                    <div className="bottom">
                        <div className="text">品牌展示</div>
                    </div>
                </NavLink>
                <NavLink to='/GreenLand/Traffic' activeClassName="active" className="item page">
                    <div className="bg"></div>
                    <div className="upper">
                        <img src={require('../../images/NavigationBar/Traffic.png')} alt="" />
                    </div>
                    <div className="bottom">
                        <div className="text">区位交通</div>
                    </div>
                </NavLink>
                <NavLink to='/GreenLand/ThreeDimention' activeClassName="active" className="item page">
                    <div className="bg"></div>
                    <div className="upper">
                        <img src={require('../../images/NavigationBar/ThreeDimention.png')} alt="" />
                    </div>
                    <div className="bottom">
                        <div className="text">三维沙盘</div>
                    </div>
                </NavLink>
                {/* 箭頭容器 */}
                <div className="item arrow" onClick={() => setCurrentActiveMenuNumber(2)}>
                    <img src={require('../../images/NavigationBar/Arrow.png')} alt="" />
                </div>
            </div>

            {/* 第二個menu */}
            <div className={(currentActiveMenuNumber === 2) ? ("menuContainer second") : ("menuContainer second hide")}>
                {/* 箭頭容器 */}
                <div className="item arrow" onClick={() => setCurrentActiveMenuNumber(1)}>
                    <img src={require('../../images/NavigationBar/Arrow.png')} alt="" />
                </div>
                {/* 一般頁面按鈕 */}
                <NavLink to='/GreenLand/HouseStyle' activeClassName="active" className="item page">
                    <div className="bg"></div>
                    <div className="upper">
                        <img src={require('../../images/NavigationBar/HouseStyle.png')} alt="" />
                    </div>
                    <div className="bottom">
                        <div className="text">精工户型</div>
                    </div>
                </NavLink>
                <NavLink to='/GreenLand/GardenTraveling' activeClassName="active" className="item page">
                    <div className="bg"></div>
                    <div className="upper">
                        <img src={require('../../images/NavigationBar/GardenTraveling.png')} alt="" />
                    </div>
                    <div className="bottom">
                        <div className="text">园林漫游</div>
                    </div>
                </NavLink>
                <NavLink to='/GreenLand/InHouseTraveling' activeClassName="active" className="item page">
                    <div className="bg"></div>
                    <div className="upper">
                        <img src={require('../../images/NavigationBar/InHouseTraveling.png')} alt="" />
                    </div>
                    <div className="bottom">
                        <div className="text">样板间漫游</div>
                    </div>
                </NavLink>
                <NavLink to='/GreenLand/FloorBook' activeClassName="active" className="item page">
                    <div className="bg"></div>
                    <div className="upper">
                        <img src={require('../../images/NavigationBar/FloorBook.png')} alt="" />
                    </div>
                    <div className="bottom">
                        <div className="text">电子楼书</div>
                    </div>
                </NavLink>
                <NavLink to='/GreenLand/BusinessIntroduction' activeClassName="active" className="item page">
                    <div className="bg"></div>
                    <div className="upper">
                        <img src={require('../../images/NavigationBar/BusinessIntroduction.png')} alt="" />
                    </div>
                    <div className="bottom">
                        <div className="text">物业介绍</div>
                    </div>
                </NavLink>
            </div>

        </div>
    )
}

export default NavigationBar;