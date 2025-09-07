import React from 'react';

const Title = (props) => {
    return (
        <div className="titleText">
            <h1>WELCOME TO NEST INVADERS</h1>
            <h2>Threats from another world have come to threaten your home. You are the last line of defense. It's up to you to defend it.</h2>
            <div className="titleDescription">
                <button onClick={props.setPageAsGame} className="start">DEFEND</button>
            </div>
        </div>
    );
}

export default Title;
