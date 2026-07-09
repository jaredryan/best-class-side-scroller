import React from 'react';

const difficulties = [
    { level: 1, label: 'Mild', blurb: 'A warm-up food fight.', colorClass: 'mild' },
    { level: 2, label: 'Spicy', blurb: 'More snacks. More splatter.', colorClass: 'spicy' },
    { level: 3, label: 'Extra Crispy', blurb: 'Full kitchen chaos.', colorClass: 'extra-crispy' },
];

const Levels = (props) => {
    return (
        <div className="levelButtons card-sticker">
            <div className="difficultyContainer">
                <div className="instructionHeading difficulty">Select Difficulty</div>
                <div className="buttons">
                    {difficulties.map(({ level, label, blurb, colorClass }) => (
                        <button
                            key={level}
                            type="button"
                            aria-pressed={props.level === level}
                            onClick={() => props.setLevel(level)}
                            className={`levelBox ${colorClass}${props.level === level ? ' highlighted' : ''}`}
                        >
                            <div className="levelLabel">{label}</div>
                            <div className="levelBlurb">{blurb}</div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Levels
