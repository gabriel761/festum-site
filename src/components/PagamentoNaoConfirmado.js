import {
    MDBCard,
    MDBCardBody,
    MDBInput,
    MDBCol,
    MDBRow,
    MDBCheckbox,
    MDBBtn,
    MDBIcon
} from 'mdb-react-ui-kit';
import "../index.css"
import { useState } from 'react';

const PagamentoNaoConfirmadoCard = () => {

    
    return (
        <MDBCard >
            <MDBCardBody>
                <MDBIcon className='ms-1 mb-4 d-flex justify-content-center' color='danger' icon='times' size='4x' />
                <h3 className='text-center'>Ops! algo deu errado...</h3>
                <p className='text-center'>Verifique se o cartão utilizado é válido</p>

            </MDBCardBody>
        </MDBCard>
    );
}

export default PagamentoNaoConfirmadoCard;