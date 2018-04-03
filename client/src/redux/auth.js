import axios from 'axios';

const initialState = {
    user: {
        username: "",
        admin: false,
        _id: "",
        email: "",
        status: ""
    },
    authErrCode: {
        signup: "",
        signin: ""
    },
    isAuthenticated: false
}

export function signup(userInfo){
    return dispatch => {
        axios.post("/auth/signup", userInfo)
            .then(response => {
                const {token, user} = response.data;
                localStorage.token = token;
                localStorage.user = JSON.stringify(user);
                dispatch(authenticate(user));
            })
            .catch(err => {
                console.error(err);
                dispatch(signupError("signup", err.response.status));
            })
    }
}

export function login(credentials){
    return dispatch => {
        axios.post('/auth/login', credentials)
            .then(response => {
                const {token, user} = response.data;
                localStorage.token = token
                localStorage.user = JSON.stringify(user);
                dispatch(authenticate(user));
            })
            .catch((err) => {
                console.error(err);
                dispatch(signupError("login", err.response.status));
            });
    }
}

export function verify() {
    return (dispatch) => {
        axios.get("/profile/")
            .then((response) => {
                let { user } = response.data;
                dispatch(authenticate(user));
            })
            .catch((err) => {
                console.error(err);
            })
    }
}

export function logout(){
    delete localStorage.token;
    delete localStorage.user;
    return {
        type: "LOGOUT"
    }
}

export function authenticate(user) {
    return {
        type: "AUTHENTICATE",
        user
    }
}

function signupError(key, errCode) {
    return {
        type: "SIGNUP_ERROR",
        key,
        errCode
    }
}


function reducer(state = initialState, action){
    switch(action.type){
        case "AUTHENTICATE":
            return {
                ...state,
                ...action.user,
                isAuthenticated: true,
                authErrCode: {
                    signup: "",
                    signin: ""
                }
            }
        case "LOGOUT":
            return initialState;
        case "SIGNUP_ERROR":
           return {
               ...state,
               authErrCode: {
                   ...state.authErrCode,
                   [action.key]: action.errCode
               }
           }
        default:
            return state;
    }
}

export default reducer;
