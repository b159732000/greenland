import React from 'react';
import './ImageSequenceAerialView.scss';

class ImageSequenceAerialView extends React.Component {
    constructor(props) {
        super(props);
        this._isMounted = false;
        this.updateLoadingProgress = this.updateLoadingProgress.bind(this);
        this.checkAllImagesLoaded = this.checkAllImagesLoaded.bind(this);
        this.desideWhichImageToShow = this.desideWhichImageToShow.bind(this);

        // 定義本頁變數
        this.imageArray = [];
        this.DOMArray = [];
        this.requestID = null;  //提供掛載/卸載requestAnimationFrame
        this.lastPositionX = null;   //上一個
        this.touchPointArray = [];   //手指點擊位置歷史紀錄
        // 跟canvas相關的變數
        this.canvas = null;    // 從DOM取得canvas
        this.ctx = null;    // 繪製canvas前的宣告
        this.canvasImageArray = [];     //存放圖片序列的陣列 (為了載入和調用)

        this.state = {
            // 對應不同專案，要進入程式碼中手動設定的
            // 設定方法是將圖片所在目錄整行文字複製進以下底方
            // 需要修改的地方及數量: function addImagesIntoPage()*1、render()中的預覽圖區*1
            imagesBaseUrl: "../../../images/HouseStyle/127GIF/",    //圖片所在的目錄

            // 對應不同專案，要在此手動設定的
            totalImagesNumber: 40,                  //圖片總張數
            imageNameStartNumber: 0,                //第一張圖片名稱的數字
            imagesFormat: ".jpg",                   // 圖片格式
            fingerMoveDistanceToChangeImage: 1,    //手指每滑過多遠距離(x軸)就換一張圖片
            autoPlay: true,                         //自動播放
            changeImageRotateDirection: true,      //是否改變圖片旋轉方向 (預設: false 左滑上一張，右滑下一張)

            // 不用手動設定的
            startShowingImageSequence: false,       //是否開始載入所有圖片
            alreadyLoadingImagesNumber: 0,          //目前載入了幾張圖片
            currentShowingImage: 1,                 //目前顯示第幾張圖片
            allImagesAreLoaded: false,              //是否全部載入完成
            realImageSequenceIsShowing: false,      //是否顯示序列禎
            playerLayerIsShowing: false,             //播放鈕圖層是否顯現
            loadingLayerIsShowing: false,           //載入圖層是否顯現
            blurPreviewImageIsShowing: true,        //模糊預覽圖是否顯現
            currentLoadingPercentage: 0,           //載入進度 (0-100)
            // 跟觸控滑動換圖相關的
            thisTimeTouch: {
                startX: null,
                startY: null,
                currentX: null,
                pageIsChanged: false,
            },
            lastTimeTouch: {
                EndX: null,
                EndY: null,
            }
        }
    }

    componentDidMount() {
        this._isMounted = true;

        // 自動播放若啟用，則執行撥放
        if (this.state.autoPlay) {
            // 預留一秒讓父原件的圖片先載入，才載入GIF
            setTimeout(() => {
                this.handlePlayButtonClick();
            }, 1000);
        }
    }
    componentWillUnmount() {
        if (this.requestID !== null) {
            window.cancelAnimationFrame(this.requestID);     // 用來更新進度條的requestAnimationFrame
            this.requestID = null;
        }
        this._isMounted = false;
    }

