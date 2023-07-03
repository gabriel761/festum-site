import React from 'react';
import "../index.css"
import {
    MDBCol,
    MDBRow,
    MDBContainer
} from 'mdb-react-ui-kit';
import LoginCard from '../components/LoginCard';


export default function Login() {
    console.log("location: ", window.location.hostname)
    return (
        <MDBContainer className='d-flex justify-content-center'>
            <MDBRow>
                <MDBCol size="md" >
                    <LoginCard />
                </MDBCol>
            </MDBRow>
        </MDBContainer>
    );
}