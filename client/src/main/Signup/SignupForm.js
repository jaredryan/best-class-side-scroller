import React from 'react'

function SignupForm(props) {
    return (
        <div className="form-wrapper top-spacing">
            <form onSubmit={props.handleSubmit}>
                <h3>Sign Up</h3>
                <div className="centerSignup">
                    <div className="signUpDiv">

                        <input onChange={props.handleChange}
                               value={props.email}
                               name="email"
                               type="email"
                               placeholder="Email Address"
                        />
                        <input onChange={props.handleChange}
                               value={props.username}
                               name="username"
                               type="text"
                               placeholder="Username"
                        />
                        <input onChange={props.handleChange}
                               value={props.password}
                               name="password"
                               type="password"
                               placeholder="Password"
                        />
                        <button type="submit">Create Account</button>

                    </div>
                </div>
                <p>{props.errMsg}</p>
            </form>
        </div>
    )
}

export default SignupForm
