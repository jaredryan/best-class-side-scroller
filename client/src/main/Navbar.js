import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout } from '../redux/auth';

class Navbar extends Component {
    constructor() {
        super();
        this.state = {
            clicked: false
        }

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        console.log(this.state.clicked);
        this.setState(prevState => {
            return {clicked: !prevState.clicked}
        })
    }

    render() {
        const isAuthenticated = this.props.isAuthenticated;
        let styleOverride;
        if (!isAuthenticated) {
            styleOverride = {width: "50%"}
        }
        const show = this.state.clicked ? {display: "block"} : {display: "none"}
        return (
            <div className="navbar-wrapper-wrapper">
                <h1 style={styleOverride}>NEST<br/>INVADERS</h1>
                <div className="widthSetter" style={styleOverride}>
                    <div className="navbar-wrapper">
                        { isAuthenticated ? null : <div className="nav-link"><Link to="/" className="nav-links"><h3>SIGN UP</h3></Link></div> }
                        { isAuthenticated ? null : <div className="nav-link"><Link to="/login" className="nav-links"><h3>LOG IN</h3></Link></div> }
                        { isAuthenticated ? <div className="nav-link"><Link to="/game" className="nav-links"><h3>GAME</h3></Link></div> : null }
                        { isAuthenticated ? <div className="nav-link"><Link to="/profile" className="nav-links"><h3>PROFILE</h3></Link></div> : null }
                        { isAuthenticated ?
                        <div className="nav-link">
                            <h3 onClick={this.props.logout} className="nav-links hoverH3">LOGOUT</h3>
                        </div>
                        : null }
                    </div>
                </div>
                <div className="widthSetter mobile" onClick={this.handleClick}>
                    <i class="fa fa-bars dropbtn"></i>
                    <div className="dropdown-content" style={show}>
                        { isAuthenticated ? null : <div className="nav-link"><Link to="/" className="nav-links"><h3>SIGN UP</h3></Link></div> }
                        { isAuthenticated ? null : <div className="nav-link"><Link to="/login" className="nav-links"><h3>LOG IN</h3></Link></div> }
                        { isAuthenticated ? <div className="nav-link"><Link to="/game" className="nav-links"><h3>GAME</h3></Link></div> : null }
                        { isAuthenticated ? <div className="nav-link"><Link to="/profile" className="nav-links"><h3>PROFILE</h3></Link></div> : null }
                        { isAuthenticated ?
                        <div className="nav-link">
                            <h3 onClick={this.props.logout} className="nav-links hoverH3">LOGOUT</h3>
                        </div>
                        : null }
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return state.user;
}

export default connect(mapStateToProps, { logout })(Navbar);
