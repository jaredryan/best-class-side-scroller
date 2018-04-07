import React from 'react';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { Link } from 'react-router-dom';

function LoginForm(props){
    return (
        <div className="form-wrapper top-spacing">
            <Paper zDepth={2} className="formBox">
                <h3 className="formHeader">Log In</h3>
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
                    <TextField
                        hintText="Password"
                        style={{marginLeft: 20, width: "90%"}}
                        underlineShow={false}
                        onChange={props.handleChange}
                        value={props.password}
                        name="password"
                        type="password"/>
                    <Divider />
                    <RaisedButton label="Login" primary={true} style={{margin: "auto", marginBottom: 0, marginTop: "15px", display: "block", maxWidth: "80%"}} type="submit"/>
                </form>
                <div className="formLink">
                    <Link to="/forgot">Forgot your password?</Link>
                </div>
            </Paper>
            <p className="errorMessage">{props.errMsg}</p>
        </div>
    );
}

export default LoginForm;
