import {
    MDBCol,
    MDBRow,
    MDBContainer
} from 'mdb-react-ui-kit';
import CriarLinkCard from "../components/CriarLinkCard";
const CriarLink = () => {
    
    return ( 
        <MDBContainer className=''>
            <MDBRow>
                <MDBCol size="md-12" >
                    <CriarLinkCard />
                </MDBCol>
            </MDBRow>
        </MDBContainer>
     );
}
 
export default CriarLink;