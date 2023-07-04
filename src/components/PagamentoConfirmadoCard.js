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

const PagamentoConfirmadoCard = () => {
    return ( 
        <MDBCard >
            <MDBCardBody>
            <MDBIcon className='ms-1 mb-4 d-flex justify-content-center' color='primary'  icon='check' size='4x' />
            <h3 className='text-center'>Pagamento Confirmado!</h3>
            <p className='text-center'>Agora é só aguardar que nossa equipe irá contatar você para te ajudar a montar sua vitrine!</p>

            </MDBCardBody>
        </MDBCard>
     );
}
 
export default PagamentoConfirmadoCard;