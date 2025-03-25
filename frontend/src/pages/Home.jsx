import { useState, useEffect, useContext } from 'react';
import api from '../api.js';
import '../styles.css';  // Import the correct CSS file
import Post from '../components/Post';
import { useNavigate, useParams } from 'react-router-dom'
import { ACCESS_TOKEN } from '../constants.js';
import ViewIndividualPost from '../components/ViewIndividualPost.jsx'
import { isAccessTokenValid, refreshToken } from '../auth.js';
import { AuthContext } from '../App.jsx';
import Prompt from '../components/Prompt.jsx';
import ReplyToPrompt from './ReplyToPrompt.jsx';


function Home () {
  const [isLoggedIn, setLoginStatus] = useState(false)
  const [numPostsOnPage,setNumPostsOnPage] = useState(0)
  const [posts, setPosts] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [pageNumber, setPageNumber] = useState(1)
  const navigate = useNavigate();  // Use useNavigate instead of useHistory
  const { page } = useParams();
  const [postDeleted, setIsDeleted] = useState(false)
  //const [isLoggedIn, setIsLoggedIn] = useState(isAccessTokenValid())
  const {isAuthenticated,setAuthenticationStatus} = useContext(AuthContext)
  const [replyStatus,setReplyingStatus] = useState(false)
  const [submittedReply,setReplySubmitted] = useState(false)
  const [submitting,setSubmitting] = useState(false)
  const [replyContent, setReplyContent] = useState('')
  const [windowSize, setWindowSize] = useState(window.innerWidth);
  const [validMap, setValidMap] = useState(false)

  useEffect(() => {

    const handleResize = () => {
      setWindowSize(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    
    if (page) {
      getPosts(`/api/posts/?page=${page}`);
    }
    else {
    getPosts('/api/posts/');
    }

    return () => window.removeEventListener('resize', handleResize);

  }, [submittedReply]);

 
  const getPosts = (url) => {
    api.get(url)
      .then((res) => {
        console.log(res.status);
        
        return res.data;
      })
      .then((data) => {
        setPosts(data.results);
        setNumPostsOnPage(posts.length)
        setNextPage(data.next);
        setPrevPage(data.previous);
        console.log("Data: ", data.results);
      })
      .catch((err) => alert(err));
      //window.scrollTo({top:0, behavior:'smooth'}) ;

      
  };


 
  const toggleContent = (contentId)  => {
    const content = document.getElementById(contentId);
    content.classList.toggle('expanded');
    
    const button = content.nextElementSibling;
    if (content.classList.contains('expanded')) {
        button.textContent = 'Read Less';
    } else {
        button.textContent = 'Read More';
    }
}

    const createNewPost = () => {
        navigate('/new')
    }

    const logout = () => {
      localStorage.clear()
      setAuthenticationStatus(false)
   
    }

/*
    const handleDelete = async (pk) => {
      if (window.confirm("Are you sure you want to delete this post?")) {
          alert("Deleting")
      
      const target = `/api/delete/${pk}/`;  // Now using template literals correctly
      try {
          const res = await api.delete(target);  // Send DELETE request
          console.log(res.status);
          setIsDeleted(true)
          getPosts(`/api/posts/?page=${page || 1}`)
            // Log status to confirm the request went through
      } catch (err) {
          alert('Error deleting post:', err.response ? err.response.data : err.message);
      }
  }
}
  */

const handleDelete = async (pk) => {
  

  if (!isAuthenticated) {
    alert("Not authenticated");
    return
  }


  if (window.confirm("Are you sure you want to delete this post?")) {
    alert("Deleting");

    const target = `/api/delete/${pk}/`; // Correct target URL for the DELETE request
    console.log("Targetting: " + target)

    try {
      const res = await api.delete(target); // Send DELETE request
      console.log(res.status);
      setIsDeleted(true); // Flag to indicate that a post was deleted
      

      // Fetch posts for the current page based on pageNumber state
     
      const currentPageUrl = `/api/posts/?page=${pageNumber || 1}`;
      console.log("Deleted on" + currentPageUrl)


      
        const updatedPosts = posts.filter((post) => post.id !== pk)
        if (updatedPosts.length > 0) {
          setPosts(updatedPosts)

        }
        else if (updatedPosts.length === 0) {
          goToPreviousPage()
        }

    } catch (err) {
      alert('Error deleting post:', err.response ? err.response.data : err.message);
    }
  }
};


const goToPreviousPage = () => {
  const newPage = pageNumber - 1;
  setPageNumber(newPage);
  getPosts(`/api/posts/?page=${newPage}`);
}

const goToNextPage = () => {
  const newPage = pageNumber + 1;
  setPageNumber(newPage);
  getPosts(`/api/posts/?page=${newPage}`);
}

const handlePostClick = (post) => {
  //alert("In  handle PostClick" + post.id)
  navigate(`/view-post/${post.id}`, { state: {post, isAuthenticated, 'fromHome' : true }})

}

const displayLoginLogout = () => {
  if (isAuthenticated) {
    return <>
        <button onClick={logout} id='logout-btn' className='enlarge-on-hover' >Logout</button>
    </>
  }
  else {
    return <>
    <button id='logout-btn' className='enlarge-on-hover' onClick={() => navigate('/login', {state: {from : '/'}})} >Login</button>
    </>
  }
}

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
  console.log("Prompt in homoe: " + prompt)
  try { 
    const res = await api.post('/api/create/', {'title':prompt,'content':replyContent})
    setReplySubmitted(true)
  }
  catch (error) {
    console.log("Error replying to prompt" + " Status Code: " + error.status)
    return false 
  }

}

/*
  <button onClick={createNewPost} id='new-post-btn-header' className='enlarge-on-hover'>Start a New Post</button>
    {displayLoginLogout()}
    <button onClick={() => navigate('/search')} >Search</button>

    */



/*

      
    {posts.map((post) => (
      <Post 
      post={post} 
      isLoggedin={isAuthenticated} 
      key={post.id} 
      handleDelete={handleDelete}
      handlePostClick={handlePostClick}
      isClickable={true}
      fromHome={true}
       />
      
    
    ))}



*/

/*
{Array.isArray(posts) && posts.length > 0 ? (
  posts.map((post) => (
    <Post 
    post={post} 
    isLoggedin={isAuthenticated} 
    key={post.id} 
    handleDelete={handleDelete}
    handlePostClick={handlePostClick}
    isClickable={true}
    fromHome={true}
     />
  ))
) : (
  <p>No posts available.</p>
)}
*/



return ( 
    <>
    <nav id='home-nav'>
    {displayLoginLogout()}
    <button onClick={createNewPost} id='new-post-btn-header' className='enlarge-on-hover'>New Post</button>
    <button id='search-btn' onClick={() => navigate('/search')} >Search</button>
</nav>

<Prompt loggedIn={isAuthenticated} submittedReply={submittedReply} setReplySubmitted={setReplySubmitted} />
{submittedReply ? <h3 style={{textAlign:'center', color:"black"}}>Response submitted.</h3> : null }
    
<div className="post-list"> {/* This can be the wrapper for your posts */}

{Array.isArray(posts) && posts.length > 0 ? (
  posts.map((post) => (
    <Post 
    post={post} 
    isLoggedin={isAuthenticated} 
    key={post.id} 
    handleDelete={handleDelete}
    handlePostClick={handlePostClick}
    isClickable={true}
    fromHome={true}
     />
  ))
) : (
  <p>No posts available.</p>
)}


  
  

  <div className="pagination">
    <button onClick={goToPreviousPage} disabled={!prevPage} className="pagination-button">
      Previous
    </button>
    <button onClick={goToNextPage} disabled={!nextPage} className="pagination-button">
      Next
    </button>
  </div>
</div>

</>
)


}

export default Home
