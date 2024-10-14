import React from "react";
import frenchFlag from "../assets/fr-flag.png"
import japaneseFlag from "../assets/jpn-flag.png"
import spanishFlag from "../assets/sp-flag.png"
import germanFlag from "../assets/gr-flag.png"
import OpenAI from "openai";
import Flag from "./Flag";
import sendSvg from "../assets/send-btn.svg"
import Message from "./Message";

const widthConstant = 372/33


export default function(){
    const openai = new OpenAI({
        apiKey: import.meta.env.VITE_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true
    })

    const languages = [["german", germanFlag], ["french", frenchFlag], ["spanish", spanishFlag], ["japanese", japaneseFlag]]

    const [language, setLanguage] = React.useState({
        french: false,
        spanish: false,
        japanese: false
    })

    const [input, setInput] = React.useState("")

    const [messages, setMessages] = React.useState([
        {
            text:`Select the language you want me to translate into, type your text and hit send!`,
            type:"assistant"
        }
    ])

    const [error, setError] = React.useState("")
    
    const chatAppRef = React.useRef(null)
    const chatText = React.useRef(null)
    
    const [maxChar, setMaxChar] = React.useState(-1)
    const [textAreaHeight, setTextAreaHeight] = React.useState(50)

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

        if(input == ""){
            console.error("Error: please write into the input box")
            setError("Error: please write into the input box")
            return
        }

        const translationLanguage = Object.keys(language).filter(value => language[value])[0]
        
        if(!translationLanguage){
            console.error("Error: please select a language")
            setError("Error: please select a language")
            return 
        }

        setError("")

        try{
            setMessages(oldMessages => {
                return [...oldMessages, {text: input, type:"user"}]
            })
    

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

            setInput("")

            const response = await openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: messages,
            })

            setMessages(oldMessages => {
                return [...oldMessages, {text: response.choices[0].message.content, type:"assistant"}]
            })

            // console.log(response)
        }catch(err){
            console.error(err)
            setError("Something went wrong please refresh the browser")
        }
    }
    
    const messageElements = messages.map((message, index) => {
        return (
            <Message 
                key={index} 
                type={message.type}
            >
                {message.text}
            </Message>
        )
    })


    React.useEffect(()=>{
        window.scroll({
            top: chatAppRef.current.offsetHeight-400,
            behavior: "smooth"
        })
    }, [messages])
    

    React.useEffect(() => {
        function recalculateMaxChar() {
            const paddingLeft = Number(getComputedStyle(chatText?.current).paddingLeft.slice(0, -2))
            const paddingRight = Number(getComputedStyle(chatText?.current).paddingRight.slice(0, -2))
            const width = chatText.current?.offsetWidth - paddingLeft - paddingRight - 2
            const maxCharacters = Math.round(width/widthConstant)
    
            setMaxChar(maxCharacters)

            // console.log(maxCharacters)
        }
        
        window.onresize = recalculateMaxChar
        
        if(maxChar === -1)
            recalculateMaxChar()
    }, [])

    React.useEffect(() => {
        const {scrollHeight, clientHeight} = chatText.current
        // console.log(scrollHeight, clientHeight)

        if(scrollHeight > clientHeight){
            setTextAreaHeight(scrollHeight)
        }
        else{
            const height = Math.floor(input.length/(maxChar + 1/maxChar)) * 23 + 50
            setTextAreaHeight(height)
        }
    }, [input])

    // const textAreaHeight = Math.floor(input.length/(maxChar + 1/maxChar)) * 23 + 50
    const maxHeight = Math.floor(200/(maxChar + 1/maxChar)) * 23 + 50

    return (
        <form ref={chatAppRef} onSubmit={translate}>

            <div className="chat-container">
                {messageElements}
            </div>

            <div className="text-area">
                <textarea 
                    ref={chatText} 
                    style={
                        {
                        maxHeight:`${maxHeight}px`, 
                        height: `${textAreaHeight}px`, 
                        overflow: input.length > 120 ? "visible" : "hidden"
                    }} 
                    className="chat-input" 
                    onChange={updateInput} 
                    value={input} 
                    name="original-text" 
                />
                <button className="send-btn">
                    <img src={sendSvg} alt="send button"/>
                </button>
            </div>


            <div className="select-language-container">
                {languages.map((language, index) => 
                    <Flag 
                        key={index} 
                        language={language[0]} 
                        flagIcon={language[1]} 
                        updateRadio={updateRadio} 
                        isChecked={isChecked}
                    />
                )}
            </div>


            {error && <p className="error-text">{error}</p>}
        </form>
    )
}