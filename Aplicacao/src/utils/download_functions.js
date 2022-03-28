import api from '../Components/Connections/api'

export async function downloadData(options) {
    const user = JSON.parse(localStorage.getItem('Auth_user')).name
    try {
        var resp = await api.get(`data?${options}&user=${user}`).catch(err => console.log(err))
        return resp.data
    } catch (erro) {
        console.log(erro)
        return null
    }
}

export async function download(options) {
    const user = JSON.parse(localStorage.getItem('Auth_user')).name
    try {
        var resp = await api.get(`${options}&user=${user}`).catch(err => console.log(err))
        return resp.data
    } catch (erro) {
        console.log(erro)
        return null
    }

}