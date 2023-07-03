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
    MDBCardTitle
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


useEffect(()=> {
    consultarPlanos()
},[])

    const consultarPlanos = async () => {
        
        const planos = await apiIpag.request({
            url: "/service/resources/plans",
            method: "GET"
        })
        console.log("planos: ", planos.data.data)
        setPlanos(planos.data.data)
    }

    const selectPlan = (item) => {
        const selected = item.attributes.name
        if(isSelected != selected){
            setIsSelected(selected)
            setLinkIpag(item.id)
        }else{
            setIsSelected("")
        }
        
    }

    const handleClick = () => {
        console.log("entrou no handle click")
        if (linkIpag.length != 0) {
            console.log("entrou no if")
            let linkCompletoTem = window.location.host + "/form-precadastro?link=" + linkIpag
            setLinkCompleto(linkCompletoTem)

        }
    }
    return (
        <MDBCard  >
            <MDBCardBody>
                <MDBRow className='mb-5'>
                    {planos.map((item, index) => {
                        return (
                            <MDBCol key={index} md={2}>
                                <MDBCard className={isSelected == item.attributes.name?'border border-primary':''}>
                                    <MDBCardBody>
                                        <MDBCardTitle>{item.attributes.name}</MDBCardTitle>
                                        <MDBCardText>
                                            {item.attributes.description}
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

export default CriarLinkCard;