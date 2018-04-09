import React, {Component} from 'react';
import GameContainer from './GameContainer';

class Level3Container extends Component {
    constructor() {
        super();
        this.state = {
            wave0: [
                {height: 29, width: 50, left: 580, top: 35, health: 3, type: "ufo", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 29, width: 50, left: 580, top: 155, health: 3, type: "ufo", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 29, width: 50, left: 580, top: 275, health: 3, type: "ufo", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 50, width: 35, left: 530, top: 295, health: 3, type: "girl", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 50, width: 34, left: 530, top: 15, health: 3, type: "ironman", moveTimer: Math.random(), shootTimer: Math.random()}
            ],
            wave1: [
                {height: 50, width: 35, left: 480, top: 295, health: 3, type: "girl", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 50, width: 34, left: 480, top: 15, health: 3, type: "ironman", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 50, width: 35, left: 430, top: 295, health: 3, type: "girl", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 50, width: 34, left: 430, top: 15, health: 3, type: "ironman", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 50, width: 35, left: 530, top: 295, health: 3, type: "girl", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 50, width: 34, left: 530, top: 15, health: 3, type: "ironman", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 29, width: 50, left: 555, top: 35, health: 3, type: "ufo", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 29, width: 50, left: 555, top: 155, health: 3, type: "ufo", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 29, width: 50, left: 555, top: 275, health: 3, type: "ufo", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 29, width: 50, left: 530, top: 295, health: 3, type: "ufo", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 29, width: 50, left: 530, top: 15, health: 3, type: "ufo", moveTimer: Math.random(), shootTimer: Math.random()}
            ],
            wave2: [
                {height: 50, width: 34, left: 480, top: 45, health: 3, type: "ironman", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 50, width: 34, left: 480, top: 15, health: 3, type: "ironman", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 50, width: 34, left: 430, top: 45, health: 3, type: "ironman", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 50, width: 34, left: 430, top: 15, health: 3, type: "ironman", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 50, width: 34, left: 530, top: 45, health: 3, type: "ironman", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 50, width: 34, left: 530, top: 15, health: 3, type: "ironman", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 29, width: 50, left: 555, top: 15, health: 3, type: "ufo", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 29, width: 50, left: 555, top: 45, health: 3, type: "ufo", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 29, width: 50, left: 555, top: 75, health: 3, type: "ufo", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 29, width: 50, left: 530, top: 105, health: 3, type: "ufo", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 29, width: 50, left: 530, top: 135, health: 3, type: "ufo", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 29, width: 50, left: 530, top: 165, health: 3, type: "ufo", moveTimer: Math.random(), shootTimer: Math.random()},
            ],
            wave3: [
                {height: 50, width: 35, left: 480, top: 295, health: 3, type: "girl", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 50, width: 35, left: 480, top: 265, health: 3, type: "girl", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 50, width: 35, left: 430, top: 295, health: 3, type: "girl", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 50, width: 35, left: 430, top: 265, health: 3, type: "girl", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 50, width: 35, left: 530, top: 295, health: 3, type: "girl", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 50, width: 35, left: 530, top: 265, health: 3, type: "girl", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 29, width: 50, left: 555, top: 180, health: 3, type: "ufo", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 29, width: 50, left: 555, top: 200, health: 3, type: "ufo", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 29, width: 50, left: 555, top: 230, health: 3, type: "ufo", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 29, width: 50, left: 530, top: 260, health: 3, type: "ufo", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 29, width: 50, left: 530, top: 290, health: 3, type: "ufo", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 29, width: 50, left: 530, top: 320, health: 3, type: "ufo", moveTimer: Math.random(), shootTimer: Math.random()}
            ],
            wave4: [
                {height: 50, width: 35, left: 480, top: 295, health: 4, type: "girl", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 50, width: 34, left: 480, top: 15, health: 4, type: "ironman", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 50, width: 35, left: 430, top: 295, health: 4, type: "girl", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 50, width: 34, left: 430, top: 15, health: 4, type: "ironman", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 50, width: 35, left: 530, top: 295, health: 4, type: "girl", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 50, width: 34, left: 530, top: 15, health: 4, type: "ironman", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 29, width: 50, left: 555, top: 35, health: 4, type: "ufo", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 29, width: 50, left: 555, top: 140, health: 4, type: "ufo", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 29, width: 50, left: 555, top: 275, health: 4, type: "ufo", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 29, width: 50, left: 530, top: 295, health: 4, type: "ufo", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 29, width: 50, left: 530, top: 15, health: 4, type: "ufo", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 29, width: 50, left: 530, top: 190, health: 4, type: "ufo", moveTimer: Math.random(), shootTimer: Math.random()}
            ]
        }

        this.useWave = this.useWave.bind(this);
        this.resetLevel = this.resetLevel.bind(this);
    }

    useWave(number) {
        const wave = this.state[`wave${number}`];
        this.setState({[`wave${number}`]: false})
        return wave;
    }

