import React from 'react';

const Levels = (props) => {
    const numberStyle =  {width: "68px", height: "68px", textAlign: "center", display: "inline-block", paddingBottom: "0px", paddingTop: "2px", backgroundColor: "rgb(60, 60, 60)"}
    const highlightedStyle = { ...numberStyle, backgroundColor: "#F2583E" }

    const textStyle = {color: "white", fontSize: "30px", paddingTop: "10px", paddingBottom: "4px", fontWeight: 500}

    return (
        <div className="levelButtons">
            <div style={{width: "204px", height: "136px", textAlign: "center", fontSize: "22px", fontWeight: 500, margin: "auto"}}>
                <div style={{fontSize: "22px", height: "68px", paddingTop: "19px", color: "#F2583E", background: 'black'}}>Select Difficulty</div>
                <div className="buttons">
                    <div onClick={() => props.setLevel(1)} style={props.level === 1 ? highlightedStyle : numberStyle}>
                        <div style={textStyle}>1</div>
                    </div>
                    <div onClick={() => props.setLevel(2)} style={props.level === 2 ? highlightedStyle : numberStyle}>
                        <div style={textStyle}>2</div>
                    </div>
                    <div onClick={() => props.setLevel(3)} style={props.level === 3 ? highlightedStyle : numberStyle}>
                        <div style={textStyle}>3</div>
                    </div>
                </div>
            </div>
        </div>
    )
    
}

export default Levels