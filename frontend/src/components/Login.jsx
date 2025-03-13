import { useState, useContext } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import {REFRESH_TOKEN,ACCESS_TOKEN } from "../constants";
import "../styles.css"
import { AuthContext } from "../App";
import { useLocation } from 'react-router-dom';



const Login = () => {
    const [username,setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loading,setLoading] = useState(false)
    const {isAuthenticated,setAuthenticationStatus} = useContext(AuthContext)
    const returnLocation = useLocation()?.state?.from

    
   // alert(location.state?.from)
    const navigate = useNavigate() 

    const handleSubmit = async (e) => {
        setLoading(true)
        e.preventDefault()
       const  route = '/api/retrieve-token/'
        //alert("In here") ;
        //Send request to whatever route the form is representing
    
        try {
            const res = await api.post(route,{username,password})
            //alert("Sending: ", username, password )
            
            if (res.status === 200)
                {
                localStorage.setItem(ACCESS_TOKEN,res.data.access)
                localStorage.setItem(REFRESH_TOKEN,res.data.refresh)
                setAuthenticationStatus(true)
                
                if (returnLocation === '/') {
                    navigate('/')
                }
                else if (returnLocation === 'new') (
                     navigate("/new/")
                )
                else { 
                   navigate('/search' ,{state: {'query' : returnLocation}})
                }
               
            }
            else{
                alert("Error")
            }
            
            
            

        }
        catch (error) {
            //alert("In error!")
            //alert("Error: " + error)
            console.error("Error response data: ", error.response?.data);
            alert("Registration failed: " + error.response?.data?.detail || error.message);

        }
       
    }





return <form onSubmit={handleSubmit} className="login-container">
    <h2>Login</h2>
    <input
        maxLength={12}
        className='login-username' 
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
    />

    <input
        maxLength={15}
        className='login-password' 
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
    />
    
    <button onClick={handleSubmit}>Submit</button>
<div className="forgot-password">
        <a href="/forgot-password" className="forgot-password-link">
            Forgot Password?
        </a>
    </div>

</form>

}



export default Login ;