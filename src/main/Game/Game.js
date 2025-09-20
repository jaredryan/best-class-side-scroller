import React, { Component } from "react";
import ReactDOM from "react-dom";

class Game extends Component {
  constructor() {
    super();
    this.state = {
      playerLocation: 155,
      verticalSize: 360,
      horizontalSize: 640,
      playerHeight: 35,
      playerWidth: 50,
      playerHealth: 10,
      currentEnemies: [],
      playerBullets: [],
      enemyBullets: [],
      scale: 1,
      gameContainerStyleWidth: {},
    };

    const maxScale = 1.5
    this.state.maxVerticalSize = this.state.verticalSize * maxScale
    this.state.maxHorizontalSize = this.state.horizontalSize * maxScale

    this.isDragging = false;
    this.shootInterval = null;
    this.delayBetweenShots = 200;

    this.renderEnemies = this.renderEnemies.bind(this);
    this.renderPlayerBullets = this.renderPlayerBullets.bind(this);
    this.renderEnemyBullets = this.renderEnemyBullets.bind(this);
    this.handleShoot = this.handleShoot.bind(this);
    this.handleEnemyShoot = this.handleEnemyShoot.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.focusDiv = this.focusDiv.bind(this);
    this.movePlayerTo = this.movePlayerTo.bind(this);
    this.handleTouch = this.handleTouch.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.startAutoShoot = this.startAutoShoot.bind(this);
    this.stopAutoShoot = this.stopAutoShoot.bind(this);
    this.updateScale = this.updateScale.bind(this);
  }

