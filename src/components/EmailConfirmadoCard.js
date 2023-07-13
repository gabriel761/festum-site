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


const EmailConfirmadoCard = () => {
    const [showInputEmail, setShowInputEmail] = useState(false)
    return (
        <MDBCard >
            <MDBCardBody>
            <MDBIcon className='ms-1 mb-4 d-flex justify-content-center' color='primary'  icon='check' size='4x' />
            <h3 className='text-center'>Email Confirmado!</h3>
            <p className='text-center'>Você completou todas as etapas do pré-cadastro! Aguarde o contato de um de nossos funcionários.</p>
            
                {showInputEmail &&
                    <form>
                        <MDBInput className='mb-4' type='email' id='form1Example1' label='E-mail' />
                        {/* <MDBRow className='mb-4'>
                    <MDBCol className='d-flex justify-content-center'>
                        <MDBCheckbox id='form1Example3' label='Remember me' defaultChecked />
                    </MDBCol>
                    <MDBCol>
                        <a href='#!'></a>
                    </MDBCol>
                </MDBRow> */}

                        <MDBBtn type='submit' block>
                            Entrar
                        </MDBBtn>
                    </form>
                }

            </MDBCardBody>
        </MDBCard>
    );
}

export default EmailConfirmadoCard;