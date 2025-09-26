import React from 'react';

const Instructions = () => {
    return (
        <div className="instructions">
            <div className="instructionsText">
                <h4 className="instructionHeading">Controls</h4>
                <p className="instructionBody standalone">You, the bird on the left, shoot seeds to fight off the invaders coming from the right.</p>
                <div className="controlContainer">
                    <div>
                        <h5>Keyboard</h5>
                        <div className="instructionControl">
                            <p className="instructionBody"><b>Move up / down</b></p>
                            <p className="instructionBody">Mouse</p>
                        </div>
                        <div className="instructionControl">
                            <p className="instructionBody"><b>Shoot (hold to auto-fire)</b></p>
                            <p className="instructionBody">Space Bar / Click</p>
                        </div>
                    </div>
                    <div>
                        <h5>Touch Screen</h5>
                        <div className="instructionControl">
                            <p className="instructionBody"><b>Move up / down</b></p>
                            <p className="instructionBody">Tap / Drag on left</p>
                        </div>
                        <div className="instructionControl">
                            <p className="instructionBody"><b>Shoot (hold to auto-fire)</b></p>
                            <p className="instructionBody">Tap / Hold on right</p>
                        </div>
                        <p className="instructionBody standalone"><b>Tip:</b>Tap / Drag / Hold in the middle of the screen will both move and shoot!</p>
                    </div>
                </div>
                <h4 className="instructionHeading emphasis">Good luck, soldier.</h4>
            </div>
        </div>
    )
    
}

export default Instructions
