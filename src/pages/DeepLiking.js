const DeepLinking = () => {
    const redirecionamento = () => {
        window.location.href = "festum://"
    }
    const redirecionamentoLogin = () => {
        window.location.href = "festum://--/login"
    }
    return ( 
        <div>
            <p>redirecionamento</p>
            <button onClick={redirecionamento}>redirecionar teste</button>
            <button onClick={redirecionamentoLogin}>redirecionar teste Login</button>
        </div>
     );
}
 
export default DeepLinking;