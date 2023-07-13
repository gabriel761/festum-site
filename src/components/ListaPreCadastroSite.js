import React, { useEffect, useRef, useState } from 'react';
import { MDBBadge, MDBBtn, MDBTable, MDBTableHead, MDBTableBody, MDBSpinner, MDBContainer } from 'mdb-react-ui-kit';
import { getFornecedores, tratarString } from '../api/getFornecedores';
import { Link } from 'react-router-dom';
import { apiIpag } from '../api/apiIpag';
const ListaPreCadastroSite = ({ statusConta }) => {
    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const messageRef = useRef('')
    const colorsStatus = useRef('warning')

    useEffect(() => {
        setIsLoading(true)
        console.log("status conta vindo do route:", statusConta)
        getFornecedores("/fornecedoresSemDistanciaPreCadastroComStatus/" + statusConta).then(async (result) => {
            console.log("data fornecedores: ", result.data)
            const fornecedoresPreCadastrados = result.data
            console.log("data fornecedores: ", fornecedoresPreCadastrados)
            messageRef.current = ''
            if (fornecedoresPreCadastrados.length == 0) {
                setIsLoading(false)
                messageRef.current = "Não há fornecedores com esse status de conta"
                setData([])
            } else {
                //let fornecedoresParaLista = await compararContasPreCadastradasComContasPagasDoIpag(fornecedoresPreCadastrados)
                // if (fornecedoresParaLista.length == 0) {
                //     messageRef.current = "Não há mais fornecedores com este status"
                // }
                // setData(fornecedoresParaLista)
                setData(fornecedoresPreCadastrados)
                setIsLoading(false)
            }
        }).catch((e) => {
            setIsLoading(false)
            messageRef.current = "Erro ao carregar fornecedores. Tente recarregar a página"
            console.log("erro ao carregar fornecedores", e)
        })
    }, [statusConta])

    const chooseColorStatus = () => {
        switch (statusConta) {
            case "Cadastro incompleto site":
                return "warning"; // amarelo
                break;
            case "ativo":
                return "success";//verde
                break;
            default:
                return "";

        }
    }
    const chooseColorStatusPagamento = (statusPagamento) => {
        switch (statusPagamento) {
            case "recusado":
                return "danger"; // amarelo
                break;
            case "ativo":
            case "aprovado e capturado":
                return "success";//verde
                break;
            default:
                return "warning";

        }
    }

    const chooseLinkAction = (item) => {
        switch (statusConta) {
            case "Cadastro incompleto site":
                return (
                <Link to={{ pathname: "/cadastro-fornecedor", }} state={{ fornecedor: item }}>
                    Completar Cadastro
                </Link>
                ); // amarelo
                break;
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
                            <th scope='col'>Nome Completo</th>
                            <th scope='col'>E-mail</th>
                            <th scope='col'>Telefone</th>
                            <th scope='col'>Status de pagamento</th>
                            <th scope='col'>Status da conta</th>
                            <th scope='col'>Ações</th>
                        </tr>
                    </MDBTableHead>
                    <MDBTableBody>

                        {data.length != 0 ? data.map((item) => {
                            return (

                                <tr key={item.pk_id}>

                                    <td>
                                        <p className='text-muted mb-0'>{item.nome} {item.sobrenome}</p>
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

                                        <MDBBadge color={chooseColorStatus()} pill>
                                            {item.status_da_conta}
                                        </MDBBadge>

                                    </td>
                                    <td>
                                        {chooseLinkAction(item)}
                                    </td>
                                </tr>

                            )

                        }) :
                            <div className='d-flex justify-content-center'>
                                <p>{messageRef.current}</p>
                            </div>
                        }


                    </MDBTableBody>
                </MDBTable>
                {/* <MDBBtn onClick={() => excluirAssinatura()}>Excluir assinatura</MDBBtn> */}
            </MDBContainer>
        );
    }
}

export default ListaPreCadastroSite