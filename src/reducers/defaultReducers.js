const initialState = {
    currentPageInNavigationLevel: "HomePage",    //目前所在頁面 (導行列層級)
}

export default function defaultReducers(state = initialState, action) {
    switch(action.type) {
        // 更新目前所在頁面 (導行列層級)
        case 'CHANGECURRENTPAGEINNAVIGATIONLEVEL':
            return {
                ...state,
                currentPageInNavigationLevel: action.value,
            }
        default:
            return state
    }
}