import React from 'react';

function LoginForm(props){
    return (
        <div className="form-wrapper top-spacing">
            <form onSubmit={props.handleSubmit}>
                <h3>Log In</h3>
                <div className="centerSignup">
                    <div className="signUpDiv">
                        <input
                            onChange={props.handleChange}
                            value={props.email}
                            name="email"
                            type="email"
                            placeholder="Email Address"
                        />
                        <input
                            onChange={props.handleChange}
                            value={props.password}
                            name="password"
                            type="password"
                            placeholder="Password"
                        />
                        <button type="submit">Submit</button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default LoginForm;
