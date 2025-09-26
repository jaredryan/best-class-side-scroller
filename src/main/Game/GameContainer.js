import React, { useState, useEffect, useRef } from 'react';
import Game, { verticalSize, horizontalSize, maxVerticalSize, maxHorizontalSize } from './Game';
import Instructions from '../Instructions';
import Levels from '../Levels';
import Level1 from '../Data/1'
import Level2 from '../Data/2'
import Level3 from '../Data/3'
import SizeAndOrientationWrapper from '../Components/SizeAndOrientationWrapper'

const playerMaxHealth = 10

const GameContainer = () => {
    const [level, setLevel] = useState(1);
    const [hasPlayed, setHasPlayed] = useState(false);
    const [timer, setTimer] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [hasWon, setHasWon] = useState(false);
    const [shotsFired, setShotsFired] = useState(0);
    const [successfulShotsFired, setSuccessfulShotsFired] = useState(0);
    const [playerLocation, setPlayerLocation] = useState(155);
    const [playerHealth, setPlayerHealth] = useState(playerMaxHealth);
    const [playerState, setPlayerState] = useState([]);
    const [enemies, setEnemies] = useState([]);
    const [playerBullets, setPlayerBullets] = useState([]);
    const [enemyBullets, setEnemyBullets] = useState([]);

    const pageWrapperRef = useRef(null);
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

    useEffect(() => { window.scrollTo(0, 0) }, [hasWon, isRunning])

    const getCurrentLevelData = () => {
        if (level === 2) return Level2
        if (level === 3) return Level3
        return Level1
    }

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
        setPlayerHealth(playerMaxHealth);
        setEnemies([]);
        setPlayerBullets([]);
        setEnemyBullets([]);

        setTimeout(() => pageWrapperRef?.current?.requestFullscreen(), 200)
    }

    const startGame = () => {
        setHasPlayed(true);
        resetGameAndStart()
    };

    const restartGame = () => {
        getCurrentLevelData()?.resetLevel();
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
        if (level === 1) levelBonus = 20000
        if (level === 2) levelBonus = 40000
        if (level === 3) levelBonus = 60000

        return levelBonus + calculateCurrentScore()
    };

    let displayComponent;
    if (!hasPlayed) {
        displayComponent = (
            <div className="gameWithInstructions">
                <div className="instructionsContainer">
                    <Instructions />
                    <Levels setLevel={setLevel} level={level} />
                </div>
                <button onClick={startGame} className="start">START GAME</button>
            </div>
        )
    } else if (isRunning) {
        displayComponent = (
            <SizeAndOrientationWrapper
                ref={pageWrapperRef}
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
                {({ scale, gameContainerStyleWidth, wrapperRef, addGutters }) => (
                    <Game
                        scale={scale}
                        addGutters={addGutters}
                        gameContainerStyleWidth={gameContainerStyleWidth}
                        wrapperRef={wrapperRef}
                        isPaused={isPaused}
                        timer={timer}
                        hasWon={hasWonHandler}
                        hasLost={hasLostHandler}
                        startGame={startGame}
                        useWave={getCurrentLevelData()?.useWave}
                        shoot={shoot}
                        hit={hit}
                        level={level}
                        currentScore={calculateCurrentScore()}
                        playerLocation={playerLocation}
                        setPlayerLocation={setPlayerLocation}
                        playerHealth={playerHealth}
                        playerMaxHealth={playerMaxHealth}
                        setPlayerHealth={setPlayerHealth}
                        enemies={enemies}
                        setEnemies={setEnemies}
                        playerBullets={playerBullets}
                        setPlayerBullets={setPlayerBullets}
                        enemyBullets={enemyBullets}
                        setEnemyBullets={setEnemyBullets}
                        playerState={playerState}
                        setPlayerState={setPlayerState}
                    />
                )}
            </SizeAndOrientationWrapper>
        )
    } else if (hasWon) {
        displayComponent = (
            <div className="gameResults">
                <h1>You Won!</h1>
                <div className="scoreResults">
                    <h2 className="emphasis">Score</h2>
                    <div className="explainScore">
                        <h3><b>Health:</b>{`1000 * HP = ${playerHealth * 1000}`}</h3>
                        <h3><b>Accuracy:</b>{`10000 * Hits / Shots = ${Math.round(10000 * successfulShotsFired / shotsFired)}`}</h3>
                        <h3><b>Time:</b>{`50000 - 1000 * Seconds = ${Math.round(53000 - timer)}`}</h3>
                        <h3><b>Level:</b>{`20000 * Level # = ${level * 20000}`}</h3>
                    </div>
                    <h2 className="emphasis"><b>Total Score</b></h2>
                    <h3 className="finalScore">{calculateFinalScore()}</h3>
                </div>
                <Levels setLevel={setLevel} level={level} />
                <button onClick={restartGame} className="start">PLAY AGAIN</button>
            </div>
        )
    } else if (!hasWon) {
        displayComponent = (
            <div className="gameResults">
                <h1>Game Over</h1>
                <Levels setLevel={setLevel} level={level} />
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
