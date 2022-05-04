import React, { useEffect, useState } from 'react';
import api from '../../Components/Connections/api';
import { useSelector } from 'react-redux';

import {
    Container,
    Button,
    Typography,
    Divider,
    TextField,
} from '@material-ui/core';
import { Delete, Add, AllInclusive, Edit, Check, Close } from '@material-ui/icons';


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
                <Typography style={{fontSize:19, color:"#454545" }}>Iniciando gerenciamento de Tipo</Typography><br/>
            </div>
            <div>
                {
                    getType.map((ty, index) => (
                        <div>
                            <Typography style={{fontSize:19, color:"#454545" }} >
                                Nome do Tipo:
                            </Typography>
                            
                            {
                                editField && putTypes == ty ?
                                    <div>
                                        <TextField
                                            key={ty}
                                            label="Editar nome do Tipo"
                                            value={nameType}
                                            onChange={(e) => setNmaeType(e.target.value)}
                                        />
                                        <Button style={{ marginBottom: 6 }} onClick={() => putType(ty)} variant="outlined" color="green"><Check style={{ width: '15px'}} /></Button>
                                        <Button style={{ marginBottom: 6 }} onClick={() => setEditField(!editField)} variant="outlined" color="danger"><Close style={{ width: '15px'}}/></Button>
                                    </div>
                                    :
                                    <div key={index}>
                                        <Typography>{ty}</Typography>
                                        <Button style={{ marginBottom: 6 }} onClick={() => handleEditField(ty)} variant="outlined" color="primary"><Edit style={{ width: '15px'}} /></Button>
                                        <Button style={{ marginBottom: 6 }} onClick={() => deleteType(ty)} variant="outlined" color="secondary"><Delete style={{ width: '15px'}} /></Button><Divider />
                                    </div>
                            }

                        </div>
                    ))

                }
            </div>
        </Container>
    )
}
