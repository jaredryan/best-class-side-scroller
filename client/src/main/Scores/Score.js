import React from 'react';

function Score(props) {
    return (
        <div className="score">
            <h3><span>{props.score.username}</span> {props.score.number}</h3>
        </div>
    )
}

export default Score;
