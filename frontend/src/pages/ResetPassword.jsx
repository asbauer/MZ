import React, { useEffect } from "react";
import { useParams, useNavigate} from "react-router-dom";
import api from "../api";
import { useState } from "react";
import '../styles.css';  // Import the correct CSS file



const ResetPassword = () => {
    const { uidb64, token } = useParams(); // Get the UID and token from the URL
    const [message,setMessage] = useState('')
    const  [showReset,setShowReset] = useState(false)
    const [newPassword,setNewPassword] = useState('')
    const [confirmPassword,setConfirmPassword] = useState('')
    const [showPassword,setShowPassword] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [passwordError,setPasswordError] = useState('')
    const [successMessage,setSuccessMessage] = useState('')
    const navigate = useNavigate()
    const [success,setSuccess] = useState(false)

    useEffect( () => {

        if (success) {
            setSuccessMessage("Password reset successfully! Redirecting to login...");
            const timeout = setTimeout(() => navigate('/login'), 3000);
            return () => clearTimeout(timeout);  // Cleanup on unmount
        }

        const verify = async () => {
            console.log(uidb64 + " and " + token)

            const path = `/api/reset/${uidb64}/${token}/`
            try {
            const res = await api.get(path)
            console.log(res.status)

            if (res.status === 200){
                console.log(res)
                console.log(res.data.isValid)
               
            } 
        }
            catch {
                console.log("Error!")
                setMessage("It looks like the email you clicked is old -- request a new one to reset your password.")
                return
            }
            //uid :  Mg
            // // token = cncmvd-80e0c0b9b7c69d46e0759238c23f0563
        }
        verify()


    }, [success])

    const handleReset = async (e) => {
        e.preventDefault() 
        
        if (newPassword != confirmPassword) {
            setPasswordError("Passwords do not match!")
            return 
        }
        else if (!newPassword || !confirmPassword) {
            setPasswordError("Cannot submit blank passwords.")
            return
        }
        

        const target = '/api/set_new_password/'
        try{
        const res = await api.post(target,{'new_password':newPassword})
        console.log(res.data.message)
        if (res.status === 200) {
            setSuccessMessage('Successfully changed password! Redirecting... ')
            setSuccess(true)
        }
        }
        catch (error) {
            console.log(error.status, error.response.data.message)
            setSuccessMessage('Unable to change password. Please ask your son for help!')
            setSuccess(false)
        }


    }

    

    const resetForm = () => {
        return <>
                <form>
                    
                    <div id='new-password-div'>
                        
                        <div>
                    <label htmlFor='password'>New Password</label>
                    </div>
                    <div>
                    <input  onChange={(e)=>setNewPassword(e.target.value)} maxLength={20} type={showPassword ? 'text' : "password"} required></input>
                    <button style={{borderRadius:'8px'}}
                            type="button" 
                            onClick={() => setShowPassword(!showPassword)}
                            >{showPassword? 'Hide' : 'Show'}</button>
                    </div></div>
                    <div id='confirm-password-div'>
                    <label htmlFor='password'>Confirm Password</label>
                    <input  onChange={(e) => setConfirmPassword(e.target.value)} maxLength={20} type={showConfirm ? 'text' : "password"} required></input>
                   
                    <button style={{borderRadius:'8px', marginBottom:'3%'}}
                            type="button" 
                            onClick={() => setShowConfirm(!showConfirm)}
                            >{showConfirm? 'Hide' : 'Show'}</button>                    
                   </div> 
                   <button style={{borderRadius:'8px', marginBottom:'2%'}} onClick={(e) => handleReset(e) } type="submit">Set New Password</button>


                </form>
        </>
    }
    return <>

        {message ? <h3>{message}</h3> : successMessage ? <h3>{successMessage}</h3> :  resetForm()}

        {passwordError? <h3 style={{textAlign:'center'}}>{passwordError}</h3> : " "}

        
    
    </>
}

export default ResetPassword