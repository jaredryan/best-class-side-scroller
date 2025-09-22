import React, { useState, useEffect, useRef } from 'react';
import Game from './Game';
import Instructions from '../Instructions';
import Levels from '../Levels';
import OrientationWrapper from '../Components/OrientationWrapper'

const GameContainer = (props) => {
    const [timer, setTimer] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [hasWon, setHasWon] = useState(false);
    const [shotsFired, setShotsFired] = useState(0);
    const [score, setScore] = useState(0);
    const [playerLocation, setPlayerLocation] = useState(155);
    const [playerHealth, setPlayerHealth] = useState(10);
    const [enemies, setEnemies] = useState([]);
    const [playerBullets, setPlayerBullets] = useState([]);
    const [enemyBullets, setEnemyBullets] = useState([]);
    const pauseFn = useRef(null);
    const resumeFn = useRef(null);

    useEffect(() => {
        const t = setInterval(() => {
            setTimer(prev => {
                if (isRunning && !isPaused) return prev + 20;
                return prev;
            })
        }, 20);
        return () => clearInterval(t);
    }, [isRunning, isPaused]);

    const hasWonHandler = () => {
        setHasWon(true);
        setIsRunning(false);
    };

    const hasLostHandler = () => {
        setHasWon(false);
        setIsRunning(false);
    };

    const resetGameStatus = () => {
        setTimer(0);
        setIsRunning(true);
        setIsPaused(false);
        setHasWon(false);
        setShotsFired(0);
        setScore(0);
        setPlayerHealth(10);
        setEnemies([]);
        setPlayerBullets([]);
        setEnemyBullets([]);
    }

    const startGame = () => {
        props.setHasPlayed(true);
        resetGameStatus()
    };

    const restartGame = () => {
        props.resetLevel();
        resetGameStatus();
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
            <OrientationWrapper
                onPause={() => {
                    setIsPaused(true);
                    if (pauseFn.current) pauseFn.current();
                }}
                onResume={() => {
                    setIsPaused(false);
                    if (resumeFn.current) resumeFn.current();
                }}
            >
                <Game
                    isPaused={isPaused}
                    timer={timer}
                    hasWon={hasWonHandler}
                    hasLost={hasLostHandler}
                    startGame={startGame}
                    useWave={props.useWave}
                    shoot={shoot}
                    calculateScore={calculateScore}
                    level={props.level}
                    currentScore={score}
                    playerLocation={playerLocation}
                    setPlayerLocation={setPlayerLocation}
                    playerHealth={playerHealth}
                    setPlayerHealth={setPlayerHealth}
                    enemies={enemies}
                    setEnemies={setEnemies}
                    playerBullets={playerBullets}
                    setPlayerBullets={setPlayerBullets}
                    enemyBullets={enemyBullets}
                    setEnemyBullets={setEnemyBullets}
                />
            </OrientationWrapper>
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
