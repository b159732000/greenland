export const SETMESSAGELIST = 'SETMESSAGELIST';
export const PUSHMESSAGE = 'PUSHMESSAGE';
export const SETRECIVERLIST = 'SETRECIVERLIST';
export const SETUSERINFO = 'SETUSERINFO';
export const SETCINFO = 'SETCINFO';
export function setMessagelist(list) {
    return { type: SETMESSAGELIST, value: list }
}

export function pushMessage(message) {
    return { type: PUSHMESSAGE, value: message }
}


export function setReciverList(list) {
    return { type: SETRECIVERLIST, value: list }
}


export function setUser(user) {
    return { type: SETUSERINFO, value: user }
}

// 後台 - 聊天頁設定對話顧客c_info
export function setc_info(info) {
    return { type: SETCINFO, value: info }
}

