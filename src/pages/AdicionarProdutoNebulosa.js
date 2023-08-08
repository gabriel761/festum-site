import {
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBInput,
    MDBTextArea,
    MDBRadio,
    MDBCardTitle,
    MDBCardText,
    MDBBtn,
    MDBSpinner
} from "mdb-react-ui-kit"
import ImageUploaderFundo from "../components/ImageUploaderFundo";
import { storage } from "../services/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { Formik } from "formik";
import { useState } from "react";
import * as yup from "yup"
import { useLocation } from "react-router-dom";
import api from "../api/api";
import { b64toBlob } from "../functions/Base64ToBlob";

const AdicionarProdutoNebulosa = () => {
    const [imageUri, setImageUri] = useState('')
    const [descricaoLoja, setDescricaoLoja] = useState("")
    const [status, setStatus] = useState('ativo')
    const [mensage, setMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    let { state } = useLocation();
    const { fornecedor } = state


    const validationSchema = yup.object({
        nome: yup.string().required("Campo obrigatório").min(2, "Mínimo de 2 letras"),
        descricao: yup.string().required("Campo obrigatório").min(5, "mínimo de 5 characteres e máximo de 100").max(100, "Máximo de 100 carateres"),
    })

    const toggleStatus = (value) => {
        if (value != status) {
            setStatus(value)
        }
    }

    const uploadImageToFirebase = async (newValues) => {
       
        const blob = b64toBlob(imageUri)
        const filename = newValues.nome.replace(" ", "-") + "-produto"
        const storageRef = ref(storage, "produtos/" + filename)
        uploadBytes(storageRef, blob).then((metadata) => {
            console.log(metadata.metadata.ref)
            console.log(storageRef.fullPath)
            getDownloadURL(metadata.ref).then((url) => {
                console.log("image url: ", url)
                const newValues2 = { ...newValues, imagem: url, tipoProduto: "produto" }
                // send to back-end precisa ficar aqui pois é necessário pegar a url do upload da foto
                sendToBackEnd(newValues2)
            }).catch((e) => {
                setIsLoading(false)
                console.log("image url error: ", e)
            })
        }).catch((e) => {
            console.log("erro no upload do firebase:", e)
        })
    }

    const sendToBackEnd = (values) => {
        api.request({
            url: "/addProdutoSite",
            data: values,
            method: "POST",
        }).then((result) => {
            setIsLoading(false)

            if (Object.keys(result.data).length == 0) {
                setMessage("Sem resposta do servidor")
            } else {
                if (!result.data.error) {
                    alert("Produto adicionado com sucesso!")
                    setIsLoading(false)
                    history.back()
                } else {
                    setMessage(result.data.error)
                }
            }
        }).catch((err) => {
            setIsLoading(false)
            setMessage("Sem resposta do servidor")
            console.log("erro do axios: ", err)
        })
    }

    const handleSubmit = async (values, resetForm) => {
        try {
            setIsLoading(true)
            if (imageUri.length != 0) {
                values = { ...values, status, idFornecedor: fornecedor.pk_id }
                await uploadImageToFirebase(values)
                
                setMessage('')
                setImageUri('')
                resetForm()
            } else {
                setIsLoading(false)
                setMessage("Por favor selecione uma imagem para o produto!")
            }
        } catch (e) {
            console.log(e)
        }

    }

    return (
        <MDBContainer className="px-5 pb-5">

            <MDBRow className="gx-5">
                <MDBCol>
                    <MDBCard >
                        <MDBCardBody>
                            <MDBRow>
                                <MDBCol className='col-md-12'  >
                                    <ImageUploaderFundo previewImage={imageUri} setPreviewImage={setImageUri} />
                                </MDBCol>
                            </MDBRow>
                            <Formik
                                initialValues={{ nome: '', descricao: '' }}
                                onSubmit={(values, { resetForm }) => handleSubmit(values, resetForm)}
                                validationSchema={validationSchema}
                            >
                                {
                                    ({ handleChange, handleSubmit, handleBlur, touched, errors, values }) => (
                                        <MDBContainer>
                                            <MDBRow className='my-3'>

                                                <MDBCol md={12}  >
                                                    <MDBInput
                                                        value={values.nome}
                                                        onChange={handleChange('nome')}
                                                        required
                                                        label='Nome do pruduto'
                                                        onBlur={handleBlur('nome')}
                                                    />
                                                    <div style={{ color: '#DC4C64' }}>{touched.nome && errors.nome}</div>
                                                </MDBCol>
                                            </MDBRow>
                                            <MDBRow className='my-3'>
                                                <MDBCol md={12}  >
                                                    <MDBTextArea
                                                        value={values.descricao}
                                                        onChange={handleChange("descricao")}
                                                        rows={6}
                                                        label='Descrição do pruduto'
                                                        onBlur={handleBlur('descricao')}
                                                    />
                                                    <div style={{ color: '#DC4C64' }}>{touched.descricao && errors.descricao}</div>
                                                </MDBCol>
                                            </MDBRow>
                                            <MDBRow>
                                                <MDBCol md={6}>
                                                    {isLoading ?
                                                        <div className='d-flex justify-content-center'>
                                                            <MDBSpinner role='status'>
                                                                <span className='visually-hidden'>Loading...</span>
                                                            </MDBSpinner>
                                                        </div> :
                                                        <>
                                                            <div style={{ color: "#DC4C64" }}>{mensage}</div>
                                                            <MDBBtn type="submit" onClick={() => handleSubmit()} color="primary">Adicionar Produto</MDBBtn>
                                                        </>
                                                    }

                                                </MDBCol>
                                            </MDBRow>
                                        </MDBContainer>
                                    )
                                }

                            </Formik>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
            </MDBRow>
        </MDBContainer>

    );
}

export default AdicionarProdutoNebulosa;