    // 初始化canvas
    initCanvas() {

        if (this.canvasDOMElement) {
            this.canvas = this.canvasDOMElement;    // 從DOM取得canvas
            this.ctx = this.canvas.getContext('2d');    // 繪製canvas前的宣告

            // 載入圖片
            // 先檢驗imageArray的長度是否為0 (因為有用到CSSTransition，所以本頁可能被多次掛載，為確保只在第一次掛載時執行推送<img/>到DOMTree)
            if (this.canvasImageArray.length === 0) {
                // 當i<圖片總張數，推送一個新的div到imageArray，最後return imageArray
                for (let i = this.state.imageNameStartNumber; i < this.state.totalImagesNumber; i++) {
                    let img = new Image();
                    img.src = require('../../../images/HouseStyle/127GIF/' + i + this.state.imagesFormat);
                    // img.src = require("../../../images/HouseStyle/127GIF/0.jpg");
                    img.onload = () => this.handleEachImageLoaded();
                    this.canvasImageArray.push(img);
                }
            }
        } else {
            // this.initCanvas();
        }



        // // 載入圖片
        // let img = new Image();
        // img.src = require("../../../images/HouseStyle/127GIF/0.jpg");

        // // 確保圖片載入完成後，執行在canvas中繪圖
        // img.onload = function () {
        //     ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
        // }
    }

    // 將image掛載到本頁中 (掛載後圖片會自動載入)
    addImagesIntoPage() {
        // 先檢驗imageArray的長度是否為0 (因為有用到CSSTransition，所以本頁可能被多次掛載，為確保只在第一次掛載時執行推送<img/>到DOMTree)
        if (this.imageArray.length === 0) {
            // 當i<圖片總張數，推送一個新的div到imageArray，最後return imageArray
            for (let i = this.state.imageNameStartNumber; i < this.state.totalImagesNumber; i++) {

                // 取得目前的時間，作為獨一無二的image ID
                let currentTime = new Date();

                // 推送img進入imageArray
                this.imageArray.push(
                    <img ref={self => this.DOMArray.push(self)} className={'image ' + "image" + i + " hidden"} src={require('../../../images/HouseStyle/127GIF/' + i + this.state.imagesFormat)} onLoad={() => this.handleEachImageLoaded()} key={"image" + currentTime + i} alt="" />
                );

            };
        }
        return this.imageArray;
    }

    // 載入每張圖片後都觸發
    handleEachImageLoaded() {
        // 目前載入的圖片數量+1
        this.setState({
            alreadyLoadingImagesNumber: this.state.alreadyLoadingImagesNumber + 1
        }, () => this.checkAllImagesLoaded())
    }

    // 檢驗全部圖片是否載入完，是的話更新state全部載入完成的狀態
    checkAllImagesLoaded() {
        // 目前載入了幾張Img了
        console.log("目前載入幾張img: " + this.state.alreadyLoadingImagesNumber);
        if (this.state.alreadyLoadingImagesNumber === this.state.totalImagesNumber) {
            this.setState({
                allImagesAreLoaded: true
            }, () => this.desideWhichImageToShow())
        }
    }

    // 設定目前要顯示第幾張圖片(設定state.currentShowingImage)
    setCurrentShowingImageTo(imageNumber) {
        this.setState({
            currentShowingImage: imageNumber
        }, () => this.desideWhichImageToShow())
    }

    // 自動決定目前顯現的圖片 (根據state.currentShowingImage)
    desideWhichImageToShow() {
        // 移除目前要顯示的圖片的hidden (要先確認GIF是否全部載入完成，否則會出現undefined)
        if (this.state.allImagesAreLoaded) {
            // 在canvas中繪製特定圖片
            let currentShowingImage = this.canvasImageArray[this.state.currentShowingImage - 1];
            // console.log(currentShowingImage);
            this.ctx.drawImage(currentShowingImage, 0, 0, this.canvas.width, this.canvas.height);
            // 成功決定目前顯示的圖片
            // console.log("成功決定目前顯示的圖片");
        }
        // // 確認className是否有hidden，如果沒有就加上hidden
        // for (let i = 0; i < this.DOMArray.length; i++)
        //     if (!this.DOMArray[i].classList.contains('hidden')) {
        //         this.DOMArray[i].classList.add('hidden');
        //     }
        // // 移除目前要顯示的圖片的hidden (要先確認GIF是否全部載入完成，否則會出現undefined)
        // if (this.state.allImagesAreLoaded) {
        //     this.DOMArray[this.state.currentShowingImage - 1].classList.remove('hidden');
        // }
    }

