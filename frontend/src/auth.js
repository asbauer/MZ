import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants";
import api from "./api";
import { jwtDecode } from "jwt-decode";

 const isAccessTokenValid = () => {
    // try catch for jwtDecode(token)
    const token = localStorage.getItem(ACCESS_TOKEN)

    if (!token) {
        console.log("No token found")
        return false
    }
    try { 
        const decoded = jwtDecode(token)
        const tokenExpiration = decoded.exp 
        const currentTime = Date.now() / 1000
        return tokenExpiration > currentTime 
    }
    catch {
        console.error("Invalid token: " + token)
        return false
    }
} 

function refreshToken() {
   // alert("In this")
    const refreshToken = localStorage.getItem(REFRESH_TOKEN) ;
    if (!refreshToken) {
        console.log("Refresh token not found in storage")
        return false
    }
    api.post('/api/refresh-token/', {refresh:refreshToken})
    .then( (res) => {
        
            localStorage.setItem(ACCESS_TOKEN,res.data.access)
            //Should I set the refresh token too?
            localStorage.setItem(REFRESH_TOKEN,res.data.refresh)
            return true
        
         
        
        }
        
    )
    .catch( (error) => {
        console.log("Error Refreshing token: " + error)
    return false 
    })

    }

export {isAccessTokenValid, refreshToken}




/*

export function isAccessTokenExpired(token) {
    try {
        const decoded = jwtDecode(token);
        const tokenExpiration = decoded.exp;
        const now = Date.now() / 1000;
        return tokenExpiration < now;
    } catch (error) {
        console.error("Invalid token:", error);
        return true;
    }
}

export async function refreshToken() {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    try {
        const res = await api.post("/api/token/refresh/", { refresh: refreshToken });
        if (res.status === 200) {
            localStorage.setItem(ACCESS_TOKEN, res.data.access);
            return res.data.access; // Return the new token if successful
        }
    } catch (error) {
        console.error("Failed to refresh token:", error);
        throw error;
    }
}





*/


