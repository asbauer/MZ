import axios from 'axios'
import { ACCESS_TOKEN, REFRESH_TOKEN } from './constants'

const apiUrl = "/choreo-apis/mama-zeeka/backend/v1"

const api = axios.create({
    baseURL : import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL   : apiUrl
})
console.log("URL: " + import.meta.env.VITE_API_URL   + " or  " +  apiUrl )

// This might be unnecessary for the home page api calls bc unprotected
/*
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN) ; 
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)
    */


function shouldInclude(method,url) {
    const sensitiveEndpoints = [
        '/api/create/',
        '/api/delete/' ,
        '/api/edit/',
        '/api/retrieve-token/'
    ]
    method = method.toLowerCase()
    if (method === 'post' || method === 'put' || method == 'delete'){
        const sensitive = sensitiveEndpoints.some(endpoint => endpoint === url)
        return sensitive? true : false
    }
}


api.interceptors.request.use(
    (config) => {
        if (shouldInclude(config.method,config.url)) {

            let token = localStorage.getItem(ACCESS_TOKEN) ; 
            if (token) {
            config.headers.Authorization = `Bearer ${token}`
            console.log("Access Token found")
            }
            else {
                console.log("Access JWT token not found")
            }
        }
        else {
            console.log("Not sending JWT")
        }
       
             return config
        }
      
    ,
    (error) => {
        return Promise.reject(error)
    }
)
    
    

export default api 