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
            <div>
                <button>Start Game</button>
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
