import React, {Component} from 'react';
import GameContainer from './GameContainer';

class GameContainerContainer extends Component {
    constructor() {
        super();
        this.state = {
            wave0: [
                {height: 29, width: 50, left: 580, top: 35, health: 1, type: "ufo"},
                {height: 29, width: 50, left: 580, top: 155, health: 1, type: "ufo"},
                {height: 29, width: 50, left: 580, top: 275, health: 1, type: "ufo"},
                {height: 50, width: 35, left: 530, top: 295, health: 1, type: "girl"},
                {height: 50, width: 34, left: 530, top: 15, health: 1, type: "ironman"}
            ],
            wave1: false,
            // [
            //     {height: 29, width: 50, left: 555, top: 35, health: 2, type: "ufo"},
            //     {height: 29, width: 50, left: 555, top: 155, health: 2, type: "ufo"},
            //     {height: 29, width: 50, left: 555, top: 275, health: 2, type: "ufo"},
            //     {height: 50, width: 35, left: 530, top: 295, health: 2, type: "girl"},
            //     {height: 50, width: 34, left: 530, top: 15, health: 2, type: "ironman"}
            // ],
            wave2: false,
            // [
            //     {height: 29, width: 50, left: 530, top: 35, health: 3, type: "ufo"},
            //     {height: 29, width: 50, left: 530, top: 155, health: 3, type: "ufo"},
            //     {height: 29, width: 50, left: 530, top: 275, health: 3, type: "ufo"},
            //     {height: 50, width: 35, left: 530, top: 295, health: 3, type: "girl"},
            //     {height: 50, width: 34, left: 530, top: 15, health: 3, type: "ironman"}
            // ],
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
        return (
            <GameContainer
                useWave={this.useWave}/>
        )
    }
}

export default GameContainerContainer;
