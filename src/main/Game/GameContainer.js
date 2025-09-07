import React, { Component } from 'react';
import Game from './Game';
import Instructions from '../Instructions';
import Levels from '../Levels';

class GameContainer extends Component {
    constructor() {
        super();
        this.state = {
            timer: 0,
            isRunning: "unstarted",
            hasWon: false,
            shotsFired: 0,
            score: 0
        }

        this.hasWon = this.hasWon.bind(this);
        this.hasLost = this.hasLost.bind(this);
        this.startGame = this.startGame.bind(this);
        this.restartGame = this.restartGame.bind(this);
        this.calculateScore = this.calculateScore.bind(this);
        this.shoot = this.shoot.bind(this);
    }

    componentDidMount() {
        setInterval(() => {
            this.setState(prevState => {
                if (prevState.isRunning === true) {
                    return {
                        timer: prevState.timer + 20
                    }
                } else {
                    return {
                        timer: prevState.timer
                    }
                }
            })
        }, 20)
    }

    hasWon() {
        this.setState({
            hasWon: true,
            isRunning: false
        });
    }

    hasLost() {
        this.setState({
            hasWon: false,
            isRunning: false
        });
    }

    startGame() {
        this.props.setHasPlayed(true)
        this.setState({isRunning: true})
    }

    restartGame() {
        this.props.resetLevel();
        this.setState({
            timer: 0,
            isRunning: true,
            hasWon: false,
            shotsFired: 0,
            score: 0
        })
    }

    shoot() {
        this.setState(prevState => {
            return {shotsFired: prevState.shotsFired + 1}
        })
    }

    calculateScore(health) {
        let score = 50000 - this.state.timer;
        if (score < 0) score = 0;
        score += 30000 + (1000 * health) - (100 * this.state.shotsFired)
        this.setState({score});
    }

    render() {
        let displayComponent
        if (!this.props.hasPlayed) {
            displayComponent = (
                <div className="gameWithInstructions">
                    <div className="instructionsContainer">
                        <Instructions />
                        <Levels setLevel={this.props.setLevel} level={this.props.level} />
                    </div>
                    <button onClick={this.startGame} className="start">START GAME</button>
                </div>
            )
        } else if (this.state.isRunning === true) {
            displayComponent = (
                <Game
                    timer={this.state.timer}
                    hasWon={this.hasWon}
                    hasLost={this.hasLost}
                    startGame={this.startGame}
                    useWave={this.props.useWave}
                    shoot={this.shoot}
                    calculateScore={this.calculateScore}
                    level={this.props.level}
                    currentScore={this.state.score}
                />
            )
        } else if (this.state.hasWon) {
            displayComponent = (
                <div className="gameResults">
                    <h1>You Won!</h1>
                    <div className="scoreResults">
                        <h2>Score</h2>
                        <h3>{this.state.score}</h3>
                    </div>
                    <Levels setLevel={this.props.setLevel} level={this.props.level} />
                    <button onClick={this.restartGame} className="start">PLAY AGAIN</button>
                </div>
            )
        } else if (!this.state.hasWon) {
            displayComponent = (
                <div className="gameResults">
                    <h1>Game Over</h1>
                    <Levels setLevel={this.props.setLevel} level={this.props.level} />
                    <button onClick={this.restartGame} className="start">PLAY AGAIN</button>
                </div>
            )
        }

        return (
            <div className="gamePage">
                {displayComponent}
            </div>
        )
    }
}

export default GameContainer;
