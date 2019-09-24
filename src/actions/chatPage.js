export const SETMESSAGELIST = 'SETMESSAGELIST';
export const PUSHMESSAGE = 'PUSHMESSAGE';
export const SETCLIENTINFO = 'SETCLIENTINFO'

export function setMessagelist(list) {
    return { type: SETMESSAGELIST, value: list }
}

export function pushMessage(message) {
    return { type: PUSHMESSAGE, value: message }
}

export function setClientInfoAction(info) {
    return { type: SETCLIENTINFO, value: info }
}

export function setSocket(socket) {
    return { type: 'SETSOCKET', value: socket }
}
