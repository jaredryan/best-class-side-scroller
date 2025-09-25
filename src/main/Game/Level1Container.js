import React, {Component} from 'react';
import GameContainer from './GameContainer';

class Level1Container extends Component {
    constructor() {
        super();
        this.state = {
            wave0: [
                {height: 29, width: 50, left: 580, top: 35, health: 1, type: "ufo", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 29, width: 50, left: 580, top: 155, health: 1, type: "ufo", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 29, width: 50, left: 580, top: 275, health: 1, type: "ufo", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 50, width: 35, left: 530, top: 295, health: 1, type: "girl", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 50, width: 34, left: 530, top: 15, health: 1, type: "ironman", moveTimer: Math.random(), shootTimer: Math.random()}
            ],
            wave1: [
                {height: 29, width: 50, left: 555, top: 35, health: 2, type: "ufo", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 29, width: 50, left: 555, top: 155, health: 2, type: "ufo", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 29, width: 50, left: 555, top: 275, health: 2, type: "ufo", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 50, width: 35, left: 530, top: 295, health: 2, type: "girl", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 50, width: 34, left: 530, top: 15, health: 2, type: "ironman", moveTimer: Math.random(), shootTimer: Math.random()}
            ],
            wave2: [
                {height: 29, width: 50, left: 530, top: 35, health: 3, type: "ufo", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 29, width: 50, left: 530, top: 155, health: 3, type: "ufo", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 29, width: 50, left: 530, top: 275, health: 3, type: "ufo", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 50, width: 35, left: 530, top: 295, health: 3, type: "girl", moveTimer: Math.random(), shootTimer: Math.random()},
                {height: 50, width: 34, left: 530, top: 15, health: 3, type: "ironman", moveTimer: Math.random(), shootTimer: Math.random()}
            ],
            // wave3: false,
            // wave4: false
        }

        this.useWave = this.useWave.bind(this);
        this.resetLevel = this.resetLevel.bind(this);
    }

    useWave(number) {
        const wave = this.state[`wave${number}`];
        // defer setting wave to false to avoid updating parent during child render
        setTimeout(() => this.setState({[`wave${number}`]: false}), 0);
        return wave;
    }

    resetLevel() {
        this.setState({
            wave0: [
                {height: 29, width: 50, left: 580, top: 35, health: 1, type: "ufo"},
                {height: 29, width: 50, left: 580, top: 155, health: 1, type: "ufo"},
                {height: 29, width: 50, left: 580, top: 275, health: 1, type: "ufo"},
                {height: 50, width: 35, left: 530, top: 295, health: 1, type: "girl"},
                {height: 50, width: 34, left: 530, top: 15, health: 1, type: "ironman"}
            ],
            wave1: [
                {height: 29, width: 50, left: 555, top: 35, health: 2, type: "ufo"},
                {height: 29, width: 50, left: 555, top: 155, health: 2, type: "ufo"},
                {height: 29, width: 50, left: 555, top: 275, health: 2, type: "ufo"},
                {height: 50, width: 35, left: 530, top: 295, health: 2, type: "girl"},
                {height: 50, width: 34, left: 530, top: 15, health: 2, type: "ironman"}
            ],
            wave2: [
                {height: 29, width: 50, left: 530, top: 35, health: 3, type: "ufo"},
                {height: 29, width: 50, left: 530, top: 155, health: 3, type: "ufo"},
                {height: 29, width: 50, left: 530, top: 275, health: 3, type: "ufo"},
                {height: 50, width: 35, left: 530, top: 295, health: 3, type: "girl"},
                {height: 50, width: 34, left: 530, top: 15, health: 3, type: "ironman"}
            ],
            wave3: false,
            wave4: false
        });
    }

    render() {
        return (
            <GameContainer
                useWave={this.useWave}
                resetLevel={this.resetLevel}
                setLevel={this.props.setLevel}
                level={this.props.level}
                setHasPlayed={this.props.setHasPlayed}
                hasPlayed={this.props.hasPlayed}
            />
        )
    }
}

export default Level1Container;
