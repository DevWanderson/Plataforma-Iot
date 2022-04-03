import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Login from '../User/Login';
import Cadastro from '../User/Cadastro';
import Load from '../../Components/Loading';



export default function RoutersAuth() {
    return (
            <Switch>
                <Route path="/login" exact component={Login} />
                <Route path="/cadastro" component={Cadastro} />
            </Switch>
    )
}