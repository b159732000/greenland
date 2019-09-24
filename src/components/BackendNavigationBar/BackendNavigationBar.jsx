import React from 'react';
import './BackendNavigationBar.scss';
import { Link, withRouter } from 'react-router-dom';
import socket from '../../utils/socket';
import events from '../../utils/events';
import { changeCurrentPageInNavigationLevel } from '../../actions/actions.js';
// import { setMessagelist, pushMessage, setUser, setc_info } from '../../actions/chatPage.js';
import { connect } from 'react-redux';
import stroage from '../../api/stroage'

// 從store讀值放入prop.變數中
function mapStateToProps(state) {
    return {
        currentPageInNavigationLevel: state.defaultReducers.currentPageInNavigationLevel,    //目前所在頁面 (導行列層級)
        userInfo: state.chat.userInfo
    }
}

const mapDispatchToProps = {
    changeCurrentPageInNavigationLevel,//範例
    // setMessagelist,
    // pushMessage,
    // setUser,
    // setc_info
}

class NavigationBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            socket: null
        }
    }

    // 元件掛載時觸發
    componentDidMount() {
        // console.log("導行列掛載時第一次檢查當前所屬頁面↓");
        this.autoUpdateCurrentPage();

        // 顯示menu icon svg各路徑長度 (debug用)
        // this.showMenuIconSVGPathLength();

        if (window.enableWeXinLogIn) {
            // let _this = this
            // _this.props.setUser(stroage.get('userInfo'))
            // if (!this.state.socket) {
            //     socket(_this).then((socket) => {
            //         _this.setState({
            //             socket: socket
            //         })
            //         events(_this, socket)
            //     })
            // }
        }
        // if (stroage.get('c_info')) {
        //     this.props.setc_info(stroage.get('c_info'))
        // }

        // debug用
        // console.log(this.props.currentPageInNavigationLevel);
    }

    // 每次元件更新時觸發
    componentDidUpdate(prevprops) {
        if (this.props.location !== prevprops.location) {
            this.autoUpdateCurrentPage(prevprops);
        }
    }

    // 自動更新所在頁面
    autoUpdateCurrentPage(prevprops) {
        let currentPage, currentPathName = window.location.pathname;
        // console.log("頁面更新時確認當前路徑: " + currentPathName);

        // 依照當前路徑，設定當前頁面(currentPage)
        if (currentPathName === '/RunXiShan_BackEnd') {
            currentPage = 'HomePage';
            console.log("當前頁面為: " + currentPage);
        }
        if (currentPathName.search('HomePage') !== -1) {
            currentPage = 'HomePage';
            console.log("當前頁面為: " + currentPage);
        }
        if (currentPathName.search('DataPage') !== -1) {
            currentPage = 'DataPage';
            console.log("當前頁面為: " + currentPage);
        }
        if (currentPathName.search('MessageList') !== -1) {
            currentPage = 'ChatPage';
            console.log("當前頁面為: " + currentPage);
        }
        if (currentPathName.search('ChatPage') !== -1) {
            currentPage = 'ChatPage';
            console.log("當前頁面為: " + currentPage);
        }
        if (currentPathName.search('VisitorPage') !== -1) {
            currentPage = 'VisitorPage';
            console.log("當前頁面為: " + currentPage);
        }
        if (currentPathName.search('CustomerInfo') !== -1) {
            currentPage = 'VisitorPage';
            console.log("當前頁面為: " + currentPage);
        }

        // 更新目前所在頁面
        this.currentPageInNavigationLevel(currentPage);
    }

    // 本頁的方法與store內的方法連結
    currentPageInNavigationLevel = (selectedPage) => {
        this.props.changeCurrentPageInNavigationLevel(selectedPage);
    }

    // 導行列選項選取時觸發
    handleNavigationBarIconClick(selectedPage) {
        // 更新目前所在頁面
        this.currentPageInNavigationLevel(selectedPage);
    }

    // 決定滑動塊的位置 (更改滑動塊class)
    updateUpperBoxPosition() {

    }

    // 顯示menu icon svg各路徑長度
    showMenuIconSVGPathLength() {
        console.log('homePagePath路徑長: ' + document.getElementsByClassName('homePagePath')[0].getTotalLength());
        console.log('dataPageBigBox路徑長: ' + document.getElementsByClassName('dataPageBigBox')[0].getTotalLength());
        console.log('dataPageMiddleBox路徑長: ' + document.getElementsByClassName('dataPageMiddleBox')[0].getTotalLength());
        console.log('dataPageSmallBox路徑長: ' + document.getElementsByClassName('dataPageSmallBox')[0].getTotalLength());
        console.log('dataPageLine路徑長: ' + document.getElementsByClassName('dataPageLine')[0].getTotalLength());
        console.log('chatPageBigChat路徑長: ' + document.getElementsByClassName('chatPageBigChat')[0].getTotalLength());
        console.log('chatPageSmallChat路徑長: ' + document.getElementsByClassName('chatPageSmallChat')[0].getTotalLength());
        console.log('chatPageMouth路徑長: ' + document.getElementsByClassName('chatPageMouth')[0].getTotalLength());
        console.log('visitorPageOuter路徑長: ' + document.getElementsByClassName('visitorPageOuter')[0].getTotalLength());
        console.log('visitorPageHead路徑長: ' + document.getElementsByClassName('visitorPageHead')[0].getTotalLength());
        console.log('visitorPageRightArm路徑長: ' + document.getElementsByClassName('visitorPageRightArm')[0].getTotalLength());
        console.log('visitorPageLeftArm路徑長: ' + document.getElementsByClassName('visitorPageLeftArm')[0].getTotalLength());
        console.log('visitorPageLeftTopLine路徑長: ' + document.getElementsByClassName('visitorPageLeftTopLine')[0].getTotalLength());
        console.log('visitorPageLeftMiddleLine路徑長: ' + document.getElementsByClassName('visitorPageLeftMiddleLine')[0].getTotalLength());
        console.log('visitorPageLeftBottomLine路徑長: ' + document.getElementsByClassName('visitorPageLeftBottomLine')[0].getTotalLength());
    }

    render() {
        return (
            <div className="NavigationBarContainer">

                {/* 清單上方滑動塊 */}
                <svg className={"upperBoxPosition " + this.props.currentPageInNavigationLevel} preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 489.46 97.98">
                    <defs>
                        <style dangerouslySetInnerHTML={{ __html: ".cls-1{fill:#1E1E28;}" }} />
                    </defs>
                    <title>资源 1</title>
                    <g id="图层_2" data-name="图层 2">
                        <g id="图层_1-2" data-name="图层 1">
                            <path className="" d="M1.25,98h0Z" />
                            <path className="" d="M489.46,98h0Z" />
                            <path className="" d="M244.73.09s-58-4.37-121.53,48.61C67.39,95.28,10.32,97.87,1.25,98h487c-9.07-.11-66.13-2.7-121.95-49.28C302.77-4.29,244.73.09,244.73.09Z" />
                        </g>
                    </g>
                </svg>

                {/* debug(包含換行程式碼) */}
                {/* <div className="debug" style={{ whiteSpace: "pre" }}>
                    --{this.props.currentPageInNavigationLevel}--{'\n'}
                    --{window.location.pathname}--
                </div> */}

                {/* 新建客戶按鈕 */}
                {/* <div className="createCustomer">
                    <div className="button"></div>
                </div> */}

                {/* 四個清單選項 */}
                <ul>

                    {/* undefined是為了在第一次進入頁面時，可以將導行列啟用項設定為homepage */}
                    <li className={(this.props.currentPageInNavigationLevel === 'HomePage' || this.props.currentPageInNavigationLevel === undefined) ? ('active') : ('')} onClick={() => this.handleNavigationBarIconClick('HomePage')}>
                        <Link to="/GreenLand/Backend/HomePage">
                            {/* 做為內部icon的對齊基準線 */}
                            <div className="iconPositioner">
                                <div className="circleContainer">
                                    {/* <svg t="1563268793827" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="50039" width="200" height="200"><path d="M832 981.333333H597.333333V597.333333a21.333333 21.333333 0 0 0-21.333333-21.333333h-128a21.333333 21.333333 0 0 0-21.333333 21.333333v384H192a64 64 0 0 1-64-64V576H51.413333A42.666667 42.666667 0 0 1 21.333333 503.253333L466.773333 57.813333a64 64 0 0 1 90.453334 0L1002.666667 503.253333A42.666667 42.666667 0 0 1 972.586667 576H896v341.333333a64 64 0 0 1-64 64z m-192-42.666666h192a21.333333 21.333333 0 0 0 21.333333-21.333334V533.333333h119.253334L527.146667 87.893333a21.333333 21.333333 0 0 0-30.08 0L51.413333 533.333333H170.666667v384a21.333333 21.333333 0 0 0 21.333333 21.333334h192V597.333333a64 64 0 0 1 64-64h128a64 64 0 0 1 64 64z" p-id="50040"></path></svg> */}

                                    <svg className="homePageSvg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44.22 41.79">
                                        <defs>
                                            <style dangerouslySetInnerHTML={{ __html: ".cls-1{fill:none;stroke:#fff;stroke-miterlimit:10;}" }} />
                                        </defs>
                                        <title>首頁</title>
                                        <g id="图层_2" data-name="图层 2">
                                            <g id="图层_1-2" data-name="图层 1">
                                                {/* path長度178 */}
                                                <path className="homePagePath" d="M37.42,41.29H27.69a1,1,0,0,1-1-1v-17a1,1,0,0,0-1-1h-7a1,1,0,0,0-1,1v17a1,1,0,0,1-1,1H6.87a1,1,0,0,1-1-1V23.75a1,1,0,0,0-1-1H1.52A1,1,0,0,1,.8,21L21,.8a1,1,0,0,1,1.43,0L43.41,21a1,1,0,0,1-.71,1.76H39.46a1,1,0,0,0-1,1V40.27A1,1,0,0,1,37.42,41.29Z" />
                                            </g>
                                        </g>
                                    </svg>

                                </div>
                            </div>
                        </Link>
                    </li>

                    <li className={(this.props.currentPageInNavigationLevel === 'DataPage') ? ('active') : ('')} onClick={() => this.handleNavigationBarIconClick('DataPage')}>
                        <Link to="/GreenLand/Backend/DataPage">
                            <div className="iconPositioner">
                                <div className="circleContainer">
                                    {/* <svg t="1563268357275" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="38601" width="200" height="200"><path d="M1002.666667 906.666667h-32V149.333333c0-46.933333-38.4-85.333333-85.333334-85.333333h-85.333333c-46.933333 0-85.333333 38.4-85.333333 85.333333v757.333334h-64V341.333333c0-46.933333-38.4-85.333333-85.333334-85.333333h-85.333333c-46.933333 0-85.333333 38.4-85.333333 85.333333v565.333334h-64V533.333333c0-46.933333-38.4-85.333333-85.333334-85.333333h-85.333333c-46.933333 0-85.333333 38.4-85.333333 85.333333v373.333334H21.333333c-12.8 0-21.333333 8.533333-21.333333 21.333333s8.533333 21.333333 21.333333 21.333333h981.333334c12.8 0 21.333333-8.533333 21.333333-21.333333s-8.533333-21.333333-21.333333-21.333333zM757.333333 149.333333c0-23.466667 19.2-42.666667 42.666667-42.666666h85.333333c23.466667 0 42.666667 19.2 42.666667 42.666666v746.666667h-170.666667V149.333333z m-320 192c0-23.466667 19.2-42.666667 42.666667-42.666666h85.333333c23.466667 0 42.666667 19.2 42.666667 42.666666v554.666667h-170.666667V341.333333z m-320 192c0-23.466667 19.2-42.666667 42.666667-42.666666h85.333333c23.466667 0 42.666667 19.2 42.666667 42.666666v362.666667h-170.666667V533.333333z" p-id="38602"></path></svg> */}
                                    <svg className="dataPageSvg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 41">
                                        <defs>
                                            <style dangerouslySetInnerHTML={{ __html: ".cls-1{fill:none;stroke:#fff;stroke-miterlimit:10;}" }} />
                                        </defs>
                                        <title>圖表</title>
                                        <g id="图层_2" data-name="图层 2">
                                            <g id="图层_1-2" data-name="图层 1">
                                                <path className="dataPageBigBox" d="M39.4.5H41.6a3.9,3.9,0,0,1,3.9,3.9V40.5a0,0,0,0,1,0,0h-10a0,0,0,0,1,0,0V4.4A3.9,3.9,0,0,1,39.4.5Z" />
                                                <path className="dataPageMiddleBox" d="M23.4,8.5H25.6a3.9,3.9,0,0,1,3.9,3.9V40.5a0,0,0,0,1,0,0h-10a0,0,0,0,1,0,0V12.4A3.9,3.9,0,0,1,23.4,8.5Z" />
                                                <path className="dataPageSmallBox" d="M7.4,18.5H9.6a3.9,3.9,0,0,1,3.9,3.9V40.5a0,0,0,0,1,0,0H3.5a0,0,0,0,1,0,0V22.4A3.9,3.9,0,0,1,7.4,18.5Z" />
                                                <line className="dataPageLine" y1="40.5" x2={50} y2="40.5" />
                                            </g>
                                        </g>
                                    </svg>
                                </div>
                            </div>
                        </Link>
                    </li>

                    <li className={(this.props.currentPageInNavigationLevel === 'ChatPage') ? ('active') : ('')} onClick={() => this.handleNavigationBarIconClick('ChatPage')}>
                        <Link to="/GreenLand/Backend/MessageList">
                            <div className="iconPositioner">
                                <div className="circleContainer">
                                    {/* <svg t="1563267672898" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="26325" width="200" height="200"><path d="M529.7 203.5c124.6 0 226 107.2 226 239.1l0 27.7c0 131.8-101.4 239.1-226 239.1l-53.2 0c-91.9 0-122.7 75.1-141 119.9-1.7 4-3.5 8.7-5.4 13-6.2-8.8-13.6-20.5-19.6-30.1-11.9-18.8-25.3-40.1-40.9-60.4-37.2-48.5-82.8-87.3-84.7-88.9l-3.8-3.4-5.1-2.2c-3.4-1.6-83.2-40.7-83.2-187l0-27.7c0-131.8 101.4-239.1 226-239.1L529.7 203.5M529.7 165.8l-211 0C173 165.8 55 289.7 55 442.6l0 27.7C55 646 160.5 691.7 160.5 691.7s44 37.2 79.1 83c34.5 45 59.9 98.5 79.1 110.7 6.1 3.9 11.4 5.6 16 5.6 42.2 0 33.6-144 141.8-144 0.1 0 0.3 0 0.4 0l52.7 0c145.6 0 263.7-123.9 263.7-276.8l0-27.7C793.4 289.7 675.3 165.8 529.7 165.8L529.7 165.8z" p-id="26326"></path><path d="M828.2 467.5c-9.6 0-17.9 7.2-18.9 17-1 10.4 6.5 19.6 16.9 20.7 67.7 6.8 115 60.9 115 131.6L941.2 652c-1.5 77.5-50.1 108.5-52.1 109.7l-2.3 1.6c-1.1 0.9-27.4 22.7-48.8 50-9 11.4-16.7 23.4-23.6 34.1-4.8 7.3-10.9 16.9-14.5 21.8-1.8-3.6-3.9-8.5-5.6-12.5-10.4-24.8-27.8-66.3-79.3-66.3l-35.3 0c-32.4 0-46.4-0.6-66-16.9-3.5-2.9-7.8-4.3-12-4.3-5.4 0-10.8 2.3-14.6 6.9-6.6 8-5.5 19.9 2.6 26.5 30.9 25.5 57 25.5 90 25.5l35.5 0c24.3 0 33.3 17.1 44.2 43.1 7.6 18 16.1 38.5 38.1 38.5 6.3 0 12.8-2 19.2-6 10.1-6.2 18.1-18.7 29.2-35.9 6.4-9.9 13.7-21.2 21.6-31.2 16.9-21.5 37.9-39.8 42.3-43.5 10.3-6.8 67.1-48.3 68.9-140.7l0-15.7c0-90.7-61.3-160.3-149-169.1C829.4 467.5 828.8 467.5 828.2 467.5L828.2 467.5z" p-id="26327"></path><path d="M424.2 619.5c-95.8 0-173.7-62.6-173.7-139.7 0-10.4 8.4-18.9 18.9-18.9 10.4 0 18.9 8.4 18.9 18.9 0 56.2 61 101.9 136 101.9s136-45.7 136-101.9c0-10.4 8.4-18.9 18.9-18.9s18.9 8.4 18.9 18.9C597.9 556.9 520 619.5 424.2 619.5z" p-id="26328"></path></svg> */}
                                    <svg className="chatPageSvg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 58.5 43.85">
                                        <defs>
                                            <style dangerouslySetInnerHTML={{ __html: ".cls-1{fill:none;stroke:#fff;stroke-miterlimit:10;}" }} />
                                        </defs>
                                        <title>聊天</title>
                                        <g id="图层_2" data-name="图层 2">
                                            <g id="图层_1-2" data-name="图层 1">
                                                <path className="chatPageBigChat" d="M31.44,35.1H25.18l-6.06,7.62a.93.93,0,0,1-1.51-.07c-1.55-2.42-5.27-8-6.59-8.49A15.94,15.94,0,0,1,.5,19.17v-2.8A15.87,15.87,0,0,1,16.37.5H31.44A15.87,15.87,0,0,1,47.31,16.37v2.86A15.87,15.87,0,0,1,31.44,35.1Z" />
                                                <path className="chatPageSmallChat" d="M33.07,35.1c2.09,2.17,3.87,3.65,7.11,3.65h3.61l3.49,4.39a.54.54,0,0,0,.87,0c.9-1.39,3-4.62,3.8-4.89A9.18,9.18,0,0,0,58,29.57V28a9.14,9.14,0,0,0-9.14-9.14h-2" />
                                                <path className="chatPageMouth" d="M34.5,19c0,4.69-4.7,8.5-10.5,8.5S13.5,23.69,13.5,19" />
                                            </g>
                                        </g>
                                    </svg>
                                </div>
                            </div>
                        </Link>
                    </li>

                    <li className={(this.props.currentPageInNavigationLevel === 'VisitorPage') ? ('active') : ('')} onClick={() => this.handleNavigationBarIconClick('VisitorPage')}>
                        <Link to="/GreenLand/Backend/VisitorPage">
                            <div className="iconPositioner">
                                <div className="circleContainer">
                                    {/* <svg t="1563270124940" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="57813" width="200" height="200"><path d="M116.948037 343.849302h115.494431c13.866822 0 25.148773-11.700483 25.148773-26.077935 0-14.381545-11.281951-26.083052-25.148773-26.083052H116.948037c-13.867846 0-25.15082 11.701506-25.15082 26.083052 0 14.377452 11.281951 26.077935 25.15082 26.077935zM116.948037 531.208481h115.494431c13.866822 0 25.148773-11.69946 25.148773-26.078959 0-6.965645-2.615571-13.514805-7.365758-18.439978-4.750187-4.925173-11.066033-7.640004-17.783015-7.640004H116.948037c-13.867846 0-25.15082 11.700483-25.15082 26.079982 0 14.379499 11.281951 26.078958 25.15082 26.078959zM257.591241 691.800016c0-6.969739-2.615571-13.520945-7.366781-18.445095-4.749164-4.926196-11.06501-7.641027-17.781992-7.641027H116.948037c-13.867846 0-25.15082 11.70253-25.15082 26.086122 0 14.377452 11.282974 26.073842 25.15082 26.073842h115.494431c13.866822 0.001023 25.148773-11.695367 25.148773-26.073842zM338.175581 718.26476l-3.39533 8.241709h56.053644l1.681292-3.171226c26.273387-49.514717 88.028892-85.744873 150.142555-88.105641h6.066159c2.289136 0 4.562922 0 6.782474 0.005117 62.145385 2.360767 123.900891 38.587853 150.178371 88.100524l1.681292 3.171226h56.056713l-3.396353-8.241709c-10.207479-24.774243-28.0171-49.005111-51.503001-70.068845-18.481933-16.575514-40.379663-31.149441-63.423495-42.22366 22.687722-14.728446 41.967834-34.592866 55.834656-57.547671 16.476253-27.269064 25.184589-58.594513 25.184589-90.589204 0-97.816816-79.580476-177.394223-177.395246-177.394223-97.820909 0-177.402409 79.579453-177.402409 177.394223 0 32.061207 8.743128 63.443961 25.285896 90.75191 13.928221 22.998807 33.288151 42.878576 56.062854 57.594743-22.958898 11.092639-44.763506 25.65224-63.158459 42.178634-23.408129 21.027919-41.160445 45.200458-51.336202 69.904093z m210.547297-386.233621c69.365834 0 125.799124 56.434314 125.799124 125.803217 0 69.365834-56.432267 125.798101-125.799124 125.798101-69.367881 0-125.803217-56.431244-125.803218-125.798101 0-69.368904 56.435337-125.803217 125.803218-125.803217z" fill="" p-id="57814"></path><path d="M848.424 63.251h-599.407c-52.319 0-94.881 42.561-94.881 94.88v71.012h50.908v-60.41c0-35.955 19.006-54.962 54.966-54.962h578.356c35.955 0 54.96 19.006 54.96 54.962v672.747c0 35.96-19.003 54.968-54.96 54.968h-578.357c-35.959 0-54.966-19.006-54.966-54.968v-60.401h-50.908v69.968c0 52.32 42.562 94.883 94.881 94.883h599.408c52.319 0 94.883-42.563 94.883-94.883v-692.92c0-52.314-42.564-94.877-94.883-94.877z" fill="" p-id="57815"></path></svg> */}
                                    <svg className="visitorPageSvg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 42.58 45.5">
                                        <defs>
                                            <style dangerouslySetInnerHTML={{ __html: ".cls-1{fill:none;stroke:#fff;stroke-miterlimit:10;}.cls-2{fill:#fff;}" }} />
                                        </defs>
                                        <title>訪客清單</title>
                                        <g id="图层_2" data-name="图层 2">
                                            <g id="图层_1-2" data-name="图层 1">
                                                <path className="visitorPageOuter" d="M3.58,9V6.2A5.7,5.7,0,0,1,9.28.5h27.1a5.7,5.7,0,0,1,5.7,5.7V39.3a5.7,5.7,0,0,1-5.7,5.7H9.28a5.7,5.7,0,0,1-5.7-5.7V37.13" />
                                                <path className="visitorPageHead" d="M30.08,21a7.5,7.5,0,1,1-7.5-7.5A7.5,7.5,0,0,1,30.08,21Z"></path>
                                                {/* <circle className="visitorPageHead" cx="22.58" cy={21} r="7.5" /> */}
                                                <path className="visitorPageRightArm" d="M13.6,33.8c1.46-2,3.42-4.26,5.74-5.22.7-.29.39-1.45-.32-1.16-2.66,1.11-4.78,3.49-6.46,5.78-.46.62.58,1.22,1,.61Z" />
                                                <path className="visitorPageLeftArm" d="M32.69,33.2c-1.67-2.28-3.8-4.67-6.46-5.78-.71-.3-1,.86-.32,1.16,2.32,1,4.28,3.23,5.74,5.22.45.62,1.49,0,1-.61Z" />
                                                <path className="visitorPageLeftTopLine" d="M.58,14.1h7a.6.6,0,0,0,0-1.2h-7a.6.6,0,0,0,0,1.2Z" />
                                                <path className="visitorPageLeftMiddleLine" d="M.58,23.6h7a.6.6,0,0,0,0-1.2h-7a.6.6,0,0,0,0,1.2Z" />
                                                <path className="visitorPageLeftBottomLine" d="M.58,33.6h7a.6.6,0,0,0,0-1.2h-7a.6.6,0,0,0,0,1.2Z" />
                                            </g>
                                        </g>
                                    </svg>
                                </div>
                            </div>
                        </Link>
                    </li>

                </ul>
            </div>
        )
    }
}

NavigationBar = withRouter(NavigationBar);
export default connect(mapStateToProps, mapDispatchToProps)(NavigationBar);