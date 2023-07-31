import React, { useState, useRef } from 'react';
import { verificarCPF, validarCNPJ } from '../functions/verificacoesFornecedor';
import api from '../api/api';
import {
    MDBCol, MDBRow, MDBContainer,
    MDBCard,
    MDBCardBody,
    MDBValidation,
    MDBValidationItem,
    MDBInput,
    MDBInputGroup,
    MDBBtn,
    MDBCheckbox,
    MDBDropdown, MDBDropdownMenu, MDBDropdownToggle, MDBDropdownItem, MDBTextArea, MDBSpinner, MDBRadio, MDBCardTitle
} from 'mdb-react-ui-kit';
import ImageUploader from '../components/ImageUploader';
import { Formik } from 'formik'
import * as yup from "yup";
import DropdownCadastro from '../components/DropdownCadastro';
import ListaCategoriasEscolhidas from '../components/ListaCategoriasEscolhidas';
import { useEffect } from 'react';
import { getDataFromDatabase, postDataFromDatabase } from '../api/getCategorias';
import UploadGaleria from '../components/UploadGaleria';
import ImageUploaderFundo from '../components/ImageUploaderFundo';
import { efetuarCadastroFornecedor } from '../functions/efetuarCadastroFornecedor';
import { formasDePagamentoData } from '../objects/formasDePagamento';
import { redirect, useLocation, useNavigate } from 'react-router-dom';
import { efetuarCriarFornecedorFicticio } from '../functions/efetuarCriarFornecedorFicticio';
import { efetuarCadastroNebulosa } from '../functions/efetuarCadastroNebulosa';




