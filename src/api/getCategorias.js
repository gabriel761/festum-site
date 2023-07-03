import api from "./api";
const getDataFromDatabase = (url) => {
   return(  api.request({
        method: "GET",
        url: url
    }))
} 

const postDataFromDatabase = (url, data) => {
    return(  api.request({
         method: "POST",
         url: url,
         data: data
     }))
 } 




export {getDataFromDatabase, postDataFromDatabase}