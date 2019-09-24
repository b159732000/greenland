import React, { useState, useEffect, useRef } from 'react'
import './InHouseTraveling.scss'

const pannellum = window.pannellum;
let panorama;

const InHouseTraveling = () => {
    // 目前戶型 (102, 127)
    const [currentHouseStyle, setCurrentHouseStyle] = useState('102');
    // 當前啟用的右上角Menu (Location, FullLocation, FullProject, FirstOpen)
    const [currentActivatingMenu, setCurrentActivationMenu] = useState('Location');

    useEffect(() => {
        initPanorama();
    }, [])

    // 右上角Menu按鈕按下時觸發
    const handleTopMenuClick = (selectedItem) => {
        switch (selectedItem) {
            case 'Location':
                setCurrentActivationMenu('Location');
                setCurrentHouseStyle('102');
                // goToSlideNumber(1);
                break;
            case 'FullLocation':
                if (currentActivatingMenu !== 'FullLocation') {
                    // setFullLocationActivatingSecondMenu('Day');
                }
                setCurrentActivationMenu('FullLocation');
                setCurrentHouseStyle('127');
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
                        "basePath": process.env.PUBLIC_URL + "/pannellum/102InHouse",
                        "path": "/%l/%s%y_%x",
                        "fallbackPath": "/fallback/%s",
                        "extension": "jpg",
                        "tileResolution": 512,
                        "maxLevel": 4,
                        "cubeResolution": 3176
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
                        "basePath": process.env.PUBLIC_URL + "/pannellum/127InHouse",
                        "path": "/%l/%s%y_%x",
                        "fallbackPath": "/fallback/%s",
                        "extension": "jpg",
                        "tileResolution": 512,
                        "maxLevel": 4,
                        "cubeResolution": 3176
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
        if (currentHouseStyle === '102') {
            panorama.loadScene('FullLocationDay');
        }
        if (currentHouseStyle === '127') {
            panorama.loadScene('FullLocationNight');
        }
    }, [currentHouseStyle])

    return (
        <div className="InHouseTraveling">
            {/* <div className="text">此页内容更新中，敬请期待。</div> */}

            {/* 全景圖 */}
            <div className={(true) ? ("panorama") : ("panorama hide")} ref={panoramaDOM}></div>

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

export default InHouseTraveling;