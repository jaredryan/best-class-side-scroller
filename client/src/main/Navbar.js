import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout } from '../redux/auth';

function Navbar(props){
    const isAuthenticated = props.isAuthenticated;
    return (
        <div className="navbar-wrapper-wrapper">
            <div className="navbar-wrapper">
                { isAuthenticated ? null : <div className="nav-link"><Link to="/" className="nav-links"><h3>Sign Up</h3></Link></div> }
                { isAuthenticated ? null : <div className="nav-link"><Link to="/login" className="nav-links"><h3>Log In</h3></Link></div> }
                { isAuthenticated ? <div className="nav-link"><Link to="/game" className="nav-links"><h3>Game</h3></Link></div> : null }
                { isAuthenticated ? <div className="nav-link"><Link to="/profile" className="nav-links"><h3>Profile</h3></Link></div> : null }
                { isAuthenticated ?
                <div className="nav-link">
                    <h3 onClick={props.logout} className="nav-links hoverH3">Logout</h3>
                </div>
                : null }
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return state.user;
}

export default connect(mapStateToProps, { logout })(Navbar);
