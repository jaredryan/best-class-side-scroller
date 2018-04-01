import React, {Component} from "react";
import Profile from "./Profile"
import {connect} from "react-redux";

class ProfileContainer extends Component {
    constructor() {
        super()
        this.state = {
            newPassword: "",
            newPasswordRepeat: ""
        }

        this.handleChange = this.handleChange.bind(this);
        this.clearState = this.clearState.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    clearState(){
        this.setState({
            newPassword: "",
            newPasswordRepeat: ""
        })
    }

    handleSubmit(e){
        e.preventDefault();
        // this.props.login(this.state.inputs);
        this.clearState();
    }

    render() {
        return (
            <Profile
                username={this.props.username}
                newPassword={this.state.newPassword}
                newPasswordRepeat={this.state.newPasswordRepeat}
                handleChange={this.handleChange}
                handleSubmit={this.handleSubmit}/>
        )
    }

}

const mapStateToProps = (state) => {
    return state.user;
}

export default connect(mapStateToProps, {})(ProfileContainer);
