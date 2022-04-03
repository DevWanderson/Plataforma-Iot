import api from '../Components/Connections/api'
export async function verificarExistenciaEUI(user, eui){
    let resultado = false
    
    await api.get(`devices?login=${user}&dev_eui=${eui}`)
        .then((res) => {
            console.log(`res.data: ${res.data}`)
            if(res.data != ''){
                resultado = true
            }
        })
        .catch((err) => {
            console.log(`catch: ${err}`)
            console.log("Resultado catch: "+resultado)                
        })
    return resultado
}