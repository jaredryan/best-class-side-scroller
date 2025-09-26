import React from 'react';

const Levels = (props) => {
    return (
        <div className="levelButtons">
            <div className="difficultyContainer">
                <div className="difficulty">Select Difficulty</div>
                <div className="buttons">
                    <div onClick={() => props.setLevel(1)} className={`levelBox${props.level === 1 ? ' highlighted' : ''}`}>
                        <div className="level">1</div>
                    </div>
                    <div onClick={() => props.setLevel(2)} className={`levelBox${props.level === 2 ? ' highlighted' : ''}`}>
                        <div className="level">2</div>
                    </div>
                    <div onClick={() => props.setLevel(3)} className={`levelBox${props.level === 3 ? ' highlighted' : ''}`}>
                        <div className="level">3</div>
                    </div>
                </div>
            </div>
        </div>
    )
    
}

export default Levels