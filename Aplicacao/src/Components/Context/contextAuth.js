import React, { useState, useEffect, createContext } from 'react';
import firebase from '../FirebaseConnection/firebaseConnection';
import api from '../../Components/Connections/api'
import { useDispatch } from 'react-redux'
import { userLogado } from '../../Reducers/ReduxUser/UserActions';




export const AuthContext = createContext({});

function AuthProvider({ children }) {
    
    const [user, setUser] = useState('');
    const [loadind, setLoading] = useState(true);
    const [openSnack, setOpenSnak] = useState(false);
    const dispatch = useDispatch()

    const [userLocal, setUserLocal] = useState({ erro: 'não foi alterado' });

    async function loadingStorage() {
        const storageUser = await JSON.parse(localStorage.getItem('Auth_user')) || '';
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

    }, [userLocal])

    useEffect(() => {
        loadingStorage()
    }, [])

    function handleOpenSnack() {
        setOpenSnak(true)
    }

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

                        api.get(`/user?login=${uid}`)
                            .then((res) => {
                                setUser(res.data)
                                // dispatch(userLogado(res.data))
                                //alert(res.data)
                            })
                            .catch((error) => {
                                /* switch(err.code){
                                    case 'auth/insufficient-permission':
                                        alert('Erro de senha')
                                } */
                                //alert(`Erro${err}`)
                                console.log(error)
                            })

                        window.location.replace('/home')

                    })

            })
            .catch((error) => {
                //alert(error)

                switch (error.code) {
                    case 'auth/wrong-password':
                        alert('senha invalida')
                        //<ErroSnack vertical="top" horizontal="right" openSnack={openSnack} descriptionErro="Senha invalida" />
                        break

                    case 'auth/user-not-found':
                        alert('Email não cadastrado')
                        break
                    case 'auth/too-many-requests':
                        alert('Senha ou email digitado errado')
                        //<ErroSnack vertical="top" horizontal="right" openSnack={openSnack}  descriptionErro="Senha ou e-mail incorretos"/>
                        break
                    case 'auth/app-deleted':
                        alert('Conta deleta ou desativada')
                        break
                    case 'auth/app-not-authorized':
                        alert('Aplicação não autirizada a utilizar esta canal')
                        break
                    case 'auth/argument-error':
                        alert('Argumento digitado, está incorreto')
                        break
                    case 'auth/invalid-api-key':
                        alert('API Key digitado incorretamente')
                        break
                    case 'auth/network-request-failed':
                        alert('Erro de conexão')
                        break
                    case 'auth/user-disabled':
                        alert('Sua conta foi desativada por administrador')
                        break
                    case 'auth/email-already-in-use':
                        alert('O endereço de e-mail já está sendo usado por outra conta.')
                        break
                    default:
                        alert(error.code)
                }
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

    //Recuperar senha 
    async function recoverPassword(email){
        await firebase.auth().sendPasswordResetEmail(email)
        .then(() =>{
            alert(`Verifique sua caixa de e-mail`)
        })
        .catch((err) =>{
            var errorCode = err.code;
            var errorMessage = err.message;
            console.log(errorCode)
            console.log(errorMessage)

        })
    }

    //cadastrar usuario no firebase
    async function cadastro(email, password, name, enterprise, lastName) {
        await firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(async (value) => {
                let uid = value.user.uid;
                let userInfo = {
                    key: uid,
                    user: name
                }
                api.post('/user', { key: userInfo.key, user: userInfo.user })// Cadastro mongo
                    .then((res) => {
                        alert(`Eviado : ${res.data}`)
                    }) 
                    .catch((error) => {
                        console.log(error)
                    })
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
                        

                        window.location.replace('/home')
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            })
            .catch((error) =>{
                switch (error.code) {
                    case 'auth/email-already-in-use':
                        alert('O endereço de e-mail já está sendo usado por outra conta.')
                        break
                    case 'auth/weak-password':
                        alert('Senha deve contar no minimo 8 caracteres')
                    break
                    case 'auth/invalid-email':
                        alert('E-mail invalido')
                    break
                    default:
                        alert(error.code)
                }
            })
    }
    return (
        <AuthContext.Provider value={{ signed: !!user, user, cadastro, logar, signOut, recoverPassword, loadind }}>
            {children}
        </AuthContext.Provider>
    )

}

export default AuthProvider;