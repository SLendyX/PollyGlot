import React from "react";

export default function({language, flagIcon, updateRadio, isChecked}){
    const selected = isChecked(language) ? "selected" : ""
    
    return (
        <label className="input-labels" htmlFor={language} >
            <input className="hidden" id={language} onChange={updateRadio} type="radio" name="language"  checked={isChecked({language})}/>
            <img className={`flag-icon ${selected}`} src={flagIcon} alt={`${language} flag`}/> 
        </label>
    )
}