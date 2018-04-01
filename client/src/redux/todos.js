import axios from 'axios';

axios.interceptors.request.use(config => {
    const token = localStorage.token;
    config.headers.Authorization = `Bearer ${token}`;
    return config;
})


const SET_TODOS = "SET_TODOS";
const todoUrl = "/api/todo/";

///////////////////////////
// Todos Action Creators //
///////////////////////////
function setTodos(todos) {
    return {
        type: SET_TODOS,
        todos
    }
}

export function loadTodos() {
    return dispatch => {
        axios.get(todoUrl)
            .then(response => {
                dispatch(setTodos(response.data));
            })
            .catch(err => {
                console.error(err);
            })
    }
}

export function addTodo(todo) {
    return dispatch => {
        axios.post(todoUrl, todo)
            .then(response => {
                dispatch(loadTodos());
            })
            .catch(err => {
                console.error(err);
            })
    }
}

export function editTodo(id, todo) {
    return dispatch => {
        axios.put(todoUrl + id, todo)
            .then(response => {
                dispatch(loadTodos());
            })
            .catch(err => {
                console.error(err);
            })
    }
}

export function deleteTodo(id){
    return dispatch => {
        axios.delete(todoUrl + id)
            .then(response => {
                dispatch(loadTodos());
            })
            .catch(err => {
                console.error(err);
            })
    }
}


///////////////////
// Todos Reducer //
///////////////////
const initialTodos = [];

export default function todosReducer(todos = initialTodos, action) {
    switch (action.type) {
        case "SET_TODOS":
            return [...action.todos]
        case "LOGOUT":
            return initialTodos;
        default:
            return todos
    }
}
