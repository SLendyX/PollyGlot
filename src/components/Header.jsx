import React from "react";
import parrot from "../assets/parrot.png"

export default function(){
    return(
        <div className="banner">
            <img src={parrot} alt="A colourful parrot"/>
            <div className="banner--text-container">
                <h1 className="banner--header">PollyGlot</h1>
                <p className="banner-subheader">Perfect translation every time</p>
            </div>
        </div>        
    )
}