import CreatePost from "../components/CreatePost";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GeneratePrompt from "../components/Prompt";

function ReplyToPrompt () {
    const [isLoading, setLoading] = useState(true)
    const [prompt,setPrompt] = useState('')
    const navigate = useNavigate()

    useEffect( () => {
        setLoading(true)
        const dailyPrompt = localStorage.getItem('dailyPrompt')


        if (!dailyPrompt) {
            navigate('/new')
        }
        else {
            console.log(JSON.parse((dailyPrompt)).prompt)
            let prompt_retrieved = JSON.parse(dailyPrompt).prompt

            setPrompt(prompt_retrieved)
            setLoading(false)
        }

    })

    return <>
     <GeneratePrompt />
     <textarea id='reply-text-area'></textarea>
     <button id='submit-reply-btn'>Submit</button>

    </>

}

export default ReplyToPrompt