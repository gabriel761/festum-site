import React, { useEffect, useRef, useState } from 'react';
import { MDBBadge, MDBBtn, MDBTable, MDBTableHead, MDBTableBody, MDBSpinner, MDBContainer, MDBDropdown, MDBDropdownMenu, MDBDropdownToggle, MDBDropdownItem } from 'mdb-react-ui-kit';
import { getFornecedores, tratarString } from '../api/getFornecedores';
import { Link } from 'react-router-dom';
import { apiIpag } from '../api/apiIpag';
import MiniMenuAction from './MiniMenuActions';
import Modal from './Modal';
const ListaPreCadastroSite = ({ statusConta, plano }) => {
    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const [basicModal, setBasicModal] = useState(false);
    const dataRef = useRef([])
    const messageRef = useRef('')
    const colorsStatus = useRef('warning')

    const modalTitle = "Exluir produto"
    const modalBody = "Tem certeza que deseja excluir este produto?"

    const fornecedorParaExcluir = useRef(null)

    useEffect(() => {
        firstFunctions()
    }, [statusConta, plano])

    const firstFunctions = () => {
        setIsLoading(true)
        console.log("status conta vindo do route:", statusConta)
        console.log("plano vindo do route:", plano)
        const reqUri = plano == "Pacote Nebulosa" ?
            "/fornecedoresSemDistanciaPreCadastroComPlano/" + plano :
            "/fornecedoresSemDistanciaPreCadastroComStatusEPlano/" + statusConta + "/" + plano
        getFornecedores(reqUri).then(async (result) => {

            const fornecedoresPreCadastrados = result.data
            console.log("data fornecedores: ", fornecedoresPreCadastrados)
            messageRef.current = ''
            if (fornecedoresPreCadastrados.length == 0) {

                messageRef.current = "Não há fornecedores com esse status de conta"
                dataRef.current = []
                setIsLoading(false)
            } else {
                //let fornecedoresParaLista = await compararContasPreCadastradasComContasPagasDoIpag(fornecedoresPreCadastrados)
                // if (fornecedoresParaLista.length == 0) {
                //     messageRef.current = "Não há mais fornecedores com este status"
                // }
                // setData(fornecedoresParaLista)
                dataRef.current = fornecedoresPreCadastrados
                setIsLoading(false)
            }
        }).catch((e) => {

            messageRef.current = "Erro ao carregar fornecedores. Tente recarregar a página"
            console.log("erro ao carregar fornecedores", e)
            setIsLoading(false)
        })
    }

    const chooseColorStatus = (statusConta) => {
        switch (statusConta) {
            case "Cadastro incompleto site":
                return "warning"; // amarelo
                break;
            case "ativo":
                return "success";//verde
                break;
            default:
                return "warning";
                break

        }
    }
    const chooseColorStatusPagamento = (statusPagamento) => {
        switch (statusPagamento) {
            case "recusado":
            case "DECLINED":
                return "danger"; // amarelo
                break;
            case "ativo":
            case "aprovado e capturado":
            case "CAPTURED":
                return "success";//verde
                break;
            default:
                return "warning";

        }
    }

    const chooseLinkAction = (item) => {
        switch (item.status_da_conta) {
            case "Cadastro incompleto site":
                return (
                    <Link to={{ pathname: "/cadastro-fornecedor", }} state={{ fornecedor: item }}>
                        Completar Cadastro
                    </Link>
                ); // amarelo
                break;
            case "usuario ficticio":
            case "ativo":
                return (
                    <Link to={{ pathname: "/adicionar-produto", }} state={{ fornecedor: item }}>
                        Adicionar Produto ao Fornecedor
                    </Link>
                );//verde
                break;
            default:
                return "";

        }
    }

    const compararContasPreCadastradasComContasPagasDoIpag = async (fornecedoresPreCadastrados) => {
        try {
            const result = await apiIpag.request({
                url: "/service/resources/subscriptions?status=paid",
                method: 'GET'
            })
            console.log("get assinaturas: ", result.data.data)
            const assinaturas = result.data.data
            const assinaturasIpagEmails = []
            await assinaturas.forEach(assinatura => {
                assinaturasIpagEmails.push(assinatura.attributes.customer.attributes.email)
            });
            console.log("assinaturas ipag: ", assinaturasIpagEmails)
            let fornecedoresParaLista = []
            let fornecedoresParaBancoDeDados = []
            await fornecedoresPreCadastrados.forEach(precadastro => {
                if (assinaturasIpagEmails.includes(precadastro.email)) {
                    fornecedoresParaLista.push(precadastro)
                }
            })
            return fornecedoresParaLista
        } catch (e) {
            console.log("erro com assinaturas do ipag: ", e)
        }





    }

    const excluirAssinatura = () => {
        apiIpag.request({
            url: "service/resources/subscriptions?id=101734",
            method: "delete"
        }).then((response) => {
            console.log("deletar assinatura: ", response.data)
        }).catch((e) => {
            console.log("erro ao deletar assinatura: ", e)
        })
    }

    const excluirFornecedor = () => {
        const fornecedor = fornecedorParaExcluir.current
        setIsLoading(true)
        getFornecedores("deleteEverythingFornecedorSite/" + fornecedor.pk_id + "/" + fornecedor.fk_fornecedor_pessoa).then((response) => {
            setIsLoading(false)
            firstFunctions()
            setBasicModal(false)
        }).catch((error) => {
            console.log(error)
            setIsLoading(false)
            alert('erro: ', error.message)
        })
    }

    const handleExcluirBtn = (fornecedor) => {
        fornecedorParaExcluir.current = fornecedor
        setBasicModal(true)
    }


    if (isLoading) {
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
                <MDBTable align='middle'>
                    <MDBTableHead>
                        <tr>
                            {(statusConta == "Cadastro incompleto site" && plano == "Pacote Estrelar") ?
                                <th scope='col'>Nome Completo</th>
                                :
                                <th scope='col'>Nome da Loja</th>
                            }
                            <th scope='col'>E-mail</th>
                            <th scope='col'>Telefone</th>
                            <th scope='col'>Status de pagamento</th>
                            <th scope='col'>Status da conta</th>
                            <th scope='col'>Ações</th>
                        </tr>
                    </MDBTableHead>
                    <MDBTableBody>

                        {dataRef.current.length != 0 ? dataRef.current.map((item) => {
                            return (
                                <>
                                    <tr key={item.pk_id}>

                                        <td>
                                            {statusConta == "Cadastro incompleto site" && plano == "Pacote Estrelar" ?
                                                <p className='text-muted mb-0' key={item.nome}>{item.nome} {item.sobrenome}</p>
                                                :
                                                <p className='text-muted mb-0' key={item.nome_loja}>{item.nome_loja}</p>
                                            }

                                        </td>
                                        <td>
                                            <p className='text-muted mb-0'>{item.email}</p>
                                        </td>
                                        <td>
                                            <p className='text-muted mb-0'>{item.telefone}</p>
                                        </td>
                                        <td>

                                            <MDBBadge color={chooseColorStatusPagamento(item.status_pagamento)} pill>
                                                {item.status_pagamento}
                                            </MDBBadge>

                                        </td>
                                        <td>

                                            <MDBBadge color={chooseColorStatus(item.status_da_conta)} pill>
                                                {item.status_da_conta}
                                            </MDBBadge>

                                        </td>
                                        <td>
                                            <MiniMenuAction item={item} />
                                            <MDBBtn color='danger' className='mt-2' onClick={() => handleExcluirBtn(item)}>Excluir Fornecedor</MDBBtn>
                                        </td>
                                        
                                    </tr>
                                    
                                </>

                            )

                        }) :
                            <div className='d-flex justify-content-center'>
                                <p>{messageRef.current}</p>
                            </div>
                        }
                        <Modal modalfunction={() => excluirFornecedor()} basicModal={basicModal} setBasicModal={setBasicModal} title={modalTitle} body={modalBody} btntitle='Excluir' />

                    </MDBTableBody>
                </MDBTable>

                {/* <MDBBtn onClick={() => excluirAssinatura()}>Excluir assinatura</MDBBtn> */}
            </MDBContainer>
        );
    }
}

export default ListaPreCadastroSite