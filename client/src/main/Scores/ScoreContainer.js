import React from 'react';
import Score from "./Score";
import { connect } from "react-redux";
import { editScoreList, deleteScoreList } from "../../redux/scores";

class ScoreContainer extends React.Component {
    handleCompleted(e){
        this.props.editScoreList(this.props.score._id, {completed: e.target.checked})
    }

    handleRemove(){
        console.log(this.props)
        this.props.deleteScoreList(this.props.score._id);
    }

    render() {
        return (
            <Score
                handleCompleted={this.handleCompleted.bind(this)}
                handleRemove={this.handleRemove.bind(this)}
                score={this.props.score}
                id={this.props.key}
                {...this.state}/>
        )
    }
}

export default connect(null,{ editScoreList, deleteScoreList })(ScoreContainer);
