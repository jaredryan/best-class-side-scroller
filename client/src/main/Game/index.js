import React, {Component} from 'react';
import Level1Container from './Level1Container';
import Level2Container from './Level2Container';
import Level3Container from './Level3Container';
import { loadScores, loadMyScores } from "../../redux/scores";
import { connect } from "react-redux";

class LevelSetter extends Component {
    constructor() {
        super();
        this.state = {
            level: 1
        }

        this.setLevel1 = this.setLevel1.bind(this);
        this.setLevel2 = this.setLevel2.bind(this);
        this.setLevel3 = this.setLevel3.bind(this);
    }

    componentDidMount() {
        this.props.loadScores();
        this.props.loadMyScores();
    }

    setLevel1() {
        this.setState({level: 1})
    }

    setLevel2() {
        this.setState({level: 2})
    }

    setLevel3() {
        this.setState({level: 3})
    }

    render() {
        return (
            <div>
                {this.state.level === 1 ?
                    <Level1Container
                        setLevel1={this.setLevel1}
                        setLevel2={this.setLevel2}
                        setLevel3={this.setLevel3}
                        level={this.state.level}/>
                    :
                    this.state.level === 2 ?
                        <Level2Container
                            setLevel1={this.setLevel1}
                            setLevel2={this.setLevel2}
                            setLevel3={this.setLevel3}
                            level={this.state.level}/>
                        :
                        <Level3Container
                            setLevel1={this.setLevel1}
                            setLevel2={this.setLevel2}
                            setLevel3={this.setLevel3}
                            level={this.state.level}/>
                }
            </div>

        )
    }
}

const mapStateToProps = state => {
    return state;
}

export default connect(mapStateToProps, {loadScores, loadMyScores})(LevelSetter)
