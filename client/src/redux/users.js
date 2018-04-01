import axios from 'axios';

axios.interceptors.request.use(config => {
    const token = localStorage.token;
    config.headers.Authorization = `Bearer ${token}`;
    return config;
})

const userUrl = "/api/user/";

///////////////////////////
// Users Action Creators //
///////////////////////////
function setUsers(users) {
    return {
        type: "SET_USERS",
        users
    }
}

export function loadUsers() {
    return dispatch => {
        axios.get(userUrl)
            .then(response => {
                dispatch(setUsers(response.data));
            })
            .catch(err => {
                console.error(err);
            })
    }
}

export function addUser(user) {
    return dispatch => {
        axios.post(userUrl, user)
            .then(response => {
                dispatch(loadUsers());
            })
            .catch(err => {
                console.error(err);
            })
    }
}

export function editUser(id, user) {
    return dispatch => {
        axios.put(userUrl + id, user)
            .then(response => {
                dispatch(loadUsers());
            })
            .catch(err => {
                console.error(err);
            })
    }
}

export function deleteUser(id){
    return dispatch => {
        axios.delete(userUrl + id)
            .then(response => {
                dispatch(loadUsers());
            })
            .catch(err => {
                console.error(err);
            })
    }
}


///////////////////
// Users Reducer //
///////////////////
const initialUsers = [];

export default function usersReducer(users = initialUsers, action) {
    switch (action.type) {
        case "SET_USERS":
            return [...action.users]
        case "LOGOUT":
            return initialUsers;
        default:
            return users
    }
}
