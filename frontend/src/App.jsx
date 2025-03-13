import React , {useState, useEffect, createContext} from 'react';
import api from './api';
import './styles.css';  // Import the correct CSS file
import Post from './components/Post';
import CreatePost from './components/CreatePost';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import NewPost from './pages/NewPost'
import Home from './pages/Home'
import { Link } from 'react-router-dom';
import Login from './components/Login'
import PageNotFound from './pages/PageNotFound'
import ProtectedRoute from './components/ProtectedRoute'
import { ACCESS_TOKEN } from './constants';
import Header from './components/Header';
import ViewPost from './pages/ViewPost';
import ViewIndividualPost from './components/ViewIndividualPost';
import { isAccessTokenValid, refreshToken } from './auth';
import ForgotPassword from './pages/ForgotPassword';
import EditPost from './pages/EditPost'
import ReplyToPrompt from './pages/ReplyToPrompt';
import SearchPosts from './components/SearchPosts.jsx';
import { use } from 'react';


export const AuthContext = createContext() ; 


function App() {
  const [posts, setPosts] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [isAuthenticated,setAuthenticationStatus] = useState(false)

  /*
  useEffect( () => {
    if (isAccessTokenValid || refreshToken) {
      setAuthenticationStatus(true)
    }
    else {
      setAuthenticationStatus(false)
    }
  })
    */




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


  const getPosts = (url) => {
    api.get(url)
      .then((res) => {
        console.log(res.status);
        return res.data;
      })
      .then((data) => {
        setPosts(data.results);
        setNextPage(data.next);
        setPrevPage(data.previous);
        console.log("Data: ", data.results);
      })
      .catch((err) => alert(err));
  };

  const HeaderCheck = () => {
    if (isAccessTokenValid()) {
      setAuthenticationStatus(true);
    }
    else if (refreshToken()) {
      setAuthenticationStatus(true)
    }
    else{
      setAuthenticationStatus(false)
    }
    
  }

  return (
    <>
    <BrowserRouter>
    <div className="container">  {/* Added class container for the main wrapper */}
  
    <AuthContext.Provider value={{isAuthenticated,setAuthenticationStatus}} > 
    <Header />
      <Routes>

<Route path='/login/' element={ <Login /> } />
 <Route path="*" element={ <PageNotFound /> } />
    
        <Route
        path="/new" 
        element={
          <ProtectedRoute>
            <NewPost />
          </ProtectedRoute>
        } />

        <Route 
        path='/prompt-reply' 
        element = {
          <ProtectedRoute>
            <ReplyToPrompt />
          </ProtectedRoute>
        }
        />

        

        
        <Route path='/' element={<Home />} />
        {//<Route path='/:page' element={<Home />} />
}
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/search' element={<SearchPosts />} />
        
        <Route path='/view-post/:postNumber' element = { <ViewIndividualPost /> } />
       
      </Routes>
      </AuthContext.Provider>
      </div>
     </BrowserRouter>

    
    </>
  );
}

export default App;
