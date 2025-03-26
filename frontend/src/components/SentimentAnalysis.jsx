import axios from "axios";
import { useEffect, useState } from "react";
import { SENTIMENT_URL } from "../constants";

import api from "../api";


function PostSentimentAnalysis({post}) {
    const [isLoading,setLoading] = useState(true)
    const [result,setResult] = useState("")


    const [sentiment,setSentiment] = useState('')
    const [score,setScore] = useState(0)
   
    useEffect(()  => {
        setLoading(true)
        const sentimentUrl = '/api/post-sentiment/'
        const payload = {
            'post_content' : post
        }
        const headers = {
            'Content-Type' : 'application/json',
            'Accept' : 'application/json'
        }

        api.post(sentimentUrl,payload, headers)
        
        .then((res) => {
            const data = res.data
            setSentiment(data.sentiment)
            setScore(data.score)
            setLoading(false)
        })
        .catch( (error) => {
            console.log("Error retrieving sentiment!" + error)
                    setSentiment("Sentiment Analysis unavailable at this time.")
                    return
        })
    
        }, [post] )



   /*

     {mood === 'positive' ?
             <img style={{margin:'auto'}} src='/happy.jpg' width='250px' height='200px' />
            :
            null }

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
            <p>{tone}</p>
            <p>Accuracy Confidence: {confidence}</p>
</>
        
    }

    /*
     return <>
    <div className="sentiment-container">
        <h2>The mood of this post is...</h2>
        {isLoading? <p>Analyzing...</p> : sentimentDisplay(sentiment, score)}

   </div> 
   </>*/


    return <>
    <div className="sentiment-container">
        <h2>The mood of this post is...</h2>
        {isLoading? <p>Analyzing...</p> : sentimentDisplay(sentiment, score)}
   </div> 

   </>
}

export default PostSentimentAnalysis ;