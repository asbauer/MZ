import { Navigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import api from '../api'
import { REFRESH_TOKEN, ACCESS_TOKEN } from '../constants'
import { useState, useEffect } from 'react'

function ProtectedRoute({ children }) {
    const [isAuthorized, setIsAuthorized] = useState(null)

    useEffect(() => {
        auth().catch(() => setIsAuthorized(false))
    }, [])

    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN)
        try {
            const res = await api.post("/api/token/refresh/", { refresh: refreshToken }) ; 
            // Attempts to get a new access token
            if (res.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access)
                setIsAuthorized(true)
            } else {
                setIsAuthorized(false)
            }
        } catch (error) {
            console.log(error)
            // NotesApp has this as true for some reason?
            setIsAuthorized(false)
        }
    }

    const auth = async () => {
        // Check if access token is expired or not
        const token = localStorage.getItem(ACCESS_TOKEN)

        if (!token) {
            setIsAuthorized(false)
            return
        }

        // If its expired, handle seamlessly refreshing it
        const decoded = jwtDecode(token)
        const tokenExpiration = decoded.exp
        const now = Date.now() / 1000

        if (tokenExpiration < now) {
            await refreshToken()
        } else {
            setIsAuthorized(true)
        }
    }

    if (isAuthorized === null) {
        return <div>Loading...</div>
    }

    return isAuthorized ? children : <Navigate to="/login" state={{from: 'create-post'}} />
}

export default ProtectedRoute
