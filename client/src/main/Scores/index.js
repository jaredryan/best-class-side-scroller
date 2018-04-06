import React from 'react';
import ScoreList from "./ScoreList";
import { connect } from "react-redux";
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import { loadScores, loadMyScores } from "../../redux/scores";

class ScoreListContainer extends React.Component {
    constructor() {
        super();
        this.state = {
            instructionsAreOpen: false,
            myScoresAreOpen: false,
            allScoresAreOpen: false
        }

        this.closeInstructions = this.closeInstructions.bind(this);
        this.openInstructions = this.openInstructions.bind(this);
        this.closeMyScores = this.closeMyScores.bind(this);
        this.openMyScores = this.openMyScores.bind(this);
        this.closeAllScores = this.closeAllScores.bind(this);
        this.openAllScores = this.openAllScores.bind(this);
    }

    closeInstructions() {
        this.setState({instructionsAreOpen: false});
    }

    openInstructions() {
        this.setState({instructionsAreOpen: false});
    }

    closeMyScores() {
        this.setState({myScoresAreOpen: false});
    }

    openMyScores() {
        this.setState({myScoresAreOpen: false});
    }

    closeAllScores() {
        this.setState({allScoresAreOpen: false});
    }

    openAllScores() {
        this.setState({allScoresAreOpen: false});
    }

    componentDidMount() {
        this.props.loadScores();
        this.props.loadMyScores();
    }

    render() {
        console.log(this.props);
        const allScores = this.props.scores.allScores ? this.props.scores.allScores.sort((a, b) => b.number - a.number) : []
        const myScores = this.props.scores.myScores ? this.props.scores.myScores.sort((a, b) => b.number - a.number) : []

        return (
            <div className="scoreDiv">
                <button onClick={this.props.startGame} className="start">Start Game</button>
                <Card className="instructions">
                    <CardHeader
                      title="Instructions"
                      actAsExpander={true}
                      showExpandableButton={true}
                    />
                    <CardText expandable={true}>
                        <h5>Objective</h5>
                        <p>Protect your nest from all of the enemies.</p>
                        <h5>Controls</h5>
                        <p>Fly up and down with the arrow keys.</p>
                        <p>Shoot seeds using the space bar to send the invaders packing.</p>
                        <h4>Good Luck!</h4>
                    </CardText>
                </Card>
                <Card className="myScores">
                    <CardHeader
                      title="Your Top Scores"
                      actAsExpander={true}
                      showExpandableButton={true}
                    />
                    <CardText expandable={true}>
                        <ScoreList
                            scores={myScores}/>
                    </CardText>
                </Card>
                <Card className="allScores">
                    <CardHeader
                      title="High Scores"
                      actAsExpander={true}
                      showExpandableButton={true}
                    />
                    <CardText expandable={true}>
                        <ScoreList
                            scores={allScores}/>
                    </CardText>
                </Card>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return state;
}

export default connect(mapStateToProps, {loadScores, loadMyScores})(ScoreListContainer)
