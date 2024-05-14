import { apiIpag } from "../api/apiIpag"
import api from "../api/api"
import { getFornecedores } from "../api/getFornecedores"
import {  postFornecedoresBearer } from "../api/postFornecedores"

export const sendCartaoToBackEnd = async (cartao, fornecedor) => {
    try {
        const numero = cartao.attributes.card.bin.substring(0, 4) + " " + cartao.attributes.card.bin.substring(4, 7) + "** ****" + " " + cartao.attributes.card.last4
        const bandeira = cartao.attributes.card.brand
        const token = cartao.token
        const cartaoDB = {
            numero,
            bandeira,
            token,
            dadosCartao: JSON.stringify(cartao),
            fkCartaoFornecedor: fornecedor.pk_id
        }
        await api.request({
            url: "/cadastrarCartao",
            method: "post",
            data: {
                ...cartaoDB
            }
        })
    } catch (error) {
        console.log("Erro ao cadastrar o cartão no back-end")
        throw (error)
    }
}

export const sendAssinaturaToBackEnd = async (assinatura, fornecedor) => {
    
    try {
        const dadosAssinatura = JSON.stringify(assinatura)
        console.log("objeto assinatura: ", dadosAssinatura)
        const dataPrimeiraCobranca = assinatura.attributes.starting_date
        const idUnico = assinatura.id
        const profile_id = assinatura.attributes.profile_id
        const cardToken = assinatura.attributes.creditcard.token
        const assinaturaDB = {
            dadosAssinatura,
            dataPrimeiraCobranca,
            idUnico,
            cardToken,
            profile_id,
            fkAssinaturaFornecedor: fornecedor.pk_id
        }
        console.log("assinatura db: ", assinaturaDB)
        await api.request({
            url: "/cadastrarAssinatura",
            method: "post",
            data: {
                ...assinaturaDB
            }
        })
    } catch (error) {
        console.log("erro enviando assinatura no BD")
        throw (error)
    }
}

 
export const ipagRequest = async (fornecedor, endereco, cartao, planId) => {

    console.log("fornecedor: ", fornecedor)
    console.log("endereço: ", endereco)
    console.log("cartao: ", cartao)

    try {
        const responseCliente = await apiIpag.request({
            url: "/service/resources/customers",
            method: "POST",
            data: {
                "name": `${fornecedor.nome} ${fornecedor.sobrenome}`,
                "cpf_cnpj": fornecedor.cnpj != null ? fornecedor.cnpj : fornecedor.cpf,
                "email": fornecedor.email,
                "phone": fornecedor.telefone,
                "address": {
                    "street": endereco.rua,
                    "number": fornecedor.numero,
                    "district": endereco.bairro,
                    "complement": fornecedor.complemento,
                    "city": endereco.cidade,
                    "state": endereco.uf,
                    "zipcode": fornecedor.cep
                }
            }
        }).catch((e) => { throw (new Error("Erro ao criar cliente: " + e.message)) })


        const responseTokenCartao = await apiIpag.request({
            url: "/service/resources/card_tokens",
            method: "POST",
            data: {
                "card": {
                    "holderName": cartao.nome,
                    "number": cartao.nrCartao,
                    "expiryMonth": cartao.validadeMonth,
                    "expiryYear": cartao.validadeYear + '',
                    "cvv": cartao.cvv
                },
                "holder": {
                    "name": `${fornecedor.nome} ${fornecedor.sobrenome}`,
                    "cpfCnpj": fornecedor.cnpj != null ? fornecedor.cnpj : fornecedor.cpf,
                    "mobilePhone": fornecedor.telefone,
                    "birthdate": cartao.nascimento,
                    "address": {
                        "street": endereco.rua,
                        "number": fornecedor.numero,
                        "district": endereco.bairro,
                        "complement": fornecedor.complemento,
                        "city": endereco.cidade,
                        "state": endereco.uf,
                        "zipcode": fornecedor.cep
                    }
                }
            }
        }).catch((e) => { throw (new Error("Erro ao criar token: " + e.response.data.message)) })
        const number = Math.floor(Math.random() * 1000)
        const responseAssinatura = await apiIpag.request({
            url: "/service/resources/subscriptions",
            method: "POST",
            data: {
                "is_active": true,
                "profile_id": fornecedor.email + "-" + planId +"-" + number,
                "plan_id": planId,
                "customer_id": responseCliente.data.id,
                "starting_date": cartao.formatedDate,
                // "closing_date": "0000-00-00",
                "callback_url": "https://festum-heroku-production.up.railway.app/webhookPlanoEstrelarIpag",
                "creditcard_token": responseTokenCartao.data.token
            }
        }).catch((e) => { throw(e.response.data.message) })
        return { objTokenCartao: responseTokenCartao.data, objAssinatura: responseAssinatura.data }
    } catch (e) {
        throw (e)
    }
}


