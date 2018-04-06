import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import ScoreList from '../Scores';
import GameContainer from './GameContainer';

class GameContainerContainer extends Component {
    constructor() {
        super();
        this.state = {
            wave0: [
                {height: 50, width: 50, left: 580, top: 35, health: 1, color: "green", type: "ufo"},
                {height: 50, width: 50, left: 580, top: 155, health: 1, color: "green", type: "ufo"},
                {height: 50, width: 50, left: 580, top: 275, health: 1, color: "green", type: "ufo"},
                {height: 50, width: 50, left: 530, top: 295, health: 1, color: "green", type: "girl"},
                {height: 50, width: 50, left: 530, top: 15, health: 1, color: "green", type: "ironman"}
            ],
            wave1: [
                {height: 50, width: 50, left: 555, top: 35, health: 2, color: "yellow", type: "ufo"},
                {height: 50, width: 50, left: 555, top: 155, health: 2, color: "yellow", type: "ufo"},
                {height: 50, width: 50, left: 555, top: 275, health: 2, color: "yellow", type: "ufo"},
                {height: 50, width: 50, left: 530, top: 295, health: 2, color: "yellow", type: "girl"},
                {height: 50, width: 50, left: 530, top: 15, health: 2, color: "yellow", type: "ironman"}
            ],
            wave2: [
                {height: 50, width: 50, left: 530, top: 35, health: 3, color: "red", type: "ufo"},
                {height: 50, width: 50, left: 530, top: 155, health: 3, color: "red", type: "ufo"},
                {height: 50, width: 50, left: 530, top: 275, health: 3, color: "red", type: "ufo"},
                {height: 50, width: 50, left: 530, top: 295, health: 3, color: "red", type: "girl"},
                {height: 50, width: 50, left: 530, top: 15, health: 3, color: "red", type: "ironman"}
            ],
            wave3: false,
            wave4: false
        }

        this.useWave = this.useWave.bind(this)
    }

    useWave(number) {
        const wave = this.state[`wave${number}`];
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
