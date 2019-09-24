// 避免typo
// export const INCREMENT = 'INCREMENT';
// export const DECREMENT = 'DECREMENT';
export const RESET = 'RESET';
export const OPENMENU = 'OPENMENU';
export const CLOSEMENU = 'CLOSEMENU';
export const MENUHASBEENOPENEDTOTRUEORFALSE = 'MENUHASBEENOPENEDTOTRUEORFALSE';
export const CHANGESCENEID = 'CHANGESCENEID'

// bgStrokeTextPositionReducers
export const UPDATECHOICELISTX = 'UPDATECHOICELISTX';
export const UPDATECHOICELISTY = 'UPDATECHOICELISTY';
export const UPDATECHOICELISTUlWidth = 'UPDATECHOICELISTUlWidth';
export const UPDATECHOICELISTUlContainerWidth = 'UPDATECHOICELISTUlContainerWidth';

// 寫法一與寫法二均可  (注意命名方式: function是camelCase, 關鍵字是UPPER_CASE_WITH_UNDERSCORES)
// 寫法一
// export function increment() {
//     return { type: INCREMENT };
// }
// 寫法二
// export const decrement = () => ({ type: DECREMENT });

export function reset() {
    return { type: RESET };
}
export function changeSceneID(SceneID) {   //PageWantToGoTo:string
    return { type: CHANGESCENEID, value: SceneID }
}
// 開啟與關閉MENU
export function openMenu() {
    return { type: OPENMENU };
}
export function closeMenu() {
    return { type: CLOSEMENU };
}
export function changeMenuHasBeenOpenedTo(trueOrFalse) {
    return { type: MENUHASBEENOPENEDTOTRUEORFALSE, value: trueOrFalse }
}


// bgStrokeTextPositionReducers
export function updateChoiceListX(choiceListX) {
    return { type: UPDATECHOICELISTX, value: { choiceListX: choiceListX } }
}
export function updateChoiceListY(choiceListY) {
    return { type: UPDATECHOICELISTY, value: { choiceListY: choiceListY } }
}
export function updateChoiceListUlWidth(choiceListUlWidth) {
    return { type: UPDATECHOICELISTUlWidth, value: choiceListUlWidth }
}
export function updateChoiceListUlContainerWidth(updateChoiceListUlContainerWidth) {
    return { type: UPDATECHOICELISTUlContainerWidth, value: updateChoiceListUlContainerWidth }
}


// PannellumSampleRoom
export const SETINITYAW = 'SETINITYAW';
export const SETINITPITCH = 'SETINITPITCH';
// export const UPDATECURRENTYAW = 'SETINITYAW';
// export const UPDATECURRENTPITCH = 'SETINITYAW';
export const SETCURRENTPANO = 'SETCURRENTPANO';
export const SETCURRENTPANOIMG = 'SETCURRENTPANOIMG';
export const CLOSEFULLSCREENPANO = 'CLOSEFULLSCREENPANO';
export const OPENFULLSCREENPANO = 'OPENFULLSCREENPANO';
export const SETUSERTYPE = 'SETUSERTYPE';

export function setInitYaw(yaw) {   //設定最初的yaw
    return { type: SETINITYAW, value: yaw };
}
export function setInitPitch(pitch) {   //設定最初的pitch
    return { type: setInitPitch, value: pitch };
}
// export function updateCurrentYaw() {    //即時更新目前的yaw
// 
// }
// export function updateCurrentPitch() {

// }
export function updateCurrentPano(currentPano) {   //更新目前顯示的全景圖
    return { type: SETCURRENTPANO, value: currentPano };
}
export function updateCurrentPanoImg(currentPanoImg) {   //更新目前顯示的全景圖片檔
    return { type: SETCURRENTPANOIMG, value: currentPanoImg };
}
export function closeFullScreenPano() {    //關閉全螢幕全景圖
    return { type: CLOSEFULLSCREENPANO };
}
export function openFullScreenPano() {    //開啟全螢幕全景圖
    return { type: OPENFULLSCREENPANO };
}

export function set_usertype(type) {    //设定微信用户种类(顾客或销售)
    return { type: SETUSERTYPE, value: type };
}

// Jghx
// 此次選取的子戶型 (山月院、山河院、A、B、C)
export const CHANGESELECTEDSECONDHOUSE = 'CHANGESELECTEDSECONDHOUSE';
export function changeSelectedSecondHouseStyle(selectedSecondHouseStyle) {
    return { type: CHANGESELECTEDSECONDHOUSE, value: selectedSecondHouseStyle };
}



// 後台
// 更新目前所在頁面 (導行列層級)
// selectedPage是文字，是要跳轉到的頁面
export const CHANGECURRENTPAGEINNAVIGATIONLEVEL = 'CHANGECURRENTPAGEINNAVIGATIONLEVEL';
export function changeCurrentPageInNavigationLevel(selectedPage) {
    return { type: CHANGECURRENTPAGEINNAVIGATIONLEVEL, value: selectedPage }
}

