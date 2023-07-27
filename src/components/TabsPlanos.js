import React, { useState } from 'react';
import {
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  
  MDBContainer
} from 'mdb-react-ui-kit';

export default function TabsPlanos({fillActive, setFillActive}) {
  

  const handleFillClick = (value) => {
    if (value === fillActive) {
      return;
    }

    setFillActive(value);
  };

  return (
    <>
      <MDBContainer>
        <MDBTabs fill className='mb-3 shadow-4'>
          <MDBTabsItem >
            <MDBTabsLink className='shadow-2-strong' onClick={() => handleFillClick('Pacote Estrelar')} active={fillActive === 'Pacote Estrelar'}>
              Pacote Estrelar
            </MDBTabsLink>
          </MDBTabsItem>
          <MDBTabsItem >
            <MDBTabsLink className='shadow-2-strong' onClick={() => handleFillClick('Pacote Nebulosa')} active={fillActive === 'Pacote Nebulosa'}>
              Pacote Nebulosa
            </MDBTabsLink>
          </MDBTabsItem>
        </MDBTabs>
      </MDBContainer>
      
    </>
  );
}