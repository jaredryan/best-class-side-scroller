import React from "react";

function Profile(props) {
    return (
        <div>
            <h1>{props.username}</h1>
            <img src="http://placekitten.com/g/100/100" alt="Kittens"/>
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
