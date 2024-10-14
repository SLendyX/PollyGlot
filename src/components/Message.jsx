import React from "react"

export default function({children: text, type=""}){
    return(
        <div className={"messages " + type}>
            <p className="message--text">
                {text}
            </p>
        </div>
    )
}