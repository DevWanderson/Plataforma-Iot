import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../../Store'
import ReqData from '../../Components/ReqData';


import Home from '../Home/index';

import CadastroTipo from '../CadastroTipo';
import CadastroEvery from '../CadastroEvery';
import CadastroMqtt from '../CadastroMqtt'
import Dispositivo from '../Dispositivos';
import Descricao from '../DescricaoDispositivo'
import Graph from '../Graph';
import Map from '../Map';
import Mqtt from '../Mqtt';
import DeviceDash from '../DeviceDashBoard/DeviceDash';
import Analytics from '../Analytics';
import Alerts from '../Alerts/Alerts'
import GerenciaAlertas from '../GerenciaAlertas';
import CadastroHttp from '../CadastroHttp';
import GerenciaSetor from '../GerenciaSetor';
import DrawerHeader from '../../Components/DrawerHeader';
import GerenciamentoTipo from '../GerenciamentoTipo';

export default function Router() {
    return (
        <Provider store={store}>
            {/* <ReqData /> */}
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
                <Route path="/gerenciamento-setor" component={GerenciaSetor}/>
                <Route path="/gerenciamento-tipo" component={GerenciamentoTipo}/>
                <Route component={Home} />
            </Switch>
        </Provider>
    );
}