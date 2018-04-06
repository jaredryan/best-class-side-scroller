import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import ScoreList from '../Scores';
import Game from './Game';

class GameContainer extends Component {
    constructor() {
        super();
        this.state = {
            timer: 0,
            isRunning: "unstarted",
            hasWon: false,
        }

        this.hasWon = this.hasWon.bind(this);
        this.hasLost = this.hasLost.bind(this);
        this.startGame = this.startGame.bind(this);
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
                        useWave={this.props.useWave}/>
                    :
                    (this.state.isRunning === false ?
                        (this.state.hasWon === false ?
                            <h1>Game Over</h1>
                            :
                            <h1>You Won!</h1>)
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

export default GameContainer;
