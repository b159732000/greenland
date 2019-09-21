import React, { useState, useEffect, useRef } from 'react'
import './ThreeDimention.scss'
import Swiper from 'react-id-swiper'

const pannellum = window.pannellum;
let panorama;

const ThreeDimention = () => {
    // 當前啟用的右上角Menu (Location, FullLocation, FullProject, FirstOpen)
    const [currentActivatingMenu, setCurrentActivationMenu] = useState('Location');
    // 區域全景第二层menu项目 (Day, Night)
    const [fullLocationActivatingSecondMenu, setFullLocationActivatingSecondMenu] = useState('Day');
    // 項目全景第二层menu项目 (Science, ResidentialArea, Resort , Finance)
    const [fullProjectActivationSecondMenu, setFullProjectActivationSecondMenu] = useState('Science');

    useEffect(() => {
        initPanorama();
    }, [])

    // 右上角Menu按鈕按下時觸發
    const handleTopMenuClick = (selectedItem) => {
        switch (selectedItem) {
            case 'Location':
                setCurrentActivationMenu('Location');
                goToSlideNumber(1);
                break;
            case 'FullLocation':
                if (currentActivatingMenu !== 'FullLocation') {
                    setFullLocationActivatingSecondMenu('Day');
                }
                setCurrentActivationMenu('FullLocation');
                break;
            case 'FullProject':
                if (currentActivatingMenu !== 'FullProject') {
                    setFullProjectActivationSecondMenu('Science');
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
            // 'slideChange': () => { handleSlideChange() }
        }
    }
    // 在DOM中添加好幾頁swiper(透過for迴圈)
    let renderImages = () => {
        // 最終要渲染到dom中的item數列
        let items = [];
        // 重複push到items中
        for (let i = 1; i <= 3; i++) {
            items.push(
                <div key={i}>
                    <img src={require('../../images/ThreeDimention/Book/' + i + '.png')} alt="" />
                </div>
            )
        }
        // 將結果返回
        return (items);
    }

    // 全景圖區域
    const panoramaDOM = useRef();
    const initPanorama = () => {
        panorama = pannellum.viewer(panoramaDOM.current, {
            // "type": "equirectangular",
            // "panorama": require('../../images/AerialView/Pannellum/AreaMainPano.jpg'),
            // // "preview": "src",    //預覽圖
            "autoLoad": true,
            "showControls": false,
            "hotSpotDebug": false,
            // 預設載入的scene
            "default": {
                "firstScene": "FullLocationDay",
                "sceneFadeDuration": "2000",
            },
            // 所有scene
            "scenes": {
                // 區域全景白天
                "FullLocationDay": {
                    "type": "multires",
                    "pitch": -4.5,
                    "yaw": -58.4,
                    "hfov": 80,
                    // 全景圖來源路徑
                    "multiRes": {
                        "basePath": process.env.PUBLIC_URL + "/pannellum/FullLocationDay",
                        "path": "/%l/%s%y_%x",
                        "fallbackPath": "/fallback/%s",
                        "extension": "jpg",
                        "tileResolution": 512,
                        "maxLevel": 3,
                        "cubeResolution": 1272
                    },
                    // "hotSpots": [
                    //     // 遊樂園到游泳池
                    //     {
                    //         "type": "scene",
                    //         "pitch": -16,
                    //         "yaw": -176,
                    //         "sceneId": "SwimmingPool", //通往下一个全景图
                    //         "cssClass": "gardenPanoHotspot",
                    //         "text": "游泳池",
                    //         "clickHandlerFunc": function () { console.log("success") },    //滑鼠點擊時觸發，觸控不觸發
                    //         // "createTooltipFunc": this.createHotspotTooltip,
                    //         "createTooltipArgs": "游泳池"
                    //     },
                    //     // 遊樂園到大門
                    //     {
                    //         "type": "scene",
                    //         "pitch": -2,
                    //         "yaw": -175,
                    //         "sceneId": "Door",
                    //         "cssClass": "gardenPanoHotspot",
                    //         "clickHandlerFunc": function () { console.log("success") },    //滑鼠點擊時觸發，觸控不觸發
                    //         // "createTooltipFunc": this.createHotspotTooltip,
                    //         "createTooltipArgs": "大门"
                    //     },
                    // ],
                },
                // 區域全景黑夜
                "FullLocationNight": {
                    "type": "multires",
                    "pitch": -4.5,
                    "yaw": -58.4,
                    "hfov": 80,
                    // 全景圖來源路徑
                    "multiRes": {
                        "basePath": process.env.PUBLIC_URL + "/pannellum/FullLocationNight",
                        "path": "/%l/%s%y_%x",
                        "fallbackPath": "/fallback/%s",
                        "extension": "jpg",
                        "tileResolution": 512,
                        "maxLevel": 3,
                        "cubeResolution": 1272
                    },
                },
                // 項目全景科創
                "Science": {
                    "type": "multires",
                    "pitch": -4.5,
                    "yaw": -58.4,
                    "hfov": 80,
                    // 全景圖來源路徑
                    "multiRes": {
                        "basePath": process.env.PUBLIC_URL + "/pannellum/Science",
                        "path": "/%l/%s%y_%x",
                        "fallbackPath": "/fallback/%s",
                        "extension": "jpg",
                        "tileResolution": 512,
                        "maxLevel": 3,
                        "cubeResolution": 1904
                    },
                },
                // 項目全景生活
                "ResidentialArea": {
                    "type": "multires",
                    "pitch": -4.5,
                    "yaw": -58.4,
                    "hfov": 80,
                    // 全景圖來源路徑
                    "multiRes": {
                        "basePath": process.env.PUBLIC_URL + "/pannellum/ResidentialArea",
                        "path": "/%l/%s%y_%x",
                        "fallbackPath": "/fallback/%s",
                        "extension": "jpg",
                        "tileResolution": 512,
                        "maxLevel": 3,
                        "cubeResolution": 1904
                    },
                },
                // 項目全景度假
                "Resort": {
                    "type": "multires",
                    "pitch": -4.5,
                    "yaw": -58.4,
                    "hfov": 80,
                    // 全景圖來源路徑
                    "multiRes": {
                        "basePath": process.env.PUBLIC_URL + "/pannellum/Resort",
                        "path": "/%l/%s%y_%x",
                        "fallbackPath": "/fallback/%s",
                        "extension": "jpg",
                        "tileResolution": 512,
                        "maxLevel": 3,
                        "cubeResolution": 1904
                    },
                },
                // 項目全景商貿
                "Finance": {
                    "type": "multires",
                    "pitch": -4.5,
                    "yaw": -58.4,
                    "hfov": 80,
                    // 全景圖來源路徑
                    "multiRes": {
                        "basePath": process.env.PUBLIC_URL + "/pannellum/Finance",
                        "path": "/%l/%s%y_%x",
                        "fallbackPath": "/fallback/%s",
                        "extension": "jpg",
                        "tileResolution": 512,
                        "maxLevel": 3,
                        "cubeResolution": 1904
                    },
                },
                // 首開區全景
                "FirstOpen": {
                    "type": "multires",
                    "pitch": -4.5,
                    "yaw": -58.4,
                    "hfov": 80,
                    // 全景圖來源路徑
                    "multiRes": {
                        "basePath": process.env.PUBLIC_URL + "/pannellum/FirstOpen",
                        "path": "/%l/%s%y_%x",
                        "fallbackPath": "/fallback/%s",
                        "extension": "jpg",
                        "tileResolution": 512,
                        "maxLevel": 3,
                        "cubeResolution": 1272
                    },
                },
            }
        })
    }
    // 更新當前全景圖
    useEffect(() => {
        if (currentActivatingMenu === 'FullLocation' && fullLocationActivatingSecondMenu === 'Day') {
            panorama.loadScene('FullLocationDay');
        }
        if (currentActivatingMenu === 'FullLocation' && fullLocationActivatingSecondMenu === 'Night') {
            panorama.loadScene('FullLocationNight');
        }
        if (currentActivatingMenu === 'FullProject' && fullProjectActivationSecondMenu === 'Science') {
            panorama.loadScene('Science');
        }
        if (currentActivatingMenu === 'FullProject' && fullProjectActivationSecondMenu === 'ResidentialArea') {
            panorama.loadScene('ResidentialArea');
        }
        if (currentActivatingMenu === 'FullProject' && fullProjectActivationSecondMenu === 'Resort') {
            panorama.loadScene('Resort');
        }
        if (currentActivatingMenu === 'FullProject' && fullProjectActivationSecondMenu === 'Finance') {
            panorama.loadScene('Finance');
        }
        if (currentActivatingMenu === 'FirstOpen') {
            panorama.loadScene('FirstOpen');
        }
    }, [currentActivatingMenu, fullLocationActivatingSecondMenu, fullProjectActivationSecondMenu])

    return (
        <div className="ThreeDimention">

            <div className="logo">
                <img src={require('../../images/Logo.png')} alt="" />
            </div>

            {/* swiper */}
            <div className="BuildingBook">
                {/* 在css中叫做swiper-container */}
                <Swiper {...swiperParams} getSwiper={updateSwiper}>
                    {renderImages()}
                </Swiper>
            </div>

            {/* 全景圖 */}
            <div className={(currentActivatingMenu !== 'Location') ? ("panorama") : ("panorama hide")} ref={panoramaDOM}></div>

            {/* 按鈕 */}
            <div className="menuContainer">
                {/* 區位解析 */}
                <div className={(currentActivatingMenu === 'Location') ? ("item Location") : ("item Location notActive")} onClick={() => handleTopMenuClick('Location')}>
                    <img className='activeButton' src={require('../../images/ThreeDimention/Button/LocationAnalyzeActive.png')} alt="" />
                    <img className='notActiveButton' src={require('../../images/ThreeDimention/Button/LocationAnalyzeNotActive.png')} alt="" />
                </div>
                {/* 全場景區域沙盤 */}
                <div className={(currentActivatingMenu === 'FullLocation') ? ("item FullLocation") : ("item FullLocation notActive")} onClick={() => handleTopMenuClick('FullLocation')}>
                    <img className='activeButton' src={require('../../images/ThreeDimention/Button/FullLocationActive.png')} alt="" />
                    <img className='notActiveButton' src={require('../../images/ThreeDimention/Button/FullLocationNotActive.png')} alt="" />
                    {(currentActivatingMenu === 'FullLocation') ? (<div className="secondMenu">
                        <div className={(fullLocationActivatingSecondMenu === 'Day') ? ("day active") : ("day notActive")} onClick={() => setFullLocationActivatingSecondMenu('Day')}>
                            <img className='activeButton' src={require('../../images/ThreeDimention/Button/DayActive.png')} alt="" />
                            <img className='notActiveButton' src={require('../../images/ThreeDimention/Button/DayNotActive.png')} alt="" />
                        </div>
                        <div className={(fullLocationActivatingSecondMenu === 'Night') ? ("night active") : ("night notActive")} onClick={() => setFullLocationActivatingSecondMenu('Night')}>
                            <img className='activeButton' src={require('../../images/ThreeDimention/Button/NightActive.png')} alt="" />
                            <img className='notActiveButton' src={require('../../images/ThreeDimention/Button/NightNotActive.png')} alt="" />
                        </div>
                    </div>) : (null)}
                </div>
                {/* 全場景項目沙盤 */}
                <div className={(currentActivatingMenu === 'FullProject') ? ("item FullProject") : ("item FullProject notActive")} onClick={() => handleTopMenuClick('FullProject')}>
                    <img className='activeButton' src={require('../../images/ThreeDimention/Button/FullProjectActive.png')} alt="" />
                    <img className='notActiveButton' src={require('../../images/ThreeDimention/Button/FullProjectNotActive.png')} alt="" />
                    {(currentActivatingMenu === 'FullProject') ? (<div className="secondMenu">
                        <div className={(fullProjectActivationSecondMenu === 'Science') ? ("Science active") : ("Science notActive")} onClick={() => setFullProjectActivationSecondMenu('Science')}>
                            <img className='activeButton' src={require('../../images/ThreeDimention/Button/ScienceActive.png')} alt="" />
                            <img className='notActiveButton' src={require('../../images/ThreeDimention/Button/ScienceNotActive.png')} alt="" />
                        </div>
                        <div className={(fullProjectActivationSecondMenu === 'ResidentialArea') ? ("ResidentialArea active") : ("ResidentialArea notActive")} onClick={() => setFullProjectActivationSecondMenu('ResidentialArea')}>
                            <img className='activeButton' src={require('../../images/ThreeDimention/Button/ResidentialAreaActive.png')} alt="" />
                            <img className='notActiveButton' src={require('../../images/ThreeDimention/Button/ResidentialAreaNotActive.png')} alt="" />
                        </div>
                        <div className={(fullProjectActivationSecondMenu === 'Resort') ? ("Resort active") : ("Resort notActive")} onClick={() => setFullProjectActivationSecondMenu('Resort')}>
                            <img className='activeButton' src={require('../../images/ThreeDimention/Button/ResortActive.png')} alt="" />
                            <img className='notActiveButton' src={require('../../images/ThreeDimention/Button/ResortNotActive.png')} alt="" />
                        </div>
                        <div className={(fullProjectActivationSecondMenu === 'Finance') ? ("Finance active") : ("Finance notActive")} onClick={() => setFullProjectActivationSecondMenu('Finance')}>
                            <img className='activeButton' src={require('../../images/ThreeDimention/Button/FinanceActive.png')} alt="" />
                            <img className='notActiveButton' src={require('../../images/ThreeDimention/Button/FinanceNotActive.png')} alt="" />
                        </div>
                    </div>) : (null)}
                </div>
                {/* 首開沙盤 */}
                <div className={(currentActivatingMenu === 'FirstOpen') ? ("item FirstOpen") : ("item FirstOpen notActive")} onClick={() => handleTopMenuClick('FirstOpen')}>
                    <img className='activeButton' src={require('../../images/ThreeDimention/Button/FirstOpenActive.png')} alt="" />
                    <img className='notActiveButton' src={require('../../images/ThreeDimention/Button/FirstOpenNotActive.png')} alt="" />
                </div>
            </div>

        </div>
    )
}

export default ThreeDimention;