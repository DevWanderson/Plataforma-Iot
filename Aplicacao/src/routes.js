import React, { useState, useEffect } from 'react';
import { userLogado } from './Reducers/ReduxUser/UserActions';
import { CircularProgress } from '@material-ui/core';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import Store from './Store';
import { Provider, useDispatch, useSelector } from 'react-redux';
import firebase from './Components/FirebaseConnection/firebaseConnection';
import Header from './Components/Header'
import PathBar from './Components/PathBar';
import Combo from './Components/SelectDeviceCombo';


import Login from './Pages/User/Login';
import Cadastro from './Pages/User/Cadastro';


import Home from './Pages/Home/index';
import CadastroTipo from './Pages/CadastroTipo';
import CadastroEvery from './Pages/CadastroEvery';
import CadastroMqtt from './Pages/CadastroMqtt'
import Dispositivo from './Pages/Dispositivos';
import Descricao from './Pages/DescricaoDispositivo';
import Graph from './Pages/Graph';
import Map from './Pages/Map';
import Mqtt from './Pages/Mqtt';
import DeviceDash from './Pages/DeviceDashBoard/DeviceDash';
import Analytics from './Pages/Analytics';
import Alerts from './Pages/Alerts/Alerts'
import GerenciaAlertas from './Pages/GerenciaAlertas';
import CadastroHttp from './Pages/CadastroHttp';


export default function Routes() {
    const [isLoggedIn, setIsLoggenIn] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch();


    useEffect(() => {



        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                setIsLoggenIn(true);
                setIsLoading(false);

                firebase.database().ref('users').child(user.uid).on('value', async (snapshot) => {
                    let data = {
                        uid: user.uid,
                        name: snapshot.val().name,
                        lastName: snapshot.val().lastName,
                        email: user.email,
                    }

                    await localStorage.setItem('Auth_user', JSON.stringify(data));
                    dispatch(userLogado(data))

                    console.log(localStorage.getItem('Auth_user'))
                })
            }else {
                
                setIsLoggenIn(false);
                setIsLoading(false);
             
            }
        });
    }, [])
    return (
        <BrowserRouter>
            {
                isLoading && (
                    <CircularProgress style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
                )
            }

            {
                isLoggedIn ? (
                    <>

                        <Header />
                        <PathBar />
                        <Combo />
                        <Switch>
                            <Route path="/home" exact component={Home} />
                            <Route path="/dispositivos-cadastrados/cadastroEverynet/cadastroTipo" component={CadastroTipo} />
                            <Route path="/dispositivos-cadastrados/cadastroEverynet" component={CadastroEvery} />
                            <Route path="/dispositivos-cadastrados/cadastroMqtt" component={CadastroMqtt} />
                            <Route path="/dispositivos-cadastrados/descricao" component={Descricao} />
                            <Route path="/dispositivos-cadastrados" component={Dispositivo} />
                            <Route path="/graphic" component={Graph} />
                            <Route path="/mapa" component={Map} />
                            <Route path="/mqtt" component={Mqtt} />
                            <Route path="/dados-do-dispositivo" component={DeviceDash} />
                            <Route path="/analytics" component={Analytics} />
                            <Route path="/alertas" component={Alerts} />
                            <Route path="/gerenciamento-de-alertas" component={GerenciaAlertas} />
                            <Route path="/cadastro-http" component={CadastroHttp} />
                            <Route component={Home} />
                        </Switch>
                    </>
                ) :
                    (
                        <Switch>
                            <Route path="/login" exact component={Login} />
                            <Route path="/cadastro" component={Cadastro} />
                        </Switch>
                    )


            }
        </BrowserRouter>

    )

}