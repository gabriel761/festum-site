import {
    MDBCard,
    MDBCardBody,
    MDBInput,
    MDBCol,
    MDBRow,
    MDBCheckbox,
    MDBBtn,
    MDBCardText,
} from 'mdb-react-ui-kit';
import "../index.css"
import { useContext, useState } from 'react';
import api from '../api/api';
import { UserContext } from '../context/UserContext';
import { Navigate, useNavigate } from 'react-router-dom';
import CryptoJS from "crypto-js"

const LoginCard = () => {
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [message, setMessage] = useState('')
    const navigate = useNavigate()

    const setSigned = useContext(UserContext)

    const handleSubmit = () => {
        if (email.length > 0 && senha.length > 0) {
            console.log("Dados enviados")


            api.request({
                method: "POST",
                url: '/login-pessoa',
                data: { email: email, firebaseId: senha },
            }).then((response) => {
                console.log("resposta do servidor: ", response)
                if (response.data.error) {
                    setMessage(response.data.message)
                } else {
                    console.log(response.data)
                    const cipherText = CryptoJS.AES.encrypt(JSON.stringify(response.data), "Web033F1").toString()
                    console.log("texto criptografado: ", cipherText)
                    localStorage.setItem("token-festum", cipherText)
                    
                    setSigned(true)
                    navigate("/lista-precadastro")
                }
            }).catch((e) => {
                console.log("erro do login: ", e)
            })
        } else {
            console.log("erro de login")
        }
    }
    return (
        <MDBCard  >
            <MDBCardBody>

                <MDBInput className='mb-4' type='email' value={email} onChange={(e) => setEmail(e.target.value)} id='form1Example1' label='E-mail' />
                <MDBInput className='mb-4' type='password' value={senha} onChange={(e) => setSenha(e.target.value)} id='form1Example2' label='Senha' />

                {/* <MDBRow className='mb-4'>
                    <MDBCol className='d-flex justify-content-center'>
                        <MDBCheckbox id='form1Example3' label='Remember me' defaultChecked />
                    </MDBCol>
                    <MDBCol>
                        <a href='#!'></a>
                    </MDBCol>
                </MDBRow> */}
                <MDBCardText style={{ color: "#DC4C64" }}>{message}</MDBCardText>
                <MDBBtn onClick={() => handleSubmit()} block>
                    Entrar
                </MDBBtn>

            </MDBCardBody>
        </MDBCard>
    );
}

export default LoginCard;