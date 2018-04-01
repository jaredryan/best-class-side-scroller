import React from 'react';

function Score(props) {
    return (
        <div>
            <h3>{props.score.number}</h3>
            <h4>{props.score.level}</h4>
            <button onClick={props.handleEdit}>Edit</button>
            <button onClick={props.handleRemove}>X</button>
        </div>
    )
}

export default Score;
