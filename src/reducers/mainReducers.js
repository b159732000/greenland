const ADD_TODOLIST = 'ADD_TODOLIST';
const CHANGEWELCOMEPAGESHOWING = 'CHANGEWELCOMEPAGESHOWING';

const initState = {
    todoList: ['first'],
    welcomePageIsShowing: true,
};

const mainReducers = (state = initState, action) => {
    switch (action.type) {
        // 增加代辦事項todoList
        case ADD_TODOLIST: {
            // 將更改前的todoList放入暫存變數tempTodo中
            const tempTodo = state.todoList.map(list => list);
            // 將新的todo項目推送至暫存變數tempTodo數列中
            tempTodo.push(action.value.listName);
            // 將更改後的tempTodo放回store的todoList
            return {
                ...state,
                todoList: tempTodo,
            };
        };
        case CHANGEWELCOMEPAGESHOWING: {
            return {
                ...state,
                welcomePageIsShowing: action.value.trueOrFalse
            }
        }
        default:
            return state;
    }
}

export default mainReducers;