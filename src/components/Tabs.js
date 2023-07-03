import React, { useState } from 'react';
import {
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  
  MDBContainer
} from 'mdb-react-ui-kit';

export default function Tabs({fillActive, setFillActive}) {
  

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
            <MDBTabsLink className='shadow-2-strong' onClick={() => handleFillClick('tab1')} active={fillActive === 'tab1'}>
              Clientes
            </MDBTabsLink>
          </MDBTabsItem>
          <MDBTabsItem >
            <MDBTabsLink className='shadow-2-strong' onClick={() => handleFillClick('tab2')} active={fillActive === 'tab2'}>
              Fornecedores
            </MDBTabsLink>
          </MDBTabsItem>
        </MDBTabs>
      </MDBContainer>
      
    </>
  );
}