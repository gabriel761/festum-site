import React, { useEffect, useRef } from 'react';
import "../index.css"
import {
    MDBCard,
    MDBCardBody,
    MDBInput,
    MDBCol,
    MDBRow,
    MDBCheckbox,
    MDBBtn,
    MDBIcon,
    MDBContainer
} from 'mdb-react-ui-kit';
import EmailConfirmadoCard from '../components/EmailConfirmadoCard';
import { useSearchParams } from 'react-router-dom';
import { apiIpag } from '../api/apiIpag';


export default function EmailConfirmadoApp() {
    // const [searchParams] = useSearchParams();
    // console.log(searchParams)
    // let values = searchParams.get("values")
    // values = decodeURIComponent(values)
    // values = JSON.parse(values)
    // console.log("values from url: ", values)
    // const criarClienteIpag = { name: values.nome, email: values.email, cpf_cnpj: values.cpf_cnpj, phone: values.tel }
    // const callUnce = useRef(false)

    const formatedDateToday = () => {
        const date = new Date()
        const dateStr = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate() + 1}`
        console.log(dateStr)
        return dateStr
    }


    // useEffect(() => {
    //     if (!callUnce.current) {
    //         requestIpag()
    //     }

    // }, [])


    // const requestIpag = async () => {
    //     callUnce.current = true
    //     try {
    //         console.log("objeto ipag antes de enviar: ", criarClienteIpag)
    //         const resultClienteIpag = await apiIpag.request({
    //             method: 'POST',
    //             url: '/service/resources/customers',
    //             data: criarClienteIpag
    //         })
    //         const clienteIpag = resultClienteIpag?.data
    //         if (clienteIpag) {
    //             const criarAssinatura = {
    //                 isActive: true,
    //                 profile_id: values.email + " " + values.ipagId + 6,
    //                 plan_id: values.ipagId,
    //                 customer_id: clienteIpag.id,
    //                 starting_date: formatedDateToday(),
    //                 callback_url: "https://festum-site.vercel.app/pagamento-confirmado"
    //             }
    //             console.log("obj criar assinatura antes do request: ", criarAssinatura)
    //             const resultAssinaturaIpag = await apiIpag.request({
    //                 method: 'POST',
    //                 url: '/service/resources/subscriptions',
    //                 data: criarAssinatura
    //             })
    //             console.log("result assinatura ipag: ", resultAssinaturaIpag)
    //             //window.location.href = resultAssinaturaIpag.data.attributes.plan.attributes.links.payment
    //         }
    //     } catch (e) {
    //         console.log(e)
    //         alert("algo deu errado: ", e.message)
    //     }
    // }


    return (
        <MDBContainer className='d-flex justify-content-center'>

            <MDBRow>
                <MDBCol md={3}>

                </MDBCol>
                <MDBCol md={6} size="md" >
                    <MDBCard >
                        <MDBCardBody>
                            <MDBIcon className='ms-1 mb-4 d-flex justify-content-center' color='primary' icon='check' size='4x' />
                            <h3 className='text-center'>Email Confirmado!</h3>
                            <p className='text-center'>Volte para o app e faça login novamente.</p>

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
                </MDBCol>
                <MDBCol md={3}>

                </MDBCol>
            </MDBRow>
        </MDBContainer>
    );
}