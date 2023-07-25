import {
    MDBCol,
    MDBRow,
    MDBContainer
} from 'mdb-react-ui-kit';
import PreCadastroFormCard from "../components/PreCadastroFormCard";
import { useSearchParams } from 'react-router-dom';
import PreCadastroSemPagamentoFormCard from '../components/PreCadastroSemPagamentoFormCard';
const PreCadastroFormSemPagamento = () => {
    
    const [searchParams] = useSearchParams();
    console.log(searchParams)
    const ipagId = searchParams.get("link")
    console.log("link ipag: ", ipagId)

    
    return ( 
        <MDBContainer className=''>
            <MDBRow>
                <MDBCol size="md-12" >
                    <PreCadastroSemPagamentoFormCard/>
                </MDBCol>
            </MDBRow>
        </MDBContainer>
     );
}
 
export default PreCadastroFormSemPagamento;