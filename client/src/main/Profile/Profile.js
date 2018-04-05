import React from "react";

function Profile(props) {
    return (
        <div className="top-spacing">
            <h1 className="font-username">{props.username}</h1>
            <hr/>
            <div>
                <h3>Change Password</h3>
                <form onSubmit={props.handleSubmit}>
                    <div className="centerSignup">
                        <div className="signUpDiv">
                                <input
                                    type="password"
                                    name="newPassword"
                                    onChange={props.handleChange}
                                    value={props.newPassword}
                                    placeholder="New Password"
                                />
                                <input
                                    type="password"
                                    name="newPasswordRepeat"
                                    onChange={props.handleChange}
                                    value={props.newPasswordRepeat}
                                    placeholder="Repeat New Password"
                                />
                            <button>Change Password</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Profile;
