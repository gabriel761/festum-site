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
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/api";
import { b64toBlob } from "../functions/Base64ToBlob";


const EditarProdutoNebulosa = () => {
    const navigation = useNavigate()
    let { state } = useLocation();
    const { produto, fornecedor } = state

    const [imageUri, setImageUri] = useState(produto.imagem)
    const [status, setStatus] = useState(produto.status)
    const [mensage, setMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    

    console.log("produto from route: ", produto)
    console.log("fornecedor from route: ", fornecedor)

    const validationSchema = yup.object({
        nome: yup.string().required("Campo obrigatório").min(2, "Mínimo de 2 letras"),
        descricao: yup.string().required("Campo obrigatório").min(5, "mínimo de 5 characteres e máximo de 100").max(100, "Máximo de 100 carateres"),
        precoOriginal: yup.string().required("Campo obrigatório"),
        precoFinal: yup.string().required("Campo obrigatório")
    })

    const toggleStatus = (value) => {
        if (value != status) {
            setStatus(value)
        }
    }

    const uploadImageToFirebase = async (newValues) => {
        const blob = b64toBlob(imageUri)
        const filename = newValues.nome.replace(" ", "-") + "-perfil"
        const storageRef = ref(storage, "files/" + filename)
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
            url: "/updateProdutoSite",
            data: values,
            method: "POST",
        }).then((result) => {
            setIsLoading(false)

            if (Object.keys(result.data).length == 0) {
                setMessage("Sem resposta do servidor")
            } else {
                if (!result.data.error) {
                    alert("Produto editado com sucesso!")
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
                values = { ...values, status, idProduto: produto.pk_id }
                if(!imageUri.includes("firebase")){
                    await uploadImageToFirebase(values)
                }else{
                    values = {...values, imagem: imageUri}
                    sendToBackEnd(values)
                }
               
                
                
                setMessage('')
                setImageUri('')
               
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
                                initialValues={{ nome: produto.nome, descricao: produto.descricao, precoOriginal: produto.preco_original, precoFinal: produto.preco_final }}
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

export default EditarProdutoNebulosa;