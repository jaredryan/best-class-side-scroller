import React from 'react';
import { Link } from 'react-router-dom';

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
                        <Link to="/forgot">Forgot your password?</Link>
                    </div>
                </div>
            </form>
            <p>{props.errMsg}</p>
        </div>
    )
}

export default LoginForm;
