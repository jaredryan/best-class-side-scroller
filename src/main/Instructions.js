import React from 'react';
import { Card, CardText } from 'material-ui/Card';

const Instructions = () => {
    return (
        <Card className="instructions">
            <CardText className="instructionsText">
                <h4 className="instructionHeading">Controls</h4>
                <div>
                    <p className="instructionBody"><b>Up / Down Arrow Keys</b>: move the bird on the left</p>
                    <p className="instructionBody"><b>Space Bar</b>: the bird shoots seeds to damage the invaders on the right</p>
                </div>
                <h4 className="instructionHeading">Good Luck!</h4>
            </CardText>
        </Card>
    )
    
}

export default Instructions
