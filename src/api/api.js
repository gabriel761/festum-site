import axios from "axios";


const myEnv = window.location.href;
console.log("my enviroment: ", myEnv)
let api

if (myEnv.includes("localhost")) {
    api = axios.create({
        baseURL: 'http://10.0.0.103:5000',
        timeout: 3000,
       headers: { 'X-Custom-Header': 'foobar' }
    })
} else {
    api = axios.create({
        baseURL: 'https://festum-heroku-production.up.railway.app',
        timeout: 3000,
        headers: { 'X-Custom-Header': 'foobar' }
    })
}


export default api