import React from "react";
import frenchFlag from "../assets/fr-flag.png"
import japaneseFlag from "../assets/jpn-flag.png"
import spanishFlag from "../assets/sp-flag.png"
import OpenAI from "openai";

export default function(){
    const openai = new OpenAI({
        apiKey: import.meta.env.VITE_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true
    })


    const [hasSubmited, setHasSubtmited] = React.useState(false)

    const [language, setLanguage] = React.useState({
        french: false,
        spanish: false,
        japanese: false
    })

    const [outputText, setOutputText] = React.useState("")
    const [error, setError] = React.useState("")

    const [input, setInput] = React.useState("")
    const inputRef = React.useRef(null)

    function updateInput(e){
        const {value} = e.target
        setInput(value)
    }

    function updateRadio(e){
        const {id: key} = e.target
        setLanguage(oldLanguage =>{
            for(const key in oldLanguage){
                oldLanguage[key] = false
            }


            return {
                ...oldLanguage,
                [key]: true
            }
        })
    }

    function isChecked(key){
        return language[key]
    }

    async function translate(e){
        e.preventDefault()

        if(hasSubmited){
            setHasSubtmited(oldHasSubmited => !oldHasSubmited)
            inputRef.current.disabled = !inputRef.current.disabled
            return
        }


        const translationLanguage = Object.keys(language).filter(value => language[value])[0]
        
        if(!translationLanguage){
            console.error("Error: please select a language")
            setError("Error: please select a language")
            return 
        }

        try{

            setError("")

            console.log(inputRef)

            inputRef.current.disabled = !inputRef.current.disabled

            const messages = [
                {
                    role:'system',
                    content:`You are an expert translator. You can speak fluently in every language.
                    When given a prompt you translate it into ${translationLanguage}.`
                },
                {
                    role:"user",
                    content: input
                }
            ]

            const response = await openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: messages,
            })

            setHasSubtmited(oldHasSubmited => !oldHasSubmited)         
            setOutputText(response.choices[0].message.content)


            // console.log(response)
        }catch(err){
            console.error(err)
            setError("Something went wrong please refresh the browser")
        }
    }


    return (
        <form onSubmit={translate}>
            <h4 className="form--header">
                {hasSubmited ? "Original text" : "Text to translate"} 👇
            </h4>

            <textarea ref={inputRef} className="text-input" onChange={updateInput} value={input} placeholder="Text to translate" name="original-text"/>
            
            <h4 className="form--header">
                {hasSubmited ? "Your translation" : "Select language"} 👇
            </h4>

            { hasSubmited ? <textarea className="text-input" disabled value={outputText} name="output-text"/> : <>
                <label className="input-labels" htmlFor="french" >
                    <input id="french" onChange={updateRadio} type="radio" name="language" checked={isChecked("french")}/>
                    French 
                    <img className="flag-icon" src={frenchFlag} alt="french flag" aria-disabled />
                </label>
                <label className="input-labels" htmlFor="spanish" >
                    <input id="spanish" onChange={updateRadio} type="radio" name="language" checked={isChecked("spanish")}/>
                    Spanish 
                    <img className="flag-icon" src={spanishFlag} alt="spanish flag" aria-disabled/>
                </label>
                <label className="input-labels" htmlFor="japanese" >
                    <input id="japanese" onChange={updateRadio} type="radio" name="language"  checked={isChecked("japanese")}/>
                    Japanese 
                    <img className="flag-icon" src={japaneseFlag} alt=" japanese flag" aria-disabled/> 
                </label>
            </>}

            <button className="translate-btn">
                {hasSubmited ? "Start Over" : "Translate"}
            </button>
            {error && <p className="error-text">{error}</p>}
        </form>
    )
}