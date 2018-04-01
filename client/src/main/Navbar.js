import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout } from '../redux/auth';

function Navbar(props){
    const isAuthenticated = props.isAuthenticated;
    return (
        <div className="navbar-wrapper">
            { isAuthenticated ? null : <div className="nav-link"><Link to="/">Sign Up</Link></div> }
            { isAuthenticated ? null : <div className="nav-link"><Link to="/login">Log In</Link></div> }
            { isAuthenticated ? <div className="nav-link"><Link to="/profile">Game</Link></div> : null }
            { isAuthenticated ? <div className="nav-link"><Link to="/profile">Profile</Link></div> : null }
            { isAuthenticated ?
            <div className="nav-link">
                <button onClick={props.logout}>Logout</button>
            </div>
            : null }
        </div>
    )
}

const mapStateToProps = (state) => {
    return state.user;
}

export default connect(mapStateToProps, { logout })(Navbar);
