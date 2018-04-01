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

export function loadScores() {
    return dispatch => {
        axios.get(scoreUrl)
            .then(response => {
                dispatch(setScores(response.data));
            })
            .catch(err => {
                console.error(err);
            })
    }
}

export function addScore(score) {
    return dispatch => {
        axios.post(scoreUrl, score)
            .then(response => {
                dispatch(loadScores());
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
const initialScores = [];

export default function scoresReducer(scores = initialScores, action) {
    switch (action.type) {
        case "SET_SCORES":
            return [...action.scores]
        case "LOGOUT":
            return initialScores;
        default:
            return scores
    }
}
