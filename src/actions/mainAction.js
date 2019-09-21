import React, { useCallback } from 'react';

const ADD_TODOLIST = 'ADD_TODOLIST';
export const addTodoListAction = (listName) => {
    return ({
        type: 'ADD_TODOLIST',
        value: { listName, }
    });
}

const CHANGEWELCOMEPAGESHOWING = 'CHANGEWELCOMEPAGESHOWING';
export const changeWelcomePageShowing = (trueOrFalse) => {
    return ({
        type: 'CHANGEWELCOMEPAGESHOWING',
        value: {trueOrFalse}
    })
}