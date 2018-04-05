import React, {Component} from "react";
import Profile from "./Profile"
import {connect} from "react-redux";
import { changePassword } from '../../redux/auth';

class ProfileContainer extends Component {
    constructor() {
        super()
        this.state = {
            newPassword: "",
            newPasswordRepeat: "",
            message: ""
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
        if (this.state.newPassword === this.state.newPasswordRepeat) {
            this.props.changePassword(this.state.newPassword);
            this.setState({message: "Your password was successfully changed."})
        } else {
            this.setState({message: "Passwords did not match."})
        }
        // this.props.login(this.state.inputs);
        this.clearState();
    }

    render() {
        let authErrCode = this.props.user.authErrCode.changePassword;
        let errMsg = this.state.message;
        if (authErrCode > 499) {
            errMsg = "Server error!";
        }

        return (
            <Profile
                username={this.props.user.username}
                newPassword={this.state.newPassword}
                newPasswordRepeat={this.state.newPasswordRepeat}
                handleChange={this.handleChange}
                handleSubmit={this.handleSubmit}
                message={errMsg}/>
        )
    }

}

const mapStateToProps = (state) => {
    return state;
}

export default connect(mapStateToProps, { changePassword })(ProfileContainer);
