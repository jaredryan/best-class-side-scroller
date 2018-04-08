import React from 'react';
import Score from "./Score";
import { connect } from "react-redux";
import { editScore, deleteScore } from "../../redux/scores";

class ScoreContainer extends React.Component {
    constructor() {
        super()

        this.handleEdit = this.handleEdit.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
    }

    handleEdit(e){
        // Edit this later to actually work
        this.props.editScore(this.props.score._id, {})
    }

    handleRemove(){
        console.log(this.props)
        this.props.deleteScore(this.props.score._id);
    }

    render() {
        return (
            <Score
                handleEdit={this.handleEdit.bind(this)}
                handleRemove={this.handleRemove.bind(this)}
                score={this.props.score}
                id={this.props.id}
                place={this.props.place}
                {...this.state}/>
        )
    }
}

export default connect(null,{ editScore, deleteScore })(ScoreContainer);
