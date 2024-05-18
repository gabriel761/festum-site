import { MDBBtn, MDBCard, MDBCardBody, MDBCardTitle, MDBCol, MDBContainer, MDBIcon, MDBInput, MDBRow, MDBSpinner, MDBValidation, MDBValidationItem } from "mdb-react-ui-kit";
import { useEffect, useRef, useState, useContext } from 'react';
import { replaceAll, onlyLettersAndSpaces, dateMask } from '../functions/uitl';
import { checkDate, testarCC, formatDate } from '../functions/validarCartao';
import { sendAssinaturaToBackEnd, sendCartaoToBackEnd, ipagRequest, getAssinatura, ipagRequestChecarSeAssinaturaExiste, ipagRequestAlterarCartaoDaAssinatura, alterarAssinaturaBD, ipagRequestCriarClienteEAssinaturaUsandoToken, ipagRequestTokenizarCartao, ipagRequestChecarSeAssinaturaExisteEmail, getCartao, updateStatusPagamentoFornecedor, mensagemStatusContaIpag, ipagRequestAtivarAssinatura, ipagRequestGetPlano } from '../functions/pagamentos';
import { checkDate as checkDateUtil } from '../functions/uitl';
import { apiIpag } from '../api/apiIpag';
import { getData, removeData, storeData } from '../storage/asyncStorage';
import { formatReal } from "../functions/converterPreco";
import { useLocation, useParams } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import { dateFormatYearFirst } from "../functions/dateFormat";
import { decode } from "base-64"

