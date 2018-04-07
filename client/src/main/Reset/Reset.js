import React from 'react';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

function Reset(props) {
    return (
        <div className="form-wrapper top-spacing">
            <Paper zDepth={2} className="formBox">
                <h3 className="formHeader">Email Password Reset</h3>
                <form onSubmit={props.handleSubmit}>
                    <TextField
                        hintText="New Password"
                        style={{marginLeft: 20, width: "90%"}}
                        underlineShow={false}
                        type="password"
                        name="newPassword"
                        onChange={props.handleChange}
                        value={props.newPassword}/>
                    <Divider />
                    <TextField
                        hintText="Repeat New Password"
                        style={{marginLeft: 20, width: "90%"}}
                        underlineShow={false}
                        type="password"
                        name="newPasswordRepeat"
                        onChange={props.handleChange}
                        value={props.newPassword}/>
                    <Divider />
                    <RaisedButton label="Change Password" primary={true} style={{margin: "auto", marginBottom: 0, marginTop: "15px", display: "block", maxWidth: "80%"}} type="submit"/>
                </form>
            </Paper>
            <p className="errorMessage">{props.message}</p>
        </div>
    );
}

export default Reset;
