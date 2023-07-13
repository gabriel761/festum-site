import {
    MDBCard,
    MDBCardBody,
    MDBInput,
    MDBCol,
    MDBRow,
    MDBCheckbox,
    MDBBtn,
    MDBIcon,
    MDBSpinner
} from 'mdb-react-ui-kit';
import "../index.css"
import { useRef, useState } from 'react';
import { auth } from '../services/firebase';
import { getFornecedores } from '../api/getFornecedores';
import { postFornecedores } from '../api/postFornecedores';
import { apiIpag } from '../api/apiIpag';



const ConfirmacaoPreCadastroCard = () => {
    const [showInputEmail, setShowInputEmail] = useState(false)
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const isErroColor = useRef(true)
    console.log("auth firebase: ", auth)

    const updateFirebaseEmail = () => {
        
        postFornecedores("/checkIfEmailExists", email).then((result) => {
            
            if (!result.data.error) {
               
                auth.currentUser.updateEmail(email).then( async() => {
                    let token = await auth.currentUser.getIdToken()
                    getFornecedores("/updateEmail/" + email,token ).then((result) => {
                        console.log(result)
                        auth.currentUser.sendEmailVerification({
                            handleCodeInApp: true,
                            url: window.location.origin + "/email-confirmado"
                          }).then((result) => {
                            isErroColor.current = false
                            setMessage("E-mail reenviado com sucesso!")
                            setIsLoading(false)
                        }).catch((error) => {
                            console.log("erro ao reenviar email de confirmação", error)
                            setMessage(`Falha no envio da mensagem para ${auth.currentUser.email}`)
                        })
                    }).catch((error) => {
                        console.error("erro update do e-mail banco de dados", error)
                        setError("Ocorreu um problema na atualização dos seus dados.")
                    })
                }).catch((error) => {
                    const erroTraduzido = verifyErrorCode(error.code)
                    console.log("erro traduzido: ", erroTraduzido)
                    setMessage(erroTraduzido)
                    setIsLoading(false)
                });
            }
        }).catch((e) => {
            console.log("erro checando email: ", e)
        })
    }

    const reenviarEmail = () => {
        isErroColor.current = true
        if (validateEmail()) {
            setIsLoading(true)
            apiIpag.request({
                url: "/service/resources/customers?email=" + auth.currentUser.email,
                method: "GET",
            }).then((response) => {
                console.log("cliente ipag: ", response.data)
                let idClienteIpag = response.data.data[0].id
                let objetoClienteIpag = { email: email, cpf_cnpj: "", name: "", phone: "" }
                getFornecedores("/getFornecedorByEmail/" + auth.currentUser.email).then((response) => {
                    console.log("fornecedor do banco de dados: ", response.data)
                    const fornecedorDB = response.data[0]
                    objetoClienteIpag.name = fornecedorDB.nome + " " + fornecedorDB.sobrenome
                    objetoClienteIpag.cpf_cnpj = fornecedorDB.cpf ? fornecedorDB.cpf : fornecedorDB.cpf_cnpj
                    objetoClienteIpag.phone = fornecedorDB.telefone
                    console.log("id ipag depois de pegar fornecedor: ", idClienteIpag)
                    apiIpag.request({
                        url: "/service/resources/customers?id=" + idClienteIpag,
                        method: "POST",
                        data: objetoClienteIpag
                    }).then((response) => {
                        updateFirebaseEmail()

                    }).catch((e) => {
                        console.log("erro ao alterar cliente no ipag: ", e)
                    })
                }).catch((e) => {
                    console.log("erro ao cosultar cliente do ipag: ", e)
                })

            })
        }

    }

    function validateEmail() {
        console.log("test email: ", email)
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            setMessage("")
            return (true)
        }
        setMessage("E-mail inválido")
        return (false)
    }

    
    return (
        <MDBCard  >
            <MDBCardBody>
                <MDBIcon className='ms-1 mb-4 d-flex justify-content-center' color='primary' icon='check' size='4x' />
                <h3 className='text-center'>Confirme seu e-mail</h3>
                <p className='text-center'>Enviamos um e-mail de confirmação para a sua caixa de entrada. Caso não encontre o e-mail, cheque sua caixa de span. Se achar necessário clique no botão abaixo para corrigir e reenviar e-mail.</p>
                <MDBBtn onClick={() => setShowInputEmail(prev => !prev)} color='secondary' type='submit' block>
                    Corrigir e reenviar e-mail
                </MDBBtn>
                {showInputEmail &&
                    <>
                        <MDBInput value={email} onChange={(e) => setEmail(e.target.value)} className='my-4' type='email' id='fExample1' label='E-mail' />

                        {isLoading ?
                            <div className='col-md-12'>
                                <MDBSpinner role='status'>
                                    <span className='visually-hidden'>Loading...</span>
                                </MDBSpinner>
                            </div>
                            :
                            <>
                                <div style={{ color: isErroColor.current?'#DC4C64': "#14A44D"}}>{message}</div>
                                <MDBBtn onClick={reenviarEmail} type='submit' >
                                    Reenviar
                                </MDBBtn>
                            </>
                        }
                    </>
                }

            </MDBCardBody>
        </MDBCard>
    );
}

export default ConfirmacaoPreCadastroCard;