import { useEffect } from "react";

const RedirectToApp = () => {
    setTimeout(function () { window.location = "https://play.google.com/store/apps/details?id=com.gabriel761.frontend"; }, 25);
    window.location = "festum://";
    return null;
}
 
export default RedirectToApp;