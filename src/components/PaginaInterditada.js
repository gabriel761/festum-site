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

const PaginaInterditada = () => {


    return (
        <MDBCard >
            <MDBCardBody>
                <MDBIcon className='ms-1 mb-4 d-flex justify-content-center' color='danger' icon='times' size='4x' />
                <h3 className='text-center'>Pagina Interditada</h3>
                <p className='text-center'>Pagina temporariamente interditada para manutenção</p>

            </MDBCardBody>
        </MDBCard>
    );
}

export default PaginaInterditada;