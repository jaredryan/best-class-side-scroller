import React, { useEffect, useRef } from "react";

import useDisablePageGestures from "../Components/useDisablePageGestures";
import TouchShield from "../Components/TouchShield";

const gameInterval = 30
const playerHeight = 35;
const playerWidth = 50;
const maxScale = 1.5;
const delayBetweenShots = 200
export const verticalSize = 360;
export const horizontalSize = 640;
export const maxVerticalSize = verticalSize * maxScale;
export const maxHorizontalSize = horizontalSize * maxScale;
const enemySpawnAnimationTimer = 300
const enemyHitAnimationTimer = 200
const enemyShootAnimationTimer = 150
const enemyExplodeAnimationTimer = 600

const playerBulletHeight = 6
const playerBulletWidth = 12



const Game = (props) => {
  const isDragging = useRef(false);
  const shootInterval = useRef(null);
  const timeoutsRef = useRef([]);
  const lastShotTime = useRef(0);
  const isMountedRef = useRef(true);

  // refs to latest parent callbacks to avoid stale closures inside the loop
  const timerRef = useRef(props.timer);
  const enemiesRef = useRef(props.enemies);
  const playerBulletsRef = useRef(props.playerBullets);
  const enemyBulletsRef = useRef(props.enemyBullets);
  const playerHealthRef = useRef(props.playerHealth);
  const playerLocationRef = useRef(props.playerLocation);
  const playerStateRef = useRef(props.playerState);

  const idRef = useRef(1);

  const smoothMove = (current, target, speed = 0.1) => {
    const next = current + (target - current) * speed;
    if (Math.abs(next - target) < 1) return target; // snap if close
    return next;
  };

  const setEnemyAnimation = (enemy, animationName, animationTimer) => {
    enemy.state.push(animationName)
    const timeout = setTimeout(() => {
      enemy.state = enemy.state.filter((animation) => animation !== animationName)
    }, animationTimer - gameInterval)
    timeoutsRef.current.push(timeout);
  }

  const setPlayerAnimation = (state, animationName, animationTimer) => {
    state.push(animationName)
    const timeout = setTimeout(() => {
      if (playerStateRef.current) {
        props.setPlayerState(playerStateRef.current.filter((animation) => animation !== animationName))
      }
    }, animationTimer - gameInterval)
    timeoutsRef.current.push(timeout);
  }

  useDisablePageGestures()

  // keep refs in sync with state
  useEffect(() => {
    timerRef.current = props.timer;
  }, [props.timer]);
  useEffect(() => {
    enemiesRef.current = props.enemies;
  }, [props.enemies]);
  useEffect(() => {
    playerBulletsRef.current = props.playerBullets;
  }, [props.playerBullets]);
  useEffect(() => {
    enemyBulletsRef.current = props.enemyBullets;
  }, [props.enemyBullets]);
  useEffect(() => {
    playerHealthRef.current = props.playerHealth;
  }, [props.playerHealth]);
  useEffect(() => {
    playerLocationRef.current = props.playerLocation;
  }, [props.playerLocation]);
  useEffect(() => {
    playerStateRef.current = props.playerState;
  }, [props.playerState]);

  // Game loop: runs every 30ms (created once on mount)
  useEffect(() => {
    isMountedRef.current = true;
    const loop = setInterval(() => {
      if (props.isPaused) return;
      
      // work with refs to avoid stale closures
      const prevPlayerBullets = playerBulletsRef.current.slice();
      const prevEnemyBullets = enemyBulletsRef.current.slice();
      const prevEnemies = enemiesRef.current.slice();
      let nextPlayerBullets = [];
      let nextEnemyBullets = [];
      let nextEnemies = prevEnemies.length !== 0
        ? prevEnemies.filter((e) => e.health > 0 || e.state.includes('dying'))
        : [];
      let nextPlayerHealth = playerHealthRef.current;
      let nextPlayerState = playerStateRef.current;

      // Move player bullets and handle hits
      for (let bullet of prevPlayerBullets) {
        let newBullet = { ...bullet };
        newBullet.left += 15;
        let hit = false;
        for (let enemy of nextEnemies) {
          if (
            !enemy.state.includes('dying') &&
            newBullet.left + 9 >= enemy.left &&
            newBullet.left <= enemy.left + enemy.width &&
            newBullet.top + 9 >= enemy.top &&
            newBullet.top <= enemy.top + enemy.height - 1
          ) {
            enemy.health -= 1;
            hit = true;
            props.hit()

            if (enemy.health <= 0) {
              let dieAnimationTimer
              if (enemy.type === 'girl') {
                dieAnimationTimer = enemyExplodeAnimationTimer
              } else {
                dieAnimationTimer = enemyExplodeAnimationTimer

                const boom = document.createElement("div");
                boom.className = "explosion";
                boom.style.left = enemy.left;
                boom.style.top = enemy.top;
                boom.style.width = enemy.width;
                boom.style.height = enemy.height;

                const enemyElement = document.getElementById(enemy.id)
                enemyElement.appendChild(boom);
              }

              setEnemyAnimation(enemy, 'dying', dieAnimationTimer)
            } else {
              setEnemyAnimation(enemy, 'hit', enemyHitAnimationTimer)
            }
            
            break;
          }
        }
        if (!hit && newBullet.left < horizontalSize)
          nextPlayerBullets.push(newBullet);
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
            setPlayerAnimation(nextPlayerState, 'dying', enemyExplodeAnimationTimer)
            setTimeout(props.hasLost, enemyExplodeAnimationTimer)
          } else {
            setPlayerAnimation(nextPlayerState, 'hit', enemyHitAnimationTimer)
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
      let waveAdded = false
      if (timerRef.current >= 3000) {
        let wave = props.useWave(0);
        if (wave !== false) {
          nextEnemies.push(
            ...wave.map((e) => {
              const enemy = {
                ...e,
                id:
                  e.id !== undefined && e.id !== null ? e.id : idRef.current++,
                state: [],
                maxHealth: e.health,
              }
              setEnemyAnimation(enemy, 'spawning', enemySpawnAnimationTimer)
              return enemy
            })
          );
          waveAdded = true
        }

        if (nextEnemies.length === 0 || timerRef.current >= 13000) {
          wave = props.useWave(1);
          if (wave !== false) {
            nextEnemies.push(
              ...wave.map((e) => {
                const enemy = {
                  ...e,
                  id:
                    e.id !== undefined && e.id !== null ? e.id : idRef.current++,
                  state: [],
                  maxHealth: e.health,
                }
                setEnemyAnimation(enemy, 'spawning', enemySpawnAnimationTimer)
                return enemy
              })
            );
            waveAdded = true
          }
        }

        if (nextEnemies.length === 0 || timerRef.current >= 23000) {
          wave = props.useWave(2);
          if (wave !== false) {

            nextEnemies.push(
              ...wave.map((e) => {
                const enemy = {
                  ...e,
                  id:
                    e.id !== undefined && e.id !== null ? e.id : idRef.current++,
                  state: [],
                  maxHealth: e.health,
                }
                setEnemyAnimation(enemy, 'spawning', enemySpawnAnimationTimer)
                return enemy
              })
            );
            waveAdded = true
          }
        }
      }

      // Enemies move and shoot
      for (let enemy of nextEnemies) {
        if (enemy.state.includes('dying')) break;
        if (timerRef.current % 1000 === 0) {
          enemy.moveTimer = Math.random() * 1000;
          enemy.shootTimer = Math.random() * 1000;
        }
        if (timerRef.current % 1000 >= enemy.shootTimer) {
          enemy.shootTimer = 1000;

          let bulletWidth
          let bulletHeight
          if (enemy.type === "ufo") {
            bulletWidth = 16
            bulletHeight = 6
          } else if (enemy.type === "ironman") {
            bulletWidth = 20
            bulletHeight = 6
          } else {
            bulletWidth = 12
            bulletHeight = 12
          }

          nextEnemyBullets.push({
            id: idRef.current++,
            height: bulletHeight,
            width: bulletWidth,
            left: enemy.left - bulletWidth,
            top: enemy.top + enemy.height / 2 - bulletHeight / 2,
            type: enemy.type,
          });
        }

        // Randomly assign movement target every 1 second or so
        if (timerRef.current % 1000 >= enemy.moveTimer) {
          enemy.moveTimer = 1000;
          const chance = Math.random();
          if (enemy.type === "ufo") {
            let target = enemy.top
            if (chance < 0.3333) {
              target = Math.max(enemy.top - 20, 0)
              if (target < 0) target = 0;
            } else if (chance < 0.6666) {
              target = Math.min(enemy.top + 20, verticalSize - enemy.height);
            }

            enemy.target = target
          } else {
            let target = enemy.left
            if (chance < 0.3333) {
              target = Math.max(enemy.left - 20, 0)
            } else if (chance < 0.6666) {
              target = Math.min(enemy.left + 20, horizontalSize - enemy.width);
            }

            enemy.target = target
          }
        }

        // Proceed with movement
        if (enemy.target) {
          if (enemy.type === "ufo") {
            enemy.top = smoothMove(enemy.top, enemy.target, 0.1);

            if (Math.abs(enemy.top - enemy.target) < 1) {
              enemy.top = enemy.target;
              delete enemy.target
            }
          } else {
            enemy.left = smoothMove(enemy.left, enemy.target, 0.1);
            
            if (Math.abs(enemy.left - enemy.target) < 1) {
              enemy.left = enemy.target;
              delete enemy.target
            }
          }
        }
      }

      // Player wins if no enemies and there are no more waves to add
      if (timerRef.current >= 3000 && nextEnemies.length === 0 && !waveAdded) {
        props.hasWon();
      }

      // commit state updates and update refs
      props.setPlayerBullets(nextPlayerBullets);
      playerBulletsRef.current = nextPlayerBullets;

      props.setEnemyBullets(nextEnemyBullets);
      enemyBulletsRef.current = nextEnemyBullets;

      props.setEnemies(nextEnemies);
      enemiesRef.current = nextEnemies;

      props.setPlayerHealth(nextPlayerHealth);
      playerHealthRef.current = nextPlayerHealth;

      props.setPlayerState(nextPlayerState);
      playerStateRef.current = nextPlayerState;
    }, gameInterval);

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
    // enemies and playerHealth intentionally not added to deps to mimic original behaviour
  }, [props.isPaused]);

  const handleShoot = () => {
    const timeout = setTimeout(() => {
      const now = Date.now();
      if (now - lastShotTime.current < delayBetweenShots) return;
      lastShotTime.current = now;

      // call parent shoot via ref to ensure parent shot counter updates
      props.shoot();
      const spawnTop = playerLocationRef.current + playerHeight / 2 - playerBulletWidth / 2;
      props.setPlayerBullets((prev) => [
        ...prev,
        {
          id: idRef.current++,
          height: playerBulletHeight,
          width: playerBulletWidth,
          left: playerBulletWidth + playerWidth,
          top: spawnTop,
        },
      ]);
    }, 10);
    timeoutsRef.current.push(timeout);
  };

  const movePlayerTo = (y) => {
    let newY = y - playerHeight / 2; // center bird on touch/click
    if (newY < 0) newY = 0;
    if (newY > verticalSize - playerHeight) newY = verticalSize - playerHeight;
    props.setPlayerLocation(newY);
  };

  const handleTouch = (e) => {
    e.preventDefault();

    const canvas = e.currentTarget.querySelector(".canvas");
    const canvasRect = canvas.getBoundingClientRect();
    const oneThirdPoint = horizontalSize / 3;
    const twoThirdsPoint = oneThirdPoint * 2;

    for (let i = 0; i < e.touches.length; i++) {
      const touch = e.touches[i];
      const x = (touch.clientX - canvasRect.left) / props.scale;
      const y = (touch.clientY - canvasRect.top) / props.scale;

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
      const x = (touch.clientX - canvasRect.left) / props.scale;

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
    }, delayBetweenShots);
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
    const y = (e.clientY - canvasRect.top) / props.scale; // account for top + scale
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

  const renderPlayer = () => (
    <div
      className={`playerContainer${playerStateRef.current?.length ? ` ${playerStateRef.current.join(' ')}` : ''}`}
      style={{
        top: `${props.playerLocation}px`,
        height: `${playerHeight - 1}px`,
        width: `${playerWidth - 1}px`,
      }}
    >
      <div className="healthbar">
        <div
          className="health"
          style={{ width: `${(playerHealthRef?.current / props.playerMaxHealth) * 100}%` }}
        />
      </div>
      <div
        className={`player`}
      />
    </div>
  )

  const renderPlayerBullets = () =>
    props.playerBullets.map((bullet, index) => (
      <div
        key={
          bullet.id !== undefined && bullet.id !== null
            ? bullet.id
            : `${index}-${bullet.top}`
        }
        style={{
          height: `${bullet.height}px`,
          width: `${bullet.width}px`,
          left: `${bullet.left}px`,
          top: `${bullet.top}px`,
        }}
        className="playerBullet"
      />
    ));

  const renderEnemyBullets = () =>
    props.enemyBullets.map((bullet, index) => (
      <div
        key={
          bullet.id !== undefined && bullet.id !== null
            ? bullet.id
            : `${index}-${bullet.top}`
        }
        style={{
          height: `${bullet.height}px`,
          width: `${bullet.width}px`,
          left: `${bullet.left}px`,
          top: `${bullet.top}px`,
        }}
        className={`enemyBullet ${bullet.type}`}
      />
    ));

  const renderEnemies = () =>
    props.enemies.map((enemy, index) => (
      <div
        key={enemy.id ? enemy.id : `${index}-${enemy.left}`}
        id={enemy.id ? enemy.id : `${index}-${enemy.left}`}
        style={{
          height: `${enemy.height - 1}px`,
          width: `${enemy.width - 1}px`,
          left: `${enemy.left}px`,
          top: `${enemy.top}px`,
        }}
        className={`enemyContainer${enemy.state.length ? ` ${enemy.state.join(' ')}` : ''}`}
      >
        <div className="healthbar">
          <div
            className="health"
            style={{ 
              width: `${(enemy.health / enemy.maxHealth) * 100}%`,
            }}
          />
        </div>
        <div
          className={`enemy ${enemy.type}`}
        />
      </div>
    ));

  const handleKeyDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.key === " ") {
      handleShoot();
    }
  };

  return (
    <div
      className="gameDiv"
      onKeyDown={handleKeyDown}
      tabIndex="0"
      ref={props.wrapperRef}
      style={{ height: "calc(var(--vh, 1vh) * 100)" }}
    >
      <TouchShield />
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
        style={props.gameContainerStyleWidth}
      >
        <div
          className="canvas"
          style={{
            width: `${horizontalSize}px`,
            height: `${verticalSize}px`,
            transform: `scale(${props.scale})`,
          }}
        >
          {renderPlayer()}
          {renderEnemies()}
          {renderPlayerBullets()}
          {renderEnemyBullets()}
          <div className="gameHealth">HP: {playerHealthRef?.current}</div>
          <div className="gameScore">SCORE: {props.currentScore}</div>
        </div>
      </div>
    </div>
  );
};

export default Game;
