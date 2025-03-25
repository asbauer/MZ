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

        <h2 style={{textAlign:'center'}}>Just ask your son to help you! He'll take care of it! </h2>
   
                <button className="enlarge-on-hover"  style={{margin:'auto', borderRadius:'8px'}} onClick={() => navigate('/login/')}>
                    Login
                </button>
                
        
    </>
}

export default ForgotPassword