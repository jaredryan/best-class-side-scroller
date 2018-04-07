import React, {Component} from 'react';
import ScoreList from '../Scores';
import Game from './Game';
import { addScore } from '../../redux/scores';
import { connect } from 'react-redux';

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
        score += 20000 + (1000 * health) - (10 * this.state.shotsFired)
        this.props.addScore(score);
        this.setState({score});
    }

    render() {
        return (
            <div className="gamePage top-spacing">
                {this.state.isRunning === true ?
                    <Game
                        timer={this.state.timer}
                        waves={this.state.waves1}
                        hasWon={this.hasWon}
                        hasLost={this.hasLost}
                        startGame={this.startGame}
                        useWave={this.props.useWave}
                        shoot={this.shoot}
                        calculateScore={this.calculateScore}/>
                    :
                    (this.state.isRunning === false ?
                        (this.state.hasWon === false ?
                            <div className="gameResults">
                                <button onClick={this.restartGame} className="start">PLAY AGAIN</button>
                                <h1>Game Over</h1>
                            </div>
                            :
                            <div className="gameResults">
                                <button onClick={this.restartGame} className="start">PLAY AGAIN</button>
                                <h1>You Won!</h1>
                                <h2>Score</h2>
                                <h3>{this.state.score}</h3>
                            </div>)
                        :
                        (<ScoreList
                            startGame={this.startGame}
                        />)
                    )
                }
            </div>
        )
    }
}

export default connect(null, { addScore })(GameContainer);
