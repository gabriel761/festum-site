import React, { useEffect, useRef, useState } from 'react';
import "../index.css"
import {
    MDBCol,
    MDBRow,
    MDBContainer,
    MDBBtn
} from 'mdb-react-ui-kit';
import EmailConfirmadoCard from '../components/EmailConfirmadoCard';
import { useSearchParams } from 'react-router-dom';
import { apiIpag } from '../api/apiIpag';
import PagamentoConfirmadoCard from '../components/PagamentoConfirmadoCard';
import PagamentoNaoConfirmadoCard from '../components/PagamentoNaoConfirmado';


const PagamentoConfirmado = () => {

//     const [searchParams] = useSearchParams();
//     const assinaturaId = searchParams.get("assinatura")
   
//     const [isLoading, setIsLoading] = useState(false)
//     const statusRef = useRef(null)

//     useEffect(() => {
//         setIsLoading(true)
//         firstFunctions()
//     },[])

// const firstFunctions = () => {
//     setTimeout( async()=>{
//         consultarPagamentoIpag().then((status) => {
//             setIsLoading(false)
//             if(status == 'paid'){
//                 statusRef.current = status
//             }else{
//                 console.log("erro do ipag")
//             }
//         })
//     }, 500);
// }

//     const consultarPagamentoIpag = async () => {
//         console.log("testar ipga")
//         try {
//             const result = await apiIpag.request({
//                 url: "/service/resources/subscriptions?id="+assinaturaId,
//                 method: 'GET'
//             })
//             return result.data.attributes.status
//         } catch (e) {
//             console.log("erro consultado no ipag: ", e)
//         }
//     }
    return (
        <MDBContainer className='d-flex justify-content-center'>

            <MDBRow>
                <MDBCol md={3}>

                </MDBCol>
                <MDBCol md={6} size="md" >
                    {/* {statusRef.current == 'paid'? */}
                    <PagamentoConfirmadoCard/>
                    {/*: <PagamentoNaoConfirmadoCard/>
                    } */}
                    
                </MDBCol>
                <MDBCol md={3}>
                    
                </MDBCol>
            </MDBRow>
        </MDBContainer>
    );
}

export default PagamentoConfirmado;