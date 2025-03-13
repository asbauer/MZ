import { useState } from "react"
import { useNavigate} from "react-router-dom"


function ForgotPassword() {
    const [email,setEmail] = useState("")
    const [submitted,setSubmitted] = useState(false)
    const [message,setMessage] = useState("")
    const navigate = useNavigate()

const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setMessage("If an account exists with that email, we will send you a reset link.")

    // Send API call to send out email to reset


}


    return <>
    <h1 style={{textAlign:"center", marginBottom:'2px' }}>Reset Password</h1>
    <h2 style={{textAlign:"center"}}>Enter your email to reset your password.</h2>
    <form onSubmit={handleSubmit}>
        <input 
        disabled={submitted}
        id='email-reset-field'
        type="email"
        placeholder="Enter your email here"
        onChange={(e) => setEmail(e.target.value) }
         />
         { message ? 
         <div style={{display:"flex",flexDirection:'column' }}>
          <p style={{textAlign: 'center', color: 'blue', marginTop: '10px'}}>
                    {message}
                </p>
                <button className="enlarge-on-hover"  style={{margin:'auto'}} onClick={() => navigate('/login/')}>
                    Login
                </button>
                
                </div>
         :
         <button className="enlarge-on-hover" type="submit">Reset Password</button>

        }
    </form>
   
    
    
    </>
}

export default ForgotPassword