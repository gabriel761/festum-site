import * as yup from 'yup'
import {
    MDBCard,
    MDBCardBody,
    MDBInput,
    MDBCol,
    MDBRow,
    MDBCheckbox,
    MDBBtn,
    MDBCardText,
    MDBCardLink,
    MDBSpinner,
    MDBIcon
} from 'mdb-react-ui-kit'
import { useState, useRef, useEffect } from 'react';
import { Formik } from 'formik';
import { getFornecedores } from '../api/getFornecedores';
import { postFornecedores } from '../api/postFornecedores'
import { auth } from "../services/firebase";
import api from '../api/api';
import verifyErrorCode from '../services/verifyErrorCode';
import { useNavigate } from 'react-router-dom';




const FormPreCadstroFirebaseCard = () => {
    const navigate = useNavigate();
    const [message, setMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [checkboxTermos, setCheckboxTermos] = useState(false)

    const yupObject = {
        email: yup.string().required("Campo obrigatório").email("E-mail inválido"),
        senha: yup.string().required("Campo obrigatório").min(6, "Mínimo de 6 letras"),
        senhaConfirmar: yup.string().required("Campo obrigatório").oneOf([yup.ref("senha")], "As senhas não coincidem"),

    }
    const validationSchema = yup.object(yupObject)

    const updateFirebaseId = async (uid, email) => {
        try {
            let result = await api.request({
                url: "/updateFirebaseId/" + uid + "/" + email,
                method: "GET"
            })
        } catch (e) {
            console.log("erro no update firebase id", e)
        }

    }


    const handleSubmit = (values) => {
        setIsLoading(true)
        if (!checkboxTermos) {
            setMessage("É necessário aceitar os termos e condições para prosseguir")
        } else {
            console.log("values: ", values.email)
            console.log("values: ", values.senha)
            postFornecedores('/checkIfEmailExists', { email: values.email }).then((response) => {
                if (response.data.emailExists) {

                    auth.createUserWithEmailAndPassword(values.email, values.senha).then(() => {
                        auth.currentUser.sendEmailVerification({
                            handleCodeInApp: false,
                            url: window.location.origin + "/email-confirmado"

                        }).then(() => {
                            updateFirebaseId(auth.currentUser.uid, auth.currentUser.email).then(() => {
                                setMessage('')
                                setIsLoading(false)
                                
                                navigate('/confirmacao-precadastro');
                            }).catch((e) => {
                                setIsLoading(false)
                                console.log("erro ao atualizar o firebase id: ", e)
                                setMessage(e.message)
                            })

                        }).catch((e) => {
                            setIsLoading(false)
                            console.log("erro ao enviar email: ", e)
                            setMessage(e.message)
                        })
                    }).catch((e) => {
                        setIsLoading(false)
                        console.log(e)
                        const erroFirebase = verifyErrorCode(e.code)
                        setMessage(erroFirebase)
                    })


                } else {
                    setMessage("Por favor digite o mesmo e-mail utilizado no pagamento")
                }

            }).catch((e) => {
                setIsLoading(false)
                console.log(e)
                setMessage(e.message)
            })
        }
    }


    return (
        <MDBCard className='w-100 p-3' >
            <MDBIcon className='ms-1 mb-4 d-flex justify-content-center' color='primary' icon='check' size='4x' />
            <h3 className='text-center'>Pagamento Confirmado!</h3>
            <MDBCardText className='text-center mx-5'>Crie uma senha e confirme seu e-mail para sua conta no aplicativo Festum!</MDBCardText>
            <Formik
                initialValues={{ email: '', senha: '', senhaConfirmar: '' }}
                onSubmit={(values) => handleSubmit(values)}
                validationSchema={validationSchema}
            >
                {
                    ({ handleChange, handleSubmit, handleBlur, touched, errors, values }) =>
                    (
                        <MDBCardBody>
                            <MDBRow className='mb-2'>
                                <MDBCol md={12} className='mb-2'>
                                    <MDBInput
                                        type='email'
                                        label='E-mail utilizado no pagamento'
                                        onChange={handleChange('email')}
                                        onBlur={handleBlur('email')}
                                        value={values.email}
                                    />
                                    <div style={{ color: '#DC4C64' }}>{touched.email && errors.email}</div>
                                </MDBCol>

                            </MDBRow>
                            <MDBRow className='mb-2'>
                                <MDBCol md={12} className='mb-2'>
                                    <MDBInput
                                        type='password'
                                        label='Senha'
                                        onChange={handleChange('senha')}
                                        onBlur={handleBlur('senha')}
                                        value={values.senha}
                                    />
                                    <div style={{ color: '#DC4C64' }}>{touched.senha && errors.senha}</div>
                                </MDBCol>
                            </MDBRow>
                            <MDBRow className='mb-2'>
                                <MDBCol md={12} className='mb-2'>
                                    <MDBInput
                                        type='password'
                                        label='Confirmar Senha'
                                        onChange={handleChange('senhaConfirmar')}
                                        onBlur={handleBlur('senhaConfirmar')}
                                        value={values.senhaConfirmar}
                                    />
                                    <div style={{ color: '#DC4C64' }}>{touched.senhaConfirmar && errors.senhaConfirmar}</div>
                                </MDBCol>
                            </MDBRow>
                            <MDBRow className='mb-5'>
                                <MDBCol md={12}>
                                    <MDBCheckbox onChange={(e) => setCheckboxTermos(e.target.value)} value={checkboxTermos} label='Eu concordo com os termos e condições' id='invalidCheck' />
                                    <MDBCardLink target='_blank' href='https://drive.google.com/file/d/1mZGSubTrJUI-V-lwnmm_pMgy-muP0c-e/view?usp=drive_link' style={{ textDecoration: "underline", marginLeft: 10 }}> Ler termos e condições</MDBCardLink>
                                </MDBCol>
                            </MDBRow>
                            {isLoading ?
                                <div className='col-md-12'>
                                    <MDBSpinner role='status'>
                                        <span className='visually-hidden'>Loading...</span>
                                    </MDBSpinner>
                                </div>
                                :
                                <>
                                    <div style={{ color: '#DC4C64' }}>{message}</div>
                                    <MDBBtn onClick={handleSubmit} type='submit' >
                                        Cadastrar
                                    </MDBBtn>
                                </>
                            }
                        </MDBCardBody>
                    )
                }
            </Formik>
        </MDBCard>
    );
}

export default FormPreCadstroFirebaseCard;