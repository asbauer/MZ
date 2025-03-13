import axios from "axios";
import { useEffect, useState } from "react";
import { SENTIMENT_URL } from "../constants";

function PostSentimentAnalysis({post}) {
    const [isLoading,setLoading] = useState(true)
    const [result,setResult] = useState("")
    const hf_token = import.meta.env.VITE_HF_TOKEN
  

    const [sentiment,setSentiment] = useState('')
    const [score,setScore] = useState(0)
   
    useEffect(()  => {
       
        //alert(hf_token)
        setLoading(true)
        
            try {
                axios.post(
                    SENTIMENT_URL ,
                    {
                        inputs:post
                    } , // Payload 

                    {
                        headers: {
                            Authorization: `Bearer ${import.meta.env.VITE_HF_TOKEN}`,
                            "Content-Type": "application/json",
                            
                        }
                    } // Set the Headers

                ) 
                .then((res) => {
                    const results = determineSentiment(res.data[0])
                    setSentiment(results.label)
                    setScore(results.score)
                    setLoading(false)
                    return 

                })
                .catch( () =>  {
                    console.log("Error!!!!!")
                    setSentiment("Sentiment Analysis unavailable at this time.")
                    return
            })
            }
            catch (error) {
                console.error("Error Occured")
            }

        }, [post] )

     /*


      const performSentimentAnalysis = async () => {
            try {
                axios.post(
                    SENTIMENT_URL ,
                    {
                        inputs:post
                    } , // Payload 

                    {
                        headers: {
                            Authorization: `Bearer ${import.meta.env.VITE_HF_TOKEN}`,
                            "Content-Type": "application/json",
                            
                        }
                    } // Set the Headers

                ) 
                .then((res) => {
                    const results = determineSentiment(res.data[0])
                    setSentiment(results.label)
                    setScore(results.score)
                    return 

                })
                .catch( () => console.log("Error!!!!!"))
            }

            */


     const determineSentiment = (data) => {
        let highestScore  = -Infinity
        let highestLabel = ""  ;
        const results = {"score" : -Infinity , 'label': ''}

        
        data.forEach(item => {
            const label = item.label
            const score = item.score
            

            if (score > results.score) {
                results.score = score
                results.label = label
            }

        })
        return results
        

     }


    async function query(question,context) {
        //alert(import.meta.env.VITE_HF_TOKEN)
        const response = await axios.post(
            SENTIMENT_URL, 
            {inputs: post, // Payload
            },
            {
            headers: {
                    Authorization: `Bearer ${import.meta.env.VITE_HF_TOKEN}`,
                    "Content-Type": "application/json",
                    
                }
               
            }
         );
    
        //const result = await response.json();
        //return result;
        //alert(JSON.stringify(response.data,null,2))
       // alert(response.data[0].label)
       //alert(typeof(response.data))
       console.log("Response: " + response.data[0][1].label)
        return response.data
    }

    /*
    let prompt = {'question' : 'Write a question that helps a blogger open up about their lifes'
        , 
        'context' : 'An elderly woman trying to open up about her life. '
    }
*/
/*
    query(post)
    
    .then((response) => {
        console.log(JSON.stringify(response, null, 2));
    });
    

    let objects = {'question' : 'Write a question that helps a blogger open up about their lifes'
        , 
        'context' : 'An elderly woman trying to open up about her life. '
    }
    */

    function sentimentDisplay(mood,confidence) {
        //alert(JSON.stringify(analysis))
        confidence = confidence.toFixed(2)*100 + "%"
        let tone = '' 
        if (mood === 'positive') {
            tone = 'This a positive and uplifting post!' 
        }
        else if (mood.mood === 'neutral') {
                tone = 'This is a neutral tone post'
        }
        else {
            tone = 'The tone of this post is serious and thoughtful'
        }
        return <>
            
            {mood === 'positive' ?
             <img style={{margin:'auto'}} src='/happy.jpg' width='250px' height='200px' />
            :
            null }
            <p>{tone}</p>
            <p>Accuracy Confidence: {confidence}</p>
</>
        
    }


    return <>
    <div className="sentiment-container">
        <h2>The mood of this post is...</h2>
        {isLoading? <p>Analyzing...</p> : sentimentDisplay(sentiment, score)}
   </div> 
   </>
}

export default PostSentimentAnalysis ;