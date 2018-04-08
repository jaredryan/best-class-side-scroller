import React from 'react';
import ScoreList from "./ScoreList";
import { connect } from "react-redux";
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';

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

    render() {
        console.log(this.props);
        console.log(this.props.scores);
        console.log(this.props.scores.allScores);
        console.log(this.props.scores.myScores);
        const allScores = this.props.scores.allScores ? this.props.scores.allScores
            .filter(score => score.level == this.props.level)
            .sort((a, b) => b.number - a.number) : []
        const myScores = this.props.scores.myScores ? this.props.scores.myScores
            .filter(score => score.level == this.props.level)
            .sort((a, b) => b.number - a.number) : []
        const headerStyle = {fontSize: "22px"}
        const style1 =  {width: "68px", height: "68px", textAlign: "center", display: "inline-block", paddingBottom: "0px", paddingTop: "2px", backgroundColor: this.props.level === 1 ? "#747E80" : "white"}
        const style2 =  {width: "68px", height: "68px", textAlign: "center", display: "inline-block", paddingBottom: "0px", paddingTop: "2px", backgroundColor: this.props.level === 2 ? "#747E80" : "white"}
        const style3 =  {width: "68px", height: "68px", textAlign: "center", display: "inline-block", paddingBottom: "0px", paddingTop: "2px", backgroundColor: this.props.level === 3 ? "#747E80" : "white"}

        return (
            <div className="scoreDiv">
                <button onClick={this.props.startGame} className="start">START GAME</button>
                <div className="levelButtons">
                    <Card style={{width: "204px", height: "136px", textAlign: "center", fontSize: "22px", fontWeight: 500, margin: "auto"}}>
                        <CardText style={{fontSize: "20px", height: "68px", paddingTop: "20px"}}>Level</CardText>
                        <div className="buttons">
                            <Card onClick={this.props.setLevel1} style={style1}>
                                <CardText style={{fontSize: "30px", paddingTop: "10px", paddingBottom: "4px", fontWeight: 500}}>1</CardText>
                            </Card>
                            <Card onClick={this.props.setLevel2} style={style2}>
                                <CardText style={{fontSize: "30px", paddingTop: "10px", paddingBottom: "4px", fontWeight: 500}}>2</CardText>
                            </Card>
                            <Card onClick={this.props.setLevel3} style={style3}>
                                <CardText style={{fontSize: "30px", paddingTop: "10px", paddingBottom: "4px", fontWeight: 500}}>3</CardText>
                            </Card>
                        </div>
                    </Card>
                </div>
                <Card className="instructions">
                    <CardHeader
                      title="Instructions"
                      actAsExpander={true}
                      showExpandableButton={true}
                      titleStyle={headerStyle}
                    />
                    <CardText expandable={true}>
                        <h4 className="instructionHeading">Objective</h4>
                        <p className="instructionText">Protect your nest from all of the enemies.</p>
                        <h4 className="instructionHeading">Controls</h4>
                        <p className="instructionText">Fly up and down with the arrow keys.</p>
                        <p className="instructionText">Shoot seeds using the space bar to send the invaders packing.</p>
                        <h4 className="instructionHeading">Good Luck!</h4>
                    </CardText>
                </Card>
                <Card className="myScores">
                    <CardHeader
                      title="Your Top Scores"
                      actAsExpander={true}
                      showExpandableButton={true}
                      titleStyle={headerStyle}
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
                      titleStyle={headerStyle}
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

export default connect(mapStateToProps, {})(ScoreListContainer)
