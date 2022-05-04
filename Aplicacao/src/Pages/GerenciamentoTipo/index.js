import React, { useEffect, useState } from 'react';
import api from '../../Components/Connections/api';
import { useSelector } from 'react-redux';

import {
    Container,
    Typography,
    TextField
} from '@material-ui/core';


export default function GerenciamentoTipo() {

    const [getType, setGetType] = useState([]);
    const [putTypes, setPutTypes] = useState('');
    const [deleteTypes, setDeleteTypes] = useState('');
    const [editField, setEditField] = useState(false);
    const [nameType, setNmaeType] = useState('');
    const userL = useSelector((state) => state.userState.userLogado)
    var user = userL ? userL.uid : null


    useEffect(() => {
        getTypes();
    }, [getType])

    async function deleteType(tipo) {
        //console.log(tipo)
        await api.delete(`types?login=${user}&type=${tipo}`)
            .then((res) => {
                /* let newList = getType.filter(item =>  item.data !== tipo)
                setGetType(newList) */
                console.log('sucesso')
                console.log(res.data)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    async function putType(type) {
        const data = {
            name: nameType
        }
        await api.put(`types?login=${user}&type=${type}`, data)
            .then((res) => {
                if (res.data === '') {
                    console.log('Erro ao editar')
                }
                else {
                    console.log('Editado com sucesso')
                    setEditField(false)
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }

    async function handleEditField(tipo) {
        console.log(tipo)
        setEditField(true)
        setNmaeType(tipo)
        setPutTypes(tipo)
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



    return (
        <Container>
            <div>
                <Typography>Iniciando gerenciamento de Tipo</Typography>
            </div>
            <div>
                {
                    getType.map((ty, index) => (
                        <div>
                            <Typography>
                                Nome do Tipo:
                            </Typography>
                            {
                                editField && putTypes == ty ?
                                    <div >
                                        <TextField
                                            key={ty}
                                            label="Editar nome do Tipo"
                                            value={nameType}
                                            onChange={(e) => setNmaeType(e.target.value)}
                                        />
                                        <button onClick={() => putType(ty)}>Salvar</button>
                                        <button onClick={() => setEditField(!editField)}>Cancelar</button>
                                    </div>
                                    :
                                    <div key={index}>
                                        <Typography>{ty}</Typography>
                                        <button onClick={() => handleEditField(ty)} >Editar</button>
                                        <button onClick={() => deleteType(ty)}>Delete</button>
                                    </div>
                            }

                        </div>
                    ))

                }
            </div>
        </Container>
    )
}
