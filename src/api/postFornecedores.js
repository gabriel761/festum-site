import api from "./api"
export const postFornecedores = (url, data) => {
    return(  api.request({
         method: "POST",
         url: url,
         data: data
     }))
 } 