import React from 'react';
import ScoreList from "./ScoreList";
import { connect } from "react-redux";
import { loadTodos } from "../../redux/scores";

class ScoreListContainer extends React.Component {
    componentDidMount() {
        this.props.loadScores();
    }

    render() {
        return (
            <ScoreList
                scores={this.props.scores}/>
        )
    }
}

const mapStateToProps = state => {
    return state;
}

export default connect(mapStateToProps, {loadTodos})(ScoreListContainer)
