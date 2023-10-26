import { useEffect } from "react";

const RedirectToApp = () => {
    var now = new Date().valueOf();
    let notInstalled = false
    setTimeout(function () {
        if (notInstalled) return;
        window.location = "https://play.google.com/store/apps/details?id=com.gabriel761.frontend";
    }, 25);
    window.location = "festum://";
    window.confirm = () => {
        notInstalled = true
    }
    return null;
}
 
export default RedirectToApp;