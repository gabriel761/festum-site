import React, { useEffect, useRef } from 'react';
import "../index.css"
import {
    MDBCard,
    MDBCardBody,
    MDBInput,
    MDBCol,
    MDBRow,
    MDBCheckbox,
    MDBBtn,
    MDBIcon,
    MDBContainer
} from 'mdb-react-ui-kit';
import EmailConfirmadoCard from '../components/EmailConfirmadoCard';
import { useSearchParams } from 'react-router-dom';
import { apiIpag } from '../api/apiIpag';


export default function SenhaConfirmadaApp() {

    return (
        <MDBContainer className='d-flex justify-content-center'>

            <MDBRow>

                <MDBCol size="md" >
                    <MDBCard >
                        <MDBCardBody>
                            <MDBIcon className='ms-1 mb-4 d-flex justify-content-center' color='primary' icon='check' size='4x' />
                            <h3 className='text-center'>Senha alterada com sucesso!</h3>
                            <p className='text-center'>Volte para o app e faça login novamente.</p>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>

            </MDBRow>
        </MDBContainer>
    );
}