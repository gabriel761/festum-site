import React, { useEffect, useState } from 'react';
import { MDBBadge, MDBBtn, MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import getClientes from '../api/getClientes';
const TableClientes = () => {
    const [data, setData] = useState([])
    useEffect(() => {
        getClientes("/clientes").then((result) => {

            setData(result.data)
        })
    }, [])

    return (
        <MDBTable align='middle'>
            <MDBTableHead>
                <tr>
                    <th scope='col'>Dados da conta</th>
                    <th scope='col'>Dados do cliente</th>
                    <th scope='col'>Endereço</th>
                    <th scope='col'>Status</th>
                    <th scope='col'>Ações</th>
                </tr>
            </MDBTableHead>
            <MDBTableBody>

                {data && data.map((item) => {
                    return (
                        <tr>
                            <td>
                                <div className='d-flex align-items-center'>
                                    <img
                                        src={item.imagem_perfil}
                                        alt=''
                                        style={{ width: '70px', height: '70px' }}
                                        className='rounded-circle'
                                    />
                                    <div className='ms-3'>
                                        <p className='fw-bold mb-1'>{item.nome + " " + item.sobrenome}</p>
                                        <p className='text-muted mb-0'>{item.email}</p>
                                        <p className='text-muted mb-0'>{item.tipo_pessoa}</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <p className='fw-normal mb-0'>CPF</p>
                                <p className='text-muted mb-1'>{item.cpf}</p>
                                <p className='fw-normal mb-0'>Telefone</p>
                                <p className='text-muted mb-1'>{item.telefone}</p>
                                <p className='fw-normal mb-0'>Data de nascimento</p>
                                <p className='text-muted mb-1'>{item.data_nascimento}</p>
                                <p className='fw-normal mb-0'>Tipo de telefone</p>
                                <p className='text-muted mb-1'>{item.tipo_telefone}</p>
                                <p className='fw-normal mb-0'>Instagram</p>
                                <p className='text-muted mb-1'>{item.instagram}</p>
                            </td>

                            <td>
                                <div className='text-wrap'>
                                    <p className='fw-normal mb-0'>Endereço</p>
                                    <p className='text-muted mb-1'>{item.endereco}</p>
                                </div>
                            </td>
                            <td>
                                <MDBBadge color='success' pill>
                                    Ativo
                                </MDBBadge>
                            </td>
                            <td>
                                <div>
                                    <MDBBtn color='link' rounded size='sm'>
                                        Aprovar
                                    </MDBBtn>
                                </div>
                                <div>
                                    <MDBBtn color='link' rounded size='sm'>
                                        Desaprovar
                                    </MDBBtn>
                                </div>
                            </td>
                        </tr>
                    )
                })}


            </MDBTableBody>
        </MDBTable>
    );
}

export default TableClientes;