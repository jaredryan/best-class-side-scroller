import React from 'react';
import ScoreList from "./ScoreList";
import { connect } from "react-redux";
import { loadScores } from "../../redux/scores";

class ScoreListContainer extends React.Component {
    componentDidMount() {
        this.props.loadScores();
    }

    render() {
        return (
            <div className="scoreDiv">
                <button onClick={this.props.startGame} className="start">Start Game</button>
                <h3>Instructions</h3>
                <h5>Objective</h5>
                <p>Wipe out all of the enemies.</p>
                <h5>Controls</h5>
                <p>ControlsMove up and down with the arrow keys.</p>
                <p>Breath fire using the space bar.</p>
                <h4>Good Luck!</h4>
                <h2>Your Top Scores</h2>
                <h2>Current High Scores</h2>
                <ScoreList
                    scores={this.props.scores}/>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return state;
}

export default connect(mapStateToProps, {loadScores})(ScoreListContainer)
