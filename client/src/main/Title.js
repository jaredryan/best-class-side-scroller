import React from 'react';
import { Link } from 'react-router-dom';

const Title = () => {
    return (
        <div className="titlePage">
            <div className="overlay">
                <div className="titleImage">
                </div>
            </div>
            <div className="titleText">
                <h1>WELCOME TO NEST INVADERS</h1>
                <h2>Threats from another world have come to threaten your home. You are the last line of defense. It's up to you to defend it.</h2>
                <div className="titleDescription"><div><Link to="/signup">SIGN UP</Link></div><h3>OR</h3><div><Link to="/login">LOGIN</Link></div></div>
            </div>
        </div>
    );
}

export default Title;
