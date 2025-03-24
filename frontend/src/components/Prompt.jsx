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
      console.log("Gemini 28: " + GEMINI_URL)
        setLoading(true)
        const today = new Date().toISOString().split('T')[0]
        let storedPrompts ; 
        
        /*
        localStorage.removeItem('dailyPrompt')
        localStorage.removeItem('usedPrompts')
        */
        
        
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
        setLoading(true)

        if (storedPrompts.length > 30) {
            localStorage.removeItem('usedPrompts')
            console.log("Cleared out old prompts")
            storedPrompts = [] 
        }

///const prompt_received = response?.data?.candidates[0]?.content?.parts[0]?.text
   //             localStorage.setItem('dailyPrompt',JSON.stringify({'prompt':prompt_received , 'promptDate' : today})) 

        const fetchPrompt = async () => {
          console.log("Gemini URL : ", GEMINI_URL)
          console.log("Token: " , import.meta.env.VITE_GEMINI_TOKEN)
          setLoading(true)
            try{
            const response = await axios.post(
                `${GEMINI_URL+import.meta.env.VITE_GEMINI_TOKEN}` ,
                
                {"contents": [{ //Proper payload
                        "parts":[{"text": instructions}]
                                }]
            } 
                                
/*
            {'contents' : [ {
                'parts': [{'part1': question, 'part2': "Give a summary"}]
            }

            ]}
                     */   
                /*
                Bad payload for testing
                {contents : question} 
                */
        
        )
               // console.log("Format: " + JSON.stringify(response.data))
                //const obj = `{${response?.data?.candidates[0]?.content?.parts[0]?.text}}`
                //console.log(obj)
                const text = response?.data?.candidates[0]?.content?.parts[0]?.text
                const arr = text.split("\n\n\n")
                let question = arr[0].split('Question:')
                question = question[1].trim().replace(/[^a-zA-Z'!? ]/g, "");
                let summary = arr[1].split("Summary:")[1].trim().replace(/[^a-zA-Z'!? ]/g, "");
                setLoading(false)
                //console.log(JSON.parse(JSON.stringify(response?.data?.candidates[0]?.content?.parts[0]?.text)))
                //let prompt_received = response?.data?.candidates[0]?.content?.parts[0]?.text
               // prompt_received = prompt_received.replace(/['"]+/g, '');
                return {'prompt': question, 'summary' : summary}
    }
        catch (err) { 
            console.log('Error Status Code: ' + err.status)
            return 'Error'
        }
    }
      
       

       
       //console.log(typeof(storedPrompt) + "contents: " + storedPrompts)

    const handleSettingPrompt = async () => {
        let final_prompt ;
        let summary ; 
        const dailyPrompt = JSON.parse(localStorage.getItem('dailyPrompt'))

       if (!dailyPrompt || dailyPrompt?.promptDate != today) {
       
            let results =  await fetchPrompt()
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