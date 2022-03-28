import axios from 'axios';

const api = axios.create({

    // baseURL: 'http://192.168.1.242:8000/'
    // baseURL:'http://161.97.133.47:8000/'
    // baseURL: 'http://pitunnel.com:12640/'
     baseURL: 'http://52.179.6.118:8000'
    // baseURL:'http://12://161.97.133.47:8000/7.0.0.1:8000'

})

export default api;