import React from 'react';
import "../index.css"
import {
    MDBCol,
    MDBRow,
    MDBContainer
} from 'mdb-react-ui-kit';
import ConfirmacaoPreCadastroCard from '../components/ConfirmacaoPreCadastroCard';


export default function ConfirmacaoPreCadastro() {
    console.log("location: ", window.location.hostname)
    return (
        <MDBContainer className='d-flex justify-content-center'>

            <MDBRow>
                <MDBCol md={3}>

                </MDBCol>
                <MDBCol md={6} size="md" >
                    <ConfirmacaoPreCadastroCard />
                </MDBCol>
                <MDBCol md={3}>

                </MDBCol>
            </MDBRow>
        </MDBContainer>
    );
}