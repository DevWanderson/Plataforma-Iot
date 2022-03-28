import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from './Pages/Home/index';
import Dashboard from './Pages/Dashboard';
import Tabela from './Pages/Table';
import CadastroTipo from './Pages/CadastroTipo';
import CadastroEvery from './Pages/CadastroEvery';
import CadastroMqtt from './Pages/CadastroMqtt'
import Dispositivo from './Pages/Dispositivos';
import Descricao from './Pages/DescricaoDispositivo'
import Graph from './Pages/Graph';
import Map from './Pages/Map';
import Mqtt from './Pages/Mqtt';
import DeviceDash from './Pages/DeviceDashBoard/DeviceDash';
import Login from './Pages/User/Login';
import Cadastro from './Pages/User/Cadastro';
import DeviceDash from './Pages/DeviceDashBoard/DeviceDash';

export default function Router() {
    return (
        <Switch>
            <Route path="/login" exact component={Login} />
            <Route path="/cadastro" component={Cadastro} />
            <Route path="/home" component={Home} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/tabela" component={Tabela} />
            <Route path="/cadastro/cadastroTipo" component={CadastroTipo} />
            <Route path="/cadastroEverynet" component={CadastroEvery} />
            <Route path="/cadastroMqtt" component={CadastroMqtt} />
            <Route path="/dispositivos-cadastrados/descricao" component={Descricao} />
            <Route path="/dispositivos-cadastrados" component={Dispositivo} />
            <Route path="/graphic" component={Graph} />
            <Route path="/mapa" component={Map} />
            <Route path="/mqtt" component={Mqtt} />
            <Route path="/dados-do-dispositivo" component={DeviceDash} />
        </Switch>
    );
}