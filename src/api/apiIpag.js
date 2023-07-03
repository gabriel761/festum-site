import axios from "axios"
export const apiIpag = axios.create({
    baseURL: 'https://api.ipag.com.br',
    timeout: 3000,
    auth: {
        username: "festumbrasil@gmail.com",
        password: "F043-B605F28B-77B89EF6-91CDC155-6012"
    },
    headers: {
        "Content-Type": "application/json",
        "x-api-version": 2
    }
})