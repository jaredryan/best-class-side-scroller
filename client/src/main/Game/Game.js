import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import ScoreList from '../Scores';

class Game extends Component {
    constructor() {
        super();
        this.state = {
            playerLocation: 155,
            verticalSize: 360,
            horizontalSize: 640,
            playerHeight: 50,
            playerWidth: 50,
            playerHealth: 10,
            currentEnemies: [],
            playerBullets: [],
            enemyBullets: []
        }

        this.renderEnemies = this.renderEnemies.bind(this);
        this.renderPlayerBullets = this.renderPlayerBullets.bind(this);
        this.renderEnemyBullets = this.renderEnemyBullets.bind(this);
        this.handleUpStroke = this.handleUpStroke.bind(this);
        this.handleDownStroke = this.handleDownStroke.bind(this);
        this.handleShoot = this.handleShoot.bind(this);
        this.handleEnemyShoot = this.handleEnemyShoot.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.focusDiv = this.focusDiv.bind(this);
    }

    componentDidMount() {
        setInterval(() => {
            this.setState(prevState => {
                // PUT HERE EVERYTHING THAT WILL CHANGE OVER TIME

                // Player bullets are moved right and hit targets
                const playerBullets = []
                for (let bullet of prevState.playerBullets) {
                    let newBullet = {...bullet}
                    newBullet.left += 15
                    let hit = false;
                    for (let enemy of this.state.currentEnemies) {
                        if (newBullet.left + 9 >= enemy.left &&
                            newBullet.left <= enemy.left + enemy.width &&
                            newBullet.top + 9 >= enemy.top &&
                            newBullet.top <= enemy.top + enemy.height - 1) {
                            enemy.health -= 1
                            hit = true;
                            break;
                        }
                    }
                    if (!hit && newBullet.left < this.state.horizontalSize) {
                        playerBullets.push(newBullet)
                    }
                }

                // Enemy bullets move left and hit player
                let playerHealth = prevState.playerHealth
                const enemyBullets = []
                for (let bullet of prevState.enemyBullets) {
                    let newBullet = {...bullet}
                    if (newBullet.type === "ufo") {
                        newBullet.left -= 15
                    } else if (newBullet.type === "girl") {
                        newBullet.left -= 10
                        newBullet.top -= 5
                    } else {
                        newBullet.left -= 10
                        newBullet.top += 5
                    }
                    if (newBullet.left + 9 >= 10 &&
                        newBullet.left <= 10 + this.state.playerWidth &&
                        newBullet.top + 9 >= this.state.playerLocation &&
                        newBullet.top <= this.state.playerLocation + this.state.playerHeight - 1) {
                        playerHealth -= 1
                        if (this.state.playerHealth <= 0) {
                            this.props.hasLost();
                        }
                    } else if (newBullet.left > 0 && newBullet.top > 0 && newBullet.top < prevState.verticalSize - newBullet.height) {
                        enemyBullets.push(newBullet)
                    }
                }

                // Remove enemies that are dead
                const currentEnemies = prevState.currentEnemies.length !== 0 ? prevState.currentEnemies.filter(enemy => enemy.health > 0) : [];

                // Add enemies as specified by the waves

                console.log(this.props.timer);
                let wave;
                if (this.props.timer >= 0) {
                    wave = this.props.useWave(0);
                    if (wave !== false) currentEnemies.push(...wave)
                }

                if (this.props.timer >= 10000) {
                    wave = this.props.useWave(1);
                    if (wave !== false) currentEnemies.push(...wave)
                }

                if (this.props.timer >= 20000) {
                    wave = this.props.useWave(2);
                    if (wave !== false) currentEnemies.push(...wave)
                }

                // The player wins if there are no enemies left after the final wave
                if (currentEnemies.length === 0 && this.props.timer > 20000) {
                    this.props.hasWon();
                }

                // Enemies fire in regular intervals
                let chance;
                let enemyLeft;
                for (let enemy of currentEnemies) {
                    if (this.props.timer % 1000 === 0) {
                        enemyBullets.push({height: 10, width: 10, left: enemy.left - 9, top: enemy.top + enemy.height / 2 - 5, type: enemy.type})
                    }
                    console.log(this.props.timer + 500);
                    if (this.props.timer % 1000 === 500) {
                        chance = Math.random();
                        if (enemy.type === "ufo") {
                            if (chance < 0.3333) {
                                enemy.top -= 20;
                                if (enemy.top < 0) {
                                    enemy.top = 0
                                }
                            } else if (chance < 0.6666) {
                                enemy.top += 20
                                if (enemy.top > prevState.verticalSize - enemy.height) {
                                    enemy.top = prevState.verticalSize - enemy.height
                                }
                            }
                        } else {
                            if (chance < 0.3333) {
                                enemy.left -= 20;
                                if (enemy.left < 0) {
                                    enemy.left = 0
                                }
                            } else if (chance < 0.6666) {
                                enemy.left += 20
                                if (enemy.left > prevState.horizontalSize - enemy.width) {
                                    enemy.left = prevState.horizontalSize - enemy.width
                                }
                            }
                        }
                    }
                }

                return {
                    playerBullets,
                    enemyBullets,
                    currentEnemies,
                    playerHealth
                }
            })
        }, 30)
        this.focusDiv();
    }

