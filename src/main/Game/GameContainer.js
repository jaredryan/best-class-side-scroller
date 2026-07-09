import React, { useState, useEffect, useRef } from 'react';
import Game, { verticalSize, horizontalSize, maxVerticalSize, maxHorizontalSize } from './Game';
import Instructions from '../Instructions';
import Levels from '../Levels';
import Level1 from '../Data/1'
import Level2 from '../Data/2'
import Level3 from '../Data/3'
import SizeAndOrientationWrapper from '../Components/SizeAndOrientationWrapper'
import { calculateFinalScore } from '../scoring'
import HeroToaster from '../Components/Sprites/HeroToaster'

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

    if (!hasPlayed) {
        setHasWon(true)
        setHasPlayed(true)
    }

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

    let displayComponent;
    if (!hasPlayed) {
        displayComponent = (
            <div className="gameWithInstructions">
                <div className="instructionsContainer">
                    <Instructions />
                    <Levels setLevel={setLevel} level={level} />
                </div>
                <button onClick={startGame} className="btn-chunky start">ENTER THE KITCHEN</button>
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
        const report = calculateFinalScore({
            playerHealth,
            shotsFired,
            successfulShotsFired,
            timer,
            level,
        });
        displayComponent = (
            <div className="gameResults">
                <h1>Kitchen Saved!</h1>
                <div className="instructionsContainer">
                    <div className="scoreResults card-sticker">
                        <h2 className="emphasis">Kitchen Report</h2>
                        <div className="explainScore">
                            <h3><b>Health Bonus:</b>{`${playerHealth} HP × 1000 = ${report.healthBonus}`}</h3>
                            <h3><b>Snack Accuracy:</b>{`${Math.round(report.accuracyPercent * 100)}% = ${report.accuracyBonus}`}</h3>
                            <h3><b>Rush Bonus:</b>{`${report.elapsedSeconds}s = ${report.rushBonus}`}</h3>
                            <h3><b>Spice Bonus:</b>{`Level ${level} = ${report.spiceBonus}`}</h3>
                        </div>
                        <h2 className="emphasis"><b>Final Tip</b></h2>
                        <h3 className="finalScore">{report.finalScore}</h3>
                        <div className="heroToasterStamp">
                            <div className="heroToasterStampIcon">
                                <HeroToaster />
                            </div>
                            <div className="stamp">Approved by Hero Toaster</div>
                        </div>
                    </div>
                    <Levels setLevel={setLevel} level={level} />
                </div>
                <button onClick={restartGame} className="btn-chunky start">PLAY AGAIN</button>
            </div>
        )
    } else if (!hasWon) {
        displayComponent = (
            <div className="gameResults">
                <h1>Kitchen Overrun!</h1>
                <p className="loseCopy">
                    The snacks are getting cocky. Grab another handful of peas and show
                    them who's head chef.
                </p>
                <Levels setLevel={setLevel} level={level} />
                <button onClick={restartGame} className="btn-chunky start">TRY AGAIN</button>
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
