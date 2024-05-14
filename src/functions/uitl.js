export const replaceAll = (text) => {
    let runnig = true
    while (runnig) {
        if (text.search(' ') != -1) {
            text = text.replace(' ', '')
        } else {
            runnig = false
        }
    }
    return text
}
export function onlyLettersAndSpaces(str) {
    return /^[A-Za-z\s]*$/.test(str);
}

export const checkDate = (date) => {
    const dateArray = date?.split("/")
    if (dateArray && dateArray.length == 3 && dateArray[2].length == 4) {
        const inputDate = new Date(parseInt(dateArray[2]), parseInt(dateArray[1]), parseInt(dateArray[0]))
        const currentDate = new Date()
        const msInput = inputDate.getTime();
        const msCurrent = currentDate.getTime()
        return (msInput < msCurrent)
    }
}

export const contarDiarParaBloqueio = (data) => {
    let diasParaBloqueio = null
    if (data) {
        const today = new Date()
        const data_bloqueioDate = new Date(data)
        const diffTime = Math.abs(data_bloqueioDate - today);
        diasParaBloqueio = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    return diasParaBloqueio
}

export const verificarEmail = (email) => {
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    return reg.test(email)
}

export const dateMask = (value, eventType) => {
    console.log(eventType)
    if (value.length == 2 && eventType !== "deleteContentBackward"){
        value = value + '/'
    }
    if(value.length < 7){
        return value
    }
}