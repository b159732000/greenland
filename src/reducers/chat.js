var chatState = {
    messagelist: [],        // 聊天頁面的聊天文字
    clientInfo: {},         // 顾问信息
    socket: null,           // socket

    // Backend
    reciverList: [],        // 跟所有人的對話紀錄總清單
    userInfo: [],
    c_info: []              // 顧客資訊
}

export default function chat(state = chatState, action) {
    switch (action.type) {

        // Frontend & Backend
        // 更新當前聊天頁面的聊天文字
        case 'PUSHMESSAGE':
            // 定義暫時的 message list = 目前的 message list
            let tempMsglist = state.messagelist

            // 將暫時的 message list 與使用者輸入的新訊息結合
            tempMsglist = tempMsglist.concat(action.value)

            // 將暫時的 message list 更新到 state 中
            return {
                ...state,
                messagelist: tempMsglist
            }

        // Frontend
        // 设置聊天信息
        case 'SETMESSAGELIST':
            return {
                ...state,
                messagelist: action.value
            }
        case 'SETCLIENTINFO':
            return {
                ...state,
                clientInfo: action.value,
            };
        case 'SETSOCKET':
            return {
                ...state,
                socket: action.value,
            };

        // Backend
        // 设置聊天列表
        case 'SETRECIVERLIST':
            return {
                ...state,
                reciverList: action.value
            }
        // 聊天列表跳轉聊天頁面時，將選中的顧客放入store中
        case 'SETCINFO':
            return {
                ...state,
                c_info: action.value
            }
        default:
            return state
    }
}