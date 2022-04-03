import api from '../Components/Connections/api'

export async function downloadData(options) {
    const user = JSON.parse(localStorage.getItem('Auth_user')).uid
    try {
        var resp = await api.get(`data?${options}&login=${user}`).catch(err => console.log(err))
        return resp.data
    } catch (erro) {
        console.log(erro)
        return null
    }
}

export async function download(options) {
    const user = JSON.parse(localStorage.getItem('Auth_user')).uid
    try {
        var resp = await api.get(`${options}&login=${user}`).catch(err => console.log(err))
        return resp.data
    } catch (erro) {
        console.log(erro)
        return null
    }

}