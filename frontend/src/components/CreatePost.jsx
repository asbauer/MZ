import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import {REFRESH_TOKEN,ACCESS_TOKEN } from "../constants";



function CreatePost() {
    const [title, setTitle] = useState('')
    const [content,setContent] = useState('')
    const navigate = useNavigate() ;

    const handleSubmit = async (e) => {
        e.preventDefault() ;
        try {
            const res = await api.post('api/create/', {title,content}) 
            //alert("Title: " + res.data.title + " Content: " + res.data.content  + " Created at: " + res.data.created_at)
           // alert(JSON.stringify(res))
           //alert(JSON.stringify(res.data))
            //const post = {'title' : res.data.title, 'content' : res.data.content, 'created_at' : res.data.created_at}
            //const post_id = res.data.id
             navigate(`/view-post/${res.data.id}`, {state:{'post':res.data}})
            //{ state: {post, isAuthenticated, 'fromHome' : true }}
           // navigate(`/view-post/${post_id}`, {state: {'post':content} } )
            
        }
        catch (error) {
            console.error("Error response data: ", error.response?.data);
            alert("Could not published at this time. Error Code: " + error.status)
            //alert("Registration failed: " + error.response?.data?.detail || error.message);
        }
    }

    

   



    return <form onSubmit={handleSubmit}>
        
        <div className="title-container">
            <h2 className='new-post-header'>New Post</h2>
            <input placeholder="Enter a Post Title" className='title-input' type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
        
            <textarea  spellCheck={true}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            />

       
        <button id='submit-button' type="submit">Submit</button>


    </form>
   
}

export default CreatePost