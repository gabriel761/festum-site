import React from 'react';
import "../index.css"
import {
    MDBCol,
    MDBRow,
    MDBContainer
} from 'mdb-react-ui-kit';

import FormPreCadstroFirebaseCard from '../components/FormPreCadastroFirebaseCard';


export default function FormPreCadastroFirebase() {
    console.log("location: ", window.location.hostname)
    return (
        <MDBContainer className='d-flex justify-content-center'>
            <MDBRow>
                <MDBCol size="md"  >
                    <FormPreCadstroFirebaseCard />
                </MDBCol>
            </MDBRow>
        </MDBContainer>
    );
}