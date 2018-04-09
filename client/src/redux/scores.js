import axios from 'axios';

axios.interceptors.request.use(config => {
    const token = localStorage.token;
    config.headers.Authorization = `Bearer ${token}`;
    return config;
})

const scoreUrl = "/api/score/";
///////////////////////////
// Scores Action Creators //
///////////////////////////
function setScores(scores) {
    return {
        type: "SET_SCORES",
        scores
    }
}

function setMyScores(scores) {
    return {
        type: "SET_MY_SCORES",
        scores
    }
}

export function loadScores() {
    return dispatch => {
        axios.get(scoreUrl + "all")
            .then(response => {
                dispatch(setScores(response.data));
            })
            .catch(err => {
                console.error(err);
            })
    }
}

export function loadMyScores() {
    return dispatch => {
        axios.get(scoreUrl)
            .then(response => {
                dispatch(setMyScores(response.data));
            })
            .catch(err => {
                console.error(err);
            })
    }
}

export function addScore(number, level) {
    return dispatch => {
        axios.post(scoreUrl, {number, level})
            .then(response => {
                dispatch(loadScores());
                dispatch(loadMyScores());
            })
            .catch(err => {
                console.error(err);
            })
    }
}

export function editScore(id, score) {
    return dispatch => {
        axios.put(scoreUrl + id, score)
            .then(response => {
                dispatch(loadScores());
            })
            .catch(err => {
                console.error(err);
            })
    }
}

export function deleteScore(id){
    return dispatch => {
        axios.delete(scoreUrl + id)
            .then(response => {
                dispatch(loadScores());
            })
            .catch(err => {
                console.error(err);
            })
    }
}


///////////////////
// Scores Reducer //
///////////////////
const initialScores = {
    allScores: [],
    myScores: []
};

export default function scoresReducer(scores = initialScores, action) {
    switch (action.type) {
        case "SET_SCORES":
            return {
                ...scores,
                allScores: action.scores
            }
        case "SET_MY_SCORES":
            return {
                ...scores,
                myScores: action.scores
            }
        case "LOGOUT":
            return initialScores;
        default:
            return scores
    }
}
