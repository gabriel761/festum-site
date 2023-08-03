import { MDBBtn } from "mdb-react-ui-kit";
import { useState } from "react";
const ListaCategoriasEscolhidas = ({data, setData}) => {
    
  
    const removeItem = (flatItem) => {
        const newData = data.filter((item) => item != flatItem)
        setData(newData)
    }
    return (
        <div style={{maxHeight: 400}}>
            {
                data.map((item, index) => {
                    return (
                        <MDBBtn style={{height: 40}} onClick={() => removeItem(item)} key={index} outline rounded color='secondary'>
                            {item.nome?item.nome:item}
                        </MDBBtn>
                    )
                }
                )
            }


        </div>
    );
}

export default ListaCategoriasEscolhidas;