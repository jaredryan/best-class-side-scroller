import React from 'react';
import ScoreContainer from "./ScoreContainer";

function ScoreList(props) {
    const scores = props.scores.map(score => {
        return (
            <ScoreContainer
                key={score._id}
                id={score._id}
                score={score}/>
        )
    })

    return (
        <div>
            {scores}
        </div>
    )
}

export default ScoreList;