    // 手指滑動時觸發
    // 滑鼠滑動時觸發(未做)
    handleTouchMove(event) {
        // 檢查歷史觸控點位記錄是否有數值，若無，則將目前入控的點位放入 (為了避免鎮列為空出錯)
        // if (this.touchPointArray === []) {
        //     this.touchPointArray.push(this.state.thisTimeTouch);
        // }

        // 按照this.state，設定手指滑動方向是要切換上一張或下一張
        if (this.state.changeImageRotateDirection) {
            // 檢查手指是往左/右滑動，然後按方向加減圖片顯示第幾張
            if (event.touches[0].screenX - this.state.thisTimeTouch.startX > 0) {  //往右滑，換上一張

                // 每滑動npx則顯示前一張 (n是state.fingerMoveDistanceToChangeImage, 手指每滑過多遠距離(x軸)就換一張圖片)
                // if ((event.touches[0].screenX - this.touchPointArray[0].startX) % this.state.fingerMoveDistanceToChangeImage === 0) {
                this.setState({
                    thisTimeTouch: {
                        ...this.state.thisTimeTouch,
                        startX: event.touches[0].screenX,
                    }
                })
                let imageNumber = (this.state.currentShowingImage - 1);
                if (imageNumber <= 0) {
                    imageNumber = this.state.totalImagesNumber;
                }
                this.setCurrentShowingImageTo(imageNumber);
                // }
            } else if (event.touches[0].screenX - this.state.thisTimeTouch.startX < 0) {  //往左滑，換下一張

                // 每滑動npx則顯示前一張 (n是state.fingerMoveDistanceToChangeImage, 手指每滑過多遠距離(x軸)就換一張圖片)
                // if ((event.touches[0].screenX - this.touchPointArray[0].startX) % this.state.fingerMoveDistanceToChangeImage === 0) {
                this.setState({
                    thisTimeTouch: {
                        ...this.state.thisTimeTouch,
                        startX: event.touches[0].screenX,
                    }
                })
                let imageNumber = (this.state.currentShowingImage + 1);
                if (imageNumber > this.state.totalImagesNumber) {
                    imageNumber = 1;
                }
                this.setCurrentShowingImageTo(imageNumber);
                // }

            }
        } else if (!this.state.changeImageRotateDirection) {

            // 檢查手指是往左/右滑動，然後按方向加減圖片顯示第幾張
            if (event.touches[0].screenX - this.state.thisTimeTouch.startX < 0) {  //往左滑，換上一張

                // 每滑動npx則顯示前一張 (n是state.fingerMoveDistanceToChangeImage, 手指每滑過多遠距離(x軸)就換一張圖片)
                if ((event.touches[0].screenX - this.touchPointArray[0].startX) % this.state.fingerMoveDistanceToChangeImage === 0) {
                    this.setState({
                        thisTimeTouch: {
                            ...this.state.thisTimeTouch,
                            startX: event.touches[0].screenX,
                        }
                    })
                    let imageNumber = (this.state.currentShowingImage - 1);
                    if (imageNumber <= 0) {
                        imageNumber = this.state.totalImagesNumber;
                    }
                    this.setCurrentShowingImageTo(imageNumber);
                }

                console.log(3);
            } else if (event.touches[0].screenX - this.state.thisTimeTouch.startX > 0) {  //往右滑，換下一張

                // 每滑動npx則顯示前一張 (n是state.fingerMoveDistanceToChangeImage, 手指每滑過多遠距離(x軸)就換一張圖片)
                if ((event.touches[0].screenX - this.touchPointArray[0].startX) % this.state.fingerMoveDistanceToChangeImage === 0) {
                    this.setState({
                        thisTimeTouch: {
                            ...this.state.thisTimeTouch,
                            startX: event.touches[0].screenX,
                        }
                    })
                    let imageNumber = (this.state.currentShowingImage + 1);
                    if (imageNumber > this.state.totalImagesNumber) {
                        imageNumber = 1;
                    }
                    this.setCurrentShowingImageTo(imageNumber);
                }

                console.log(4);
            }
        }

        // 為了讓下一個手指移動的位置跟這次比較
        this.setState({
            thisTimeTouch: {
                ...this.state.thisTimeTouch,
                startX: event.touches[0].screenX,
                startY: event.touches[0].screenY,
            }
        });
        // 將目前的滑鼠位置放入觸控點紀錄陣列中
        this.touchPointArray.push(this.state.thisTimeTouch);
        // 如果觸控點紀錄陣列超過設定筆數(見state.fingerMoveDistanceToChangeImage)，刪除最舊的一筆資料(即第0項)
        if (this.touchPointArray.length > this.state.fingerMoveDistanceToChangeImage) {
            this.touchPointArray.splice(0, 1);  //從第幾項開始，總共刪除幾項
        }
    }
    handleTouchStart(event) {
        this.setState({
            thisTimeTouch: {
                ...this.state.thisTimeTouch,
                startX: event.touches[0].screenX,
                startY: event.touches[0].screenY,
            }
        }, () => this.touchPointArray.push(this.state.thisTimeTouch))
    }
    handleTouchEnd(event) {
        this.setState({
            thisTimeTouch: {
                ...this.state.thisTimeTouch,
                pageIsChanged: false,
            }
        })
    }

