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
            if (forJson == '{"pk_id":368,"nome":"admin","sobrenome":"festum","email":"admin@festum.com.br","id_firebase":"Web033F1","tipo_pessoa":"admin"}') {
                signed = true
            }
        }

        console.log("this is location: ", location)
        if (location.pathname == "/" || location.pathname == "/form-precadastro" || location.pathname == "/confirmacao-precadastro" || location.pathname == "/email-confirmado" || location.pathname == "/pagamento-confirmado" || location.pathname == "/form-precadastro-firebase" || location.pathname == "/email-confirmado-app" || location.pathname == "/senha-confirmada-app" || !signed) {
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
