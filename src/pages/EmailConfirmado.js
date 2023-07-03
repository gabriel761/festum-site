import React from 'react';
import "../index.css"
import {
    MDBCol,
    MDBRow,
    MDBContainer,
    MDBBtn
} from 'mdb-react-ui-kit';
import EmailConfirmadoCard from '../components/EmailConfirmadoCard';
import { useSearchParams } from 'react-router-dom';
import { apiIpag } from '../api/apiIpag';


export default function EmailConfirmado() {
    const [searchParams] = useSearchParams();
    console.log(searchParams)
    let values = searchParams.get("values")
    values = decodeURIComponent(values)
    console.log("values from url: ", values)
    const criarClienteIpag = { name: values.nome, email: values.email, cpf_cnpj: values.cpf_cnpj,  phone: values.tel }

    const requestIpag = () => {
        console.log("objeto ipag antes de enviar: ", criarClienteIpag)
        apiIpag.request({
            method: 'POST',
            url: '/service/resources/customers',
            data: criarClienteIpag
        }).then((response) => {
            console.log("resposta ipag: ", response.data)
        }).catch((e) => {
            console.log("erro na requisição ipag: ",e)
        })
    }


    return (
        <MDBContainer className='d-flex justify-content-center'>

            <MDBRow>
                <MDBCol md={3}>

                </MDBCol>
                <MDBCol md={6} size="md" >
                    <EmailConfirmadoCard />
                </MDBCol>
                <MDBCol md={3}>
                    <MDBBtn onClick={() => requestIpag()}>
                        Testar ipag
                    </MDBBtn>
                </MDBCol>
            </MDBRow>
        </MDBContainer>
    );
}