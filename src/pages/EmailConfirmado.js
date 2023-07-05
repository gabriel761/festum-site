import React, { useEffect, useRef } from 'react';
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


export default function EmailConfirmado() {
    const [searchParams] = useSearchParams();
    console.log(searchParams)
    let values = searchParams.get("values")
    values = decodeURIComponent(values)
    values = JSON.parse(values)
    console.log("values from url: ", values)
    const criarClienteIpag = { name: values.nome, email: values.email, cpf_cnpj: values.cpf_cnpj, phone: values.tel }
    const callUnce = useRef(false)

    const formatedDateToday = () => {
        const date = new Date()
        const dateStr = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()+1}`
        console.log(dateStr)
        return dateStr
    }

   
           useEffect(()=> {
            if(!callUnce.current){
                requestIpag()
            }
            
           },[])
 

    const requestIpag = async () => {
        callUnce.current = true
        try{
        console.log("objeto ipag antes de enviar: ", criarClienteIpag)
        const resultClienteIpag = await apiIpag.request({
            method: 'POST',
            url: '/service/resources/customers',
            data: criarClienteIpag
        })
        const clienteIpag = resultClienteIpag?.data
        if(clienteIpag){
            const criarAssinatura = {isActive: true, profile_id: values.email, plan_id: values.ipagId ,customer_id: clienteIpag.id, starting_date: formatedDateToday(), callback_url: "https://festum-site.vercel.app/pagamento-confirmado" }
            console.log("obj criar assinatura antes do request: ", criarAssinatura)
            const resultAssinaturaIpag= await apiIpag.request({
                method:'POST',
                url: '/service/resources/subscriptions',
                data: criarAssinatura
            })
            console.log("result assinatura ipag: ", resultAssinaturaIpag)
            window.location.href = resultAssinaturaIpag.data.attributes.links.payment
        }
    }catch(e){
        console.log(e)
        alert("algo deu errado: ", e.message)
    }
    }


    return (
        <MDBContainer className='d-flex justify-content-center'>

            <MDBRow>
                <MDBCol md={3}>

                </MDBCol>
                <MDBCol md={6} size="md" >
                    <EmailConfirmadoCard />
                </MDBCol>
                <MDBCol md={3}>
                   
                </MDBCol>
            </MDBRow>
        </MDBContainer>
    );
}