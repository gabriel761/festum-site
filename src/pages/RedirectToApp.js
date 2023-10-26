import { useEffect } from "react";

const RedirectToApp = () => {
    useEffect(() => {
        try {
            window.location.replace("festum://")    
        } catch (error) {
            window.location.replace("https://play.google.com/store/apps/details?id=com.gabriel761.frontend")
        }
        
    }, [])
    return ( 
        <div>
            <h1>Redirecting to app...</h1>
        </div>
     );
}
 
export default RedirectToApp;