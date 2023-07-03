import api from "./api";
const getPessoas = (url) => {
   return(  api.request({
        method: "GET",
        url: url
    }))
} 

const tratarString = (data) => {
   const newData = data.map((item) => {
        item.nome_loja = item.nome_loja.trim()
        item.categoria = item.categoria.trim()
        return item
    })

   return newData
}

export {getPessoas, tratarString}