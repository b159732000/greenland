import { combineReducers } from 'redux'
import mainReducers from './mainReducers.js'

// 前台
import chat from './chat.js'

// 後台
import defaultReducers from './defaultReducers.js'

export default combineReducers({
    mainReducers,
    chat,
    defaultReducers
})