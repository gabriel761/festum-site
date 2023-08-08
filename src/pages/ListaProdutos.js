import { MDBBtn, MDBCard, MDBCardBody, MDBCardImage, MDBCardText, MDBCardTitle, MDBCol, MDBContainer, MDBRow, MDBSpinner } from "mdb-react-ui-kit";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getFornecedores } from "../api/getFornecedores";
import Modal from "../components/Modal";

const ListaProdutos = () => {
    const navigate = useNavigate()
    let { state } = useLocation();
    const { fornecedor } = state

    const [basicModal, setBasicModal] = useState(false);
    const [isloading, setIsLoading] = useState(false)
    const [produtos, setProdutos] = useState([])
    const messageRef = useRef('')

    const modalTitle = "Exluir produto"
    const modalBody = "Tem certeza que deseja excluir este produto?"

    console.log("fornecedor from route: ", fornecedor)

    const firstFunctions = () => {
        getFornecedores('/getProdutosFromIdFornecedorSite/' + fornecedor.pk_id).then((response) => {
            setIsLoading(false)
            if (response.data.length > 0) {
                setProdutos(response.data)
            } else {
                messageRef.current = 'Nenhum produto cadastrado no momento para este fornecedor'
            }
        }).catch((e) => {
            messageRef.current = "Erro ao carregar produtos: " + e.message
        })
    }
    useEffect(() => {
        setIsLoading(true)
        firstFunctions()
    }, [])

    const handleClick = (produto) => {
        const uri = produto.planos == "Pacote Nebulosa" ? '/editar-produto-nebulosa': '/editar-produto'
        navigate(uri, { state: { produto, fornecedor } })
    }
    const handleClickExcluir = () => {
        setBasicModal(true);

    }
    const excluirProduto = (idProduto) => {
        setIsLoading(true)
        getFornecedores("deletarProdutoSite/" + idProduto).then((response) => {
            setIsLoading(false)
            firstFunctions()
            setBasicModal(false)
        }).catch((error) => {
            setIsLoading(false)
            alert('erro: ', error.message)
        })
    }


    if (isloading) {
        return (
            <div className='d-flex justify-content-center'>
                <MDBSpinner role='status'>
                    <span className='visually-hidden'>Loading...</span>
                </MDBSpinner>
            </div>
        )
    } else {
        return (
            <MDBContainer>
                <MDBRow>
                    {produtos.length != 0 ? produtos.map((produto) => {
                        return (
                            <>
                                <MDBCol md={3} className="mt-4">
                                    <MDBCard className="g-col-4">
                                        <MDBCardBody>
                                            <MDBCardImage className="mb-4" style={{ width: 300, height: 150, objectFit: "cover" }} position="center" fluid src={produto.imagem} />
                                            <MDBCardTitle>{produto.nome}</MDBCardTitle>
                                            <MDBCardText>{produto.descricao}</MDBCardText>
                                            <div className="d-flex justify-content-between">
                                                <MDBBtn onClick={() => handleClick(produto)} className='me-1' color="success ">Editar</MDBBtn>
                                                <MDBBtn onClick={() => handleClickExcluir(produto.pk_id)} className='me-1' color="danger">Excluir</MDBBtn>
                                            </div>
                                        </MDBCardBody>
                                    </MDBCard>
                                </MDBCol>
                                <Modal modalfunction={() => excluirProduto(produto.pk_id)} basicModal={basicModal} setBasicModal={setBasicModal} title={modalTitle} body={modalBody} btntitle='Excluir' />

                            </>
                        )
                    }) :
                        <MDBContainer>
                            <MDBCardText>{messageRef.current}</MDBCardText>
                        </MDBContainer>
                    }

                </MDBRow>

            </MDBContainer >
        );
    }


}

export default ListaProdutos;