import React from 'react';

const Title = (props) => {
    return (
        <div className="titleText">
            <h1>NEST INVADERS</h1>
            <h2>Unknown invaders threaten your nest. You are the last line of defense. Send those intruders packing.</h2>
            <div className="titleDescription">
                <button onClick={props.setPageAsGame} className="start">DEFEND</button>
            </div>
        </div>
    );
}

export default Title;