    // 點擊播放鈕觸發
    handlePlayButtonClick() {
        this.setState({
            startShowingImageSequence: true,
        })
        // 隱藏播放鈕圖層
        this.hidePlayButtonLayer();
        // 顯現載入圖層
        this.showLoadingLayer();
        // 初始化canvas
        this.initCanvas();
    }

    // 隱藏播放鈕圖層
    hidePlayButtonLayer() {
        this.setState({
            playerLayerIsShowing: false
        })
    }

    // 顯現載入圖層，並開始更新載入進度
    showLoadingLayer() {
        this.setState({
            loadingLayerIsShowing: true
        }, () => this.updateLoadingProgress());
    }

    // 即時更新載入進度 (文字+進度條長度)
    updateLoadingProgress() {

        // 為了循環執行此函數
        this.requestID = window.requestAnimationFrame(this.updateLoadingProgress);

        console.log("now is in animation frame");
        console.log("state.allImagesAreLoaded: " + this.state.allImagesAreLoaded);

        // 序列禎載入完成時觸發
        if (this.state.allImagesAreLoaded) {
            // 隱藏載入圖層並卸載requestAnimation
            this.hideLoadingLayer();
            // 隱藏模糊圖層
            this.hideBlurPreviewImage();
        } else {
            // 將目前的載入進度(%)設定進state中
            let currentLoadingPercentage = Math.round(this.state.alreadyLoadingImagesNumber / this.state.totalImagesNumber * 100);
            this.setState({
                currentLoadingPercentage: currentLoadingPercentage
            })

            // 進度條長度
            let loadingBarWidth = this.state.currentLoadingPercentage + "%";
            this.progressBarDOMElement.style.width = loadingBarWidth;
        }

    }

    // 隱藏載入圖層並卸載requestAnimation
    hideLoadingLayer() {
        // 隱藏載入圖層
        this.setState({
            loadingLayerIsShowing: false
        })

        // 卸載載入進度條的requestAnimationFrame (見function updateLoadingProgress())
        window.cancelAnimationFrame(this.requestID);
        this.requestID = null;

        console.log("cancle animationframe");
    }

    // 隱藏模糊預覽圖
    hideBlurPreviewImage() {
        this.setState({
            blurPreviewImageIsShowing: false
        })
    }

    // 顯現真實背景圖
    showRealImageSequence() {

    }

