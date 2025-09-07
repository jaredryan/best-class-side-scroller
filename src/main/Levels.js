import React from 'react';
import { Card, CardText } from 'material-ui/Card';

const Levels = (props) => {
    const numberStyle =  {width: "68px", height: "68px", textAlign: "center", display: "inline-block", paddingBottom: "0px", paddingTop: "2px", backgroundColor: "rgb(235, 235, 235)"}
    const highlightedStyle = { ...numberStyle, backgroundColor: "#F2583E" }

    const textStyle = {color: "black", fontSize: "30px", paddingTop: "10px", paddingBottom: "4px", fontWeight: 500}

    return (
        <div className="levelButtons">
            <Card style={{width: "204px", height: "136px", textAlign: "center", fontSize: "22px", fontWeight: 500, margin: "auto"}}>
                <CardText style={{fontSize: "22px", height: "68px", paddingTop: "19px"}}>Select Level</CardText>
                <div className="buttons">
                    <Card onClick={() => props.setLevel(1)} style={props.level === 1 ? highlightedStyle : numberStyle}>
                        <CardText style={textStyle}>1</CardText>
                    </Card>
                    <Card onClick={() => props.setLevel(2)} style={props.level === 2 ? highlightedStyle : numberStyle}>
                        <CardText style={textStyle}>2</CardText>
                    </Card>
                    <Card onClick={() => props.setLevel(3)} style={props.level === 3 ? highlightedStyle : numberStyle}>
                        <CardText style={textStyle}>3</CardText>
                    </Card>
                </div>
            </Card>
        </div>
    )
    
}

export default Levels
