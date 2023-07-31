import { MDBCard, MDBCardBody, MDBCardText, MDBCardTitle, MDBCol, MDBContainer, MDBRow } from "mdb-react-ui-kit";

const ListaProdutos = () => {
    return (
        <MDBContainer>
            <MDBRow>
                <MDBCol md={3} className="mt-4">
                    <MDBCard className="g-col-4">
                        <MDBCardBody>
                            <MDBCardTitle>Card title</MDBCardTitle>
                            <MDBCardText>Card text lorem ipsum dolor sit amment</MDBCardText>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
                <MDBCol md={3} className="mt-4">
                    <MDBCard className="g-col-4">
                        <MDBCardBody>
                            <MDBCardTitle>Card title</MDBCardTitle>
                            <MDBCardText>Card text lorem ipsum dolor sit amment</MDBCardText>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
                <MDBCol md={3} className="mt-4">
                    <MDBCard className="g-col-4">
                        <MDBCardBody>
                            <MDBCardTitle>Card title</MDBCardTitle>
                            <MDBCardText>Card text lorem ipsum dolor sit amment</MDBCardText>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
                <MDBCol md={3} className="mt-4">
                    <MDBCard className="g-col-4">
                        <MDBCardBody>
                            <MDBCardTitle>Card title</MDBCardTitle>
                            <MDBCardText>Card text lorem ipsum dolor sit amment</MDBCardText>
                        </MDBCardBody>

                    </MDBCard>
                </MDBCol>
                <MDBCol md={3} className="mt-4">
                    <MDBCard className="g-col-4">
                        <MDBCardBody>
                            <MDBCardTitle>Card title</MDBCardTitle>
                            <MDBCardText>Card text lorem ipsum dolor sit amment</MDBCardText>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
            </MDBRow>

        </MDBContainer >
    );
}

export default ListaProdutos;