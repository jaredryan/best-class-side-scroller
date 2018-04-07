import React, {Component} from "react";
import Profile from "./Profile"
import {connect} from "react-redux";
import { changePassword, editUser } from '../../redux/auth';

class ProfileContainer extends Component {
    constructor() {
        super()
        this.state = {
            email: "",
            username: "",
            newPassword: "",
            newPasswordRepeat: "",
            message: ""
        }

        this.handleChange = this.handleChange.bind(this);
        this.clearState = this.clearState.bind(this);
        this.handleEditUsernameSubmit = this.handleEditUsernameSubmit.bind(this);
        this.handleEditEmailSubmit = this.handleEditEmailSubmit.bind(this);
        this.handlePasswordSubmit = this.handlePasswordSubmit.bind(this);
    }

    componentWillMount() {
        this.setState({
            email: this.props.user.email,
            username: this.props.user.username
        })
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    clearState(){
        this.setState({
            email: "",
            username: "",
            newPassword: "",
            newPasswordRepeat: "",
            message: ""
        })
    }

    handlePasswordSubmit(e){
        e.preventDefault();
        if (this.state.newPassword === this.state.newPasswordRepeat) {
            this.props.changePassword(this.state.newPassword);
            this.setState({
                message: "Your password was successfully changed.",
                newPassword: "",
                newPasswordRepeat: ""
            })
        } else {
            this.setState({
                message: "Passwords did not match.",
                newPassword: "",
                newPasswordRepeat: ""
            })
        }
    }

    handleEditUsernameSubmit(e){
        e.preventDefault();
        this.props.editUser({username: this.state.username});
        this.setState({
            username: this.state.username,
            message: "Your username was successfully changed."
        });
    }

    handleEditEmailSubmit(e){
        e.preventDefault();
        this.props.editUser({email: this.state.email});
        this.setState({
            email: this.state.email,
            message: "Your email was successfully changed."
        });
    }

    render() {
        let authErrCode = this.props.user.authErrCode.edit;
        let errMsg = this.state.message;
        if (authErrCode > 499) {
            errMsg = "Server error!";
        }

        return (
            <Profile
                username={this.state.username}
                email={this.state.email}
                newPassword={this.state.newPassword}
                newPasswordRepeat={this.state.newPasswordRepeat}
                handleChange={this.handleChange}
                handleEditUsernameSubmit={this.handleEditUsernameSubmit}
                handleEditEmailSubmit={this.handleEditEmailSubmit}
                handlePasswordSubmit={this.handlePasswordSubmit}
                message={errMsg}/>
        )
    }
}

const mapStateToProps = (state) => {
    return state;
}

export default connect(mapStateToProps, { changePassword, editUser })(ProfileContainer);
