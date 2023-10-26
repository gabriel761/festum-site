import { useEffect } from "react";

const RedirectToApp = () => {
    var now = new Date().valueOf();
    let notInstalled = false
    setTimeout(function () {
        if (notInstalled){
            window.location = "https://play.google.com/store/apps/details?id=com.gabriel761.frontend";
        };
        
    }, 500);
    window.location = "festum://";
    window.confirm = () => {
        notInstalled = true
    }
    return null;
}
 
export default RedirectToApp;