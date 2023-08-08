import React, { useState } from 'react';
import {
    MDBBtn,
    MDBModal,
    MDBModalDialog,
    MDBModalContent,
    MDBModalHeader,
    MDBModalTitle,
    MDBModalBody,
    MDBModalFooter,
} from 'mdb-react-ui-kit';

export default function Modal({basicModal, setBasicModal, title, body, btntitle, modalfunction}) {
    

    return (
        <>
           
            <MDBModal show={basicModal} setShow={setBasicModal} tabIndex='-1'>
                <MDBModalDialog>
                    <MDBModalContent>
                        <MDBModalHeader>
                            <MDBModalTitle>{title}</MDBModalTitle>
                            <MDBBtn className='btn-close' color='none' onClick={() => setBasicModal(false)}></MDBBtn>
                        </MDBModalHeader>
                        <MDBModalBody>{body}</MDBModalBody>

                        <MDBModalFooter>
                            <MDBBtn color='secondary' onClick={() => setBasicModal(false)}>
                                Cancelar
                            </MDBBtn>
                            <MDBBtn onClick={modalfunction} color='danger'>{btntitle}</MDBBtn>
                        </MDBModalFooter>
                    </MDBModalContent>
                </MDBModalDialog>
            </MDBModal>
        </>
    );
}