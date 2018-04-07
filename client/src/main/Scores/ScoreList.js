import React from 'react';
import ScoreContainer from "./ScoreContainer";

function ScoreList(props) {
    const scores = props.scores.map((score, index) => {
        return (
            <ScoreContainer
                key={score._id}
                id={score._id}
                place={index + 1}
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
