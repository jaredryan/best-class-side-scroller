import React from 'react';

function ForgotPasswordForm(props){
    return (
        <div className="form-wrapper top-spacing">
            <form onSubmit={props.handleSubmit}>
                <h3>Forgot Your Password?</h3>
                <p>Type in your email address here, and a link to
                reset your password will be sent to your email.</p>
                <div className="centerSignup">
                    <div className="signUpDiv">
                        <input
                            onChange={props.handleChange}
                            value={props.email}
                            name="email"
                            type="email"
                            placeholder="Email Address"
                        />
                        <button type="submit">Submit</button>
                    </div>
                </div>
            </form>
            <p>{props.errMsg}</p>
        </div>
    )
}

export default ForgotPasswordForm;
