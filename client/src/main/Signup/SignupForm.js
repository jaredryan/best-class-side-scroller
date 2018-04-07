import React from 'react';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

function SignupForm(props) {
    return (
        <div className="form-wrapper top-spacing">
            <Paper zDepth={2} className="formBox">
                <h3 className="formHeader">Sign Up</h3>
                <form onSubmit={props.handleSubmit}>
                    <TextField
                        hintText="Email Address"
                        style={{marginLeft: 20, width: "90%"}}
                        underlineShow={false}
                        name="email"
                        type="email"
                        value={props.email}
                        onChange={props.handleChange}/>
                    <Divider />
                    <TextField
                        hintText="Username"
                        style={{marginLeft: 20, width: "90%"}}
                        underlineShow={false}
                        name="username"
                        type="text"
                        value={props.username}
                        onChange={props.handleChange}/>
                    <Divider />
                    <TextField
                        hintText="Password"
                        style={{marginLeft: 20, width: "90%"}}
                        underlineShow={false}
                        name="password"
                        type="password"
                        value={props.password}
                        onChange={props.handleChange}/>
                    <Divider />
                    <RaisedButton label="Create Account" primary={true} style={{margin: "auto", marginBottom: 0, marginTop: "15px", display: "block", maxWidth: "80%"}} type="submit"/>
                </form>
            </Paper>
            <p className="errorMessage">{props.errMsg}</p>
        </div>
    );
}

export default SignupForm;
