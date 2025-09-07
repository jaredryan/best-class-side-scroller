import React from 'react';
import { Card, CardText } from 'material-ui/Card';

const Instructions = () => {
    return (
        <Card className="instructions">
            <CardText className="instructionsText">
                <h4 className="instructionHeading">Controls</h4>
                <div>
                    <p className="instructionBody">Fly up and down with the arrow keys.</p>
                    <p className="instructionBody">Shoot seeds using the space bar to send the invaders packing.</p>
                </div>
                <h4 className="instructionHeading">Good Luck!</h4>
            </CardText>
        </Card>
    )
    
}

export default Instructions
