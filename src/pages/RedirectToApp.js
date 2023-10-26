import { useEffect } from "react";

const RedirectToApp = () => {
    useEffect(() => {
        window.location = "https://play.google.com/store/apps/details?id=com.gabriel761.frontend";
    })
    
    window.location = "festum://";
    
    return (
        <div>
            <h1>Redirecionando...</h1>
        </div>
    );
}
 
export default RedirectToApp;