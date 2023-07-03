import React, { useEffect, useState } from 'react';
import { MDBBadge, MDBBtn, MDBTable, MDBTableHead, MDBTableBody, MDBSpinner } from 'mdb-react-ui-kit';
import { getFornecedores, tratarString } from '../api/getFornecedores';
import { Link } from 'react-router-dom';
const ListaPreCadastroSite = () => {
    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState('')
    useEffect(() => {
        setIsLoading(true)
        getFornecedores("/fornecedoresSemDistanciaPreCadastro").then((result) => {
            console.log("data fornecedores: ", result.data)
            const newData = result.data
            console.log("data fornecedores: ", newData)
            setIsLoading(false)
            setMessage('')
            setData(newData)
            if(newData.length == 0){
                setMessage("Não há mais fornecedores com o pré-cadastro pendente")
            }
        }).catch((e) => {
            setIsLoading(false)
            setMessage("Erro ao carregar fornecedores. Tente recarregar a página")
            console.log("erro ao carregar fornecedores", e)
        })
    }, [])
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
            <MDBTable align='middle'>
                <MDBTableHead>
                    <tr>
                        <th scope='col'>Nome Completo</th>
                        <th scope='col'>E-mail</th>
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

                                    <MDBBadge color='warning' pill>
                                        {item.status_da_conta}
                                    </MDBBadge>

                                </td>
                                <td>
                                    <Link
                                        to={{
                                            pathname: "/cadastro-fornecedor",
                                        }}
                                        state={{ fornecedor: item }}
                                    >
                                        <p className='text-link mb-0'>Completar Cadastro</p>
                                    </Link>
                                </td>
                            </tr>

                        )

                    }) :
                        <div className='d-flex justify-content-center'>
                            <p>{message}</p>
                        </div>
                    }


                </MDBTableBody>
            </MDBTable>
        );
    }
}

export default ListaPreCadastroSite