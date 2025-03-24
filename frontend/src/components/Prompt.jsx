import { useEffect, useState } from "react";
import {PROMPT_URL} from '../constants/'
import axios from "axios";
import { GEMINI_URL } from "../constants";
import api from "../api";

function Prompt({loggedIn,submittedReply,setReplySubmitted}) {
    const instructions = `Generate a question for an elderly woman 
    to write about for her blog for people to get to know her  
    make it cathartic for her to write about and also something that  
    she could write about for her kids and friends to get to know her. 
    Don't mention tapestry, use appropriate punctuation, including apostrophes 
     and keep it to no more than 300 chars. Generate a different one than last time too.

     Also generate a short summary of the question that is < 80 characters in length
    `
    const [prompt,setPrompt] = useState('')
      //const {isAuthenticated,setAuthenticationStatus} = useContext(AuthContext)
      const [replyStatus,setReplyingStatus] = useState(false)
      //const [submittedReply,setReplySubmitted] = useState(false)
      const [submitting,setSubmitting] = useState(false)
      const [replyContent, setReplyContent] = useState('')
      const [summary,setSummary] = useState('')
      const [isLoading,setLoading] = useState(true)
    

    useEffect( () => {
        setLoading(true)
        const today = new Date().toISOString().split('T')[0]
        let storedPrompts ; 
        
        
        localStorage.removeItem('dailyPrompt')
        localStorage.removeItem('usedPrompts')
        
        
        
        if (localStorage.getItem('usedPrompts')) {
            //console.log("Contains stuff" + JSON.parse(localStorage.getItem('usedPrompts')) )
            storedPrompts = JSON.parse(localStorage.getItem('usedPrompts'))
           // console.log("Contains stuff" + JSON.stringify(JSON.parse(localStorage.getItem('usedPrompts'))) )
        }
        else {
            //alert("In creating empty array")
            storedPrompts = [] 
            console.log("Type of storedPrompts: " + Array.isArray(storedPrompts))
        }
       // let storedPrompts = JSON.parse(localStorage.getItem('usedPrompts')) || []

        if (storedPrompts.length > 30) {
            localStorage.removeItem('usedPrompts')
            console.log("Cleared out old prompts")
            storedPrompts = [] 
        }

///const prompt_received = response?.data?.candidates[0]?.content?.parts[0]?.text
   //             localStorage.setItem('dailyPrompt',JSON.stringify({'prompt':prompt_received , 'promptDate' : today})) 

        const fetchPrompt = async () => {
          const target = '/api/retrieve-prompt/'

          try {
            const response = await api.get(target) 
            const data = await response.json()
            const question = data.question
            const summary = data.summary
            return {'prompt': question, 'summary' : summary}
          }

          catch {
            console.log("Error retrieving prompt!")
            return null
          }
    }
       
       //console.log(typeof(storedPrompt) + "contents: " + storedPrompts)

    const handleSettingPrompt = async () => {
        let final_prompt ;
        let summary ; 
        const dailyPrompt = JSON.parse(localStorage.getItem('dailyPrompt'))
        setLoading(true)

       if (!dailyPrompt || dailyPrompt?.promptDate != today) {
       
            let results =  await fetchPrompt()
            if (!results) {
              setPrompt("Prompt unavailable at this time")
              setLoading(false)
              return
            }
            let retrieved_prompt = results.prompt
            summary = results.summary

            if (retrieved_prompt === 'Error') {
                setPrompt("Prompt unavailable at this time")
                setLoading(false)
                return
            }
            

            while (storedPrompts.includes(retrieved_prompt)) {
                console.log(results + " has already been used")
                results =  await fetchPrompt()
                retrieved_prompt = results.prompt
                summary = results.summary
                
       }

       storedPrompts.push(results)
       localStorage.setItem('usedPrompts',JSON.stringify(storedPrompts))
       localStorage.setItem('dailyPrompt',JSON.stringify({'prompt':retrieved_prompt , 'summary' : summary, 'promptDate' : today})) 
       //console.log("Fetched and set new prompt: " + retrieved_prompt)
        final_prompt = retrieved_prompt
        } 
  
       else {
        console.log("Retrieved daily prompt")
        final_prompt = dailyPrompt.prompt
        summary = dailyPrompt.summary
       }
      
   // prompt = prompt.replace(/['"]+/g, '');
   console.log("Prompt: " + final_prompt + "Summary: " + summary)
    setPrompt(final_prompt)
    setSummary(summary)
    setLoading(false)
    }

    handleSettingPrompt()

    },[instructions])


const handlePromptReplyClick = (e) => {
    e.stopPropagation()
    setReplyingStatus(true)
    //navigate('/prompt-reply')
  }
  
  const renderReply = () => {
    return <>
    <form onSubmit={handleReplySubmission}>
     <textarea value={replyContent} onChange={(e) => setReplyContent(e.target.value)} id='reply-text-area'></textarea>
     <button id='submit-reply-btn'>Submit</button>
     </form>
     </>
  }
  const handleReplySubmission = async (e) => {
    e.preventDefault() 
    console.log("Prompt: " + prompt)
    console.log("Content: " + replyContent)
   console.log(summary)
    try { 
      const res = await api.post('/api/create/', 
        {title:`Prompt: "${summary}"`, 'content':replyContent})
      setReplySubmitted(true)
      
    }
    catch (error) {
      console.log("Error replying to prompt" + " Status Code: " + error.status)
      console.error("Error response data: ", error.response?.data);
      return false 
    }
  
  }


  const renderContent = () => {
    if (!loggedIn) {
        return
    }
    else {
        return <>
        
{submittedReply? null :
(

replyStatus ? 
renderReply() : 
<button id='reply-btn' className='enlarge-on-hover' onClick={handlePromptReplyClick}> Reply to Prompt</button>
)

}</>
    }


  }


    return <>
    <div className='prompt-container'>
        <h2>Prompt of the Day </h2>
    {isLoading ?
    <p>Loading...</p> 
    :
    <p>{prompt}</p>
    }
    </div>


{renderContent()}
</>
}
export default Prompt