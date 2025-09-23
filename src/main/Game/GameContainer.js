import React, { useState, useEffect, useRef } from 'react';
import Game, { verticalSize, horizontalSize, maxVerticalSize, maxHorizontalSize } from './Game';
import Instructions from '../Instructions';
import Levels from '../Levels';
import SizeAndOrientationWrapper from '../Components/SizeAndOrientationWrapper'

const GameContainer = (props) => {
    const [timer, setTimer] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [hasWon, setHasWon] = useState(false);
    const [shotsFired, setShotsFired] = useState(0);
    const [successfulShotsFired, setSuccessfulShotsFired] = useState(0);
    const [playerLocation, setPlayerLocation] = useState(155);
    const [playerHealth, setPlayerHealth] = useState(10);
    const [enemies, setEnemies] = useState([]);
    const [playerBullets, setPlayerBullets] = useState([]);
    const [enemyBullets, setEnemyBullets] = useState([]);

    const wrapperRef = useRef(null);
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

    useEffect(() => { window.scrollTo(0, 0) }, [props.hasPlayed, hasWon, isRunning])

    const hasWonHandler = () => {
        setHasWon(true);
        setIsRunning(false);
    };

    const hasLostHandler = () => {
        setHasWon(false);
        setIsRunning(false);
    };

    const resetGameAndStart = () => {
        setTimer(0);
        setIsRunning(true);
        setIsPaused(false);
        setHasWon(false);
        setShotsFired(0);
        setSuccessfulShotsFired(0);
        setPlayerHealth(10);
        setEnemies([]);
        setPlayerBullets([]);
        setEnemyBullets([]);
        if (wrapperRef.current) wrapperRef.current.requestFullscreen();
    }

    const startGame = () => {
        props.setHasPlayed(true);
        resetGameAndStart()
    };

    const restartGame = () => {
        props.resetLevel();
        resetGameAndStart();
    };

    const shoot = () => {
        setShotsFired(prev => prev + 1);
    };

    const hit = () => {
        setSuccessfulShotsFired(prev => prev + 1);
    }

    const calculateCurrentScore = () => {
        // 50000 starting time bonus, lowers per ms spent in round
        let timerBonus = 53000 - timer;
        if (timerBonus < 0) timerBonus = 0;

        // 10 hp * 1000 = 10000 possible health bonus, -1000 per hit taken
        const healthBonus = playerHealth * 1000

        // 10000 accuracy bonus, -100 per % below 100
        let accuracyBonus = 10000
        if (shotsFired) accuracyBonus = 10000 * successfulShotsFired / shotsFired

        return Math.round(timerBonus + healthBonus + accuracyBonus)
    };

    const calculateFinalScore = () => {
        let levelBonus = 0
        if (props.level === 1) levelBonus = 20000
        if (props.level === 2) levelBonus = 40000
        if (props.level === 3) levelBonus = 60000

        return levelBonus + calculateCurrentScore()
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
    } else if (isRunning) {
        displayComponent = (
            <SizeAndOrientationWrapper
                ref={wrapperRef}
                horizontalSize={horizontalSize}
                verticalSize={verticalSize}
                maxHorizontalSize={maxHorizontalSize}
                maxVerticalSize={maxVerticalSize}
                onPause={() => {
                    setIsPaused(true);
                    if (pauseFn.current) pauseFn.current();
                }}
                onResume={() => {
                    setIsPaused(false);
                    if (resumeFn.current) resumeFn.current();
                }}
            >
                {({ scale, gameContainerStyleWidth, wrapperRef }) => (
                    <Game
                        scale={scale}
                        gameContainerStyleWidth={gameContainerStyleWidth}
                        wrapperRef={wrapperRef}
                        isPaused={isPaused}
                        timer={timer}
                        hasWon={hasWonHandler}
                        hasLost={hasLostHandler}
                        startGame={startGame}
                        useWave={props.useWave}
                        shoot={shoot}
                        hit={hit}
                        level={props.level}
                        currentScore={calculateCurrentScore()}
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
                )}
            </SizeAndOrientationWrapper>
        )
    } else if (hasWon) {
        displayComponent = (
            <div className="gameResults">
                <h1>You Won!</h1>
                <div className="scoreResults">
                    <h2>Score</h2>
                    <h3>{calculateFinalScore()}</h3>
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
