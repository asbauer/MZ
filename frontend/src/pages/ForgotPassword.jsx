import { useState } from "react"
import { useNavigate} from "react-router-dom"
import api from "../api"


function ForgotPassword() {
    const [email,setEmail] = useState("")
    const [submitted,setSubmitted] = useState(false)
    const [message,setMessage] = useState("")
    const navigate = useNavigate()

const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitted(true)

    // Send API call to send out email to reset

    const csrfToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('csrftoken='))
    ?.split('=')[1];
   
    try {
        // Send the API call to Django for the password reset request
        const reset_url = '/api/email_reset_password/';
        const res = await api.post(reset_url, { email },  {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        if (res.status === 200) {
            setMessage("Password reset link has been sent if the email exists in the database.");
        } else {
            setMessage("Something went wrong, please try again later.");
        }
    } catch (error) {
        // Error handling
        console.error("Error during password reset request:", error);
        setMessage("Failed to send the reset link. Please try again later.");
    }




}

/*


 <h2 style={{textAlign:'center'}}>Just ask your son to help you! He'll take care of it! </h2>

 

*/


    return <>
    <div>
        {submitted ? <h3 style={{textAlign:'center'}}>If an account exists with that email, we will send you a reset link.</h3>
        :
        
            <form onSubmit={(e) => handleSubmit(e)}>
                <h2>Reset Password</h2>
                <input 
                        maxLength={50} 
                        type="email" 
                        placeholder="Enter your email"
                        onChange={(e) => setEmail(e.target.value)}
                         />
                <button 
                        type='submit' 
                        style= {{borderRadius:'8px'}}
                        >
                            Reset
                        </button>
            </form>
}
          
</div>

          
        
    </>
}

export default ForgotPassword