

const storeData = (key, value) => {
    try {
        const jsonValue = JSON.stringify(value);
        localStorage.setItem(key, jsonValue);
    } catch (e) {
        console.log("localStorage error storing data: ", e);
    }
};

const getData = async (key) => {
    try {
        const jsonValue= await localStorage.getItem(key)
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        console.log("async storage error getting data: ", e)
    }
}
 
const removeData = async (key) => {
    try{
        await localStorage .removeItem(key)
    }catch(e){
        console.log("async storage error removing data: ", e)
    }
}

export  {storeData, getData, removeData}