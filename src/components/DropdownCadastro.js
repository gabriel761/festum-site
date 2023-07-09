import { MDBDropdownMenu, MDBDropdownItem } from "mdb-react-ui-kit";
const DropdownCadastro = ({ data, setEscolhidos, escolhidos, getSubcategorias }) => {
    const items = [
        { key: 1, nome: 'aniversário' },
        { key: 2, nome: 'festa' },
        { key: 3, nome: 'chá de bebe' },
        { key: 4, nome: 'festa de empresa' },
        { key: 5, nome: "celebração" },
        { key: 6, nome: "casamento" },
    ]

    const escolherItem = (selectedItem) => {
        let newEscolhidos
        let jaTem = false
        if (selectedItem.nome == "Todos") {
            newEscolhidos = data.filter((item) => {
                return item.nome != "Todos"
            })
            setEscolhidos([...newEscolhidos])
        } else {

            escolhidos.forEach((item) => {
                if (item == selectedItem) {
                    jaTem = true
                }
            })
            if (!jaTem) {
                newEscolhidos = [...escolhidos, selectedItem]
                setEscolhidos(newEscolhidos);
            }
        }
        if (getSubcategorias && !jaTem)
            getSubcategorias(newEscolhidos)

    }
    return (
        <MDBDropdownMenu style={{ maxHeight: 400, overflow: "auto" }}>
            {data.map((item, index) => {
                return (
                    <MDBDropdownItem key={index} onClick={() => escolherItem(item)} className='dropdown-item'>{item.nome?item.nome:item}</MDBDropdownItem>
                )
            })}
        </MDBDropdownMenu>
    );
}

export default DropdownCadastro;