import { Link } from 'react-router-dom';
import { ACCESS_TOKEN } from '../constants';
import { isAccessTokenValid, refreshToken } from '../auth';
import { useState, useEffect } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../App';


function Header() {
 const {isAuthenticated,setAuthenticationStatus} = useContext(AuthContext)
 const [isOpen,setOpen] = useState(false)


 useEffect( () => {
  if (isAccessTokenValid() || refreshToken()) {
    setAuthenticationStatus(true)
  }
  else {
    setAuthenticationStatus(false)
  }

 }
)

 const checkAuth = () => {
  if (isAccessTokenValid() || refreshToken()) {
    setAuthenticationStatus(true)
  }
  else {
    setAuthenticationStatus(false)
  }

 }


const tagline= () => {

    
    

    if (isAccessTokenValid() || refreshToken ) {
      return <>
      <h3> Welcome Mama Zeeka</h3>
      </>
    }
    else {
      return (
        <>
      <p className="header-subtitle">Welcome to the Mama Zeeka Blog</p>
        </>
      )
    }
  }


function handleClick () {

  setOpen(!isOpen) 
  alert(isOpen)
  alert("Clicked")
}


return <>
<Link to='/' className='header-link enlarge-on-hover'>
  <header className="header">  {/* Apply header class */}
  
  <h1 className="header-title">Mama Zeeka</h1>  {/* Apply header-title class */}
  {isAuthenticated ?
     <p className='header-subtitle'>Hello, Mama Zeeka</p> 
     : <p className='header-subtitle'>Welcome to Mama Zeeka's Blog</p>
     }

 
  {/* Apply subtitle class */}
 </header>
 </Link>

{/*
 <nav>
     
      <button 
        className="hamburger" 
        onClick={() => setOpen(!isOpen) } 
        aria-expanded={isOpen} 
        aria-label="Toggle navigation"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      
      <ul className={`${isOpen ? "menu-active" : "menu"}`}>
        <li><a href="#home">Home</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#services">Services</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </nav>
    */}

 
 </>


}

export default Header