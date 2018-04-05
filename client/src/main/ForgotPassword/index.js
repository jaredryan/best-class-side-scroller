import React from 'react';
import { connect } from 'react-redux';
import { forgotPassword } from '../../redux/auth';
import ForgotPasswordForm from './ForgotPasswordForm';

class ForgotPasswordFormContainer extends React.Component {
    constructor(){
        super();
        this.state = {
            email: '',
            message: ''
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.submissionSuccess = this.submissionSuccess.bind(this);
    }

    handleChange(e){
        this.setState({[e.target.name]: e.target.value});
    }

    submissionSuccess(){
        this.setState({
            email: '',
            message: 'The link has been sent to your email.'
        })
    }

    handleSubmit(e){
        e.preventDefault();
        this.props.forgotPassword(this.state.email);
        this.submissionSuccess();
    }

    render(){
        let authErrCode = this.props.user.authErrCode.forgotPasswordForm;
        let errMsg = this.state.message;
        if (authErrCode < 500 && authErrCode > 399) {
            errMsg = "Invalid email!";
        } else if (authErrCode > 499) {
            errMsg = "Server error!";
        }

        return (
            <ForgotPasswordForm
                handleChange={this.handleChange}
                handleSubmit={this.handleSubmit}
                errMsg={errMsg}
                {...this.state}
            />
        )
    }
}

export default connect(null, { forgotPassword })(ForgotPasswordFormContainer);