export const ipagRequestCriarClienteEAssinaturaUsandoToken = async (cartao, endereco, fornecedor, planId, formatedDate) => {
    try {
        console.log("cartao criar cliente e assinatura usando token: ", cartao)
        console.log("profile id: ", planId)
    const responseCliente = await apiIpag.request({
        url: "/service/resources/customers",
        method: "POST",
        data: {
            "name": `${fornecedor.nome} ${fornecedor.sobrenome}`,
            "cpf_cnpj": fornecedor.cnpj != null ? fornecedor.cnpj : fornecedor.cpf,
            "email": fornecedor.email,
            "phone": fornecedor.telefone,
            "address": {
                "street": endereco.rua,
                "number": fornecedor.numero,
                "district": endereco.bairro,
                "complement": fornecedor.complemento,
                "city": endereco.cidade,
                "state": endereco.uf,
                "zipcode": fornecedor.cep
            }
        }
    }).catch((e) => { console.log("Erro ao criar cliente: ",e.response.data); throw (new Error("Erro ao criar cliente: " + e.message)) })
        const number = Math.floor(Math.random() * 1000)
    const responseAssinatura = await apiIpag.request({
        url: "/service/resources/subscriptions",
        method: "POST",
        data: {
            "is_active": true,
            "profile_id": fornecedor.email + "-" + planId +"-"+number,
            "plan_id": planId,
            "customer_id": responseCliente.data.id,
            "starting_date": formatedDate,
            // "closing_date": "0000-00-00",
            "callback_url": "https://festum-heroku-production.up.railway.app/webhookPlanoEstrelarIpag",
            "creditcard_token": cartao.token
        }
    }).catch((e) => { throw (e.response.data.message) })
    return {objCliente: responseCliente.data , objAssinatura: responseAssinatura.data};
    } catch (error) {
        throw(error)
    }
}

export const ipagRequestTokenizarCartao = async (cartao, fornecedor, endereco) => {
    console.log("fornecedor from db: ", fornecedor.cnpj != null ? fornecedor.cnpj : fornecedor.cpf)
    console.log("cartao: ", cartao)
    console.log("endereco: ", endereco)
    try {
        const responseTokenCartao = await apiIpag.request({
            url: "/service/resources/card_tokens",
            method: "POST",
            data: {
                "card": {
                    "holderName": cartao.nome,
                    "number": cartao.nrCartao,
                    "expiryMonth": cartao.validadeMonth,
                    "expiryYear": cartao.validadeYear + '',
                    "cvv": cartao.cvv
                },
                "holder": {
                    "name": `${fornecedor.nome} ${fornecedor.sobrenome}`,
                    "cpfCnpj": fornecedor.cnpj != null ? fornecedor.cnpj : fornecedor.cpf,
                    "mobilePhone": fornecedor.telefone,
                    "birthdate": cartao.nascimento,
                    "address": {
                        "street": endereco.rua,
                        "number": fornecedor.numero,
                        "district": endereco.bairro,
                        "complement": fornecedor.complemento,
                        "city": endereco.cidade,
                        "state": endereco.uf,
                        "zipcode": fornecedor.cep
                    }
                }
            }
        })
    return responseTokenCartao.data
    } catch (e) {
        console.log("erro tokenizando cartao: ",e.response.data.message)
        throw (e.response.data.message)
    }
}

export const ipagRequestChecarSeAssinaturaExiste = async (id) => {
    try {
        const assinatura = await apiIpag.request({
            url: "/service/resources/subscriptions?id=" + id,
            method: "GET"
        })
        return assinatura.data;
    } catch (error) {

        console.log("erro checando assinatura no ipag: ",error.response.data.message)
        return null
    }
    
    
}

