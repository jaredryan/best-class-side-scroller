import React from 'react';
import ScoreList from "./ScoreList";
import { connect } from "react-redux";
import { loadScores, loadMyScores } from "../../redux/scores";

class ScoreListContainer extends React.Component {
    componentDidMount() {
        this.props.loadScores();
        this.props.loadMyScores();
    }

    render() {
        const allScores = this.props.allScores ? this.props.allScores.sort((a, b) => b.number - a.number) : []
        const myScores = this.props.myScores ? this.props.myScores.sort((a, b) => b.number - a.number) : []

        console.log(this.props);
        return (
            <div className="scoreDiv">
                <button onClick={this.props.startGame} className="start">Start Game</button>
                <h3>Instructions</h3>
                <h5>Objective</h5>
                <p>Protect your nest from all of the enemies.</p>
                <h5>Controls</h5>
                <p>Fly up and down with the arrow keys.</p>
                <p>Shoot seeds using the space bar to send the invaders packing.</p>
                <h4>Good Luck!</h4>
                <h2>Your Top Scores</h2>
                <ScoreList
                    scores={myScores}/>
                <h2>Current High Scores</h2>
                <ScoreList
                    scores={allScores}/>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return state;
}

export default connect(mapStateToProps, {loadScores, loadMyScores})(ScoreListContainer)
