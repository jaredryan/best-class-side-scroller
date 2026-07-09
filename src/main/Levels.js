import React from 'react';

const difficulties = [
    { level: 1, label: 'Mild', blurb: 'A warm-up food fight.' },
    { level: 2, label: 'Spicy', blurb: 'More snacks. More splatter.' },
    { level: 3, label: 'Extra Crispy', blurb: 'Full kitchen chaos.' },
];

const Levels = (props) => {
    return (
        <div className="levelButtons card-sticker">
            <div className="difficultyContainer">
                <div className="difficulty">Select Difficulty</div>
                <div className="buttons">
                    {difficulties.map(({ level, label, blurb }) => (
                        <div
                            key={level}
                            onClick={() => props.setLevel(level)}
                            className={`levelBox${props.level === level ? ' highlighted' : ''}`}
                        >
                            <div className="levelNumber">{level}</div>
                            <div className="levelLabel">{label}</div>
                            <div className="levelBlurb">{blurb}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Levels
