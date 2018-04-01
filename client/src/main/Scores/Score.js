import React from 'react';

function Score(props) {
    return (
        <div>
            <h3>{props.score.title}</h3>
            <label htmlFor="">Completed:</label>
            <input
                onChange={props.handleCompleted}
                type="checkbox"
                checked={props.score.completed}/>
            <button onClick={props.handleRemove}>X</button>
        </div>
    )
}

export default Score;
