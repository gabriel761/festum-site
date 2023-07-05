import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import CryptoJS from "crypto-js";

const ShowNavbarComponent = ({ children, signed }) => {
    const [showNavbar, setShowNavbar] = useState(true)
    const location = useLocation()
    useEffect(() => {

        const token = localStorage.getItem("token-festum")
        if (token) {
            const bytes = CryptoJS.AES.decrypt(token, "Web033F1")
            const forJson = bytes.toString(CryptoJS.enc.Utf8)
            console.log("for json: ", forJson)
            const normalText = JSON.parse(forJson)
            console.log("texto descriptografado: ", normalText)
            if (forJson == '{"pk_id":356,"nome":"admin","sobrenome":"festum","email":"admin@festum.com.br","id_firebase":"senha1","tipo_pessoa":"admin"}') {
                signed = true
            }
        }

        console.log("this is location: ", location)
        if (location.pathname == "/" || location.pathname == "/form-precadastro" || location.pathname == "/confirmacao-precadastro" || location.pathname == "email-confirmado" || !signed) {
            setShowNavbar(false)
        } else {
            setShowNavbar(true)
        }
    }, [location])
    return (
        <div>
            {showNavbar && <div> {children} </div>}
        </div>
    );
}

export default ShowNavbarComponent
