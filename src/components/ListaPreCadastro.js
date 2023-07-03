import React, { useEffect, useState } from 'react';
import { MDBBadge, MDBBtn, MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import {getFornecedores, tratarString} from '../api/getFornecedores';
const ListaPreCadastro = () => {
    const [data, setData] = useState([])
    useEffect(() => {
        getFornecedores("/fornecedoresSemDistanciaPreCadastro").then((result) => {
            console.log("data fornecedores: ", result.data)
            const newData = result.data
            console.log("data fornecedores: ", newData)
            setData([])
        }).catch((e) => {
            console.log("erro ao carregar fornecedores",e)
        })
    }, [])

    return (
        <MDBTable align='middle'>
            <MDBTableHead>
                <tr>
                    <th scope='col'>Dados da conta</th>
                    <th scope='col'>Dados do fornecedor</th>
                    <th scope='col'>Dados de filtragem</th>
                    <th scope='col'>Endereço</th>
                    <th scope='col'>Status</th>
                    <th scope='col'>Ações</th>
                </tr>
            </MDBTableHead>
            <MDBTableBody>

                {data? data.map((item) => {
                    return (
                        <tr key={item.pk_id}>
                            <td>
                                <div className='d-flex align-items-center'>
                                    <img
                                        src={item.imagem}
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
                                <p className='fw-nomal mb-0'>CNPJ</p>
                                <p className='text-muted mb-1'>{item.cnpj}</p>
                                <p className='fw-normal mb-0'>Telefone</p>
                                <p className='text-muted mb-1'>{item.telefone}</p>
                                <p className='fw-normal mb-0'>Nome Loja</p>
                                <p className='text-muted mb-1'>{item.nome_loja}</p>
                                <p className='fw-normal mb-0'>Instagram</p>
                                <p className='text-muted mb-1'>{item.instagram}</p>
                            </td>
                            <td>
                                <p className='fw-normal mb-0'>Categoria</p>
                                <p className='text-muted mb-1'>{item.categoria}</p>
                                <p className='fw-normal mb-0'>Subcategoria</p>
                                <p className='text-muted mb-1'>{item.subcategoria}</p>
                                <p className='fw-normal mb-0'>Segmento</p>
                                <p className='text-muted mb-1'>{item.segmento}</p>
                                <p className='fw-normal mb-0'>Palavras chave</p>
                                <p className='text-muted mb-1'>{item.palavras_chave}</p>
                                <p className='fw-normal mb-0'>Preço inicial</p>
                                <p className='text-muted mb-1'>{item.preco_inicial}</p>
                            </td>
                            <td>
                                <div className='text-wrap'>
                                    <p className='fw-normal mb-0'>Endereço</p>
                                    <p className='text-muted mb-1'>{item.endereco}</p>
                                    <p className='fw-normal mb-0'>Cidade</p>
                                    <p className='text-muted mb-1'>{item.cidade}</p>
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
                }):
                <div className='d-flex justify-content-center'>
                    <p>Não há mais pré-cadastros pendentes</p>
                </div>
            }


            </MDBTableBody>
        </MDBTable>
    );
}

export default ListaPreCadastro