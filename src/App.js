import React, { useState } from 'react';
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
import PagamentoConfirmadoCard from './components/PagamentoConfirmadoCard';
import PagamentoConfirmado from './pages/PagamentoConfirmado';
import ShowNavbarComponet from './components/ShowNavbarComponent';
import { UserContext } from './context/UserContext';
import CryptoJS from 'crypto-js';
import AdicionarProduto from './pages/AdicionarProduto';
import FormPreCadastroFirebase from './pages/FormePreCadastroFirebase';
import DeepLinking from './pages/DeepLiking';
import CriarFornecedorFicticio from './pages/CriarFornecedorFicticio';
import PreCadastroFormSemPagamento from './pages/PreCadastroSemPagamento';
import CriarFornecedorNebulosa from './pages/CriarFornecedorNebulosa';
import ListaProdutos from './pages/ListaProdutos';
import EditarFornecedorNebulosa from './pages/EditarFornecedorNebulosa';
import EditarProdutoNebulosa from './pages/EditarProdutoNebulosa';
import EditarFornecedor from './pages/EditarFornecedor';
import AdicionarProdutoNebulosa from './pages/AdicionarProdutoNebulosa';
import EditarProduto from './pages/EditarProduto';
import RedirectToApp from './pages/RedirectToApp';
import EmailConfirmadoApp from './pages/EmailConfirmadoApp';
import SenhaConfirmadaApp from './components/SenhaConfirmada';



function Private({ Item, signed, setSigned }) {

  // crio uma variavel boleana e comparo o objeto de usuario do banco de dados com um objeto criptografado
  const token = localStorage.getItem("token-festum")
  if(token){
    const bytes = CryptoJS.AES.decrypt(token, "Web033F1")
    const forJson = bytes.toString(CryptoJS.enc.Utf8)
    if(forJson == '{"pk_id":368,"nome":"admin","sobrenome":"festum","email":"admin@festum.com.br","id_firebase":"Web033F1","tipo_pessoa":"admin"}'){
      setSigned(true)
    }
  }
 

  return signed ? <Item /> : <Login />
}

function App() {
  const [signed, setSigned] = useState(false)
  return (

    <MDBContainer fluid>
      <UserContext.Provider value={setSigned}>
        <Router>
          <MDBContainer className='mb-5'>
            <ShowNavbarComponet signed={signed}>
              <Navbar />
            </ShowNavbarComponet>
          </MDBContainer>
          <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/lista-precadastro' element={<Private setSigned={setSigned} signed={signed} Item={PreCadastroLista} />} />
            <Route path='/form-precadastro' element={<PreCadastroForm />} />
            <Route path='/cadastro-fornecedor' element={<Private setSigned={setSigned} signed={signed} Item={CadastroFornecedor} />} />
            <Route path='/criar-link' element={<Private setSigned={setSigned} signed={signed} Item={CriarLink} />} />
            <Route path='/confirmacao-precadastro' element={<ConfirmacaoPreCadastro />} />
            <Route path='/email-confirmado' element={<EmailConfirmado />} />
            <Route path='/email-confirmado-app' element={<EmailConfirmadoApp />} />
            <Route path='/senha-confirmada-app' element={<SenhaConfirmadaApp />} />
            <Route path='/pagamento-confirmado' element={<PagamentoConfirmado />} />
            <Route path='/adicionar-produto' element={<AdicionarProduto />} />
            <Route path='/adicionar-produto-nebulosa' element={<AdicionarProdutoNebulosa />} />
            <Route path='/form-precadastro-firebase' element={<FormPreCadastroFirebase />} />
            <Route path='/deeplinking' element={<DeepLinking />} />
            <Route path='/redirect-to-app' element={<RedirectToApp />} />
            <Route path='/criar-fornecedor-ficticio' element={<Private setSigned={setSigned} signed={signed} Item={CriarFornecedorFicticio} />} />
            <Route path='/form-precadastro-sempagamento' element={<Private setSigned={setSigned} signed={signed} Item={PreCadastroFormSemPagamento} />} />
            <Route path='/form-pacote-nebulosa' element={<Private setSigned={setSigned} signed={signed} Item={CriarFornecedorNebulosa} />} />
            <Route path='/listar-produtos' element={<Private setSigned={setSigned} signed={signed} Item={ListaProdutos} />}/>
            <Route path='/editar-fornecedor-nebulosa' element={<Private setSigned={setSigned} signed={signed} Item={EditarFornecedorNebulosa} />}/>
            <Route path='/editar-fornecedor-estrelar' element={<Private setSigned={setSigned} signed={signed} Item={EditarFornecedor} />} />
            <Route path='/editar-produto-nebulosa' element={<Private setSigned={setSigned} signed={signed} Item={EditarProdutoNebulosa} />} />
            <Route path='/editar-produto' element={<Private setSigned={setSigned} signed={signed} Item={EditarProduto} />} />
          </Routes>
        </Router>
      </UserContext.Provider>
    </MDBContainer>
  );
}

export default App;
