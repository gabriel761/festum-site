import api from "./api"
export const postFornecedores = (url, data) => {
    return(  api.request({
         method: "POST",
         url: url,
         data: data
     }))
 } 

export const postFornecedoresBearer = (url, data, token) => {
    return (api.request({
        method: "POST",
        url: url,
        data: data,
        headers: { Authorization: "Bearer " + token }
    }))
}