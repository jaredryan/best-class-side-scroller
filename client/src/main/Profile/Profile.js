import React from 'react';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

function Profile(props) {
    return (
        <div className="form-wrapper top-spacing">
            <Paper zDepth={2} className="formBox profileEdit">
                <h4 className="formSubHeader">Email</h4>
                <form onSubmit={props.handleEditEmailSubmit}>
                    <TextField
                        hintText="Email Address"
                        style={{marginLeft: 20, width: "90%"}}
                        underlineShow={false}
                        type="email"
                        name="email"
                        onChange={props.handleChange}
                        value={props.email}/>
                    <Divider />
                    <RaisedButton label="Save" primary={true} style={{margin: "auto", marginBottom: 0, marginTop: "15px", display: "block", maxWidth: "80%"}} type="submit"/>
                </form>
            </Paper>
            <Paper zDepth={2} className="formBox profileEdit">
                <h4 className="formSubHeader">Username</h4>
                <form onSubmit={props.handleEditUsernameSubmit}>
                    <TextField
                        hintText="Username"
                        style={{marginLeft: 20, width: "90%"}}
                        underlineShow={false}
                        type="text"
                        name="username"
                        onChange={props.handleChange}
                        value={props.username}/>
                    <Divider />
                    <RaisedButton label="Save" primary={true} style={{margin: "auto", marginBottom: 0, marginTop: "15px", display: "block", maxWidth: "80%"}} type="submit"/>
                </form>
            </Paper>
            <Paper zDepth={2} className="formBox profileEdit">
                <h4 className="formSubHeader">Change Password</h4>
                <form onSubmit={props.handlePasswordSubmit}>
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
                        value={props.newPasswordRepeat}/>
                    <Divider />
                    <RaisedButton label="Change Password" primary={true} style={{margin: "auto", marginBottom: 0, marginTop: "15px", display: "block", maxWidth: "80%"}} type="submit"/>
                </form>
            </Paper>
            <p className="errorMessage">{props.message}</p>
        </div>
    );
}

export default Profile;
