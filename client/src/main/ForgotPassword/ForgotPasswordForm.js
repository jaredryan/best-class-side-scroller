import React from 'react';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

function ForgotPasswordForm(props){
    return (
        <div className="form-wrapper top-spacing">
            <Paper zDepth={2} className="formBox">
                <h3 className="formHeader">Forgotten Password?</h3>
                <p className="formDescription">Type in your email address here, and a link to
                   reset your password will be sent to your email.</p>
                <form onSubmit={props.handleSubmit}>
                    <TextField
                        hintText="Email Address"
                        style={{marginLeft: 20, width: "90%"}}
                        underlineShow={false}
                        onChange={props.handleChange}
                        value={props.email}
                        name="email"
                        type="email"/>
                    <Divider />
                    <RaisedButton label="Send" primary={true} style={{margin: "auto", marginBottom: 0, marginTop: "15px", display: "block", maxWidth: "80%"}} type="submit"/>
                </form>
            </Paper>
            <p className="errorMessage">{props.errMsg}</p>
        </div>
    );
}

export default ForgotPasswordForm;
