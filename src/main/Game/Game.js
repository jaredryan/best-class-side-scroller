import React, { useEffect, useRef } from "react";

import useDisablePageGestures from "../Components/useDisablePageGestures";
import TinyChef from "../Components/Sprites/TinyChef";
import SodaBottle from "../Components/Sprites/SodaBottle";
import HotdogPile from "../Components/Sprites/HotdogPile";
import NachoPlate from "../Components/Sprites/NachoPlate";
import TouchShield from "../Components/TouchShield";

const gameInterval = 15; // ms, fixed-step simulation
const healthBarOffset = 6
const playerHeight = 35;
const playerWidth = 50;
const maxScale = 1.5;
const delayBetweenShots = 200;
export const verticalSize = 360;
export const horizontalSize = 640;
export const maxVerticalSize = verticalSize * maxScale;
export const maxHorizontalSize = horizontalSize * maxScale;
const enemySpawnAnimationTimer = 300;
const enemyHitAnimationTimer = 200;
const enemyShootAnimationTimer = 150;
const enemyExplodeAnimationTimer = 600;

const playerBulletHeight = 6;
const playerBulletWidth = 12;

const Game = (props) => {
  // interaction refs
  const isDragging = useRef(false);
  const shootInterval = useRef(null);
  const timeoutsRef = useRef([]);
  const lastShotTime = useRef(0);
  const isMountedRef = useRef(true);

  // refs to latest parent values to avoid stale closures
  const timerRef = useRef(props.timer);
  const enemiesRef = useRef(props.enemies);
  const playerBulletsRef = useRef(props.playerBullets);
  const enemyBulletsRef = useRef(props.enemyBullets);
  const playerHealthRef = useRef(props.playerHealth);
  const playerLocationRef = useRef(props.playerLocation);
  const playerStateRef = useRef(props.playerState);

  const idRef = useRef(1);

  // for DOM-level smoothing/interpolation:
  const nodeRefs = useRef({
    player: null,
    enemies: new Map(), // id -> element
    playerBullets: new Map(),
    enemyBullets: new Map(),
  });

  // snapshots for interpolation: prev and curr (maps of id -> {left, top})
  const prevSnapshotRef = useRef({
    player: { left: 10, top: props.playerLocation || 0 },
    enemies: new Map(),
    playerBullets: new Map(),
    enemyBullets: new Map(),
  });
  const currSnapshotRef = useRef({
    player: { left: 10, top: props.playerLocation || 0 },
    enemies: new Map(),
    playerBullets: new Map(),
    enemyBullets: new Map(),
  });

  // helpers for movement/animations (kept your semantics)
  const smoothMove = (current, target, speed = 0.1) => {
    const next = current + (target - current) * speed;
    if (Math.abs(next - target) < 1) return target; // snap if close
    return next;
  };

  const setEnemyAnimation = (enemy, animationName, animationTimer) => {
    if (!enemy.state) enemy.state = [];
    enemy.state.push(animationName);
    const timeout = setTimeout(() => {
      if (!enemy.state) return;
      enemy.state = enemy.state.filter((a) => a !== animationName);
    }, Math.max(0, animationTimer - gameInterval));
    timeoutsRef.current.push(timeout);
  };

  const setPlayerAnimation = (state, animationName, animationTimer) => {
    if (!state) state = [];
    state.push(animationName);
    const timeout = setTimeout(() => {
      if (playerStateRef.current) {
        props.setPlayerState(
          playerStateRef.current.filter(
            (animation) => animation !== animationName
          )
        );
      }
    }, Math.max(0, animationTimer - gameInterval));
    timeoutsRef.current.push(timeout);
  };

  useDisablePageGestures();

  // keep refs in sync with props
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

  // Utility: build snapshot Maps from arrays for interpolation
  const buildSnapshotFromArrays = (
    playerLoc,
    playerBullets,
    enemyBullets,
    enemies
  ) => {
    const player = { left: 10, top: playerLoc };
    const pMap = new Map();
    (playerBullets || []).forEach((b) =>
      pMap.set(b.id, { left: b.left, top: b.top })
    );
    const eMap = new Map();
    (enemyBullets || []).forEach((b) =>
      eMap.set(b.id, { left: b.left, top: b.top })
    );
    const enMap = new Map();
    (enemies || []).forEach((e) =>
      enMap.set(e.id, { left: e.left, top: e.top })
    );
    return { player, playerBullets: pMap, enemyBullets: eMap, enemies: enMap };
  };

  // initialize snapshots from initial props on mount
  useEffect(() => {
    const snap = buildSnapshotFromArrays(
      props.playerLocation,
      props.playerBullets,
      props.enemyBullets,
      props.enemies
    );
    prevSnapshotRef.current = snap;
    currSnapshotRef.current = snap;
  }, []); // run only once

  // rAF / fixed-step loop
  useEffect(() => {
    isMountedRef.current = true;

    let lastTime = performance.now();
    let accumulator = 0;
    let rafId = 0;

    // simulation tick: this is the code that used to run inside setInterval — unchanged logic except organization
    const simulateTick = () => {
      // read previous arrays from refs
      const prevPlayerBullets = (playerBulletsRef.current || []).slice();
      const prevEnemyBullets = (enemyBulletsRef.current || []).slice();
      const prevEnemies = (enemiesRef.current || []).slice();

      let nextPlayerBullets = [];
      let nextEnemyBullets = [];
      let nextEnemies =
        prevEnemies.length !== 0
          ? prevEnemies.filter(
              (e) => e.health > 0 || (e.state && e.state.includes("dying"))
            )
          : [];
      let nextPlayerHealth = playerHealthRef.current;
      let nextPlayerState = playerStateRef.current;

      // Move player bullets and handle hits
      for (let bullet of prevPlayerBullets) {
        let newBullet = { ...bullet };
        newBullet.left += 7.5;
        let hit = false;
        for (let enemy of nextEnemies) {
          const playerBulletHeight = 6;
          const playerBulletWidth = 12;
          if (
            !enemy.state?.includes("dying") &&
            newBullet.left + playerBulletWidth >= enemy.left &&
            newBullet.left <= enemy.left + enemy.width &&
            newBullet.top + playerBulletHeight >= enemy.top &&
            newBullet.top <= enemy.top + enemy.height - 1
          ) {
            enemy.health -= 1;
            hit = true;
            props.hit && props.hit();

            if (enemy.health <= 0) {
              let dieAnimationTimer = enemyExplodeAnimationTimer;

              // put explosion DOM element if you want (you had it previously)
              if (enemy.type !== "girl") {
                const enemyElement = document.getElementById(enemy.id);
                if (enemyElement) {
                  const boom = document.createElement("div");
                  boom.className = "explosion";
                  // set style px values
                  boom.style.position = "absolute";
                  boom.style.left = "0px";
                  boom.style.top = "0px";
                  boom.style.width = `${enemy.width}px`;
                  boom.style.height = `${enemy.height}px`;
                  enemyElement.appendChild(boom);
                  // we don't rely on removing this here — your CSS animation can remove itself or we'll clear on unmount
                }
              }

              setEnemyAnimation(enemy, "dying", dieAnimationTimer);
            } else {
              setEnemyAnimation(enemy, "hit", enemyHitAnimationTimer);
            }

            break;
          }
        }
        if (!hit && newBullet.left < horizontalSize - playerBulletWidth)
          nextPlayerBullets.push(newBullet);
      }

      // Move enemy bullets and handle player collision
      for (let bullet of prevEnemyBullets) {
        let newBullet = { ...bullet };
        if (newBullet.type === "ufo") {
          newBullet.left -= 7.5;
        } else if (newBullet.type === "girl") {
          newBullet.left -= 5;
          newBullet.top -= 2.5;
        } else {
          newBullet.left -= 5;
          newBullet.top += 2.5;
        }

        if (
          newBullet.left + newBullet.width >= 10 &&
          newBullet.left <= 10 + playerWidth &&
          newBullet.top + newBullet.height >= playerLocationRef.current &&
          newBullet.top <= playerLocationRef.current + playerHeight - 1
        ) {
          nextPlayerHealth -= 1;

          if (nextPlayerHealth <= 0) {
            nextPlayerHealth = 0;
            setPlayerAnimation(
              nextPlayerState,
              "dying",
              enemyExplodeAnimationTimer
            );
            const t = setTimeout(
              () => props.hasLost && props.hasLost(),
              enemyExplodeAnimationTimer
            );
            timeoutsRef.current.push(t);
          } else {
            setPlayerAnimation(nextPlayerState, "hit", enemyHitAnimationTimer);
          }
        } else if (
          newBullet.left > 0 &&
          newBullet.top > 0 &&
          newBullet.top < verticalSize - (newBullet.height || 10)
        ) {
          nextEnemyBullets.push(newBullet);
        }
      }

      // Add enemies as specified by the waves (only when appropriate)
      let waveAdded = false;
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
              };
              setEnemyAnimation(enemy, "spawning", enemySpawnAnimationTimer);
              return enemy;
            })
          );
          waveAdded = true;
        }

        if (!waveAdded && (nextEnemies.length === 0 || timerRef.current >= 13000)) {
          wave = props.useWave(1);
          if (wave !== false) {
            nextEnemies.push(
              ...wave.map((e) => {
                const enemy = {
                  ...e,
                  id:
                    e.id !== undefined && e.id !== null
                      ? e.id
                      : idRef.current++,
                  state: [],
                  maxHealth: e.health,
                };
                setEnemyAnimation(enemy, "spawning", enemySpawnAnimationTimer);
                return enemy;
              })
            );
            waveAdded = true;
          }
        }

        if (!waveAdded && (nextEnemies.length === 0 || timerRef.current >= 23000)) {
          wave = props.useWave(2);
          if (wave !== false) {
            nextEnemies.push(
              ...wave.map((e) => {
                const enemy = {
                  ...e,
                  id:
                    e.id !== undefined && e.id !== null
                      ? e.id
                      : idRef.current++,
                  state: [],
                  maxHealth: e.health,
                };
                setEnemyAnimation(enemy, "spawning", enemySpawnAnimationTimer);
                return enemy;
              })
            );
            waveAdded = true;
          }
        }
      }

      // Enemies move and shoot
      for (let enemy of nextEnemies) {
        if (enemy.state?.includes("dying")) continue;
        if (timerRef.current % 1000 === 0) {
          enemy.moveTimer = Math.random() * 1000;
          enemy.shootTimer = Math.random() * 1000;
        }
        if (timerRef.current % 1000 >= enemy.shootTimer) {
          enemy.shootTimer = 1000;

          let bulletWidth;
          let bulletHeight;
          if (enemy.type === "ufo") {
            bulletWidth = 16;
            bulletHeight = 6;
          } else if (enemy.type === "ironman") {
            bulletWidth = 20;
            bulletHeight = 6;
          } else {
            bulletWidth = 12;
            bulletHeight = 12;
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
            let target = enemy.top;
            if (chance < 0.3333) {
              target = Math.max(enemy.top - 20, healthBarOffset);
            } else if (chance < 0.6666) {
              target = Math.min(enemy.top + 20, verticalSize - enemy.height);
            }
            enemy.target = target;
          } else {
            let target = enemy.left;
            if (chance < 0.3333) {
              target = Math.max(enemy.left - 20, 0);
            } else if (chance < 0.6666) {
              target = Math.min(enemy.left + 20, horizontalSize - enemy.width);
            }
            enemy.target = target;
          }
        }

        // Proceed with movement (smooth)
        if (enemy.target !== undefined && enemy.target !== null) {
          if (enemy.type === "ufo") {
            enemy.top = smoothMove(enemy.top, enemy.target, 0.1);
            if (Math.abs(enemy.top - enemy.target) < 1) {
              enemy.top = enemy.target;
              delete enemy.target;
            }
          } else {
            enemy.left = smoothMove(enemy.left, enemy.target, 0.1);
            if (Math.abs(enemy.left - enemy.target) < 1) {
              enemy.left = enemy.target;
              delete enemy.target;
            }
          }
        }
      }

      // Player wins if no enemies and there are no more waves to add
      if (timerRef.current >= 3000 && nextEnemies.length === 0 && !waveAdded) {
        const t = setTimeout(() => {
          if (isMountedRef.current) props.hasWon && props.hasWon();
        }, 0);
        timeoutsRef.current.push(t);
      }

      // commit parent state updates (same as before)
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

      // Update snapshots for interpolation:
      // prev = last curr, curr = new snapshot generated from new arrays
      prevSnapshotRef.current = currSnapshotRef.current;
      currSnapshotRef.current = buildSnapshotFromArrays(
        playerLocationRef.current,
        nextPlayerBullets,
        nextEnemyBullets,
        nextEnemies
      );
    }; // simulateTick

    // interpolate and apply transforms to DOM elements
    const renderInterpolated = (alpha) => {
      // player
      const playerEl = nodeRefs.current.player;
      const prevPlayer = prevSnapshotRef.current.player || {
        left: 10,
        top: playerLocationRef.current,
      };
      const currPlayer = currSnapshotRef.current.player || prevPlayer;
      if (playerEl) {
        const lerpLeft =
          prevPlayer.left + (currPlayer.left - prevPlayer.left) * alpha;
        const lerpTop =
          prevPlayer.top + (currPlayer.top - prevPlayer.top) * alpha;
        playerEl.style.transform = `translate3d(${lerpLeft}px, ${lerpTop}px, 0)`;
      }

      // enemies
      for (const [id, el] of nodeRefs.current.enemies.entries()) {
        if (!el) continue;
        const prev =
          prevSnapshotRef.current.enemies.get(id) ||
          currSnapshotRef.current.enemies.get(id);
        const curr = currSnapshotRef.current.enemies.get(id) || prev;
        if (!prev || !curr) continue;
        const lx = prev.left + (curr.left - prev.left) * alpha;
        const ly = prev.top + (curr.top - prev.top) * alpha;
        el.style.transform = `translate3d(${lx}px, ${ly}px, 0)`;
      }

      // player bullets
      for (const [id, el] of nodeRefs.current.playerBullets.entries()) {
        if (!el) continue;
        const prev =
          prevSnapshotRef.current.playerBullets.get(id) ||
          currSnapshotRef.current.playerBullets.get(id);
        const curr = currSnapshotRef.current.playerBullets.get(id) || prev;
        if (!prev || !curr) continue;
        const lx = prev.left + (curr.left - prev.left) * alpha;
        const ly = prev.top + (curr.top - prev.top) * alpha;
        el.style.transform = `translate3d(${lx}px, ${ly}px, 0)`;
      }

      // enemy bullets
      for (const [id, el] of nodeRefs.current.enemyBullets.entries()) {
        if (!el) continue;
        const prev =
          prevSnapshotRef.current.enemyBullets.get(id) ||
          currSnapshotRef.current.enemyBullets.get(id);
        const curr = currSnapshotRef.current.enemyBullets.get(id) || prev;
        if (!prev || !curr) continue;
        const lx = prev.left + (curr.left - prev.left) * alpha;
        const ly = prev.top + (curr.top - prev.top) * alpha;
        if (el?.classList?.contains("ironman")) {
          el.style.transform = `translate3d(${lx}px, ${ly}px, 0) rotate(-28deg)`;
        } else {
          el.style.transform = `translate3d(${lx}px, ${ly}px, 0)`;
        }
      }
    };

    // frame loop
    const frame = (now) => {
      if (!isMountedRef.current) return;
      rafId = requestAnimationFrame(frame);

      if (props.isPaused) {
        // reset clock so we don't accumulate time while paused
        lastTime = now;
        accumulator = 0;
        renderInterpolated(0); // keep visuals stable
        return;
      }

      let delta = now - lastTime;
      // clamp delta to avoid spiralling after tab switch
      if (delta > 1000) delta = 1000;
      lastTime = now;
      accumulator += delta;

      // run fixed-step simulation ticks as many as needed
      while (accumulator >= gameInterval) {
        simulateTick();
        accumulator -= gameInterval;
      }

      const alpha = Math.max(0, Math.min(1, accumulator / gameInterval));
      renderInterpolated(alpha);
    };

    rafId = requestAnimationFrame(frame);

    return () => {
      isMountedRef.current = false;
      cancelAnimationFrame(rafId);
      // clear queued timeouts
      for (let t of timeoutsRef.current) clearTimeout(t);
      timeoutsRef.current = [];
      // clear auto-shoot interval if active
      if (shootInterval.current) {
        clearInterval(shootInterval.current);
        shootInterval.current = null;
      }
    };
  }, [props.isPaused]); // re-create loop on pause changes (to mimic prior behaviour)

  // shooting helpers (unchanged logic)
  const handleShoot = () => {
    const timeout = setTimeout(() => {
      const now = Date.now();
      if (now - lastShotTime.current < delayBetweenShots) return;
      lastShotTime.current = now;

      props.shoot && props.shoot();
      const spawnTop =
        playerLocationRef.current + playerHeight / 2 - playerBulletWidth / 2;
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
    let newY = y - playerHeight / 2; // center
    if (newY < healthBarOffset) newY = healthBarOffset;
    if (newY > verticalSize - playerHeight) newY = verticalSize - playerHeight;
    props.setPlayerLocation(newY);
  };

  // input handlers (kept as in your version)
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
    const oneThirdPoint = horizontalSize / 3;

    for (let i = 0; i < e.touches.length; i++) {
      const touch = e.touches[i];
      const x = (touch.clientX - canvasRect.left) / props.scale;
      if (x > oneThirdPoint) return;
    }

    stopAutoShoot();
  };

  const handleMouseDown = (e) => {
    isDragging.current = true;
    handleMouseMove(e);
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
    const canvasRect = canvas.getBoundingClientRect();
    const y = (e.clientY - canvasRect.top) / props.scale;
    movePlayerTo(y);

    if (isDragging.current) {
      handleShoot();
    }
  };

  const handleClick = (e) => {
    if (e.currentTarget) handleShoot();
  };

  // Render callbacks attach DOM refs to nodeRefs for rAF interpolation.
  // Use transform: translate3d(...) instead of top/left; React will set initial transform values,
  // and rAF will update them each frame for smoothness.

  const renderPlayer = () => {
    const playerId = "player";
    const playerLeft = 10;
    const playerTop = playerLocationRef.current || 0;
    // set initial transform via inline style so rAF has something on first paint
    const transform = `translate3d(${playerLeft}px, ${playerTop}px, 0)`;

    return (
      <div
        className={`playerContainer`}
        style={{
          height: `${playerHeight - 1}px`,
          width: `${playerWidth - 1}px`,
          transform,
        }}
        ref={(el) => {
          if (el) {
            nodeRefs.current.player = el;
            // also ensure parent container gets transformed; we are transforming this element directly
            // keep player as the element we transform (so use player ref)
          } else {
            nodeRefs.current.player = null;
          }
        }}
      >
        <div className="healthbar">
          <div
            className="health"
            style={{
              width: `${
                (playerHealthRef?.current / props.playerMaxHealth) * 100
              }%`,
            }}
          />
        </div>
        <div
          className={`playerAnimationContainer${
            playerStateRef.current?.length
              ? ` ${playerStateRef.current.join(" ")}`
              : ""
          }`}
        >
          <div className="player">
            <TinyChef />
          </div>
        </div>
      </div>
    );
  };

  const renderPlayerBullets = () =>
    props.playerBullets.map((bullet, index) => {
      const id =
        bullet.id !== undefined && bullet.id !== null
          ? bullet.id
          : `${index}-${bullet.top}`;
      const initialTransform = `translate3d(${bullet.left}px, ${bullet.top}px, 0)`;
      return (
        <div
          key={id}
          ref={(el) => {
            if (el) nodeRefs.current.playerBullets.set(bullet.id, el);
            else nodeRefs.current.playerBullets.delete(bullet.id);
          }}
          style={{
            height: `${bullet.height}px`,
            width: `${bullet.width}px`,
            transform: initialTransform,
            position: "absolute",
            willChange: "transform",
          }}
          className="playerBullet"
        />
      );
    });

  const renderEnemyBullets = () =>
    props.enemyBullets.map((bullet, index) => {
      const id =
        bullet.id !== undefined && bullet.id !== null
          ? bullet.id
          : `${index}-${bullet.top}`;
      let initialTransform = `translate3d(${bullet.left}px, ${bullet.top}px, 0)`;
      if (bullet.type === "ironman") {
        initialTransform += ` rotate(-28deg)`;
      }
      return (
        <div
          key={id}
          ref={(el) => {
            if (el) nodeRefs.current.enemyBullets.set(bullet.id, el);
            else nodeRefs.current.enemyBullets.delete(bullet.id);
          }}
          style={{
            height: `${bullet.height}px`,
            width: `${bullet.width}px`,
            transform: initialTransform,
            position: "absolute",
            willChange: "transform",
          }}
          className={`enemyBullet ${bullet.type}${
            bullet.type === "ironman" ? (bullet.id % 2 === 0 ? " ketchup" : "") : ""
          }`}
        />
      );
    });

  const renderEnemies = () =>
    props.enemies.map((enemy, index) => {
      const idKey =
        enemy.id !== undefined && enemy.id !== null
          ? enemy.id
          : `${index}-${enemy.left}`;
      const initialTransform = `translate3d(${enemy.left}px, ${enemy.top}px, 0)`;
      return (
        <div
          key={idKey}
          id={enemy.id}
          ref={(el) => {
            if (el) nodeRefs.current.enemies.set(enemy.id, el);
            else nodeRefs.current.enemies.delete(enemy.id);
          }}
          style={{
            height: `${enemy.height - 1}px`,
            width: `${enemy.width - 1}px`,
            transform: initialTransform,
            position: "absolute",
            willChange: "transform",
          }}
          className={`enemyContainer`}
        >
          <div className="healthbar">
            <div
              className="health"
              style={{
                width: `${
                  (enemy.health / (enemy.maxHealth || enemy.health || 1)) * 100
                }%`,
              }}
            />
          </div>
          <div
            className={`enemyAnimationContainer${
              enemy.state?.length ? ` ${enemy.state.join(" ")}` : ""
            }`}
          >
            <div className={`enemy ${enemy.type}`}>
              {enemy.type === "ufo" && <SodaBottle />}
              {enemy.type === "ironman" && <HotdogPile />}
              {enemy.type === "girl" && <NachoPlate />}
            </div>
          </div>
        </div>
      );
    });

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
        {props.addGutters ? <div className="gutter left" /> : null}
        <div
          className="canvas"
          style={{
            width: `${horizontalSize}px`,
            height: `${verticalSize}px`,
            transform: `scale(${props.scale})`,
            position: "relative",
            touchAction: "none",
          }}
        >
          {renderPlayer()}
          {renderEnemies()}
          {renderPlayerBullets()}
          {renderEnemyBullets()}
          <div className="gameHealth">HEALTH: {playerHealthRef?.current}</div>
        </div>
        {props.addGutters ? <div className="gutter right" /> : null}
      </div>
    </div>
  );
};

export default Game;
