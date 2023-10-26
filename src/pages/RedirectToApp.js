import { useEffect } from "react";

const RedirectToApp = () => {
    var now = new Date().valueOf();
    setTimeout(function () {
        if (new Date().valueOf() - now > 100) return;
        window.location = "https://play.google.com/store/apps/details?id=com.gabriel761.frontend";
    }, 25);
    window.location = "festum://";
    return null;
}
 
export default RedirectToApp;