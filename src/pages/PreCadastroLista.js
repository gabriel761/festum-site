import { useState } from "react";
import { MDBContainer } from "mdb-react-ui-kit";
import ListaPreCadastro from "../components/ListaPreCadastro";
import ListaPreCadastroSite from "../components/ListaPreCadastroSite";
import Tabs from "../components/Tabs";

const PreCadastroLista = () => {
    const [fillActive, setFillActive] = useState("Cadastro incompleto site")
    return (
        <MDBContainer>
            <Tabs fillActive={fillActive} setFillActive={setFillActive}/>
            <ListaPreCadastroSite statusConta={fillActive} />
        </MDBContainer>
    );
}

export default PreCadastroLista;