const PagarAssinaturaFornecedor = () => {
    //console.log("user from context: ", userFromContext)
    const [isLoading, setIsloading] = useState(false)
    const [isLoadingSubmit, setIsLoadingSubmit] = useState(false)
    const [isLoadingPayment, setIsLoadingPayment] = useState(false)
    const [isLoadingAssinatura, setIsLoadingAssinatura] = useState(false)
    const [pagamentoRealizado, setPagamentoRealizado] = useState(false)
    const [message, setMessage] = useState('')
    const [messageDate, setMessageDate] = useState('')
    const [messageDateNascimento, setMessageDateNascimento] = useState('')
    const [nrCartao, setNrCartao] = useState('')
    const [nome, setNome] = useState('')
    const [nascimento, setNascimento] = useState('')
    const [validade, setValidade] = useState('')
    const [validadeMonth, setValidadeMonth] = useState('')
    const [validadeYear, setValidadeYear] = useState('')
    const [cvv, setCvv] = useState('')

    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const { planId, fornecedor, tokenFirebase } = JSON.parse(decode(params.get('data'))) ;

    console.log(planId  )
    // 
    // console.log(planId)
    let yourDate = new Date()
    yourDate = yourDate.setDate(yourDate.getDate() + 1);
    yourDate = new Date(yourDate)
    const formatedDateRef = useRef(null)
    const fornecedorFromDBRef = useRef(fornecedor)
    const enderecoFromCepRef = useRef(null)
    const nrCartaoIsValidRef = useRef(false)
    const nomeIsValidRef = useRef(false)
    const nascimentoIsValid = useRef(false)
    const validadeIsValidRef = useRef(false)
    const cvvIsValidRef = useRef(false)
    const accessTokenRef =  useRef(tokenFirebase)
    const planoIpag = useRef(null)

    useEffect(() => {
        firstFunctions()
    }, [])

    if (planId == 2562) {
        let yourDate = new Date()
        yourDate = yourDate.setDate(yourDate.getDate() + 1);
        yourDate = new Date(yourDate)
        formatedDateRef.current = `${yourDate.getFullYear()}-${yourDate.getMonth() + 1 > 10 ? yourDate.getMonth() + 1 : `0${yourDate.getMonth() + 1}`}-${yourDate.getDate() >= 10 ? yourDate.getDate() : `0${yourDate.getDate()}`}`
    } else {
        let yourDate = new Date()
        yourDate = yourDate.setDate(yourDate.getDate() + 60);
        yourDate = new Date(yourDate)
        formatedDateRef.current = `${yourDate.getFullYear()}-${yourDate.getMonth() + 1 > 10 ? yourDate.getMonth() + 1 : `0${yourDate.getMonth() + 1}`}-${yourDate.getDate() >= 10 ? yourDate.getDate() : `0${yourDate.getDate()}`}`
    }

    const firstFunctions = async () => {
        let endereco = await getEnderecoFromCep(fornecedorFromDBRef.current.cep)
      
        setIsloading(true)
        try{
            planoIpag.current = await ipagRequestGetPlano(planId);
        }catch (error){
            alert("erro ao pegar plano ipag:", error.message)
        }
       
        endereco = {
            ...endereco,
            cep: fornecedorFromDBRef.current?.cep,
            numero: fornecedorFromDBRef.current?.numero,
            complemento: formatedDateRef.current?.complemento
        }
        enderecoFromCepRef.current = endereco
        setIsloading(false)
    }


    const onChangeNrCartao = (text) => {

        if ((text.length == 4 || text.length == 9 || text.length == 14) && nrCartao.length < text.length) {
            text = text + ' '
        }
        const verifyNumbers = /^[\d\s]+$/

        if ((verifyNumbers.test(text) || text == '') && text.length <= 19) {
            setNrCartao(text)
        }

        text = replaceAll(text)
        if (text.length == 16) {
            nrCartaoIsValidRef.current = !!testarCC(text)
            console.log("numero do cartao is valid: ", nrCartaoIsValidRef.current)
        }
    }
    const onChangeName = (text) => {
        const verfyLeters = /^[a-zA-Z\s]+$/;

        text = text.replace('  ', ' ')
        text = text.toUpperCase()
        if (verfyLeters.test(text) || text == '') {
            setNome(text)
        }


        const nomeIsValid = onlyLettersAndSpaces(text)
        nomeIsValidRef.current = nomeIsValid
    }
    const onChangeDate = (date) => {
        if (date.length == 2 && validade.length < date.length) {
            date = date + '/'
        }
        const verifyNumbers = /^[\d/]+$/
        if ((verifyNumbers.test(date) || date == '') && date.length <= 7) {
            setValidade(date)
        }

        const { dateIsValid, vencido, inputMonth, inputYear } = checkDate(date)
        if (dateIsValid) {
            if (!vencido) {
                validadeIsValidRef.current = false

                setMessageDate("Cartão vencido")
            } else {
                setMessageDate('')
                setValidadeMonth(inputMonth)
                setValidadeYear(inputYear.toString())
                validadeIsValidRef.current = dateIsValid
            }
        } else if (!dateIsValid && date.length > 4) {
            validadeIsValidRef.current = false
            setMessageDate("Formato de data inválido")
        } else {
            validadeIsValidRef.current = false
            setMessageDate("")
        }
    }

    const onchangeBirthDate = (date) => {
        if ((date.length == 2 || date.length == 5) && nascimento.length < date.length) {
            date = date + '/'
        }
        const verifyNumbers = /^[\d/]+$/
        if ((verifyNumbers.test(date) || date == '') && date.length <= 10) {
            setNascimento(date)
        }

        if (date.length === 10) {

            const isValid = checkDateUtil(date)
            if (!isValid) {
                setMessageDateNascimento("data inválida")
            } else {
                setMessageDateNascimento('')
            }
            nascimentoIsValid.current = isValid

        } else {
            nascimentoIsValid.current = false
        }

    }

    const onChangeCvv = (cvv) => {
        const verifyNumbers = /^[\d/]+$/
        if ((verifyNumbers.test(cvv) || cvv == '') && cvv.length <= 3) {
            setCvv(cvv)
        }

        if (cvv.length == 3) {
            cvvIsValidRef.current = true
        }
    }

    const getEnderecoFromCep = async (cep) => {
        try {
            const value = cep.replace('-', '')
            const response = await fetch("https://viacep.com.br/ws/" + value + "/json/")
            const data = await response.json()
            const result = {
                uf: data.uf,
                cidade: data.localidade,
                bairro: data.bairro,
                rua: data.logradouro
            }
            return result

        } catch (error) {

            alert(`Erro ao pegar endereço: ${error}`)
            navigation.goBack()
        }

    }

    const efetuarPagamento = async (cartaoTokenizado, assinaturaDB, assinaturaIpag) => {


        try {
            setIsLoadingAssinatura(true)
            if (!!assinaturaDB && !!assinaturaIpag) {
                const alterarAssinatura = await ipagRequestAlterarCartaoDaAssinatura(assinaturaDB.id, cartaoTokenizado.token, planId)
                await ipagRequestAtivarAssinatura(assinaturaDB.id)
                const updateAssinaturaData = { dadosAssinatura: JSON.stringify(alterarAssinatura), cardToken: alterarAssinatura.attributes.creditcard.token, idFornecedor: fornecedorFromDBRef.current.pk_id + '', cancelado: false, dataBloqueio: null }
                await alterarAssinaturaBD(updateAssinaturaData)

                if (!!cartaoTokenizado?.fromIpag) {
                    cartaoTokenizado.fromIpag = false
                    await sendCartaoToBackEnd(cartaoTokenizado, fornecedorFromDBRef.current).catch((e) => { throw ("Erro enviando cartao ao banco de dados: " + e.message) })
                }
            } else {

                const { objCliente, objAssinatura } = await ipagRequestCriarClienteEAssinaturaUsandoToken(cartaoTokenizado, enderecoFromCepRef.current, fornecedorFromDBRef.current, planId, formatedDateRef.current).catch((e) => { alert('Erro no processo de pagamento: ' + e); setIsLoadingSubmit(false); })
                await sendAssinaturaToBackEnd(objAssinatura, fornecedorFromDBRef.current)
                if (!!cartaoTokenizado?.fromIpag) {
                    cartaoTokenizado.fromIpag = false
                    await sendCartaoToBackEnd(cartaoTokenizado, fornecedorFromDBRef.current).catch((e) => { throw ("Erro enviando cartao ao banco de dados: " + e.message) })
                }

            }
            setIsLoadingAssinatura(false)
            setPagamentoRealizado(true)
        } catch (error) {
            setIsLoadingAssinatura(false)
            console.log(error)
            alert(error.message)

        }
    }
    const checarCartaoAntesDoPagamento = async (cartaoTokenizado, assinaturaDB, assinaturaIpag, blockPagamentoObj) => {

        try {
            setIsLoadingPayment(true)
            const paymentObj = {
                "amount": "1.00",
                "callback_url": "https://festum-heroku-production.up.railway.app/webhookPlanoEstrelarIpag",
                "payment": {
                    "type": "card",
                    "method": cartaoTokenizado.attributes.card.brand,
                    "installments": "1",
                    "capture": false,
                    "card": {
                        "holder": nome,
                        "number": nrCartao,
                        "expiry_month": validadeMonth,
                        "expiry_year": validadeYear,
                        "cvv": cvv
                        //"token": cartao.token
                    }
                },
                "customer": {
                    "name": fornecedorFromDBRef.current.nome + " " + fornecedorFromDBRef.current.sobrenome,
                    "cpf_cnpj": !!fornecedorFromDBRef.current.cnpj ? fornecedorFromDBRef.current.cnpj : fornecedorFromDBRef.current.cpf,
                    "email": fornecedorFromDBRef.current.email,
                    "phone": fornecedorFromDBRef.current.telefone,
                    "billing_address": {
                        "street": enderecoFromCepRef.current.rua,
                        "city": enderecoFromCepRef.current.cidade,
                        "number": enderecoFromCepRef.current.numero,
                        "district": enderecoFromCepRef.current.bairro,
                        "state": enderecoFromCepRef.current.uf,
                        "complement": enderecoFromCepRef.current.complemento,
                        "zipcode": enderecoFromCepRef.current.cep
                    }
                }
            }


            const responseIpag = await apiIpag.request({
                url: "/service/payment",
                method: 'POST',
                data: paymentObj

            })


            if (responseIpag.data.attributes.status.code == 5 || responseIpag.data.attributes.status.code == 8) {
                const responseIpagCancelar = await apiIpag.request({
                    url: "/service/cancel?id=" + responseIpag.data.id,
                    method: 'POST',
                })

                if (!!blockPagamentoObj) {
                    await removeData('pagamento-bloqueado')
                }
                await updateStatusPagamentoFornecedor({ status_pagamento: "Aprovado e Capturado", fk_fornecedor_pessoa: fornecedorFromDBRef.current.fk_fornecedor_pessoa }, accessTokenRef.current)
                efetuarPagamento(cartaoTokenizado, assinaturaDB, assinaturaIpag)
            } else {
                // protocolo de falha no pagamento
                if (!!blockPagamentoObj) {
                    if (verificarSeTempoDeBloqueioAcabou(blockPagamentoObj.date)) {
                        blockPagamentoObj.trys = 1
                    } else {
                        blockPagamentoObj.trys++
                    }
                    storeData("pagamento-bloqueado", JSON.stringify(blockPagamentoObj))
                } else {
                    await storeData("pagamento-bloqueado", JSON.stringify(criarObjetoDeBloqueio()))
                }
                const statusPagamento = mensagemStatusContaIpag(responseIpag.data.attributes.status.code)
                alert("Erro no pagamento: Pagamento " + statusPagamento)
                await updateStatusPagamentoFornecedor({ status_pagamento: statusPagamento, fk_fornecedor_pessoa: fornecedorFromDBRef.current.fk_fornecedor_pessoa }, accessTokenRef.current)
            }
            setIsLoadingPayment(false)
        } catch (error) {
            console.log('erro ao tentar realizar o pagamento: ', error.response.data)
            // protocolo de falha no pagamento
            if (!!blockPagamentoObj) {
                if (verificarSeTempoDeBloqueioAcabou(blockPagamentoObj.date)) {
                    console.log("acabou o tempo de bloqueio: ", verificarSeTempoDeBloqueioAcabou(blockPagamentoObj.date))
                    blockPagamentoObj = criarObjetoDeBloqueio()
                } else {
                    console.log("não acabou o tempo de bloqueio: ", verificarSeTempoDeBloqueioAcabou(blockPagamentoObj.date))
                    blockPagamentoObj.trys++
                }
                storeData("pagamento-bloqueado", JSON.stringify(blockPagamentoObj))
            } else {
                await storeData("pagamento-bloqueado", JSON.stringify(criarObjetoDeBloqueio()))
            }
            setIsLoadingPayment(false)
            if (!!error?.response?.data?.error?.message) {
                alert("errro ao realizar pagamento: " + JSON.stringify(error.response.data.error.message))
            } else {
                alert('erro ao tentar realizar o pagamento: ' + error.message)
            }

        }

    }

    const criarObjetoDeBloqueio = () => {
        const dateNow = new Date().getTime()
        const dateNowHours = dateNow / 3600000
        return {
            email: fornecedorFromDBRef.current.email,
            trys: 1,
            date: dateNowHours
        }
    }

    const verificarSeTempoDeBloqueioAcabou = (dateBlock) => {
        const dateNow = new Date().getTime()
        const dateNowHours = dateNow / 3600000
        const hoursPassed = dateNowHours - dateBlock

        return hoursPassed > 1
    }

    const submit = async () => {
        if (nrCartaoIsValidRef.current && nomeIsValidRef.current && validadeIsValidRef.current && cvvIsValidRef.current && nascimentoIsValid.current) {

            const cartao = { nrCartao: nrCartao, nome: nome, validadeMonth: validadeMonth, validadeYear: validadeYear, cvv: cvv, nascimento: dateFormatYearFirst(nascimento) , formatedDate: formatedDateRef.current }

            setIsLoadingSubmit(true)
            setMessage('')
            const assinaturaDB = await getAssinatura(fornecedorFromDBRef.current.pk_id, accessTokenRef.current)
            let cartaoTokenizado = await getCartao(cartao.nrCartao, fornecedorFromDBRef.current.pk_id)

            let assinaturaIpag = null
            if (assinaturaDB) {
                assinaturaIpag = await ipagRequestChecarSeAssinaturaExiste(assinaturaDB.id + "")

            }
            if (!cartaoTokenizado) {

                cartaoTokenizado = await ipagRequestTokenizarCartao(cartao, fornecedorFromDBRef.current, enderecoFromCepRef.current).catch((e) => { throw ("alterar cartao da assinatura: " + e) })
                cartaoTokenizado = { ...cartaoTokenizado, fromIpag: true }
            } else {
                cartaoTokenizado = JSON.parse(cartaoTokenizado.dados_cartao)
            }



            setIsLoadingSubmit(false)
            let blockPagamento = JSON.parse(await getData('pagamento-bloqueado'))

            if (!blockPagamento) {
                checarCartaoAntesDoPagamento(cartaoTokenizado, assinaturaDB, assinaturaIpag, blockPagamento)
            } else if (verificarSeTempoDeBloqueioAcabou(blockPagamento.date)) {
                checarCartaoAntesDoPagamento(cartaoTokenizado, assinaturaDB, assinaturaIpag, blockPagamento)
            } else if (blockPagamento.trys < 2) {
                checarCartaoAntesDoPagamento(cartaoTokenizado, assinaturaDB, assinaturaIpag, blockPagamento)
            } else {
                alert("Pagamento temporariamente bloqueado por excesso de falhas consecutivas. Tente novamente em 1 hora")
            }

        } else if (!nrCartaoIsValidRef.current) {
            setMessage("numero do cartão inválido")
        } else if (!nomeIsValidRef.current) {
            setMessage("nome inválido")
        } else if (!validadeIsValidRef.current) {
            setMessage("data de validade inválida")
        } else if (!nascimentoIsValid) {
            setMessage("data de nascimento inválida")
        } else if (!cvvIsValidRef.current) {
            setMessage("cvv inválido")
        }
        setIsLoadingSubmit(false)
    }

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center ">
                <MDBSpinner size="lg" />
            </div>
        )
    }

    if (isLoadingPayment) {
        return (
            <div className="d-flex justify-content-center flex-column">
                <MDBSpinner className="align-self-center" size="lg" />
                <p style={{ fontSize: 16, textAlign: "center", marginTop: 20 }}>Estamos verificando seu cartão. Isso pode levar alguns instantes. Por favor não feche o aplicativo nem saia desta tela...</p>
            </div>
        )
    }

    if (isLoadingAssinatura) {
        return (
            <div className="d-flex justify-content-center flex-column">
                <MDBSpinner className="align-self-center"  size="lg" />
                <p style={{ fontSize: 16, textAlign: "center", marginTop:20 }}>Verificando assinatura...</p>
            </div>
        )
    }

    if (pagamentoRealizado) {
        return (
            <div className="d-flex justify-content-center flex-column">
                <MDBCard >
                    <MDBCardBody>
                        <MDBIcon className='ms-1 mb-4 d-flex justify-content-center' color='primary' icon='check' size='4x' />
                        <h3 className='text-center'>Pagamento Confirmado!</h3>
                        <p className='text-center'>Agora é só voltar para o aplicativo e finalizar seu cadastro!</p>

                    </MDBCardBody>
                </MDBCard>
            </div>
        )
    }

    return (
        <MDBContainer>
            <MDBRow center>
                <MDBCol md={6} sm={12}>
                    <MDBCard style={{ padding: 20 }}>
                        <MDBRow>

                            <h1>{planoIpag.current?.attributes.name}</h1>


                            <p>{planoIpag.current?.attributes.description}</p>
                            <h3>R${formatReal(planoIpag.current?.attributes.amount)}</h3>

                        </MDBRow>
                        <hr className="hr mb-6" />
                        <MDBValidation className="row g-3 ">
                            <MDBValidationItem className="col-12">
                                <MDBInput value={nrCartao} onChange={(e) => onChangeNrCartao(e.target.value)} label="Numero do cartão" />
                            </MDBValidationItem>
                            <MDBValidationItem className="col-12">
                                <MDBInput value={nome} onChange={(e) => onChangeName(e.target.value)} label="Nome impresso no cartão" />
                            </MDBValidationItem>
                            <MDBValidationItem className="col-4">
                                <MDBInput value={validade} onChange={(e) => onChangeDate(e.target.value)} label="Vencimento" />
                                <div style={{ color: '#DC4C64' }}>{messageDate}</div>
                            </MDBValidationItem>
                            <MDBValidationItem className="col-4">
                                <MDBInput value={nascimento} onChange={(e) => onchangeBirthDate(e.target.value)} label="Nascimento" />
                                <div style={{ color: '#DC4C64' }}>{messageDateNascimento}</div>
                            </MDBValidationItem>
                            <MDBValidationItem className="col-4">
                                <MDBInput value={cvv} onChange={(e) => onChangeCvv(e.target.value)} label="CVV" />
                            </MDBValidationItem>
                            <div style={{ color: '#DC4C64' }}>{message}</div>
                            <MDBBtn onClick={submit}>Comprar</MDBBtn>
                        </MDBValidation>
                    </MDBCard>
                </MDBCol>
            </MDBRow>
        </MDBContainer >
    );
}

export default PagarAssinaturaFornecedor;