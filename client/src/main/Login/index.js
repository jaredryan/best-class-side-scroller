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
                password: ''
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
                password: ''
            }
        })
    }

    handleSubmit(e){
        e.preventDefault();
        this.props.login(this.state.inputs);
        this.clearInputs();
    }

    render(){
        return (
            <LoginForm
                handleChange={this.handleChange}
                handleSubmit={this.handleSubmit}
                {...this.state.inputs}
            />
        )
    }
}

export default connect(null, { login })(LoginFormContainer);
