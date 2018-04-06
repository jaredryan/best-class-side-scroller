import React, {Component} from "react";
import Reset from "./Reset"
import {connect} from "react-redux";
// import { Route, Switch, withRouter, Redirect } from "react-router-dom";
import { resetPassword } from '../../redux/auth';

class ResetContainer extends Component {
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
            this.props.resetPassword(this.state.newPassword, this.props.location.pathname.slice(7));
            alert("Your password was successfully changed.");
            this.props.history.push("/login");
        } else {
            this.setState({message: "Passwords did not match."})
        }
    }

    render() {
        let authErrCode = this.props.user.authErrCode.changePassword;
        let errMsg = this.state.message;
        if (authErrCode > 499) {
            errMsg = "Server error!";
        }

        return (
            <Reset
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

export default connect(mapStateToProps, { resetPassword })(ResetContainer);
