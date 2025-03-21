import { useEffect, useState, useContext } from "react";
import api from "../api";
import { useLocation, useNavigate } from "react-router-dom";
import {REFRESH_TOKEN,ACCESS_TOKEN } from "../constants";
import { isAccessTokenValid, refreshToken } from "../auth";
import { AuthContext } from "../App";

import 'bootstrap/dist/css/bootstrap.min.css';




function Post({post, handleDelete = null, handlePostClick = null , editMode=false, fromHome=false}) {

    
    const formattedDate = new Date(post.created_at).toLocaleDateString('en-us') 
    const [expanded, setExpanded] = useState(false); // Track if the content is expanded or not
   // const [isAuthenticated, setIsAuthenticated] = useState(false); // Track login status
    const [isDeleted, setIsDeleted] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const {isAuthenticated,setAuthenticationStatus} = useContext(AuthContext)
    const [isEditing, setIsEditing] = useState(editMode)
    const [postContent,setPostContent] = useState(post.content)
    const [postTitle, setPostTitle] = useState(post.title)
    const [isClickable, setIsClickable] = useState(false)
    const [postClicked, setPostClicked] = useState(false)
    const navigate = useNavigate()
    const [longTitle,setLongTitle] = useState(false)
    const [showOptions,setShowOptions] = useState(false)
    const [windowSize, setWindowSize] = useState(window.innerWidth);
    const [classes, setClasses] = useState("") 
    
    


    useEffect( () => {
        //alert("From: " + location )
        /*
        if (isAccessTokenValid()) {
            //setIsLoggedIn(true)
            setAuthenticationStatus(true)
        }
        else if (refreshToken()){
            //setIsLoggedIn(true)
            setAuthenticationStatus(true)
        }
            */

        const handleResize = () => {
            setWindowSize(window.innerWidth);
          };
      
          window.addEventListener('resize', handleResize);

        if (!handlePostClick) {
            setIsClickable(false)
        }
        else {
            setIsClickable(true)
        }

        return () => localStorage.removeItem('updatedPost')
            
        
    }, [])

    /*
    useState( () => {
        const authorized = localStorage.getItem(ACCESS_TOKEN)
        if (authorized) {
            setIsAuthenticated(true)
        }
    }, [])
    */

    //console.log("Is logged in for ", post.title +  " " + isAccessTokenValid())    
    

    /*
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
        */

    const toggleContent = () => {
        setExpanded(!expanded); // Toggle the expanded state
    };

    const formatContent= (content) => {
        return content.split('\n').map((item, index) => {
            return (
              <span key={index}>
                {item}
                <br />
              </span>
            );
          });

    }



    const handleDeletePost= (e) => {
        e.stopPropagation() ;
        handleDelete(post.id)

    }

    //            <button className="delete-btn" onClick={(e) => { e.stopPropagation() ; handleDelete(post.id) }} >Delete Post</button>

    //<p className="post-content">{formatContent(post.content)}</p>

    //            <button className="delete-btn enlarge-on-hover" onClick={handleDeletePost} >Delete Post</button>


    const updatePost = async (e) => {
        e.preventDefault()
        
        const target = `/api/edit/${post.id}/` ;
        setIsEditing(false)

        api.put(target,{'title': postTitle,'content':postContent})
        .then( (res) => {
            localStorage.setItem('updatedPost', postContent)

        })
        .catch( (err) => {
            console.error("Error updating post:", err);
            if (err.response) {
                // Log the response from the server
                console.error("Server Response:", err.response);
                // You can access the specific error details here
                console.error("Error message:", err.response.data);
                console.error("Error status:", err.response.status);
                console.error("Error headers:", err.response.headers);
     }
     } )
        
    }

    const editPost = (e) => {
        e.stopPropagation()
        setIsEditing(true)
       
        if (fromHome) {
        navigate(`/view-post/${post.id}`, {state: {'isEditing':true,'fromHome':true}})
        }

    }

    const cancelEdit = (e) => {
        e.stopPropagation()
        setIsEditing(false)
       
        setPostClicked(false)
        setPostContent(post.content)
    }

    const clickToEdit = (e) => {
        if (isAuthenticated && postClicked == false) {
            setPostClicked(true)
            editPost(e)
        }
        
    }

    const moveCur = (e) => {
       // const cursorPosition = textarea.selectionStart;
        //alert(cursorPosition)

    }

    /* Original Styling

     <div className="post-title-container">
        <h3 className="post-title">{post.title}</h3>
        <div className="post-alteration-buttons-container">

        {isAuthenticated? 
        <>
         {isEditing?
         <button className="enlarge-on-hover edit-cancel-btn"  onClick={cancelEdit}> Cancel </button>
         :
         <button className="enlarge-on-hover edit-cancel-btn" onClick={editPost}> Edit </button>

        } 
        <button className="enlarge-on-hover" onClick={handleDeletePost} >Delete Post</button>

        </>
        :
        null

        }
       
         </div>
        </div>
        
        */

        /*
        <div className="post-alteration-buttons-container">
        </div>

         <h3 className="post-title">{post.title}</h3>
        */


         /*Newest


        <h3 className="post-title">{post.title}</h3>


        {isAuthenticated? 
        
     
        <div className="post-alteration-buttons-container" >
         {isEditing?
         <button className="enlarge-on-hover edit-cancel-btn"  onClick={cancelEdit}> Cancel </button>
         :
         <button className="enlarge-on-hover edit-cancel-btn" onClick={editPost}> Edit </button>

        } 
        <button className="enlarge-on-hover" onClick={handleDeletePost} >Delete</button>
</div>
         
        :
        null

        }

        */

        function checkTitleLength () {
            if (postTitle.length > 68) {
                return true
            }
            else {
                
                return false
            }
            
        }


        /*


        {isAuthenticated? 
        
     
        <div className="post-alteration-buttons-container" >
         {isEditing?
         <button className="enlarge-on-hover edit-cancel-btn"  onClick={cancelEdit}> Cancel </button>
         :
         <button className="enlarge-on-hover edit-cancel-btn" onClick={editPost}> Edit </button>

        } 
        <button className="enlarge-on-hover" onClick={handleDeletePost} >Delete</button>
</div>
         
        :
        null

        }

        */

    function expandOptions (e) {
        e.stopPropagation()
        setShowOptions(!showOptions)



    }

    function showRegularLayout () {
        console.log("Ere")
        return <>
        <div className="post-title-container">
        {checkTitleLength() ?<h3 className="post-title long-title">{post.title}</h3>  :<h3 className="post-title">{post.title}</h3>}
        
        </div>
        </>
    }


    function showMobileLayout() {
       
       
            return <>
            <button className='options-btn' onClick={expandOptions} style={{"background-color":'white', 'color':'black'}}>
                &#9776;
                </button>




  <div>
   

  <nav id={showOptions ? 'menu-actions' : 'menu'} >
  <ul className='options-list'>
    <li ><button className='alteration-btns' onClick={expandOptions}>Cancel</button></li>
   <li className='alteration-btns'><button className='alteration-btns'  onClick={editPost}>Edit</button></li>
   <li className='alteration-btns'><button className='alteration-btns' onClick={handleDelete}>Delete</button></li>
 
   
</ul>

   </nav>
   </div>
  
    

            </>
        
        
    }

    /*
     <div className="post-alteration-buttons-container">
    {windowSize <= 1200 ? showMobileLayout() : null}

    {isEditing ? (
      <button className="enlarge-on-hover edit-cancel-btn" onClick={cancelEdit}>
        Cancel
      </button>
    ) : (
      <button className="enlarge-on-hover edit-cancel-btn" onClick={editPost}>
        Edit
      </button>
    )}

    <button className="enlarge-on-hover" onClick={handleDeletePost}>
      Delete
    </button>
  </div>
)}


        



    
        </div>
        */

    const renderTitle = () => {
        let classesForTitle = 'post-title ' ;
        if (checkTitleLength()) {
            classesForTitle += 'long-title '
        }
        if (!isAuthenticated) {
            classesForTitle += 'not-authenticated'
        }
        console.log(classesForTitle)
        //setClasses(classesForTitle)
        return classesForTitle

    }

       
    return <div 
                className={`post-container ${isClickable? 'enlarge-on-hover' : 'none' } `}
                onClick={isClickable? () => handlePostClick(post) : clickToEdit}
            >

   


    <div className="post-title-container">

  
        
            <h3 className={renderTitle()}>{post.title}</h3>

    
    
    {isAuthenticated && (
  <div className="post-alteration-buttons-container">
    {windowSize <= 767 ? (
      showMobileLayout()
    ) : (
      <>
        {isEditing ? (
          <button className="enlarge-on-hover edit-cancel-btn" onClick={cancelEdit}>
            Cancel
          </button>
        ) : (
          <button className="enlarge-on-hover edit-cancel-btn" onClick={editPost}>
            Edit
          </button>
        )}
        <button className="enlarge-on-hover" onClick={handleDeletePost}>
          Delete
        </button>
      </>
    )}
  </div>
)}



        
</div>


    
        

        
        
        
        

            {isEditing
            ? 
            <form id='edit-form'>
            <textarea value={postContent} onChange={(e) => setPostContent(e.target.value)} />
            <button type="submit" onClick={updatePost}>Save</button>
            </form>
            : //formatContent(post.content)
            <>
            <div onClick={moveCur}>
            {localStorage.getItem('updatedPost') 
                ? localStorage.getItem('updatedPost') 
                : formatContent(postContent) }
                </div>
           </>
        }
        

        
        <small>{formattedDate}</small>
        

       
        
    </div>
}

export default Post


