import React from 'react';

const Instructions = () => {
    return (
        <div className="instructions card-sticker">
            <div className="instructionsText">
                <h4 className="instructionHeading">Kitchen Briefing</h4>
                <p className="instructionBody standalone">
                    You're the Tiny Chef. Fire peas at the snacks storming in from the right.
                </p>
                <div className="controlContainer">
                    <div className="instructionControl">
                        <p className="instructionBody"><b>Move</b></p>
                        <p className="instructionBody">Mouse / touch left side</p>
                    </div>
                    <div className="instructionControl">
                        <p className="instructionBody"><b>Fire</b></p>
                        <p className="instructionBody">Space / click / touch right side</p>
                    </div>
                    <div className="instructionControl">
                        <p className="instructionBody"><b>Combo zone</b></p>
                        <p className="instructionBody">Middle area moves and fires</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Instructions
