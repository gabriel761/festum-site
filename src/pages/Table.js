import React from 'react';
import { MDBBadge, MDBBtn, MDBTable, MDBTableHead, MDBTableBody, MDBTabsContent, MDBTabsPane, MDBContainer, } from 'mdb-react-ui-kit';
import TableClientes from '../components/TableClientes';
import Tabs from '../components/Tabs';
import TableFornecedor from '../components/TableFornecedor';
import Navbar from '../components/Navbar';
import Filtros from '../components/Filtros';

export default function Table() {
  const [fillActive, setFillActive] = React.useState('tab1');
  return (
    <div>

      <Tabs fillActive={fillActive} setFillActive={setFillActive} />
      <MDBTabsContent>
        <MDBContainer>
          <Filtros />
        </MDBContainer>
        <MDBTabsPane show={fillActive === 'tab1'}>
          <TableClientes />
        </MDBTabsPane>
        <MDBTabsPane show={fillActive === 'tab2'}>
          <TableFornecedor />
        </MDBTabsPane>
      </MDBTabsContent>

    </div>
  );
}