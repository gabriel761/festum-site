import {MDBCard,
    MDBCardBody,
    MDBInput,
    MDBCol,
    MDBRow,
    MDBCheckbox,
    MDBBtn,} from 'mdb-react-ui-kit';
    import "../index.css"
const LoginCard = () => {
    return ( 
        <MDBCard  >
            <MDBCardBody>
            <form>
                <MDBInput className='mb-4' type='email' id='form1Example1' label='E-mail' />
                <MDBInput className='mb-4' type='password' id='form1Example2' label='Senha' />

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
            </MDBCardBody>
        </MDBCard>
     );
}
 
export default LoginCard;