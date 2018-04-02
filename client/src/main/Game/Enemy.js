import React, {Component} from 'react';

class Canvas extends Component {
    constructor() {
        super();
        this.state = {
            map: [],
            playerLocation: 170,
            verticalSize: 400,
            horizontalSize: 400,
            playerHeight: 50,
            playerLength: 50,
            enemies: []
        }

        this.handleUpStroke = this.handleUpStroke.bind(this);
        this.handleDownStroke = this.handleDownStroke.bind(this);
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

    render() {
        return (
            <div>
                <div className="canvas" style={{height: `${this.state.verticalSize}px`, width: `${this.state.horizontalSize}px`}}>
                    <div className="player" style={{top: `${this.state.playerLocation}px`, height: `${this.state.playerHeight - 1}px`, width: `${this.state.playerLength - 1}px`}}></div>
                </div>
                <button onClick={this.handleUpStroke}>Up</button>
                <button onClick={this.handleDownStroke}>Down</button>
            </div>
        )
    }
}

export default Canvas;
