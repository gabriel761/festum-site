import * as yup from 'yup'
import {
    MDBCard,
    MDBCardBody,
    MDBInput,
    MDBCol,
    MDBRow,
    MDBCheckbox,
    MDBBtn,
    MDBCardText,
    MDBCardTitle,
    MDBSpinner
} from 'mdb-react-ui-kit';
import "../index.css"
import { Formik } from 'formik';
import { efetuarPreCadastroSite } from '../functions/efetuarPreCadastro';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { apiIpag } from '../api/apiIpag';


const CriarLinkCard = () => {
    const [linkIpag, setLinkIpag] = useState('')
    const [linkCompleto, setLinkCompleto] = useState('')
    const [planos, setPlanos] = useState([])
    const [isSelected, setIsSelected] = useState()
    const [isLoading, setIsLoading] = useState(false)


useEffect(()=> {
    consultarPlanos()
},[])

    const consultarPlanos = async () => {
        try{
            setIsLoading(true)
        const planos = await apiIpag.request({
            url: "/service/resources/plans",
            method: "GET"
        })
        console.log("planos: ", planos.data.data)
        setPlanos(planos.data.data)
        setIsLoading(false)
    }catch(e){
        console.log("erro ao carregar planos: ", e)
    }
    }

    const selectPlan = (item) => {
        console.log("plano: ", item)
        const selected = item.id
        if(isSelected != selected){
            setIsSelected(selected)
            setLinkIpag(item.attributes.links.payment)
        }else{
            setIsSelected("")
        }
        
    }

    const handleClick = () => {
        console.log("entrou no handle click")
        if (linkIpag.length != 0) {
            console.log("entrou no if")
            let linkCompletoTem = linkIpag
            setLinkCompleto(linkCompletoTem)

        }
    }

    if(isLoading){
        return (
            <div className='d-flex justify-content-center'>
                <MDBSpinner role='status'>
                    <span className='visually-hidden'>Loading...</span>
                </MDBSpinner>
            </div>
        )
    }else{
        return (
            <MDBCard  >
                <MDBCardBody>
                    <MDBRow className='mb-5'>
                        {planos.map((item, index) => {
                            return (
                                <MDBCol key={index} md={2}>
                                    <MDBCard className={isSelected == item.id?'border border-primary':''}>
                                        <MDBCardBody>
                                            <MDBCardTitle>{item.attributes.name}</MDBCardTitle>
                                            <MDBCardText>
                                                {item.attributes.description}
                                            </MDBCardText>
                                            <MDBCardText>
                                               R$ {item.attributes.amount}
                                            </MDBCardText>
                                            <MDBBtn onClick={() => selectPlan(item)}>Selecionar</MDBBtn>
                                        </MDBCardBody>
                                    </MDBCard>
                                </MDBCol>
                            )
                        })}
    
                    </MDBRow>
                    <MDBCardText>{linkCompleto}</MDBCardText>
                    <MDBBtn onClick={handleClick} >
                        Criar Link
                    </MDBBtn>
                    
                </MDBCardBody>
            </MDBCard>
        );
    }
    
}

export default CriarLinkCard;