const EditarFornecedorNebulosa = () => {



    const navigate = useNavigate()
    let { state } = useLocation();
    const { fornecedor } = state

    

    const transformSegmentoCategoriaSubcategoria = (array) => {
        const transformed = array.map((item) => {
          return {
            nome: item
          }
        })
        console.log("transform segmentos: ", transformed)
        return transformed
      }

    // const [message,errorMessageRef.current =  = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [perfilImage, setPerfilImage] = useState(fornecedor.imagem);
    const [imagemFundo, setImagemFundo] = useState(fornecedor.foto_de_fundo);
    const [tipoTel, setTipoTel] = useState("Celular")
    const [cep, setCep] = useState('')
    const [cnpj, setCnpj] = useState('')
    const [cpf, setCpf] = useState('')
    const [cpfMessage, setCpfMessage] = useState('')
    const [uf, setUf] = useState('')
    const [cidade, setCidade] = useState('')
    const [bairro, setBairro] = useState('')
    const [rua, setRua] = useState('')
    const [numero, setNumero] = useState('')
    const [complemento, setComplemento] = useState('')
    const [cepMessage, setCepMessage] = useState('')
    const [segmentosData, setSegmentosData] = useState([])
    const [categoriasData, setCategoriasData] = useState([])
    const [subcategoriasData, setSubcategoriasData] = useState([])
    const [segmentos, setSegmentos] = useState(transformSegmentoCategoriaSubcategoria( fornecedor.segmento.split(", ")))
    const [categorias, setCategorias] = useState(transformSegmentoCategoriaSubcategoria(fornecedor.categoria.split(", ")))
    const [subcategorias, setSubcategorias] = useState(transformSegmentoCategoriaSubcategoria(fornecedor.subcategoria.split(", ")))
    const [formaPagamento, setFormaPagamento] = useState([])
    const [horarioFuncionamento, setHorarioFuncionamento] = useState('')
    const [descricaoLoja, setDescricaoLoja] = useState('')
    const [prazoProducao, setPrazoProducao] = useState('')
    const [fazEntrega, setFazEntrega] = useState("Não")
    const [prazoEntrega, setPrazoEntrega] = useState('')
    const prazoEntregaTipoRef = useRef("Minutos")
    const prazoProducaoTipoRef = useRef("Minutos")
    const [galeria, setGaleria] = useState([])

    const cepRef = useRef(null)
    const cepValid = useRef(false)
    const cnpjInputRef = useRef(null)
    const cnpjRef = useRef(null)
    const cnpjIsValidRef = useRef(false)
    const cpfRef = useRef(null)
    const cpfIsValid = useRef(false)
    const subcategoriaSugestRef = useRef('')
    const errorMessageRef = useRef('')

    
    const yupObject = {

        email: yup.string().required("Campo obrigatório").email("E-mail inválido"),
        nomeLoja: yup.string().required("Campo obrigatório").min(2),
        cep: yup.string(),
        uf: yup.string(),
        cidade: yup.string(),
        bairro: yup.string(),
        rua: yup.string(),
        numero: yup.number("Apenas numeros"),
        categoria: yup.string(),
        subcategoria: yup.string(),
        segmento: yup.string(),
        preco: yup.string().required("Campo obrigatório"),
        tel: yup.string(),
    }
    const validationSchema = yup.object(yupObject)


    const getSubcategorias = (newCategorias) => {
        getDataFromDatabase("/subcategoriasByFkId/" + JSON.stringify(newCategorias)).then((result) => {
            console.log("subcategorias: ", result.data)
            const options = [...result.data, { nome: "Todos", pk_id: 0 }]
            setSubcategoriasData(options)
        }).catch((e) => {
            console.log("erro subcategorias: ", e)
        })
    }
    useEffect(() => {
        getDataFromDatabase('/segmentos').then((result) => {
            setSegmentosData([...result.data, { nome: "Todos", pk_id: 0 }])
            getDataFromDatabase('/categorias').then((result) => {
                setCategoriasData([...result.data, { nome: "Todos", pk_id: 0 }])
            })
        })
    }, [])

    const onChangeCep = (value) => {
        cepValid.current = false
        setCep(value)
        setCepMessage('')
        value = value.replace('-', '')
        if (value.length == 8) {

            fetch("https://viacep.com.br/ws/" + value + "/json/").then((result) => result.json().then((data) => {
                console.log("entrou no cep")
                console.log(data)
                if (!data.erro) {
                    setUf(data.uf)
                    setCidade(data.localidade)
                    setBairro(data.bairro)
                    setRua(data.logradouro)
                    setCepMessage('')
                    cepValid.current = true
                } else {
                    setUf('')
                    setCidade('')
                    setBairro('')
                    setRua('')
                    setCepMessage('CEP inválido')
                    cepValid.current = false
                }
            })).catch((e) => {
                console.log("erro do viacep: ", e)
                setCepMessage("CEP inválido")
            })
        }
    }
    const getCoordinates = async () => {
        let finalAddress = rua + ", " + numero + " - " + bairro + ", " + cidade + " - " + uf
        let location = null
        console.log("final address: ", finalAddress)
        const result = await api.request({
            url: "https://www.mapquestapi.com/geocoding/v1/address?key=EorR4RAXKIMPw2ePIu7bhWrROCmEoS1Q&location=" + finalAddress,
            method: "get"
        })
        location = result.data.results[0].locations[0].latLng
        location = { latitude: location.lat, longitude: location.lng }
        if (complemento) {
            finalAddress = finalAddress + " - " + cep + " - " + complemento
        } else {
            finalAddress = finalAddress + " - " + cep
        }
        return { finalAddress, location }
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

    const onBlurCep = (value) => {
        if (cep.length < 8) {
            setCepMessage('CEP inválido')
        }

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
                setCpfMessage("")
                cpfIsValid.current = true

            } else {
                setCpfMessage("CPF inválido")
            }
        }
        setCpf(cpf)
    }
    const handleSubmit = (values) => {
        console.log("entrou no submit. CEP: ", cepValid.current)
        setIsLoading(true)
        getCoordinates().then(async (data) => {
            let newValues
            if (data.location && cepValid.current && 5 && perfilImage && galeria.length != 0 && imagemFundo && segmentos.length != 0 && categorias.length != 0 && subcategorias.length != 0 && ((cpfIsValid.current || cnpjIsValidRef.current) && !(cpfIsValid.current && cnpjIsValidRef.current))) {
                console.log("handle submit")
                let dadosInteresse = { horarioFuncionamento, prazoProducao: prazoProducao + " " + prazoProducaoTipoRef.current, prazoEntrega: prazoEntrega + " " + prazoEntregaTipoRef.current, fazEntrega }
                console.log("dados de interesse: ", dadosInteresse)
                newValues = { ...values, localizacao: JSON.stringify(data.location), endereco: data.finalAddress, cidade, segmentos: segmentos, categorias: categorias, subcategorias: subcategorias, cnpj: cnpjRef.current, tipoTel: tipoTel, imagem: perfilImage, cep, galeria, imagemFundo, formaPagamento: JSON.stringify(formaPagamento), descricaoLoja, dadosInteresse: JSON.stringify(dadosInteresse),statusPagamento: "conta gratuita", statusConta: "conta gratuita", plano: "Pacote Nebulosa" }
                if (cpf) {
                    newValues.cnpj = null;
                    newValues = { ...newValues, cpf: cpf }
                    try {
                        const { message } = await efetuarCadastroNebulosa(newValues)
                        errorMessageRef.current = message

                        setIsLoading(false)
                        if (message.length == 0) {
                            alert("Cadastro completado com sucesso!")

                        }
                    } catch (e) {
                        errorMessageRef.current = e.message
                        setIsLoading(false)
                        console.log(e)

                    }
                } else {
                    postDataFromDatabase("/getCnpj", newValues.cnpj).then(async (result) => {
                        if (!result.data.error) {
                            try {
                                const { message } = await efetuarCadastroNebulosa(newValues)
                                errorMessageRef.current = message
                                setIsLoading(false)
                                if (message.length == 0) {
                                    alert("Cadastro completado com sucesso!")
                                }
                            } catch (e) {
                                errorMessageRef.current = e.message
                                setIsLoading(false)
                                console.log(e)
                            }
                        } else {
                            errorMessageRef.current = result.data.message
                            setIsLoading(false)
                        }
                    }).catch((e) => {
                        console.log("erro checando cnpj: ", e)
                        setIsLoading(false)
                    })
                }
            } else if (!data.location || data.finalAddress.length < 5) {
                errorMessageRef.current = "Endereço inválido"
                setIsLoading(false)
            } else if (segmentos.length == 0 || categorias.length == 0 || subcategorias.length == 0) {
                errorMessageRef.current = "Escolha um segmento, categoria e subcategoria"
                setIsLoading(false)
            } else if (!perfilImage) {
                errorMessageRef.current = "Adicione uma imagem para seu perfil"
                setIsLoading(false)
            } else if (!imagemFundo) {
                errorMessageRef.current = "Adicione uma imagem de fundo"
                setIsLoading(false)
            } else if (galeria.length == 0) {
                errorMessageRef.current = "Adicione uma ou mais imagens à sua galeria"
                setIsLoading(false)
            } else if (!cpfIsValid.current && !cnpjIsValidRef.current) {
                console.log("cpf: ", cpfIsValid.current)
                console.log("cnpj: ", cnpjIsValidRef.current)
                errorMessageRef.current = "Escreva um CNPJ ou CPF válido"
                setIsLoading(false)
            } else if (cpfIsValid.current && cnpjIsValidRef.current) {
                console.log("cpf: ", cpfIsValid.current)
                console.log("cnpj: ", cnpjIsValidRef.current)
                errorMessageRef.current = "Você digitou o CNPJ e o CPF. Escolha apenas um deles para manter e apague o outro"
                setIsLoading(false)
            } else if (!cepValid.current) {
                errorMessageRef.current = "CEP inválido"
                setIsLoading(false)
            } else {
                errorMessageRef.current = "nenhuma mensagem de erro"
                setIsLoading(false)
            }
        }).catch((e) => {
            console.log(e)
        })

    }

    return (

        <MDBContainer className="px-5">

            <MDBRow className="gx-5">
                <MDBCol>
                    <MDBCard >
                        <MDBCardBody>
                            <MDBRow style={{ marginBottom: 40 }} className='g-5'>
                                <MDBCol md='3'>

                                </MDBCol>
                                <MDBCol className='col-md-6'>
                                    <ImageUploader previewImage={perfilImage} setPreviewImage={setPerfilImage} />
                                </MDBCol>
                                <MDBCol md='3'>

                                </MDBCol>
                            </MDBRow>
                            <Formik
                                initialValues={{ nome: '', sobrenome: '', email: '', senha: '', senhaConfirmar: '', nomeLoja: '', numero: '', complemento: '', cnpj: '', tel: '', instagram: '', instagramLink: '', endereco: '', cidade: '', palavrasChave: '', categoria: '', subcategoria: '', segmento: '', preco: '' }}
                                onSubmit={(values) => handleSubmit(values)}
                                validationSchema={validationSchema}
                            >
                                {
                                    ({ handleChange, handleSubmit, handleBlur, touched, errors, values }) => (
                                        <MDBContainer>

                                            <MDBRow className='my-3'>
                                                <MDBCol className='col-md-12'  >
                                                    <MDBInput
                                                        value={values.email}
                                                        onChange={handleChange('email')}
                                                        required
                                                        label='E-mail'
                                                        onBlur={handleBlur('email')}
                                                    />
                                                    <div style={{ color: '#DC4C64' }}>{touched.email && errors.email}</div>
                                                </MDBCol>
                                            </MDBRow>
                                            <MDBRow className='my-3'>
                                                <MDBCol className='col-md-3' feedback='Please provide a valid zip.' >
                                                    <MDBInput
                                                        value={cep}
                                                        onChange={(e) => onChangeCep(e.target.value)}
                                                        required
                                                        ref={cepRef}
                                                        label='CEP'
                                                        onBlur={() => onBlurCep()}
                                                    />
                                                    <div style={{ color: '#DC4C64' }}>{cepMessage}</div>
                                                </MDBCol>
                                                <MDBCol className='col-md-1'  >
                                                    <MDBInput
                                                        value={uf}
                                                        onChange={handleChange('uf')}
                                                        required
                                                        label='UF'
                                                        onBlur={handleBlur('uf')}
                                                    />
                                                    <div style={{ color: '#DC4C64' }}>{touched.uf && errors.uf}</div>
                                                </MDBCol>
                                                <MDBCol className='col-md-4' feedback='Please provide a valid zip.' >
                                                    <MDBInput
                                                        value={cidade}
                                                        onChange={handleChange('cidade')}
                                                        required
                                                        label='Cidade'
                                                        onBlur={handleBlur('cidade')}
                                                    />
                                                    <div style={{ color: '#DC4C64' }}>{touched.cidade && errors.cidade}</div>
                                                </MDBCol>
                                                <MDBCol className='col-md-4'  >
                                                    <MDBInput
                                                        value={bairro}
                                                        onChange={handleChange('bairro')}
                                                        required
                                                        label='Bairro'
                                                        onBlur={handleBlur('bairro')}
                                                    />
                                                    <div style={{ color: '#DC4C64' }}>{touched.bairro && errors.bairro}</div>
                                                </MDBCol>
                                            </MDBRow>
                                            <MDBRow className='my-3'>
                                                <MDBCol className='col-md-6' feedback='Please provide a valid zip.' >
                                                    <MDBInput
                                                        value={rua}
                                                        onChange={handleChange('rua')}
                                                        required
                                                        label='Rua'
                                                        onBlur={handleBlur('rua')}
                                                    />
                                                    <div style={{ color: '#DC4C64' }}>{touched.rua && errors.rua}</div>
                                                </MDBCol>
                                                <MDBCol className='col-md-2'  >
                                                    <MDBInput
                                                        value={values.numero}
                                                        onChange={handleChange('numero')}
                                                        required
                                                        label='Numero'
                                                        onBlur={handleBlur('numero')}
                                                    />
                                                    <div style={{ color: '#DC4C64' }}>{touched.numero && errors.numero}</div>
                                                </MDBCol>
                                                <MDBCol className='col-md-4' feedback='Please provide a valid zip.' >
                                                    <MDBInput
                                                        value={values.complemento}
                                                        onChange={handleChange('complemento')}
                                                        required
                                                        label='Complemento'
                                                        onBlur={handleBlur('complemento')}
                                                    />
                                                    <div style={{ color: '#DC4C64' }}>{touched.complemento && errors.complemento}</div>
                                                </MDBCol>
                                            </MDBRow>
                                            <MDBRow className='my-3'>
                                                <MDBCol className='col-md-4'  >
                                                    <MDBInput
                                                        value={values.tel}
                                                        onChange={handleChange('tel')}
                                                        required
                                                        label='Tel'
                                                        onBlur={handleBlur('tel')}
                                                    />
                                                    <div style={{ color: '#DC4C64' }}>{touched.tel && errors.tel}</div>
                                                </MDBCol>
                                                <MDBCol className='col-md-3' feedback='Please provide a valid zip.' >
                                                    <MDBInput
                                                        value={tipoTel}
                                                        onChange={(e) => setTipoTel(e.target.value)}
                                                        required
                                                        label='TipoTel'

                                                    />

                                                </MDBCol>
                                                <MDBCol className='col-md-5'  >
                                                    <MDBInput
                                                        value={values.nomeLoja}
                                                        onChange={handleChange('nomeLoja')}
                                                        required
                                                        label='Nome Loja'
                                                        onBlur={handleBlur('nomeLoja')}
                                                    />
                                                    <div style={{ color: '#DC4C64' }}>{touched.nomeLoja && errors.nomeLoja}</div>
                                                </MDBCol>
                                            </MDBRow>
                                            <MDBRow className='my-3'>
                                                <MDBCol className='col-md-4' feedback='Please provide a valid zip.' >
                                                    <MDBInput
                                                        value={cnpj}
                                                        onChange={(e) => onChangeCnpj(e.target.value)}
                                                        required
                                                        label='CNPJ'
                                                        ref={cnpjInputRef}
                                                        onBlur={handleBlur('cnpj')}
                                                    />
                                                    <div style={{ color: '#DC4C64' }}>{touched.cnpj && errors.cnpj}</div>
                                                </MDBCol>
                                                <MDBCol className='col-md-4'  >
                                                    <MDBInput
                                                        value={cpf}
                                                        onChange={(e) => maskCPF(e.target.value)}
                                                        required
                                                        label='CPF'
                                                        onBlur={handleBlur('cpf')}
                                                    />
                                                    <div style={{ color: '#DC4C64' }}>{cpfMessage}</div>
                                                </MDBCol>
                                                <MDBCol className='col-md-4' feedback='Please provide a valid zip.' >
                                                    <MDBInput
                                                        value={values.preco}
                                                        onChange={handleChange('preco')}
                                                        required
                                                        label='Preco mínimo'
                                                        onBlur={handleBlur('preco')}
                                                    />
                                                    <div style={{ color: '#DC4C64' }}>{touched.preco && errors.preco}</div>
                                                </MDBCol>
                                            </MDBRow>
                                            <MDBRow className='my-3'>
                                                <MDBCol className='col-md-4 d-grid gap-2' feedback='Please provide a valid zip.' >
                                                    <MDBDropdown className="d-grid gap-2 d-md-flex justify-content-md-center" color='secondary'>
                                                        <MDBDropdownToggle style={{ maxHeight: 40 }}>Segmento</MDBDropdownToggle>
                                                        <DropdownCadastro data={segmentosData} escolhidos={segmentos} setEscolhidos={setSegmentos} />
                                                    </MDBDropdown>
                                                    <ListaCategoriasEscolhidas data={segmentos} setData={setSegmentos} />
                                                </MDBCol>
                                                <MDBCol className='col-md-4 d-grid gap-2 ' feedback='Please provide a valid zip.' >
                                                    <MDBDropdown className="d-grid gap-2 d-md-flex justify-content-md-center" color='secondary'>
                                                        <MDBDropdownToggle style={{ maxHeight: 40 }}>Categoria</MDBDropdownToggle>
                                                        <DropdownCadastro getSubcategorias={getSubcategorias} data={categoriasData} escolhidos={categorias} setEscolhidos={setCategorias} />
                                                    </MDBDropdown>
                                                    <div style={{ color: '#DC4C64' }}>{touched.categoria && errors.categoria}</div>
                                                    <ListaCategoriasEscolhidas data={categorias} setData={setCategorias} />
                                                </MDBCol>
                                                <MDBCol className='col-md-4 d-grid gap-2' feedback='Please provide a valid zip.' >
                                                    <MDBDropdown className="d-grid gap-2 d-md-flex justify-content-md-center" color='secondary'>
                                                        <MDBDropdownToggle style={{ maxHeight: 40 }}>subcategoria</MDBDropdownToggle>
                                                        <DropdownCadastro data={subcategoriasData} escolhidos={subcategorias} setEscolhidos={setSubcategorias} />
                                                    </MDBDropdown>
                                                    <ListaCategoriasEscolhidas data={subcategorias} setData={setSubcategorias} />
                                                </MDBCol>
                                            </MDBRow>
                                            <MDBRow className='my-3'>
                                                <MDBCol className='col-md-12'  >
                                                    <UploadGaleria galeria={galeria} setGaleria={setGaleria} />
                                                </MDBCol>
                                            </MDBRow>
                                            <MDBRow>
                                                <MDBCol className='col-md-12'  >
                                                    <ImageUploaderFundo previewImage={imagemFundo} setPreviewImage={setImagemFundo} />
                                                </MDBCol>
                                            </MDBRow>
                                            <MDBRow className='my-5'>
                                                {!isLoading ?
                                                    <div className='col-md-12'>
                                                        <div style={{ color: '#DC4C64' }}>{errorMessageRef.current}</div>
                                                        <MDBBtn type='submit' style={{ marginRight: 20 }} onClick={handleSubmit}>Cadastrar Fornecedor</MDBBtn>
                                                    </div>
                                                    :
                                                    <div className='col-md-12'>
                                                        <MDBSpinner role='status'>
                                                            <span className='visually-hidden'>Loading...</span>
                                                        </MDBSpinner>
                                                    </div>
                                                }

                                            </MDBRow>
                                        </MDBContainer>
                                    )}
                            </Formik>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
            </MDBRow>
        </MDBContainer>

    );
}

export default EditarFornecedorNebulosa;