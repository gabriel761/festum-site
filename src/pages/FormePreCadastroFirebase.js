import React from 'react';
import "../index.css"
import {
    MDBCol,
    MDBRow,
    MDBContainer
} from 'mdb-react-ui-kit';

import FormPreCadstroFirebaseCard from '../components/FormPreCadastroFirebaseCard';
import { useSearchParams } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import PagamentoNaoConfirmadoCard from '../components/PagamentoNaoConfirmado';

export default function FormPreCadastroFirebase() {

    const [searchParams] = useSearchParams();
    console.log(searchParams)
    const encryptedStatusCode = searchParams.get("code")
    var bytes =  CryptoJS.AES.decrypt(encryptedStatusCode, 'Web033F1');
    var statusCode = bytes.toString(CryptoJS.enc.Utf8);
    

    

    return (
        <MDBContainer className='d-flex justify-content-center'>
            <MDBRow>
                <MDBCol size="md"  >
                    {
                        statusCode == 8?
                            <FormPreCadstroFirebaseCard />
                            :
                            <PagamentoNaoConfirmadoCard />
                            
                            
                    }
                    
                    
                </MDBCol>
            </MDBRow>
        </MDBContainer>
    );
}