import { useState } from "react";
import { MDBContainer } from "mdb-react-ui-kit";
import ListaPreCadastro from "../components/ListaPreCadastro";
import ListaPreCadastroSite from "../components/ListaPreCadastroSite";
import Tabs from "../components/Tabs";
import TabsPlanos from "../components/TabsPlanos";

const PreCadastroLista = () => {
    const [fillActive, setFillActive] = useState("Cadastro incompleto site")
    const [fillPlanos, setFillPlanos] = useState("Pacote Estrelar")
    return (
        <MDBContainer>
            <TabsPlanos fillActive={fillPlanos} setFillActive={setFillPlanos} />
            {fillPlanos == "Pacote Estrelar" ?
                <>
                    <Tabs fillActive={fillActive} setFillActive={setFillActive} />
                </>
                : 
                null
            }
            <ListaPreCadastroSite statusConta={fillActive}  plano={fillPlanos}/>

        </MDBContainer>
    );
}

export default PreCadastroLista;