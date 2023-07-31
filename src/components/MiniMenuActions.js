import React from 'react';
import { MDBDropdown, MDBDropdownMenu, MDBDropdownToggle, MDBDropdownItem } from 'mdb-react-ui-kit';
import { Link } from 'react-router-dom';

export default function MiniMenuAction({ item }) {
    const { planos, status_da_conta } = item
    let arrayDisabledOptions = []
    const options = [
        { name: "Completar Cadastro", path: "/cadastro-fornecedor" },
        { name: "Editar Fornecedor", path: planos == "Pacote Estrelar" ? "/editar-fornecedor-estrelar" : "/editar-fornecedor-nebulosa" },
        { name: "Adicionar Produto", path: "/adicionar-produto" },
        { name: "Listar Produtos Cadastrados", path: "/listar-produtos" }
    ]

    const addDisabledOptions = () => {
        const optionsToDisable = []
        switch (planos) {
            case "Pacote Estrelar":
                optionsToDisable.push("")
                break;
            case "Pacote Nebulosa":
                optionsToDisable.push("Completar Cadastro","Adicionar Produto", "Listar Produtos Cadastrados", "Editar Fornecedor")
                break;

        }
        switch (status_da_conta) {
            case "Cadastro incompleto site":
                optionsToDisable.push("Adicionar Produto", "Listar Produtos Cadastrados", "Editar Fornecedor")
                break;
            case "ativo":
                optionsToDisable.push("Completar Cadastro","Adicionar Produto", "Listar Produtos Cadastrados", "Editar Fornecedor")
                break;
        }
        return optionsToDisable
    }

    arrayDisabledOptions = addDisabledOptions()
    if (item) {
        return (
            <MDBDropdown>
                <MDBDropdownToggle>Escolha uma Ação</MDBDropdownToggle>
                <MDBDropdownMenu>
                    {options.map((option) => {
                        return (
                            <MDBDropdownItem link disabled={arrayDisabledOptions.includes(option.name)}>
                                <Link style={{ color: "inherit" }} to={{ pathname: option.path }} state={{ fornecedor: item }}>
                                    {option.name}
                                </Link>
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