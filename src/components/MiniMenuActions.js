import React from 'react';
import { MDBDropdown, MDBDropdownMenu, MDBDropdownToggle, MDBDropdownItem } from 'mdb-react-ui-kit';
import { Link, useNavigate } from 'react-router-dom';

export default function MiniMenuAction({ item }) {
    const { planos, status_da_conta } = item
    let arrayDisabledOptions = []
    const navigate = useNavigate()
    const options = [
        { name: "Completar Cadastro", path: "/cadastro-fornecedor" },
        { name: "Editar Fornecedor", path: planos == "Pacote Estrelar" ? "/editar-fornecedor-estrelar" : "/editar-fornecedor-nebulosa" },
        { name: "Adicionar Produto", path: planos == "Pacote Estrelar" ? "/adicionar-produto": "/adicionar-produto-nebulosa" },
        { name: "Listar Produtos Cadastrados", path: "/listar-produtos" }
    ]

    const addDisabledOptions = () => {
        const optionsToDisable = []
        switch (planos) {
            case "Pacote Estrelar":
                optionsToDisable.push("")
                break;
            case "Pacote Nebulosa":
                optionsToDisable.push("Completar Cadastro")
                break;

        }
        switch (status_da_conta) {
            case "Cadastro incompleto site":
                optionsToDisable.push("Adicionar Produto", "Listar Produtos Cadastrados", "Editar Fornecedor")
                break;
            case "ativo":
                optionsToDisable.push("Completar Cadastro",)
                break;
        }
        return optionsToDisable
    }

    const handleClick = (path, data) => {
        if(path != "/excluir-fornecedor"){
            navigate(path, { state: { fornecedor: data } })
        }
        
    }

    arrayDisabledOptions = addDisabledOptions()
    if (item) {
        return (
            <MDBDropdown>
                <MDBDropdownToggle>Escolha uma Ação</MDBDropdownToggle>
                <MDBDropdownMenu>
                    {options.map((option) => {
                        return (
                            <MDBDropdownItem link href='' onClick={() => handleClick(option.path, item)} disabled={arrayDisabledOptions.includes(option.name)}>
                               
                                    {option.name}
                                
                            </MDBDropdownItem>
                        )
                    })}
                </MDBDropdownMenu>
            </MDBDropdown>
        );
    } else {
        return null
    }

}