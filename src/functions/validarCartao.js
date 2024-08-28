
function Error(message) {
    this.message = message;
    this.name = "UserException";
}

export const checkDate = (date) => {
    const dateArray = date?.split("/")
    if (dateArray && dateArray.length == 2 && dateArray[1].length == 4) {
        const inputDate = new Date(parseInt(dateArray[1]), parseInt(dateArray[0])-1)
        const currentDate = new Date()
        const inputYear = inputDate.getFullYear();
        const realMonth = inputDate.getMonth() + 1
        const inputMonth = realMonth >= 10 ?realMonth.toString() : "0" + realMonth
        const currentYear = currentDate.getFullYear()
        const currentMonth = currentDate.getMonth()

        const vencido = inputYear != currentYear ? inputYear > currentYear : inputDate > currentDate
        return { dateIsValid: true, vencido, inputMonth, inputYear }
    }else{
        return {dateIsValid: false}
    }
}

export function testarCC(nr) {
    while (nr.includes(' ')) {
        nr = nr.replace(' ', '');
    }
    var cartoes = {
        Elo: /^(((4011|4312|4389|4514|4576|5041|5066|5067|6277|6362|6504|6505|6550|6551|6554|6555)[0-9]{12})|(509[0-9]{2}[0-9]{12}))/,
        Visa: /^4(?:[0-9]{12}|[0-9]{15})$/,
        Mastercard: /^5[1-5][0-9]{14}/,
        Amex: /^3[47][0-9]{13}/,
        DinersClub: /^3(?:0[0-5]|[68][0-9])[0-9]{11}/,
        Discover: /^6(?:011|5[0-9]{2})[0-9]{12}/,
        JCB: /^(?:2131|1800|35\d{3})\d{11}/,
    };
    for (var cartao in cartoes) if (nr.match(cartoes[cartao])) return cartao;
    return null;
}

export const formatDate = (date) => {
    const dateArray = date.split("/")
    const finalDate = dateArray[2] + "-" + dateArray[1] + "-" + dateArray[0]
    return finalDate
}