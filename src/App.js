import React from 'react';
import { MDBBtn, MDBContainer, MDBRow, MDBCol } from 'mdb-react-ui-kit';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Table from './pages/Table'
import Navbar from './components/Navbar'
import Login from './pages/Login';

import CadastroFornecedor from './pages/CadastroFornecedor';
import PreCadastroLista from './pages/PreCadastroLista';
import PreCadastroForm from './pages/PreCadastroForm';
import CriarLink from './pages/CriarLink';
import ConfirmacaoPreCadastro from './pages/ConfirmacaoPreCadastro';
import EmailConfirmado from './pages/EmailConfirmado';

function App() {

  return (
    
        <MDBContainer fluid>
          <Router>
            <MDBContainer className='mb-5'>
              <Navbar />
            </MDBContainer>
            <Routes>
              <Route path='/' element={<Login />} />
              <Route path='/table' element={<Table />} />
              <Route path='/lista-precadastro' element={<PreCadastroLista />} />
              <Route path='/form-precadastro' element={<PreCadastroForm />} />
              <Route path='/cadastro-fornecedor' element={<CadastroFornecedor />} />
              <Route path='/criar-link' element={<CriarLink />} />
              <Route path='/confirmacao-precadastro' element={<ConfirmacaoPreCadastro />} />
              <Route path='/email-confirmado' element={<EmailConfirmado />} />
            </Routes>
          </Router>
        </MDBContainer>
  );
}

export default App;
