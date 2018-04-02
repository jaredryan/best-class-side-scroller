import React, {Component} from 'react';

class Canvas extends Component {
    constructor() {
        super();
        this.state = {
            playerLocation: 170,
            verticalSize: 400,
            horizontalSize: 400,
            playerHeight: 50,
            playerLength: 50,
            playerHealth: 10,
            currentEnemies: [{height: 50, width: 50, left: 200, top: 200, health: 2, color: "blue"},
            {height: 50, width: 50, left: 300, top: 300, health: 2, color: "blue"}],
            waves: [],
            playerBullets: [],
            enemyBullets: []
        }

        this.renderEnemies = this.renderEnemies.bind(this);
        this.renderPlayerBullets = this.renderPlayerBullets.bind(this);
        this.renderEnemyBullets = this.renderPlayerBullets.bind(this);
        this.handleUpStroke = this.handleUpStroke.bind(this);
        this.handleDownStroke = this.handleDownStroke.bind(this);
        this.handleShoot = this.handleShoot.bind(this);
        this.handleEnemyShoot = this.handleEnemyShoot.bind(this);
    }

    componentDidMount() {
        setInterval(() => {
            this.setState(prevState => {
                // PUT HERE EVERYTHING THAT WILL CHANGE OVER TIME
                const playerBullets = prevState.playerBullets.map((bullet, index) => {
                    let newBullet = {...bullet}
                    newBullet.left += 15
                    return newBullet
                }).filter(item => {
                    return item.left < this.state.horizontalSize;
                })

                const enemyBullets = prevState.enemyBullets.map((bullet, index) => {
                    let newBullet = {...bullet}
                    newBullet.left -= 15
                    return newBullet
                }).filter(item => {
                    return item.left > this.state.horizontalSize;
                })
                return {
                    playerBullets,
                    enemyBullets
                }
            })
        }, 30)
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
            playerBullets.push({height: 10, width: 10, left: 9 + this.state.playerLength, top: this.state.playerLocation + this.state.playerHeight / 2 - 5})
            return {playerBullets}
        });
    }

    handleEnemyShoot() {
        this.setState(prevState => {
            const enemyBullets = prevState.enemyBullets.slice();
            for (let enemy of this.state.currentEnemies) {
                enemyBullets.push({height: 10, width: 10, left: enemy.left - 10, top: enemy.top + enemy.height / 2 - 5})
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
            return <div key={index + bullet.top.toString()} style={{height: `${bullet.height - 1}px`, width: `${bullet.width - 1}px`, left: `${bullet.left}px`, top: `${bullet.top}px`}} className="playerBullet"></div>
        })
    }

    renderEnemies() {
        return this.state.currentEnemies.map((enemy, index) => {
            return <div style={{height: `${enemy.height - 1}px`, width: `${enemy.width - 1}px`, left: `${enemy.left}px`, top: `${enemy.top}px`, backgroundColor: `${enemy.color}`}} className="enemy" key={index + enemy.left.toString()}></div>
        })
    }

    render() {
        return (
            <div>
                <div className="canvas" style={{height: `${this.state.verticalSize}px`, width: `${this.state.horizontalSize}px`}}>
                    <div className="player" style={{top: `${this.state.playerLocation}px`, height: `${this.state.playerHeight - 1}px`, width: `${this.state.playerLength - 1}px`}}></div>
                    {this.renderEnemies()}
                    {this.renderPlayerBullets()}
                    {this.renderEnemyBullets()}
                </div>
                <button onClick={this.handleUpStroke}>Up</button>
                <button onClick={this.handleDownStroke}>Down</button>
                <button onClick={this.handleShoot}>Shoot</button>
                <button onClick={this.handleEnemyShoot}>Enemy Shoot</button>
            </div>
        )
    }
}

export default Canvas;