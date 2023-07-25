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
} from 'mdb-react-ui-kit';
import "../index.css"
import { Formik } from 'formik';
import { efetuarPreCadastroSite } from '../functions/efetuarPreCadastro';
import { useState, useRef, useEffect } from 'react';
import { verificarCPF, validarCNPJ } from '../functions/verificacoesFornecedor';
import verifyErrorCode from '../services/verifyErrorCode';



const PreCadastroSemPagamentoFormCard = () => {

    const [toggleCPF, setToggleCPF] = useState(false)
    const [cnpj, setCnpj] = useState('')
    const [cpf, setCpf] = useState('')
    const [tel, setTel] = useState('')
    const [message, setMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [checkboxTermos, setCheckboxTermos] = useState(false)


    const cnpjIsValidRef = useRef(false)
    const cpfIsValid = useRef(false)


    const yupObject = {
        nome: yup.string().required("Campo obrigatório"),
        sobrenome: yup.string().required("Campo obrigatório"),
        email: yup.string().required("Campo obrigatório").email("E-mail inválido"),
        senha: yup.string().required("Campo obrigatório").min(6, "Mínimo de 6 letras"),
        senhaConfirmar: yup.string().required("Campo obrigatório").oneOf([yup.ref("senha")], "As senhas não coincidem"),

    }

    const validationSchema = yup.object(yupObject)

    const cpfCnpjToggle = () => {
        if (toggleCPF) {
            setCnpj('')
            cnpjIsValidRef.current = false
        } else {
            setCpf('')
            cpfIsValid.current = false
        }
        setToggleCPF(prev => !prev)
    }
    const onChangeCnpj = value => {
        cnpjIsValidRef.current = false
        var x = value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,3})(\d{0,3})(\d{0,4})(\d{0,2})/);
        value = !x[2] ? x[1] : x[1] + '.' + x[2] + '.' + x[3] + '/' + x[4] + (x[5] ? '-' + x[5] : '');
        setCnpj(value)

        if (value.length == 18) {
            cnpjIsValidRef.current = validarCNPJ(value)

        } else {
            cnpjIsValidRef.current = false
        }

    }
    const phoneMask = (value) => {
        
        if (!value) return ""
        value = value.replace(/\D/g, '')
        value = value.replace(/(\d{2})(\d)/, "($1) $2")
        value = value.replace(/(\d)(\d{4})$/, "$1-$2")
        setTel(value)
    }
    function maskCPF(cpf) {
        cpfIsValid.current = false
        cpf = cpf.replace(/\D/g, "")
        cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2")
        cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2")
        cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2")
        if (cpf.length > 14)
            return
        if (cpf.length == 14) {
            const resultVerificarCpf = verificarCPF(cpf)
            if (resultVerificarCpf) {
                setCpf(cpf)

                cpfIsValid.current = true

            } else {
                cpfIsValid.current = false
            }
        }

        setCpf(cpf)
    }



    const handleSubmit = async (values) => {
        setIsLoading(true)

        if ( ((cpfIsValid.current || cnpjIsValidRef.current) && !(cpfIsValid.current && cnpjIsValidRef.current) && tel.length >= 10 && checkboxTermos)) {
            setMessage('')
            if (cpfIsValid.current) {
                values = { ...values, cpf_cnpj: cpf}
            } else {
                values = { ...values, cpf_cnpj: cnpj }
            }
            values = { ...values, tel }
            let redirectLink = "https://" + 'festum-site.vercel.app' + "/email-confirmado"
            redirectLink = encodeURI(redirectLink)
            console.log(redirectLink)
            try {
                efetuarPreCadastroSite(values, redirectLink).then((result) => {
                    console.log('Result: ', result);
                    setMessage(result.message)
                    if(!result.error){
                        window.location.href = window.location.origin + "/confirmacao-precadastro";
                    }
                   
                    setIsLoading(false)
                }).catch((e) => {
                    console.log("erro de pré cadastro no site: ",verifyErrorCode(e.code) )
                    setMessage(verifyErrorCode(e.code))
                })

            } catch (e) {
                setMessage(e.message)
            }

        } else if (!cpfIsValid.current && !cnpjIsValidRef.current) {
            setMessage("Escreva um CNPJ ou um CPF válido")
        } else if (cpfIsValid.current && cnpjIsValidRef.current) {
            setMessage("Use apenas o CNPJ ou CPF")
        } else if (!checkboxTermos) {
            console.log("mensagem de erro checkbox")
            setMessage("É necessário aceitar os termos e condições para prosseguir")
        } else if (tel.length < 10) {
            console.log("telefone invalid")
            setMessage("telefone inválido")
        }
        setIsLoading(false)



    }



    return (
        <MDBCard  >
            <Formik
                initialValues={{ nome: '', sobrenome: '', email: '', senha: '', senhaConfirmar: '' }}
                onSubmit={(values) => handleSubmit(values)}
                validationSchema={validationSchema}
            >
                {
                    ({ handleChange, handleSubmit, handleBlur, touched, errors, values }) =>
                    (
                        <MDBCardBody>
                            <MDBRow className='mb-2'>
                                <MDBCol md={6} className='mb-2'>
                                    <MDBInput
                                        type='text'
                                        label='Nome'
                                        onChange={handleChange('nome')}
                                        onBlur={handleBlur('nome')}
                                        value={values.nome}
                                    />
                                    <div style={{ color: '#DC4C64' }}>{touched.nome && errors.nome}</div>
                                </MDBCol>
                                <MDBCol md={6} className='mb-2'>
                                    <MDBInput
                                        type='text'
                                        label='Sobrenome'
                                        onChange={handleChange('sobrenome')}
                                        onBlur={handleBlur('sobrenome')}
                                        value={values.sobrenome}
                                    />
                                    <div style={{ color: '#DC4C64' }}>{touched.sobrenome && errors.sobrenome}</div>
                                </MDBCol>
                            </MDBRow>
                            <MDBRow className='mb-2'>
                                {toggleCPF ?
                                    (
                                        <>
                                            <MDBCol md={4} className='mb-2'>
                                                <MDBInput
                                                    type='text'
                                                    label='CPF'
                                                    onChange={(e) => maskCPF(e.target.value)}
                                                    value={cpf}
                                                />
                                                <div style={{ color: '#DC4C64' }}>{touched.cpf && errors.cpf}</div>
                                            </MDBCol>
                                            <MDBCol md={2} className='mb-2'>
                                                <MDBCardLink style={{ cursor: "pointer" }} onClick={cpfCnpjToggle}>
                                                    Voltar a usar CNPJ
                                                </MDBCardLink>
                                            </MDBCol>
                                        </>
                                    )
                                    :
                                    (
                                        <>
                                            <MDBCol md={4} className='mb-2'>
                                                <MDBInput
                                                    type='text'
                                                    label='CNPJ'
                                                    onChange={(e) => onChangeCnpj(e.target.value)}
                                                    value={cnpj}

                                                />
                                                <div style={{ color: '#DC4C64' }}>{touched.cnpj && errors.cnpj}</div>
                                            </MDBCol>
                                            <MDBCol md={2} className='mb-2'>
                                                <MDBCardLink style={{ cursor: "pointer" }} onClick={cpfCnpjToggle}>
                                                    Usar CPF em vez de CNPJ
                                                </MDBCardLink>
                                            </MDBCol>
                                        </>
                                    )
                                }

                                <MDBCol md={6} className='mb-2'>
                                    <MDBInput
                                        type='text'
                                        label='Telefone'
                                        onChange={(e) => phoneMask(e.target.value)}

                                        value={tel}
                                    />

                                </MDBCol>
                            </MDBRow>
                            <MDBRow className='mb-4'>
                                <MDBCol md={4} className='mb-2'>
                                    <MDBInput
                                        type='email'
                                        label='E-mail'
                                        onChange={handleChange('email')}
                                        onBlur={handleBlur('email')}
                                        value={values.email}
                                    />
                                    <div style={{ color: '#DC4C64' }}>{touched.email && errors.email}</div>
                                </MDBCol>
                                <MDBCol md={4} className='mb-2'>
                                    <MDBInput
                                        type='password'
                                        label='Senha'
                                        onChange={handleChange('senha')}
                                        onBlur={handleBlur('senha')}
                                        value={values.senha}
                                    />
                                    <div style={{ color: '#DC4C64' }}>{touched.senha && errors.senha}</div>
                                </MDBCol>
                                <MDBCol md={4} className='mb-2'>
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
                                    <MDBCheckbox onChange={(e) => setCheckboxTermos(prev => !prev)}  label='Eu concordo com os termos e condições' id='invalidCheck' />
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

export default PreCadastroSemPagamentoFormCard;