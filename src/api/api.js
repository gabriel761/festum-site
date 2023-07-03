import axios from "axios";

 const api = axios.create({
    baseURL:'https://festum.herokuapp.com',
    timeout: 3000,
    headers:{'X-Custom-Header': 'foobar'}
})

// const api = axios.create({
//     baseURL:'http://10.0.0.103:5000',
//     timeout: 3000,
//     headers:{'X-Custom-Header': 'foobar'}
// })

export default api