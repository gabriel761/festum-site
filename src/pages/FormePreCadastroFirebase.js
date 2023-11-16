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
    console.log("seach params: ",searchParams)
    const encryptedStatusCode = searchParams.get("code")
    console.log("encrypted status code",encryptedStatusCode)
    var bytes =  CryptoJS.AES.decrypt(encryptedStatusCode, 'Web033F1');
    console.log(bytes)
    var statusCode = bytes.toString(CryptoJS.enc.Utf8);
    console.log("status code: ", statusCode)

    

    return (
        <MDBContainer className='d-flex justify-content-center'>
            <MDBRow>
                <MDBCol size="md"  >
                    {
                        statusCode == 8 || statusCode == 5?
                            <FormPreCadstroFirebaseCard />
                            :
                            <PagamentoNaoConfirmadoCard />
                            
                            
                    }
                    
                    
                </MDBCol>
            </MDBRow>
        </MDBContainer>
    );
}