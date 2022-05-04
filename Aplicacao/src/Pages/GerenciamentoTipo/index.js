import React, { useEffect, useState } from 'react';
import api from '../../Components/Connections/api';
import { useDispatch, useSelector } from 'react-redux';

import {
    Container,
    Typography
} from '@material-ui/core';


export default function GerenciamentoTipo() {

    const [getType, setGetType] = useState([]);

    const dispatch =  useDispatch();
    const userL = useSelector((state) => state.userState.userLogado)
    var user = userL ? userL.uid : null


    useEffect(() => {
        getTypes();
    }, [])

    async function deleteType(){
        await api.get(`types?login=${user}`)
        .then((res) =>{

        })
        .catch((err) =>{
            console.log(err)
        })
    }

    async function putType(){
        await api.put(`types?login=${user}`)
        .then((res) =>{

        })
        .catch((err) =>{
            console.log(err)
        })
    }

    async function getTypes() {
        await api.get(`types`)
            .then((res) => {
                setGetType(res.data)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const typesMap = (tipo, index) => {
        return (
            <div key={index}>
                <Typography>{tipo}</Typography>
            </div>
        )
    }

    return (
        <Container>
            <div>
                <Typography>Iniciando gerenciamento de Tipo</Typography>
            </div>
            <div>
                {getType.map(typesMap)}
            </div>
        </Container>
    )
}
