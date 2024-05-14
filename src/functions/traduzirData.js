export const traduzirData = (dataEmIngles) =>  {
    // Mapeamento dos dias da semana
    const diasSemana = {
        "Sun": "Domingo",
        "Mon": "Segunda-feira",
        "Tue": "Terça-feira",
        "Wed": "Quarta-feira",
        "Thu": "Quinta-feira",
        "Fri": "Sexta-feira",
        "Sat": "Sábado"
    };

    // Mapeamento dos meses
    const mesesAno = {
        "Jan": "Janeiro",
        "Feb": "Fevereiro",
        "Mar": "Março",
        "Apr": "Abril",
        "May": "Maio",
        "Jun": "Junho",
        "Jul": "Julho",
        "Aug": "Agosto",
        "Sep": "Setembro",
        "Oct": "Outubro",
        "Nov": "Novembro",
        "Dec": "Dezembro"
    };

    // Dividir a string da data em partes
    const partes = dataEmIngles.split(" ");
    const diaSemanaIngles = partes[0];
    const mesIngles = partes[1];
    const diaMes = partes[2];
    const ano = partes[3];

    // Traduzir os componentes da data
    const diaSemanaPortugues = diasSemana[diaSemanaIngles];
    const mesPortugues = mesesAno[mesIngles];

    // Construir a data traduzida
    const dataEmPortugues = `${diaSemanaPortugues}, ${diaMes} de ${mesPortugues} de ${ano}`;

    return dataEmPortugues;
}