import React from 'react';

function Score(props) {
    return (
        <div className="score">
            <h3><span className="numberScore">{props.place}.</span> <span className="userScore">{props.score.username}</span> {props.score.number}</h3>
        </div>
    )
}

export default Score;
