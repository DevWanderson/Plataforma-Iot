import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../../store'
import Header from '../../Components/Header'
import PathBar from '../../Components/PathBar';
import Combo from '../../Components/SelectDeviceCombo';


import Home from '../Home/index';

import CadastroTipo from '../CadastroTipo';
import CadastroEvery from '../CadastroEvery';
import CadastroMqtt from '../CadastroMqtt'
import Dispositivo from '../Dispositivos';
import Descricao from '../DescricaoDispositivo'
import Graph from '../Graph';
import Map from '../Map';
import Mqtt from '../Mqtt';
import Load from '../../Components/Loading';
import DeviceDash from '../DeviceDashBoard/DeviceDash';
import Analytics from '../Analytics';
import Alerts from '../Alerts/Alerts'
import Forecast from '../Forecast';

export default function Router() {
    return (
        <Provider store={store}>
            <Header />
            <PathBar />
            <Combo />
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/dispositivos-cadastrados/cadastroEverynet/cadastroTipo"  component={CadastroTipo} />
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
                <Route path="/forecast" component={Forecast}/>
                <Route component={Home}/> 
            </Switch>

        </Provider>
    );
}