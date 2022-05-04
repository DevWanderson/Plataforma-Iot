import React, { useEffect, useState } from 'react';
import api from '../../Components/Connections/api';
import { useDispatch, useSelector } from 'react-redux';

import {
    Container,
    Typography
} from '@material-ui/core';


export default function GerenciamentoTipo() {

    const [getType, setGetType] = useState([]);
    const [putTypes, setPutTypes] = useState('');
    const [deleteTypes, setDeleteTypes] = useState('');
    const [editField, setEditField] = useState(false);

    const dispatch =  useDispatch();
    const userL = useSelector((state) => state.userState.userLogado)
    var user = userL ? userL.uid : null


    useEffect(() => {
        getTypes();
    }, [])

    async function deleteType(tipo){
        console.log(tipo)
        await api.get(`types?login=${user}&type=${tipo}`)
        .then((res) =>{
            /* let newList = getType.filter(item =>  item.data !== tipo)
            setGetType(newList) */
            console.log('sucesso')
            console.log(res.data)
        })
        .catch((err) =>{
            console.log(err)
        })
    }

    async function putType(dev){
        console.log(dev)
        await api.put(`types?login=${user}&type=${putTypes}`)
        .then((res) =>{
            if(res.data == ''){
                console.log('Erro ao editar')
            }
            else{
                console.log('Editado com sucesso')
            }
        })
        .catch((err) =>{
            console.log(err)
        })
    }

    async function getTypes() {
        await api.get(`types?login=${user}`)
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
                <button onClick={() => putType(tipo)} >Atualizar</button>
                <button onClick={() => deleteType(tipo)}>Delete</button>
            </div>
        )
    }

    return (
        <Container>
            <div>
                <Typography>Iniciando gerenciamento de Tipo</Typography>
            </div>
            <div>

                {
                editField && 
                getType.map(typesMap)}
            </div>
        </Container>
    )
}
