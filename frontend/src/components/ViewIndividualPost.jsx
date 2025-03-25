import Post from './Post'
import {useState, useEffect } from 'react'
import api from '../api'
import { useLocation, useParams, useNavigate} from 'react-router-dom'
import { isAccessTokenValid, refreshToken } from '../auth'
import PostSentimentAnalysis from './SentimentAnalysis'




function ViewIndividualPost() {
    const [deletedPost, setDeletedPost] = useState(false)
    const location = useLocation() 
    const {postNumber} = useParams() ; 
    const [post,setPost] = useState({})
    const [loggedInStatus, setIsLoggedIn] = useState(isAccessTokenValid())
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()
    const [isEditing, setIsEditing] = useState(location.state?.isEditing)
    let   editing = false ;
    const [showSentiment, setShowSentiment] = useState(false)
   
    

    //alert("Arrived at individual post")

   // const post = location.state.post

   //alert("Post number: " + postNumber + " with title: " + location.state.post.title )

   
    useEffect( () => {
     
        if (!location.state?.post) {
          setIsLoading(true)
          console.log("Attempting to retrieve: ")
             api.get(`/api/posts/${postNumber}/`)
            .then( (res) => {
                console.log("Return status: " + res.status)
                console.log("Data: " + res.data.title)
                setPost(res.data)
                setIsLoading(false)
            })
            .catch( (error) => alert("Error!")) 
            
        }
        else {
           // alert(location.state.post.title)
          // alert("In state")
            setPost(location.state.post)
            setIsLoading(false)
            if (location.state?.isEditing)
            {
              setIsEditing(true)
            }
            
        }
        



    }, [location.state,postNumber])
   
    

    const handleDelete = async (pk) => {

        if (!isAccessTokenValid() && !refreshToken()) {
          alert("Not authenticated");
          return
        }
      
      
        if (window.confirm("Are you sure you want to delete this post?")) {
          const target = `/api/delete/${pk}/`; // Correct target URL for the DELETE request
      
          try {
            const res = await api.delete(target); // Send DELETE request
            console.log(res.status);
            setDeletedPost(true) // Flag to indicate that a post was deleted
            if (res.status === 204) {
              return true
            }
            
          } catch (err) {
            alert('Error deleting post:', err.status + 'Please sign in again!');
          }
        }
      };

    const displaySentimentAnalysis = (e) => {
      e.stopPropagation() 
      setShowSentiment(!showSentiment)
      console.log(showSentiment)

      if (showSentiment && post != null) {
        return <PostSentimentAnalysis post={post.content} />
      }
    }
    

    //alert("ViewIndividualPost" + location.state.post.id)
    function displayOptions () {
      if (deletedPost) {
        setTimeout(() => navigate('/'),3000)
        return <>
      <h2 style={{ textAlign: 'center' }}>Post Deleted. Redirecting to Home.</h2>
      </>
      }
      else if (isLoading) {   
        return   <h2 style={{ textAlign: 'center' }}>Loading...</h2>
      }
      else {
        return <>
        {isLoading? 
        <p>Loading... </p>
        :
        <>
        
        <div id='enlarged-post' style={{marginTop:'2%'}} >
        <Post 
      post={post} 
      handleDelete={handleDelete}
      editMode={isEditing}
      />
     
      </div>
      <button style={{width:'95%' ,margin:'auto', borderRadius:'8px'}} id='sentiment-btn'  onClick={() => setShowSentiment(!showSentiment)}>
      Feature Coming Soon...
      </button>
      {showSentiment? <PostSentimentAnalysis post={post.content} /> : null }
      </>
    }
       </>
      }
    
    }

    //Render the post component 
    return displayOptions()
      
      
}




export default ViewIndividualPost