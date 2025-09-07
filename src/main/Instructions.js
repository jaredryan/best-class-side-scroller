import React from 'react';
import { Card, CardText } from 'material-ui/Card';

const Instructions = () => {
    return (
        <Card className="instructions">
            <CardText className="instructionsText">
                <h4 className="instructionHeading">Controls</h4>
                <p className="instructionBody">You, the bird on the left, shoot seeds to fight off the invaders coming from the right.</p>
                <div>
                    <div className="instructionControl">
                        <p className="instructionBody"><b>Up / Down Arrow Keys</b></p>
                        <p className="instructionBody">Move</p>
                    </div>
                    <div className="instructionControl">
                        <p className="instructionBody"><b>Space Bar</b></p>
                        <p className="instructionBody">Shoot</p>
                    </div>
                </div>
                <h4 className="instructionHeading black">Good luck, soldier.</h4>
            </CardText>
        </Card>
    )
    
}

export default Instructions
