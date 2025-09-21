import React, { useState, useEffect, useRef } from "react";

const Game = (props) => {
  const [playerLocation, setPlayerLocation] = useState(155);
  const [verticalSize] = useState(360);
  const [horizontalSize] = useState(640);
  const [playerHeight] = useState(35);
  const [playerWidth] = useState(50);
  const [playerHealth, setPlayerHealth] = useState(10);
  const [currentEnemies, setCurrentEnemies] = useState([]);
  const [playerBullets, setPlayerBullets] = useState([]);
  const [enemyBullets, setEnemyBullets] = useState([]);
  const [scale, setScale] = useState(1);
  const [gameContainerStyleWidth, setGameContainerStyleWidth] = useState({});

  const maxScale = 1.5;
  const maxVerticalSize = verticalSize * maxScale;
  const maxHorizontalSize = horizontalSize * maxScale;

  const isDragging = useRef(false);
  const shootInterval = useRef(null);
  const timeoutsRef = useRef([]);
  const delayBetweenShots = useRef(200);
  const lastShotTime = useRef(0);
  const gameRef = useRef(null);
  const isMountedRef = useRef(true);
  const timerRef = useRef(props.timer);
  const currentEnemiesRef = useRef(currentEnemies);
  const playerBulletsRef = useRef(playerBullets);
  const enemyBulletsRef = useRef(enemyBullets);
  const playerHealthRef = useRef(playerHealth);
  const playerLocationRef = useRef(playerLocation);
  const idRef = useRef(1);
  // refs to latest parent callbacks to avoid stale closures inside the loop
  const calculateScoreRef = useRef(props.calculateScore);
  const shootRef = useRef(props.shoot);
  const hasWonRef = useRef(props.hasWon);
  const hasLostRef = useRef(props.hasLost);

  // Helper: focus game div
  const focusDiv = () => {
    if (gameRef.current) {
      gameRef.current.focus();
    }
  };

  const enterFullscreen = () => {
    const el = gameRef.current;
    if (!el) return;

    if (el.requestFullscreen) {
      el.requestFullscreen();
    } else if (el.webkitRequestFullscreen) {
      el.webkitRequestFullscreen(); // Safari
    } else if (el.msRequestFullscreen) {
      el.msRequestFullscreen(); // IE/Edge
    }
  };

  // const exitFullscreen = () => {
  //   if (document.exitFullscreen) {
  //     document.exitFullscreen();
  //   } else if (document.webkitExitFullscreen) {
  //     document.webkitExitFullscreen();
  //   } else if (document.msExitFullscreen) {
  //     document.msExitFullscreen();
  //   }
  // };

  // Update scale on mount and window resize
  useEffect(() => {
    const updateScale = () => {
      // max scale to fill screen
      let scaleWidth = Math.min(window.innerWidth, maxHorizontalSize) / horizontalSize;
      let scaleHeight = Math.min(window.innerHeight, maxVerticalSize) / verticalSize;

      const styleWidth = {
        width: window.innerWidth < horizontalSize ? `100%` : `100vw`,
      };

      setScale(Math.min(scaleWidth, scaleHeight));
      setGameContainerStyleWidth(styleWidth);
    };

    updateScale();
    window.addEventListener("resize", updateScale);

    if (window.innerWidth <= maxHorizontalSize || window.innerHeight <= maxVerticalSize) {
      enterFullscreen()
    }
    
    return () => window.removeEventListener("resize", updateScale);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // keep latest timer in a ref so the loop can read it without recreating the interval
  useEffect(() => {
    timerRef.current = props.timer;
  }, [props.timer]);

  useEffect(() => { calculateScoreRef.current = props.calculateScore; }, [props.calculateScore]);
  useEffect(() => { shootRef.current = props.shoot; }, [props.shoot]);
  useEffect(() => { hasWonRef.current = props.hasWon; }, [props.hasWon]);
  useEffect(() => { hasLostRef.current = props.hasLost; }, [props.hasLost]);

  // keep refs in sync with state
  useEffect(() => { currentEnemiesRef.current = currentEnemies; }, [currentEnemies]);
  useEffect(() => { playerBulletsRef.current = playerBullets; }, [playerBullets]);
  useEffect(() => { enemyBulletsRef.current = enemyBullets; }, [enemyBullets]);
  useEffect(() => { playerHealthRef.current = playerHealth; }, [playerHealth]);
  useEffect(() => { playerLocationRef.current = playerLocation; }, [playerLocation]);

  // Game loop: runs every 30ms (created once on mount)
  useEffect(() => {
    isMountedRef.current = true;
    const loop = setInterval(() => {
      // work with refs to avoid stale closures
      const prevPlayerBullets = playerBulletsRef.current.slice();
      const prevEnemyBullets = enemyBulletsRef.current.slice();
      const prevEnemies = currentEnemiesRef.current.slice();
      let nextPlayerBullets = [];
      let nextEnemyBullets = [];
      let nextEnemies = prevEnemies.length !== 0 ? prevEnemies.filter((e) => e.health > 0) : [];
      let nextPlayerHealth = playerHealthRef.current;

      // Move player bullets and handle hits
      for (let bullet of prevPlayerBullets) {
        let newBullet = { ...bullet };
        newBullet.left += 15;
        let hit = false;
        for (let enemy of nextEnemies) {
          if (
            newBullet.left + 9 >= enemy.left &&
            newBullet.left <= enemy.left + enemy.width &&
            newBullet.top + 9 >= enemy.top &&
            newBullet.top <= enemy.top + enemy.height - 1
          ) {
            enemy.health -= 1;
            hit = true;
            break;
          }
        }
        if (!hit && newBullet.left < horizontalSize) nextPlayerBullets.push(newBullet);
      }

      // Move enemy bullets and handle player collision
      for (let bullet of prevEnemyBullets) {
        let newBullet = { ...bullet };
        if (newBullet.type === "ufo") {
          newBullet.left -= 15;
        } else if (newBullet.type === "girl") {
          newBullet.left -= 10;
          newBullet.top -= 5;
        } else {
          newBullet.left -= 10;
          newBullet.top += 5;
        }

        if (
          newBullet.left + 9 >= 10 &&
          newBullet.left <= 10 + playerWidth &&
          newBullet.top + 9 >= playerLocationRef.current &&
          newBullet.top <= playerLocationRef.current + playerHeight - 1
        ) {
          nextPlayerHealth -= 1;
          if (nextPlayerHealth <= 0) {
            setTimeout(() => props.hasLost && props.hasLost(), 0);
          }
        } else if (
          newBullet.left > 0 &&
          newBullet.top > 0 &&
          newBullet.top < verticalSize - newBullet.height
        ) {
          nextEnemyBullets.push(newBullet);
        }
      }

      // Add enemies as specified by the waves (only when appropriate)
      if (timerRef.current > 3000) {
        let wave = props.useWave(0);
  if (wave !== false) nextEnemies.push(...wave.map(e => ({ ...e, id: (e.id !== undefined && e.id !== null) ? e.id : idRef.current++ })));

        if (nextEnemies.length === 0 || timerRef.current >= 13000) {
          wave = props.useWave(1);
          if (wave !== false) nextEnemies.push(...wave.map(e => ({ ...e, id: (e.id !== undefined && e.id !== null) ? e.id : idRef.current++ })));
        }

        if (nextEnemies.length === 0 || timerRef.current >= 23000) {
          wave = props.useWave(2);
          if (wave !== false) nextEnemies.push(...wave.map(e => ({ ...e, id: (e.id !== undefined && e.id !== null) ? e.id : idRef.current++ })));
        }
      }

      // Enemies move and shoot
      for (let enemy of nextEnemies) {
        if (timerRef.current % 1000 === 0) {
          enemy.moveTimer = Math.random() * 1000;
          enemy.shootTimer = Math.random() * 1000;
        }
          if (timerRef.current % 1000 >= enemy.shootTimer) {
          enemy.shootTimer = 1000;
          if (enemy.type === "ufo") {
            nextEnemyBullets.push({ id: idRef.current++, height: 8, width: 20, left: enemy.left - 15, top: enemy.top + enemy.height / 2 - 5, type: enemy.type });
          } else if (enemy.type === "ironman") {
            nextEnemyBullets.push({ id: idRef.current++, height: 8, width: 24, left: enemy.left - 23, top: enemy.top + enemy.height / 2 - 5, type: enemy.type });
          } else {
            nextEnemyBullets.push({ id: idRef.current++, height: 15, width: 15, left: enemy.left - 14, top: enemy.top + enemy.height / 2 - 5, type: enemy.type });
          }
        }
        if (timerRef.current % 1000 >= enemy.moveTimer) {
          enemy.moveTimer = 1000;
          const chance = Math.random();
          if (enemy.type === "ufo") {
            if (chance < 0.3333) {
              enemy.top -= 20;
              if (enemy.top < 0) enemy.top = 0;
            } else if (chance < 0.6666) {
              enemy.top += 20;
              if (enemy.top > verticalSize - enemy.height) enemy.top = verticalSize - enemy.height;
            }
          } else {
            if (chance < 0.3333) {
              enemy.left -= 20;
              if (enemy.left < 0) enemy.left = 0;
            } else if (chance < 0.6666) {
              enemy.left += 20;
              if (enemy.left > horizontalSize - enemy.width) enemy.left = horizontalSize - enemy.width;
            }
          }
        }
      }

      // Player wins if no enemies after final wave
        if (nextEnemies.length === 0 && timerRef.current > 23000) {
          // schedule parent updates asynchronously and track the timeout so it can be cleared on unmount
          const t1 = setTimeout(() => { if (isMountedRef.current) calculateScoreRef.current && calculateScoreRef.current(nextPlayerHealth); }, 0);
          const t2 = setTimeout(() => { if (isMountedRef.current) hasWonRef.current && hasWonRef.current(); }, 0);
          timeoutsRef.current.push(t1, t2);
        }

        // schedule score update (was previously called each tick)
  const t3 = setTimeout(() => { if (isMountedRef.current) calculateScoreRef.current && calculateScoreRef.current(nextPlayerHealth); }, 0);
        timeoutsRef.current.push(t3);

      // commit state updates and update refs
  setPlayerBullets(nextPlayerBullets);
      playerBulletsRef.current = nextPlayerBullets;

  setEnemyBullets(nextEnemyBullets);
      enemyBulletsRef.current = nextEnemyBullets;

  setCurrentEnemies(nextEnemies);
      currentEnemiesRef.current = nextEnemies;

      setPlayerHealth(nextPlayerHealth);
      playerHealthRef.current = nextPlayerHealth;
    }, 30);

    focusDiv();
    return () => {
      clearInterval(loop);
      // clear any queued timeouts
      for (let t of timeoutsRef.current) clearTimeout(t);
      timeoutsRef.current = [];
      // clear auto-shoot interval if active
      if (shootInterval.current) {
        clearInterval(shootInterval.current);
        shootInterval.current = null;
      }
      isMountedRef.current = false;
    };
  // currentEnemies and playerHealth intentionally not added to deps to mimic original behaviour
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (props.isRunning === true) focusDiv();
  }, [props.isRunning]);

  const handleShoot = () => {
      setTimeout(() => {
      const now = Date.now();
      if (now - lastShotTime.current < delayBetweenShots.current) return;
      lastShotTime.current = now;

      // call parent shoot via ref to ensure parent shot counter updates
      shootRef.current && shootRef.current();
      setPlayerBullets((prev) => [
        ...prev,
        {
          id: idRef.current++,
          height: 10,
          width: 10,
          left: 9 + playerWidth,
          top: playerLocation + playerHeight / 2 - 5,
        },
      ]);
    }, 10);
  };

  const movePlayerTo = (y) => {
    let newY = y - playerHeight / 2; // center bird on touch/click
    if (newY < 0) newY = 0;
    if (newY > verticalSize - playerHeight) newY = verticalSize - playerHeight;
    setPlayerLocation(newY);
  };

  const handleTouch = (e) => {
    e.preventDefault();

    const canvas = e.currentTarget.querySelector(".canvas");
    const canvasRect = canvas.getBoundingClientRect();
    const oneThirdPoint = horizontalSize / 3;
    const twoThirdsPoint = oneThirdPoint * 2;

    for (let i = 0; i < e.touches.length; i++) {
      const touch = e.touches[i];
      const x = (touch.clientX - canvasRect.left) / scale;
      const y = (touch.clientY - canvasRect.top) / scale;

      if (x <= twoThirdsPoint) movePlayerTo(y);
      if (x >= oneThirdPoint) {
        handleShoot();
        startAutoShoot();
      }
    }
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();

    const canvas = e.currentTarget.querySelector(".canvas");
    const canvasRect = canvas.getBoundingClientRect();
    const oneThirdPoint = horizontalSize / 3; // divide into thirds

    for (let i = 0; i < e.touches.length; i++) {
      const touch = e.touches[i];
      const x = (touch.clientX - canvasRect.left) / scale;

      if (x > oneThirdPoint) return;
    }

    stopAutoShoot();
  };

  const handleMouseDown = (e) => {
    isDragging.current = true;
    handleMouseMove(e); // update immediately
    startAutoShoot();
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    stopAutoShoot();
  };

  const startAutoShoot = () => {
    if (shootInterval.current) return;
    shootInterval.current = setInterval(() => {
      handleShoot();
    }, delayBetweenShots.current);
  };

  const stopAutoShoot = () => {
    if (shootInterval.current) {
      clearInterval(shootInterval.current);
      shootInterval.current = null;
    }
  };

  const handleMouseMove = (e) => {
    const canvas = e.currentTarget.querySelector(".canvas");
    const canvasRect = canvas.getBoundingClientRect(); // get actual canvas position
    const y = (e.clientY - canvasRect.top) / scale; // account for top + scale
    movePlayerTo(y);

    if (isDragging.current) {
      handleShoot();
    }
  };

  const handleClick = (e) => {
    if (e.currentTarget) {
      handleShoot();
    }
  };

  const renderPlayerBullets = () =>
    playerBullets.map((bullet, index) => (
      <div
  key={bullet.id !== undefined && bullet.id !== null ? bullet.id : `${index}-${bullet.top}`}
        style={{
          height: `${bullet.height - 1}px`,
          width: `${bullet.width - 1}px`,
          left: `${bullet.left}px`,
          top: `${bullet.top}px`,
        }}
        className="playerBullet"
      ></div>
    ));

  const renderEnemyBullets = () =>
    enemyBullets.map((bullet, index) => (
      <div
  key={bullet.id !== undefined && bullet.id !== null ? bullet.id : `${index}-${bullet.top}`}
        style={{
          height: `${bullet.height - 1}px`,
          width: `${bullet.width - 1}px`,
          left: `${bullet.left}px`,
          top: `${bullet.top}px`,
        }}
        className={`enemyBullet ${bullet.type}`}
      ></div>
    ));

  const renderEnemies = () =>
    currentEnemies.map((enemy, index) => (
      <div
        style={{
          height: `${enemy.height - 1}px`,
          width: `${enemy.width - 1}px`,
          left: `${enemy.left}px`,
          top: `${enemy.top}px`,
        }}
        className={`enemy ${enemy.type}`}
  key={enemy.id !== undefined && enemy.id !== null ? enemy.id : `${index}-${enemy.left}`}
      ></div>
    ));

  const handleKeyDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.key === " ") {
      handleShoot();
    }
  };

  return (
    <div className="gameDiv" onKeyDown={handleKeyDown} tabIndex="0" ref={gameRef}>
      <div
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouch}
        onTouchMove={handleTouch}
        onTouchEnd={handleTouchEnd}
        onClick={handleClick}
        className="gameContainer"
        style={gameContainerStyleWidth}
      >
        <div
          className="canvas"
          style={{
            width: `${horizontalSize}px`,
            height: `${verticalSize}px`,
            transform: `scale(${scale})`,
          }}
        >
          <div
            className="player"
            style={{
              top: `${playerLocation}px`,
              height: `${playerHeight - 1}px`,
              width: `${playerWidth - 1}px`,
            }}
          />
          {renderEnemies()}
          {renderPlayerBullets()}
          {renderEnemyBullets()}
          <div className="gameHealth">HP: {playerHealth}</div>
          <div className="gameScore">SCORE: {props.currentScore}</div>
        </div>
      </div>
    </div>
  );
};

export default Game;
