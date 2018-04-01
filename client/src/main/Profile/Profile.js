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
                    <div>
                        <label>New Password
                        <input
                            type="password"
                            name="newPassword"
                            onChange={props.handleChange}
                            value={props.newPassword}/>
                        </label>
                    </div>
                    <div>
                        <label>Repeat New Password
                        <input
                            type="password"
                            name="newPasswordRepeat"
                            onChange={props.handleChange}
                            value={props.newPasswordRepeat}/>
                        </label>
                    </div>
                    <button>Change Password</button>
                </form>
            </div>
        </div>
    )
}

export default Profile;
