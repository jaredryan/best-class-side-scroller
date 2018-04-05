import React from "react";

function Reset(props) {
    return (
        <div className="form-wrapper top-spacing">
            <form onSubmit={props.handleSubmit}>
                <h3>Email Password Reset</h3>
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
            <p>{props.errMsg}</p>
        </div>
    )
}

export default Reset;
