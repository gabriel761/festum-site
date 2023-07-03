import api from "./api";
const getClientes = (url) => {
   return(  api.request({
        method: "GET",
        url: url
    }))
} 
 
export default getClientes;