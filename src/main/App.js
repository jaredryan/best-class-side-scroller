import React, { Component } from 'react';
import Game from './Game';
import Title from './Title';

class App extends Component {
    constructor() {
        super();
        this.state = {
            level: 1,
            page: '',
            hasPlayed: false,
        }

        this.setLevel = this.setLevel.bind(this);
        this.setPageAsTitle = this.setPageAsTitle.bind(this);
        this.setPageAsInstructions = this.setPageAsInstructions.bind(this);
        this.setPageAsGame = this.setPageAsGame.bind(this);
        this.setHasPlayed = this.setHasPlayed.bind(this);
    }

    setLevel(level) {
        this.setState({ level });
    }

    setPageAsTitle() {
        this.setState({ page: 'title' });
    }

    setPageAsInstructions() {
        this.setState({ page: 'instructions' });
    }

    setPageAsGame() {
        this.setState({ page: 'game' });
    }

    setHasPlayed(hasPlayed) {
        this.setState({ hasPlayed });
    }

    render() {
        return (
            <div className="titlePage">
                <div className="overlay">
                    <div className="titleImage" />
                </div>
                {this.state.page === 'game'
                    ? (
                        <Game
                            setPageAsGame={this.setPageAsGame}
                            setLevel={this.setLevel}
                            level={this.state.level}
                            setHasPlayed={this.setHasPlayed}
                            hasPlayed={this.state.hasPlayed}
                        />
                    )
                    : <Title setPageAsGame={this.setPageAsGame} />
                }
            </div>
        )
    }
}

export default App;
