import React from 'react';
import HeroToaster from './Components/Sprites/HeroToaster';

const Title = (props) => {
    return (
        <div className="titleText">
            <div className="heroToasterCorner">
                <HeroToaster />
            </div>
            <h1 className="displayTitle">SNACK ATTACK</h1>
            <h2>
                The kitchen has gone rogue. The snacks have feelings now — and most
                of those feelings are violent.
            </h2>
            <h2 className="titleSubline">
                Enter: a tiny chef, a pea shooter, and one very questionable lunch rush.
            </h2>
            <div className="titleDescription">
                <button onClick={props.setPageAsGame} className="btn-chunky start">
                    START FOOD FIGHT
                </button>
            </div>
        </div>
    );
}

export default Title;