    componentDidUpdate() {
        if (this.props.isRunning === true) this.focusDiv();
    }

    focusDiv() {
        if (Object.keys(this.refs).length !== 0) {
            ReactDOM.findDOMNode(this.refs.game).focus();
        }
    }

    handleDownStroke() {
        this.setState(prevState => {
            const playerLocation = prevState.playerLocation + 20;
            if (playerLocation > this.state.verticalSize - this.state.playerHeight) {
                return {playerLocation: this.state.verticalSize - this.state.playerHeight}
            }
            return {playerLocation}
        });
    }

    handleUpStroke() {
        this.setState(prevState => {
            const playerLocation = prevState.playerLocation - 20;
            if (playerLocation < 0) {
                return {playerLocation: 0}
            }
            return {playerLocation}
        });
    }

    handleShoot() {
        this.setState(prevState => {
            const playerBullets = prevState.playerBullets.slice();
            playerBullets.push({height: 10, width: 10, left: 9 + this.state.playerWidth, top: this.state.playerLocation + this.state.playerHeight / 2 - 5})
            return {playerBullets}
        });
    }

    handleEnemyShoot() {
        this.setState(prevState => {
            const enemyBullets = prevState.enemyBullets.slice();
            for (let enemy of this.state.currentEnemies) {
                enemyBullets.push({height: 10, width: 10, left: enemy.left - 9, top: enemy.top + enemy.height / 2 - 5})
            }
            return {enemyBullets}
        });
    }

    renderPlayerBullets() {
        return this.state.playerBullets.map((bullet, index) => {
            return <div key={index + bullet.top.toString()} style={{height: `${bullet.height - 1}px`, width: `${bullet.width - 1}px`, left: `${bullet.left}px`, top: `${bullet.top}px`}} className="playerBullet"></div>
        })
    }

    renderEnemyBullets() {
        return this.state.enemyBullets.map((bullet, index) => {
            return <div key={index + bullet.top.toString()} style={{height: `${bullet.height - 1}px`, width: `${bullet.width - 1}px`, left: `${bullet.left}px`, top: `${bullet.top}px`}} className="enemyBullet"></div>
        })
    }

    renderEnemies() {
        return this.state.currentEnemies.map((enemy, index) => {
            return <div style={{height: `${enemy.height - 1}px`, width: `${enemy.width - 1}px`, left: `${enemy.left}px`, top: `${enemy.top}px`, backgroundColor: `${enemy.color}`}} className="enemy" key={index + enemy.left.toString()}></div>
        })
    }

    handleKeyDown(e) {
        if (e.key === " ") {
            this.handleShoot()
        } else if (e.key === "ArrowUp") {
            this.handleUpStroke()
        } else if (e.key === "ArrowDown") {
            this.handleDownStroke()
        }
    }

    render() {
        return (
            <div className="gameDiv" onKeyDown={this.handleKeyDown} tabIndex="0" ref="game">
                <div className="canvas" style={{height: `${this.state.verticalSize}px`, width: `${this.state.horizontalSize}px`}}>
                    <div className="player" style={{top: `${this.state.playerLocation}px`, height: `${this.state.playerHeight - 1}px`, width: `${this.state.playerWidth - 1}px`}}></div>
                    {this.renderEnemies()}
                    {this.renderPlayerBullets()}
                    {this.renderEnemyBullets()}
                </div>
            </div>
        )
    }
}

export default Game;
