import { useEffect } from "react"
import "../styles.css"
import { useNavigate} from "react-router-dom"

const PageNotFound = () => {
    const navigate = useNavigate()
    useEffect(() => {
        setTimeout(() => navigate('/'),2000)
    }) 
    
    return <div className="page-not-found">
    <h1>Page Not Found</h1>
    <p>Returning you to Home.</p>
    
    </div>
}

export default PageNotFound