    render() {
        return (
            <div className="ImageSequenceAerialViewContainer" onTouchMove={(event) => this.handleTouchMove(event)} onTouchStart={(event) => this.handleTouchStart(event)} onTouchEnd={() => this.handleTouchEnd()}>

                {/* 播放鈕擊白色半透明覆蓋 */}
                {/* <div className="coverContainer"> */}
                <div className={(this.state.playerLayerIsShowing) ? ("coverContainer") : ("coverContainer hidden")}>
                    <div className="icons" onClick={() => this.handlePlayButtonClick()}>
                        {/* <i className="fas fa-play"></i> */}
                        {/* <svg t={1564044135429} className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id={1987} width={200} height={200}><path d="M215.178417 42.372414l670.896551 420.193103c31.77931 21.186207 42.372414 63.558621 21.186207 98.868966-7.062069 10.593103-14.124138 17.655172-21.186207 21.186207l-670.896551 420.193103c-31.77931 21.186207-77.682759 10.593103-98.868966-21.186207-7.062069-7.062069-10.593103-21.186207-10.593103-35.310345V102.4c0-38.841379 31.77931-70.62069 70.620689-70.62069 14.124138 0 24.717241 3.531034 38.84138 10.593104z" p-id={1988} /></svg> */}
                        <svg t="1564044366165" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2104" width="200" height="200"><path d="M512 0C229.451852 0 0 229.451852 0 512s229.451852 512 512 512 512-229.451852 512-512S794.548148 0 512 0zM512 986.074074C250.311111 986.074074 37.925926 773.688889 37.925926 512S250.311111 37.925926 512 37.925926s474.074074 212.385185 474.074074 474.074074S773.688889 986.074074 512 986.074074z" p-id="2105"></path><path d="M676.977778 494.933333l-271.17037-157.392593c-13.274074-7.585185-28.444444 1.896296-28.444444 17.066667l0 314.785185c0 15.17037 15.17037 24.651852 28.444444 17.066667l271.17037-157.392593C688.355556 521.481481 688.355556 502.518519 676.977778 494.933333z" p-id="2106"></path></svg>
                    </div>
                    <div className="cover"></div>
                </div>

                {/* 載入畫面 */}
                {/* <div className="loadingAnimationContainer"> */}
                <div className={(this.state.loadingLayerIsShowing) ? ("loadingAnimationContainer") : ("loadingAnimationContainer hidden")}>
                    {/* 將內容物置於畫面中間 */}
                    <div className="positioner">

                        {/* 左右置中 */}
                        <div className="upper">
                            {/* 載入動畫容器 */}
                            <div className="animationContainer">
                                {/* 這次選用的動畫 - 百分比 */}
                                <h1 className="count">{this.state.currentLoadingPercentage + "%"}</h1>
                            </div>
                        </div>

                        {/* 左右置中 */}
                        <div className="bottom">
                            {/* 載入條 */}
                            <div className="percentageContainer">
                                {/* 進度條本體 */}
                                <div className="progress-bar">
                                    <span className="bar">
                                        <span className="progress" ref={self => this.progressBarDOMElement = self}></span>
                                    </span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* 預覽圖 */}
                {/* <div className="previewImg"> */}
                <div className={(this.state.blurPreviewImageIsShowing) ? ("previewImg") : ("previewImg hidden")}>
                    <img src={require(('../../../images/HouseStyle/127GIF/' + this.state.imageNameStartNumber + this.state.imagesFormat))} alt="" />
                </div>

                {/* 掛載圖片的程式碼 */}
                {/* {(this.state.startShowingImageSequence) ? (this.addImagesIntoPage()) : (null)} */}
                {/* 掛載後的東西大概長下面這樣 */}
                {/* <img className="image image1 hidden" src={require('../../images/Jghx/HouseStyle/Villa/MountainMoon/MountainMoonCombineGif/' + i +'.png')} onLoad={()=>this.handleEachImageLoaded()} key={"image" + currentTime + i} alt=""/> */}

                {/* 使用canvas */}
                <canvas width="4096" height="2727" ref={self => this.canvasDOMElement = self}></canvas>
                {/* <canvas width="2048" height="1363" ref={self => this.canvasDOMElement = self}></canvas> */}

            </div>
        )
    }
}

export default ImageSequenceAerialView;