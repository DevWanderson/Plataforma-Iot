import React, { useState, useEffect, createContext } from 'react';
import firebase from '../FirebaseConnection/firebaseConnection';
import api from '../../Components/Connections/api'
import {useDispatch} from 'react-redux'
import { userLogado } from '../../store/Modulos/Devices/actions';



export const AuthContext = createContext({});

function AuthProvider({ children }) {
    const redux = useState(state => state);

    const [user, setUser] = useState('');
    const [loadind, setLoading] = useState(true);
    const dispatch = useDispatch()

    const [userLocal, setUserLocal] = useState({ erro: 'não foi alterado' });

    async function loadingStorage() {
        const storageUser = await JSON.parse(localStorage.getItem('Auth_user')) || '';
        console.log(storageUser)
        if (storageUser != '') {
            setUser(storageUser);
            setLoading(false)
        }
        setLoading(false)
    }

    function getUserLocal() {
        let user = JSON.parse(localStorage.getItem('Auth_user'));
        return user
    }

    useEffect(() => {
        setUserLocal(getUserLocal())
    }, [])

    useEffect(() => {
        dispatch(userLogado(userLocal))
        console.log(userLocal)
        console.log(redux)
    }, [userLocal])

    useEffect(() => {
        loadingStorage()
    }, [])

    //função para logar o usuário 
    async function logar(email, password) {
        await firebase.auth().signInWithEmailAndPassword(email, password)
            .then(async (value) => {
                let uid = value.user.uid
                await firebase.database().ref('users').child(uid).once('value')
                    .then((snapshot) => {
                        let data = {
                            uid: uid,
                            name: snapshot.val().name,
                            lastName: snapshot.val().lastName,
                            email: value.user.email,
                        }
                        setUser(data);
                        storageUser(data)
                        
                        api.get(`/user?key=${uid}`)
                        .then((res) => {
                            setUser(res.data)
                            // dispatch(userLogado(res.data))
                            //alert(res.data)
                        })
                        .catch((err) =>{
                            alert(`Erro${err}`)
                        })

                        window.location.replace('/')

                    })

            })
            .catch((error) => {
                alert(error)
            })
    }

    //salvando dado no Storage
    async function storageUser(data) {
        await localStorage.setItem('Auth_user', JSON.stringify(data));
    }

    //deslogar usuario
    async function signOut() {
        await firebase.auth().signOut();
        await localStorage.removeItem('Auth_user')
        setUser(null);
        window.location.replace('/login')
    }

    //cadastrar usuario no firebase
    async function cadastro(email, password, name, enterprise, lastName) {
        await firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(async (value) => {
                let uid = value.user.uid;
                await firebase.database().ref('users').child(uid).set({
                    name: name,
                    lastName: lastName,
                    enterprise: enterprise
                })
                    .then(() => {
                        let data = {
                            uid: uid,
                            name: name,
                            lastName: lastName,
                            email: value.user.email,
                            enterprise: enterprise
                        }
                        setUser(data)
                        storageUser(data)
                        ////
                        let userInfo = {
                            key: uid,
                            user: name
                        }
                        api.post('/user', userInfo)
                            .then((res) => {
                                alert(`Eviado : ${res.data}`)
                            })
                            .catch((err) => {
                                alert(`Erro ao enviar ${err}`)
                            })

                        window.location.replace('/')
                    })
                    .catch((error) => {
                        console.log(`Erro aqui ${error}`)
                    })
            })
    }
    return (
        <AuthContext.Provider value={{ signed: !!user, user, cadastro, logar, signOut, loadind }}>
            {children}
        </AuthContext.Provider>
    )

}

export default AuthProvider;