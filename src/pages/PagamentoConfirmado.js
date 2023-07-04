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
import PagamentoConfirmadoCard from '../components/PagamentoConfirmadoCard';

const PagamentoConfirmado = () => {
    return (
        <MDBContainer className='d-flex justify-content-center'>

            <MDBRow>
                <MDBCol md={3}>

                </MDBCol>
                <MDBCol md={6} size="md" >
                    <PagamentoConfirmadoCard/>
                </MDBCol>
                <MDBCol md={3}>
                    <MDBBtn >
                        Testar ipag
                    </MDBBtn>
                </MDBCol>
            </MDBRow>
        </MDBContainer>
    );
}

export default PagamentoConfirmado;