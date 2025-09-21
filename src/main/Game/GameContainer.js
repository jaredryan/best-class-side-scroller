import React, { useState, useEffect } from 'react';
import Game from './Game';
import Instructions from '../Instructions';
import Levels from '../Levels';

const GameContainer = (props) => {
    const [timer, setTimer] = useState(0);
    const [isRunning, setIsRunning] = useState('unstarted');
    const [hasWon, setHasWon] = useState(false);
    const [shotsFired, setShotsFired] = useState(0);
    const [score, setScore] = useState(0);

    useEffect(() => {
        const t = setInterval(() => {
            setTimer(prev => {
                if (isRunning === true) return prev + 20;
                return prev;
            })
        }, 20);
        return () => clearInterval(t);
    }, [isRunning]);

    const hasWonHandler = () => {
        setHasWon(true);
        setIsRunning(false);
    };

    const hasLostHandler = () => {
        setHasWon(false);
        setIsRunning(false);
    };

    const startGame = () => {
        props.setHasPlayed(true);
        setIsRunning(true);
    };

    const restartGame = () => {
        props.resetLevel();
        setTimer(0);
        setIsRunning(true);
        setHasWon(false);
        setShotsFired(0);
        setScore(0);
    };

    const shoot = () => {
        setShotsFired(prev => prev + 1);
    };

    const calculateScore = (health) => {
        let s = 53000 - timer;
        if (s < 0) s = 0;
        s += 30000 + (1000 * health) - (100 * shotsFired);
        setScore(s);
    };

    let displayComponent;
    if (!props.hasPlayed) {
        displayComponent = (
            <div className="gameWithInstructions">
                <div className="instructionsContainer">
                    <Instructions />
                    <Levels setLevel={props.setLevel} level={props.level} />
                </div>
                <button onClick={startGame} className="start">START GAME</button>
            </div>
        )
    } else if (isRunning === true) {
        displayComponent = (
            <Game
                timer={timer}
                hasWon={hasWonHandler}
                hasLost={hasLostHandler}
                startGame={startGame}
                useWave={props.useWave}
                shoot={shoot}
                calculateScore={calculateScore}
                level={props.level}
                currentScore={score}
            />
        )
    } else if (hasWon) {
        displayComponent = (
            <div className="gameResults">
                <h1>You Won!</h1>
                <div className="scoreResults">
                    <h2>Score</h2>
                    <h3>{score}</h3>
                </div>
                <Levels setLevel={props.setLevel} level={props.level} />
                <button onClick={restartGame} className="start">PLAY AGAIN</button>
            </div>
        )
    } else if (!hasWon) {
        displayComponent = (
            <div className="gameResults">
                <h1>Game Over</h1>
                <Levels setLevel={props.setLevel} level={props.level} />
                <button onClick={restartGame} className="start">PLAY AGAIN</button>
            </div>
        )
    }

    return (
        <div className="gamePage">
            {displayComponent}
        </div>
    )
}

export default GameContainer;