  componentDidMount() {
    this.updateScale();
    window.addEventListener("resize", this.updateScale);

    setInterval(() => {
      this.setState((prevState) => {
        // PUT HERE EVERYTHING THAT WILL CHANGE OVER TIME

        // Player bullets are moved right and hit targets
        const playerBullets = [];
        for (let bullet of prevState.playerBullets) {
          let newBullet = { ...bullet };
          newBullet.left += 15;
          let hit = false;
          for (let enemy of this.state.currentEnemies) {
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
          if (!hit && newBullet.left < this.state.horizontalSize) {
            playerBullets.push(newBullet);
          }
        }

        // Enemy bullets move left and hit player
        let playerHealth = prevState.playerHealth;
        const enemyBullets = [];
        for (let bullet of prevState.enemyBullets) {
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
            newBullet.left <= 10 + this.state.playerWidth &&
            newBullet.top + 9 >= this.state.playerLocation &&
            newBullet.top <=
              this.state.playerLocation + this.state.playerHeight - 1
          ) {
            playerHealth -= 1;
            if (this.state.playerHealth <= 1) {
              this.props.hasLost();
            }
          } else if (
            newBullet.left > 0 &&
            newBullet.top > 0 &&
            newBullet.top < prevState.verticalSize - newBullet.height
          ) {
            enemyBullets.push(newBullet);
          }
        }

        // Remove enemies that are dead
        const currentEnemies =
          prevState.currentEnemies.length !== 0
            ? prevState.currentEnemies.filter((enemy) => enemy.health > 0)
            : [];

        // Add enemies as specified by the waves
        let wave;
        if (this.props.timer > 3000) {
          wave = this.props.useWave(0);
          if (wave !== false) currentEnemies.push(...wave);

          if (currentEnemies.length === 0 || this.props.timer >= 13000) {
            wave = this.props.useWave(1);
            if (wave !== false) currentEnemies.push(...wave);
          }

          if (currentEnemies.length === 0 || this.props.timer >= 23000) {
            wave = this.props.useWave(2);
            if (wave !== false) currentEnemies.push(...wave);
          }
        }

        // The player wins if there are no enemies left after the final wave
        if (currentEnemies.length === 0 && this.props.timer > 23000) {
          this.props.calculateScore(this.state.playerHealth);
          this.props.hasWon();
        }

        // Enemies fire in regular intervals
        let chance;
        for (let enemy of currentEnemies) {
          if (this.props.timer % 1000 === 0) {
            enemy.moveTimer = Math.random() * 1000;
            enemy.shootTimer = Math.random() * 1000;
          }
          if (this.props.timer % 1000 >= enemy.shootTimer) {
            enemy.shootTimer = 1000;
            if (enemy.type === "ufo") {
              enemyBullets.push({
                height: 8,
                width: 20,
                left: enemy.left - 15,
                top: enemy.top + enemy.height / 2 - 5,
                type: enemy.type,
              });
            } else if (enemy.type === "ironman") {
              enemyBullets.push({
                height: 8,
                width: 24,
                left: enemy.left - 23,
                top: enemy.top + enemy.height / 2 - 5,
                type: enemy.type,
              });
            } else {
              enemyBullets.push({
                height: 15,
                width: 15,
                left: enemy.left - 14,
                top: enemy.top + enemy.height / 2 - 5,
                type: enemy.type,
              });
            }
          }
          if (this.props.timer % 1000 >= enemy.moveTimer) {
            enemy.moveTimer = 1000;
            chance = Math.random();
            if (enemy.type === "ufo") {
              if (chance < 0.3333) {
                enemy.top -= 20;
                if (enemy.top < 0) {
                  enemy.top = 0;
                }
              } else if (chance < 0.6666) {
                enemy.top += 20;
                if (enemy.top > prevState.verticalSize - enemy.height) {
                  enemy.top = prevState.verticalSize - enemy.height;
                }
              }
            } else {
              if (chance < 0.3333) {
                enemy.left -= 20;
                if (enemy.left < 0) {
                  enemy.left = 0;
                }
              } else if (chance < 0.6666) {
                enemy.left += 20;
                if (enemy.left > prevState.horizontalSize - enemy.width) {
                  enemy.left = prevState.horizontalSize - enemy.width;
                }
              }
            }
          }
        }

        this.props.calculateScore(this.state.playerHealth);

        return {
          playerBullets,
          enemyBullets,
          currentEnemies,
          playerHealth,
        };
      });
    }, 30);
    this.focusDiv();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateScale);
  }

  updateScale = () => {
    const { horizontalSize, verticalSize, maxHorizontalSize, maxVerticalSize } = this.state;

    // max scale to fill screen
    let scaleWidth = Math.min(window.innerWidth, maxHorizontalSize) / horizontalSize;
    let scaleHeight = Math.min(window.innerHeight, maxVerticalSize) / verticalSize;

    const gameContainerStyleWidth = {
      width: window.innerWidth < horizontalSize
        ? `100%`
        : `100vw`
    }

    // Now, need to handle situation where the height or width becomes less than 
    // verticalSize or horizontalSize. 

    this.setState({
      scale: Math.min(scaleWidth, scaleHeight),
      gameContainerStyleWidth,
    });
  };

  componentDidUpdate() {
    if (this.props.isRunning === true) this.focusDiv();
  }

  focusDiv() {
    if (Object.keys(this.refs).length !== 0) {
      ReactDOM.findDOMNode(this.refs.game).focus();
    }
  }

  handleShoot() {
    setTimeout(() => {
      const now = Date.now();
      if (now - this.lastShotTime < this.delayBetweenShots) return;
      this.lastShotTime = now;

      this.props.shoot();
      this.setState((prevState) => {
        const playerBullets = prevState.playerBullets.slice();
        playerBullets.push({
          height: 10,
          width: 10,
          left: 9 + this.state.playerWidth,
          top: this.state.playerLocation + this.state.playerHeight / 2 - 5,
        });
        return { playerBullets };
      });
    }, 10);
  }

  handleEnemyShoot() {
    this.setState((prevState) => {
      const enemyBullets = prevState.enemyBullets.slice();
      for (let enemy of this.state.currentEnemies) {
        enemyBullets.push({
          height: 10,
          width: 10,
          left: enemy.left - 9,
          top: enemy.top + enemy.height / 2 - 5,
        });
      }
      return { enemyBullets };
    });
  }

  renderPlayerBullets() {
    return this.state.playerBullets.map((bullet, index) => {
      return (
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
      );
    });
  }

  renderEnemyBullets() {
    return this.state.enemyBullets.map((bullet, index) => {
      return (
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
      );
    });
  }

  renderEnemies() {
    return this.state.currentEnemies.map((enemy, index) => {
      return (
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
      );
    });
  }

  handleKeyDown(e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.key === " ") {
      this.handleShoot();
    }
  }

  movePlayerTo(y) {
    this.setState((prevState) => {
      let newY = y - prevState.playerHeight / 2; // center bird on touch/click
      if (newY < 0) newY = 0;
      if (newY > prevState.verticalSize - prevState.playerHeight) {
        newY = prevState.verticalSize - prevState.playerHeight;
      }
      return { playerLocation: newY };
    });
  }

  handleTouch(e) {
    e.preventDefault();

    const canvas = e.currentTarget.querySelector(".canvas");
    const canvasRect = canvas.getBoundingClientRect();
    const oneThirdPoint = this.state.horizontalSize / 3;
    const twoThirdsPoint = oneThirdPoint * 2;

    for (let i = 0; i < e.touches.length; i++) {
      const touch = e.touches[i];
      const x = (touch.clientX - canvasRect.left) / this.state.scale;
      const y = (touch.clientY - canvasRect.top) / this.state.scale;

      if (x <= twoThirdsPoint) this.movePlayerTo(y);
      if (x >= oneThirdPoint) {
        this.handleShoot();
        this.startAutoShoot();
      }
    }
  }

  handleTouchEnd(e) {
    e.preventDefault();

    const canvas = e.currentTarget.querySelector(".canvas");
    const canvasRect = canvas.getBoundingClientRect();
    const oneThirdPoint = this.state.horizontalSize / 3; // divide into thirds

    for (let i = 0; i < e.touches.length; i++) {
      const touch = e.touches[i];
      const x = (touch.clientX - canvasRect.left) / this.state.scale;

      if (x > oneThirdPoint) return;
    }

    this.stopAutoShoot();
  }

  handleMouseDown(e) {
    this.isDragging = true;
    this.handleMouseMove(e); // update immediately
    this.startAutoShoot();
  }

  handleMouseUp() {
    this.isDragging = false;
    this.stopAutoShoot();
  }

  startAutoShoot() {
    if (this.shootInterval) return;
    this.shootInterval = setInterval(() => {
      this.handleShoot();
    }, this.delayBetweenShots);
  }

  stopAutoShoot() {
    if (this.shootInterval) {
      clearInterval(this.shootInterval);
      this.shootInterval = null;
    }
  }

  handleMouseMove(e) {
    const canvas = e.currentTarget.querySelector(".canvas");
    const canvasRect = canvas.getBoundingClientRect(); // get actual canvas position
    const y = (e.clientY - canvasRect.top) / this.state.scale; // account for top + scale
    this.movePlayerTo(y);

    if (this.isDragging) {
      this.handleShoot();
    }
  }

  handleClick(e) {
    if (e.currentTarget) {
      this.handleShoot();
    }
  }

  render() {
    return (
      <div
        className="gameDiv"
        onKeyDown={this.handleKeyDown}
        tabIndex="0"
        ref="game"
      >
        <div
          onMouseDown={this.handleMouseDown}
          onMouseUp={this.handleMouseUp}
          onMouseLeave={this.handleMouseUp}
          onMouseMove={this.handleMouseMove}
          onTouchStart={this.handleTouch}
          onTouchMove={this.handleTouch}
          onTouchEnd={this.handleTouchEnd}
          onClick={this.handleClick}
          className="gameContainer"
          style={this.state.gameContainerStyleWidth}
        >
          <div
            className="canvas"
            style={{
              width: `${this.state.horizontalSize}px`,
              height: `${this.state.verticalSize}px`,
              transform: `scale(${this.state.scale})`,
            }}
          >
            <div
              className="player"
              style={{
                top: `${this.state.playerLocation}px`,
                height: `${this.state.playerHeight - 1}px`,
                width: `${this.state.playerWidth - 1}px`,
              }}
            />
            {this.renderEnemies()}
            {this.renderPlayerBullets()}
            {this.renderEnemyBullets()}
            <div className="gameHealth">HP: {this.state.playerHealth}</div>
            <div className="gameScore">SCORE: {this.props.currentScore}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default Game;
