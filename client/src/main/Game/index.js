import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import ScoreList from '../Scores';

class Canvas extends Component {
    constructor() {
        super();
        this.state = {
            playerLocation: 170,
            verticalSize: 400,
            horizontalSize: 400,
            playerHeight: 50,
            playerWidth: 50,
            playerHealth: 10,
            currentEnemies: [{height: 50, width: 50, left: 200, top: 200, health: 2, color: "blue", id: 1},
            {height: 50, width: 50, left: 300, top: 300, health: 2, color: "blue", id: 2}],
            waves: [],
            playerBullets: [],
            enemyBullets: [],
            isRunning: "unstarted",
            message: ""
        }

        this.renderEnemies = this.renderEnemies.bind(this);
        this.renderPlayerBullets = this.renderPlayerBullets.bind(this);
        this.renderEnemyBullets = this.renderEnemyBullets.bind(this);
        this.handleUpStroke = this.handleUpStroke.bind(this);
        this.handleDownStroke = this.handleDownStroke.bind(this);
        this.handleShoot = this.handleShoot.bind(this);
        this.handleEnemyShoot = this.handleEnemyShoot.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.startGame = this.startGame.bind(this);
        this.focusDiv = this.focusDiv.bind(this);
    }

    componentDidMount() {
        setInterval(() => {
            this.setState(prevState => {
                // PUT HERE EVERYTHING THAT WILL CHANGE OVER TIME
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

                let playerHealth = prevState.playerHealth
                const enemyBullets = []
                for (let bullet of prevState.enemyBullets) {
                    let newBullet = {...bullet}
                    newBullet.left -= 15
                    if (newBullet.left + 9 >= 10 &&
                        newBullet.left <= 10 + this.state.playerWidth &&
                        newBullet.top + 9 >= this.state.playerLocation &&
                        newBullet.top <= this.state.playerLocation + this.state.playerHeight - 1) {
                        playerHealth -= 1
                        if (this.state.playerHealth <= 0) {
                            return {isRunning: false}
                        }
                    } else if (newBullet.left > 0) {
                        enemyBullets.push(newBullet)
                    }
                }


                const currentEnemies = prevState.currentEnemies.filter(enemy => enemy.health > 0);

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
        if (this.state.isRunning === true) this.focusDiv();
    }

    focusDiv() {
        if (Object.keys(this.refs).length !== 0) {
            ReactDOM.findDOMNode(this.refs.game).focus();
        }
    }

    handleDownStroke() {
        this.setState(prevState => {
            if (prevState.playerLocation < this.state.verticalSize - this.state.playerHeight) {
                return {playerLocation: prevState.playerLocation + 10}
            }
        });
    }

    handleUpStroke() {
        this.setState(prevState => {
            if (prevState.playerLocation > 0) {
                return {playerLocation: prevState.playerLocation - 10}
            }
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
            console.log(bullet);
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

    startGame() {
        this.setState({isRunning: true})
    }

    render() {
        return (
            <div>
                {this.state.isRunning === true ?
                    <div className="gameDiv" onKeyDown={this.handleKeyDown} tabIndex="0" ref="game">
                        <div className="canvas" style={{height: `${this.state.verticalSize}px`, width: `${this.state.horizontalSize}px`}}>
                            <div className="player" style={{top: `${this.state.playerLocation}px`, height: `${this.state.playerHeight - 1}px`, width: `${this.state.playerWidth - 1}px`}}></div>
                            {this.renderEnemies()}
                            {this.renderPlayerBullets()}
                            {this.renderEnemyBullets()}
                        </div>
                    </div>
                    :
                    this.state.isRunning === false ?
                        <h1>Game Over</h1>
                        :
                        <ScoreList
                            startGame={this.startGame}
                        />
                }
            </div>
        )
    }
}

export default Canvas;
