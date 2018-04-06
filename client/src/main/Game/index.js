import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import ScoreList from '../Scores';
import GameContainer from './GameContainer';

class GameContainerContainer extends Component {
    constructor() {
        super();
        this.state = {
            wave0: [
                {height: 50, width: 50, left: 580, top: 35, health: 1, color: "green"},
                {height: 50, width: 50, left: 580, top: 155, health: 1, color: "green"},
                {height: 50, width: 50, left: 580, top: 275, health: 1, color: "green"}
            ],
            wave1: [
                {height: 50, width: 50, left: 555, top: 35, health: 2, color: "yellow"},
                {height: 50, width: 50, left: 555, top: 155, health: 2, color: "yellow"},
                {height: 50, width: 50, left: 555, top: 275, health: 2, color: "yellow"}
            ],
            wave2: [
                {height: 50, width: 50, left: 530, top: 35, health: 3, color: "red"},
                {height: 50, width: 50, left: 530, top: 155, health: 3, color: "red"},
                {height: 50, width: 50, left: 530, top: 275, health: 3, color: "red"}
            ],
            wave3: false,
            wave4: false
        }

        this.useWave = this.useWave.bind(this)
    }

    useWave(number) {
        const wave = this.state[`wave${number}`];
        console.log(wave);
        this.setState({[`wave${number}`]: false})
        return wave;
    }

    render() {
        console.log(this.state);
        return (
            <GameContainer
                useWave={this.useWave}/>
        )
    }
}

export default GameContainerContainer;
