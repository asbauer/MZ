import { useEffect, useState , useContext } from "react";
import api from "../api";
import { isAccessTokenValid,refreshToken } from "../auth";
import Post from "./Post";
import { AuthContext } from "../App";
import { useNavigate } from "react-router-dom";
import Login from "./Login";
import { ACCESS_TOKEN,REFRESH_TOKEN } from "../constants";
import { useLocation } from "react-router-dom";

function SearchPosts () {
    const [query,setQuery] = useState('')
    const [results,setResults] = useState([])
    const [prevPage,setPrevPage] = useState(false)
    const [nextPage,setNextPage] = useState(false)
    const [isLoading,setLoading] = useState(true)
    const [isDeleted,setIsDeleted] = useState(false)
    const {isAuthenticated,setAuthenticationStatus} = useContext(AuthContext)
    const navigate = useNavigate()
    const [pageNumber,setPageNumber] = useState(0)
    const [displayLogin,setDisplayLogin] = useState(false)
    const [navigateUrl,setNavigateUrl] = useState('')
    const [passedUrl, setPassedUrl] =  useState(useLocation().state?.query)
    const [show,setShow] = useState(false)
   


    useEffect( () => {
        console.log(passedUrl)
        if (passedUrl) {
            console.log('Passed from Login')
            retrieveResults(passedUrl)
        }
        

        

    }, [passedUrl])

    const handleDelete = async (pk) => {
        /*
        localStorage.removeItem(ACCESS_TOKEN)
        localStorage.removeItem(REFRESH_TOKEN)
        
       localStorage.clear()
        setAuthenticationStatus(false)
      */

        if (!isAccessTokenValid() && !refreshToken() ) {
            alert("Please Login Again First!")
            console.log("NavigationURL: " + navigateUrl)
            setAuthenticationStatus(false)
            navigate('/login', {state:{'from' : navigateUrl}})
           // navigate(`/view-post/${post.id}`, { state: {post, isAuthenticated, 'fromHome' : true }})
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
      
      
            
              const updatedPosts = results.filter((post) => post.id !== pk)
              if (updatedPosts.length > 0) {
                setResults(updatedPosts)
      
              }
              else if (updatedPosts.length === 0) {
                goToPreviousPage()
              }
      
          } catch (err) {
            alert('Error deleting post:', err.response ? err.response.data : err.message);
          }
        }
      };

    const retrieveResults = async (url) => {
        let res  ;
        console.log(url)
    
    try {
      if (url) {
         res = await api.get(url) 
        
      }
      else {
         url = `/api/search/?search=${query}`
         res = await api.get(url) 
       
        
      }
      setNavigateUrl(url)
      console.log(res.data)
      setResults(res.data.results)
      setNextPage(res.data.next);
      setPrevPage(res.data.previous);
      setLoading(false)
    }
    catch (error) {
        console.log("Error Retrieving Results. " + error)
    }

    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        //Search call here  
        setShow(true)
        retrieveResults()
      

    }

    const goToPreviousPage = () => {
        if (!prevPage)
            return 
        retrieveResults(prevPage)
    }

    const goToNextPage = () => {
        if (!nextPage) {
            return 
        }
        retrieveResults(nextPage)
    }

    const handlePostClick = (post) => {
        //alert("In  handle PostClick" + post.id)
        navigate(`/view-post/${post.id}`, { state: {post, isAuthenticated, 'fromHome' : false }})
      
      }

     


    return <div id='search-container'> 
    <h2 id='search-header'>Search Posts</h2>
    <form  onSubmit={handleSubmit}>
        <input id='search-input' value={query} onChange={(e) => setQuery(e.target.value)} type='text' placeholder="Enter search terms" />
        <button style={{borderRadius:'8px'}}> Search </button>
    </form>

    

    <div className={show? 'post-list' :'hide'}> 
      
    {isLoading? null : (results.length > 0 ? results.map((result) => (
      <Post 
      post={result} 
      handleDelete={handleDelete}
      key={result.id} 
      
      isClickable={true}
      handlePostClick={handlePostClick}
      fromHome={true}
       />
       
    )
    
    )
    :
    <p>No Results Found.</p>
)
    
      
    }
    
</div>

    <div className={show ? 'pagination' :'hide'}>
    <button onClick={goToPreviousPage} disabled={!prevPage} className="pagination-button">
      Previous
    </button>
    <button onClick={goToNextPage} disabled={!nextPage} className="pagination-button">
      Next
    </button>
  </div>

  </div>

    






}
export default SearchPosts ;