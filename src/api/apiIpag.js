import axios from "axios"
// export const apiIpag = axios.create({
//     baseURL: 'https://api.ipag.com.br',
//     timeout: 3000,
//     auth: {
//         username: "jg.7651@gmail.com",
//         password: "DE86-8B29EDCB-DF1FA18B-E0061035-2F7E"
//     },
//     headers: {
//         "Content-Type": "application/json",
//         "x-api-version": 2
//     }
// })

export const apiIpag = axios.create({
    baseURL: 'https://sandbox.ipag.com.br',
    timeout: 3000,
    auth: {
        username: "jg.7651@gmail.com",
        password: "DE86-8B29EDCB-DF1FA18B-E0061035-2F7E"
    },
    headers: {
        "Content-Type": "application/json",
        "x-api-version": 2
    }
})