    resetLevel() {
        this.setState({
            wave0: [
                {height: 29, width: 50, left: 580, top: 35, health: 3, type: "ufo", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 29, width: 50, left: 580, top: 155, health: 3, type: "ufo", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 29, width: 50, left: 580, top: 275, health: 3, type: "ufo", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 50, width: 35, left: 530, top: 295, health: 3, type: "girl", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 50, width: 34, left: 530, top: 15, health: 3, type: "ironman", moveTimer: Math.random(), shootTimer: Math.random()}
            ],
            wave1: [
                {height: 50, width: 35, left: 480, top: 295, health: 3, type: "girl", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 50, width: 34, left: 480, top: 15, health: 3, type: "ironman", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 50, width: 35, left: 430, top: 295, health: 3, type: "girl", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 50, width: 34, left: 430, top: 15, health: 3, type: "ironman", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 50, width: 35, left: 530, top: 295, health: 3, type: "girl", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 50, width: 34, left: 530, top: 15, health: 3, type: "ironman", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 29, width: 50, left: 555, top: 35, health: 3, type: "ufo", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 29, width: 50, left: 555, top: 155, health: 3, type: "ufo", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 29, width: 50, left: 555, top: 275, health: 3, type: "ufo", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 29, width: 50, left: 530, top: 295, health: 3, type: "ufo", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 29, width: 50, left: 530, top: 15, health: 3, type: "ufo", moveTimer: Math.random(), shootTimer: Math.random()}
            ],
            wave2: [
                {height: 50, width: 34, left: 480, top: 45, health: 3, type: "ironman", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 50, width: 34, left: 480, top: 15, health: 3, type: "ironman", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 50, width: 34, left: 430, top: 45, health: 3, type: "ironman", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 50, width: 34, left: 430, top: 15, health: 3, type: "ironman", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 50, width: 34, left: 530, top: 45, health: 3, type: "ironman", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 50, width: 34, left: 530, top: 15, health: 3, type: "ironman", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 29, width: 50, left: 555, top: 15, health: 3, type: "ufo", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 29, width: 50, left: 555, top: 45, health: 3, type: "ufo", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 29, width: 50, left: 555, top: 75, health: 3, type: "ufo", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 29, width: 50, left: 530, top: 105, health: 3, type: "ufo", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 29, width: 50, left: 530, top: 135, health: 3, type: "ufo", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 29, width: 50, left: 530, top: 165, health: 3, type: "ufo", moveTimer: Math.random(), shootTimer: Math.random()},
            ],
            wave3: [
                {height: 50, width: 35, left: 480, top: 295, health: 3, type: "girl", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 50, width: 35, left: 480, top: 265, health: 3, type: "girl", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 50, width: 35, left: 430, top: 295, health: 3, type: "girl", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 50, width: 35, left: 430, top: 265, health: 3, type: "girl", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 50, width: 35, left: 530, top: 295, health: 3, type: "girl", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 50, width: 35, left: 530, top: 265, health: 3, type: "girl", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 29, width: 50, left: 555, top: 180, health: 3, type: "ufo", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 29, width: 50, left: 555, top: 200, health: 3, type: "ufo", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 29, width: 50, left: 555, top: 230, health: 3, type: "ufo", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 29, width: 50, left: 530, top: 260, health: 3, type: "ufo", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 29, width: 50, left: 530, top: 290, health: 3, type: "ufo", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 29, width: 50, left: 530, top: 320, health: 3, type: "ufo", moveTimer: Math.random(), shootTimer: Math.random()}
            ],
            wave4: [
                {height: 50, width: 35, left: 480, top: 295, health: 4, type: "girl", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 50, width: 34, left: 480, top: 15, health: 4, type: "ironman", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 50, width: 35, left: 430, top: 295, health: 4, type: "girl", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 50, width: 34, left: 430, top: 15, health: 4, type: "ironman", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 50, width: 35, left: 530, top: 295, health: 4, type: "girl", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 50, width: 34, left: 530, top: 15, health: 4, type: "ironman", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 29, width: 50, left: 555, top: 35, health: 4, type: "ufo", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 29, width: 50, left: 555, top: 140, health: 4, type: "ufo", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 29, width: 50, left: 555, top: 275, health: 4, type: "ufo", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 29, width: 50, left: 530, top: 295, health: 4, type: "ufo", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 29, width: 50, left: 530, top: 15, health: 4, type: "ufo", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 29, width: 50, left: 530, top: 190, health: 4, type: "ufo", moveTimer: Math.random(), shootTimer: Math.random()}
            ]
        });
    }

    render() {
        return (
            <GameContainer
                useWave={this.useWave}
                resetLevel={this.resetLevel}
                setLevel1={this.props.setLevel1}
                setLevel2={this.props.setLevel2}
                setLevel3={this.props.setLevel3}
                level={this.props.level}/>
        )
    }
}

export default Level3Container;
