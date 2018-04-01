import { combineReducers, createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";

import users from "./users";
import user from './auth'

const reducer = combineReducers({
    user,
    auth
});

export default createStore(
    reducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
    applyMiddleware(thunk)
);
