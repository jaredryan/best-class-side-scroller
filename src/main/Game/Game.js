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
  const delayBetweenShots = useRef(200);
  const lastShotTime = useRef(0);
  const gameRef = useRef(null);

  // Helper: focus game div
  const focusDiv = () => {
    if (gameRef.current) {
      gameRef.current.focus();
    }
  };

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
    return () => window.removeEventListener("resize", updateScale);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Game loop: runs every 30ms
  useEffect(() => {
    const loop = setInterval(() => {
      setPlayerBullets((prevPlayerBullets) => {
        const newPlayerBullets = [];
        // Use currentEnemies from ref via function closure; read from state via getter below
        for (let bullet of prevPlayerBullets) {
          let newBullet = { ...bullet };
          newBullet.left += 15;
          let hit = false;
          for (let enemy of currentEnemies) {
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
          if (!hit && newBullet.left < horizontalSize) {
            newPlayerBullets.push(newBullet);
          }
        }
        return newPlayerBullets;
      });

      setEnemyBullets((prevEnemyBullets) => {
        let playerH = playerHealth;
        const newEnemyBullets = [];
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
            newBullet.top + 9 >= playerLocation &&
            newBullet.top <= playerLocation + playerHeight - 1
          ) {
            playerH -= 1;
            if (playerHealth <= 1) {
              props.hasLost();
            }
          } else if (
            newBullet.left > 0 &&
            newBullet.top > 0 &&
            newBullet.top < verticalSize - newBullet.height
          ) {
            newEnemyBullets.push(newBullet);
          }
        }
        if (playerH !== playerHealth) setPlayerHealth(playerH);
        return newEnemyBullets;
      });

      // Remove dead enemies and add waves
      setCurrentEnemies((prevEnemies) => {
        const alive = prevEnemies.length !== 0 ? prevEnemies.filter((e) => e.health > 0) : [];
        let current = alive.slice();
        let wave;
        if (props.timer > 3000) {
          wave = props.useWave(0);
          if (wave !== false) current.push(...wave);

          if (current.length === 0 || props.timer >= 13000) {
            wave = props.useWave(1);
            if (wave !== false) current.push(...wave);
          }

          if (current.length === 0 || props.timer >= 23000) {
            wave = props.useWave(2);
            if (wave !== false) current.push(...wave);
          }
        }

        // Player wins if no enemies after final wave
        if (current.length === 0 && props.timer > 23000) {
          props.calculateScore(playerHealth);
          props.hasWon();
        }

        // Enemies actions (move/shoot)
        for (let enemy of current) {
          if (props.timer % 1000 === 0) {
            enemy.moveTimer = Math.random() * 1000;
            enemy.shootTimer = Math.random() * 1000;
          }
          if (props.timer % 1000 >= enemy.shootTimer) {
            enemy.shootTimer = 1000;
            if (enemy.type === "ufo") {
              setEnemyBullets((prev) => [...prev, {
                height: 8,
                width: 20,
                left: enemy.left - 15,
                top: enemy.top + enemy.height / 2 - 5,
                type: enemy.type,
              }]);
            } else if (enemy.type === "ironman") {
              setEnemyBullets((prev) => [...prev, {
                height: 8,
                width: 24,
                left: enemy.left - 23,
                top: enemy.top + enemy.height / 2 - 5,
                type: enemy.type,
              }]);
            } else {
              setEnemyBullets((prev) => [...prev, {
                height: 15,
                width: 15,
                left: enemy.left - 14,
                top: enemy.top + enemy.height / 2 - 5,
                type: enemy.type,
              }]);
            }
          }
          if (props.timer % 1000 >= enemy.moveTimer) {
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

        props.calculateScore(playerHealth);
        return current;
      });
    }, 30);

    focusDiv();
    return () => clearInterval(loop);
  // currentEnemies and playerHealth intentionally not added to deps to mimic original behaviour
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.timer]);

  useEffect(() => {
    if (props.isRunning === true) focusDiv();
  }, [props.isRunning]);

  const handleShoot = () => {
    setTimeout(() => {
      const now = Date.now();
      if (now - lastShotTime.current < delayBetweenShots.current) return;
      lastShotTime.current = now;

      props.shoot();
      setPlayerBullets((prev) => [
        ...prev,
        {
          height: 10,
          width: 10,
          left: 9 + playerWidth,
          top: playerLocation + playerHeight / 2 - 5,
        },
      ]);
    }, 10);
  };

  const handleEnemyShoot = () => {
    setEnemyBullets((prev) => {
      const next = prev.slice();
      for (let enemy of currentEnemies) {
        next.push({
          height: 10,
          width: 10,
          left: enemy.left - 9,
          top: enemy.top + enemy.height / 2 - 5,
        });
      }
      return next;
    });
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
        key={index + bullet.top.toString()}
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
        key={index + bullet.top.toString()}
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
        key={index + enemy.left.toString()}
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