export const ipagRequestGetPlano = async (id) => {
    try {
        const assinatura = await apiIpag.request({
            url: "/service/resources/plans?id=" + id,
            method: "GET"
        })
        return assinatura.data;
    } catch (error) {

        console.log("erro checando assinatura no ipag: ", error.response.data.message)
        return null
    }


}
export const ipagRequestChecarSeAssinaturaExisteEmail = async (email) => {
    try {
        const assinatura = await apiIpag.request({
            url: "/service/resources/subscriptions?email=" + email,
            method: "GET"
        })
        return assinatura.data.data[0];
    } catch (error) {

        console.log("erro checando assinatura no ipag: ", error.response.data.message)
        return null
    }


}

export const ipagRequestAlterarCartaoDaAssinatura = async (idAssinatura, token, idPlano) => {
    console.log("id assinatura: ", idAssinatura)
    console.log("id plano: ", idPlano)
    console.log("token: ", token)
    const response = await apiIpag.request({
        url: "/service/resources/subscriptions?id=" + idAssinatura,
        method: "PUT",
        data: {
            "creditcard_token": token,
            "plan_id": idPlano
        }
    })
    return response.data
}

export const ipagRequestDeletarCartaoDaAssinatura = async (idAssinatura) => {
    if(typeof idAssinatura == "number"){
        idAssinatura = idAssinatura + ""
    }
    const response = await apiIpag.request({
        url: `/service/subscriptions/${idAssinatura}/card_token`,
        method: "DELETE"
    })
    return response.data
    
}
export const ipagRequestDesativarAssinatura = async (idAssinatura) => {
    console.log("id assinatura dentro do ipag request destativar assinatura:", idAssinatura)
    if (typeof idAssinatura == "number") {
        idAssinatura = idAssinatura + ""
    }
    const response = await apiIpag.request({
        url: `/service/resources/subscriptions?id=${idAssinatura}`,
        method: "PUT",
        data: {"is_active": false}
    })
    return response.data
}

export const ipagRequestAtivarAssinatura = async (idAssinatura) => {
    const response = await apiIpag.request({
        url: `/service/resources/subscriptions?id=${idAssinatura}`,
        method: "PUT",
        data: { "is_active": true }
    })
    return response.data
}

export const getAssinatura = async (idFornecedor, firebaseToken) => {
    try {
        console.log("id fornecedor: ", idFornecedor)
        console.log("")
        const result = await getFornecedores("/getAssinaturaByIdFornecedor/" + idFornecedor, firebaseToken)
        console.log(result.data)
        return result.data[0]
    } catch (error) {
        console.log("erro checando assinatura no banco de dados: ", error)
        return null
    }
    
   
}
export const getCartao = async (numeroCartao,idFornecedor, firebaseToken) => {
    try {
        numeroCartao = numeroCartao.substring(0,7) + "** ****"+" "+ numeroCartao.substring(15, numeroCartao.length)
        console.log(numeroCartao)
        console.log(idFornecedor)
        const { data } = await getFornecedores("/getCartaoByNumeroAndIdFornecedor/"+numeroCartao+"/"+idFornecedor, firebaseToken)
        return data[0]
    } catch (error) {
        console.log("erro checando cartao no banco de dados: ", error)
        return null
    }


}

export const alterarAssinaturaBD =  async (dataAssinatura, tokenFirebase) => {
    try {
        const { data } = await postFornecedoresBearer("/updateAssinatura", dataAssinatura,tokenFirebase )
        return data[0]
    } catch (error) {
        console.log("erro no update assinatura no banco de dados: ", error.response.data)
        return null
    }
}

export const updateStatusPagamentoFornecedor = async  (data, token) => {
    postFornecedoresBearer("/updateStatusPagamentoFornecedor", data, token)
}

export const mensagemStatusContaIpag = (statusNumber) => {
    switch (statusNumber) {
        case 1:
            return "Iniciado"
            break;
        case 2:
            return "Boleto Impresso"
            break;
        case 3:
            return "Cancelado"
            break;
        case 4:
            return "Em análise"
            break;
        case 5:
            return "Pré-Autorizado"
            break;
        case 6:
            return "Autorizado Valor Parcial"
            break;
        case 7:
            return "Recusado"
            break;
        case 8:
            return "Aprovado e Capturado"
            break;
        case 9:
            return "Chargeback"
            break;
        case 10:
            return "Em Disputa"
            break;
        default:
            return "Erro ao receber status"
    }
}