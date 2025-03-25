import axios from 'axios'
import { ACCESS_TOKEN } from './constants'

const apiUrl = "/choreo-apis/mama-zeeka/backend/v1"

const api = axios.create({
    baseURL : import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL   : apiUrl
})
console.log("URL: " + import.meta.env.VITE_API_URL   + " or  " +  apiUrl + )

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


api.interceptors.request.use(
    (config) => {
        if (config.method === 'post'|| config.method === 'POST'  || config.method === 'delete' || config.method === 'DELETE' || config.method == 'put' || config.method =='PUT') {
            const token = localStorage.getItem(ACCESS_TOKEN) ; 
            if (token) {
            config.headers.Authorization = `Bearer ${token}`
            console.log("Token found")
             }
             return config
        }
        else {
        console.log("Token not found!")
        return config
        }
    },
    (error) => {
        return Promise.reject(error)
    }
)
    
    

export default api 