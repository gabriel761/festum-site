
export function formatReal(int2) {
        // console.log("valor antes da conversão: ",int)
        // var tmp = int+'';
        // tmp = tmp.replace(/([0-9]{2})$/g, ",$1");
        // if( tmp.length > 6 )
        //         tmp = tmp.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");
        // console.log("real brasileiro: ", tmp)
        // return tmp;
        int2 = parseFloat(int2)
        let int = int2.toFixed(2)
        console.log("valor antes da conversão: ",int)
        let valor = int + '';
        valor = parseInt(valor.replace(/[\D]+/g, ''));
        valor = valor + '';
        valor = valor.replace(/([0-9]{2})$/g, ",$1");

        if (valor.length > 6) {
                valor = valor.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");
        }
        console.log("real brasileiro: ", valor)
        return valor;
}


