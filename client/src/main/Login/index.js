import React from 'react';
import { connect } from 'react-redux';
import { login } from '../../redux/auth';
import LoginForm from './LoginForm';

class LoginFormContainer extends React.Component {
    constructor(){
        super();
        this.state = {
            inputs: {
                email: '',
                password: '',
                message: ''
            }
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e){
        e.persist();
        this.setState(prevState => {
            return {
                inputs: {
                    ...prevState.inputs,
                    [e.target.name]: e.target.value
                }
            }
        })
    }

    clearInputs(){
        this.setState({
            inputs: {
                email: '',
                password: '',
                message: ''
            }
        })
    }

    handleSubmit(e){
        e.preventDefault();
        this.props.login(this.state.inputs);
        this.clearInputs();
    }

    render(){
        let authErrCode = this.props.user.authErrCode.signin;
        let errMsg = this.state.message;
        if (authErrCode < 500 && authErrCode > 399) {
            errMsg = "Invalid email or password!";
        } else if (authErrCode > 499) {
            errMsg = "Server error!";
        }

        return (
            <LoginForm
                handleChange={this.handleChange}
                handleSubmit={this.handleSubmit}
                errMsg={errMsg}
                {...this.state.inputs}
            />
        )
    }
}

export default connect(null, { login })(LoginFormContainer);
