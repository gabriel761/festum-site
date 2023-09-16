import {
    MDBCol,
    MDBRow,
    MDBContainer
} from 'mdb-react-ui-kit';
import CriarLinkCard from "../components/CriarLinkCard";
import PaginaInterditada from '../components/PaginaInterditada';
const CriarLink = () => {
    
    return ( 
        <MDBContainer className=''>
            <MDBRow>
                <MDBCol size="md-12" >
                    <PaginaInterditada/>
                    {/* <CriarLinkCard /> */}
                </MDBCol>
            </MDBRow>
        </MDBContainer>
     );
}
 
export default CriarLink;