import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, TextField, Typography, Checkbox, FormControlLabel, Divider, Button } from '@material-ui/core';
import api from '../../Components/Connections/api';
import ReactJson from 'react-json-view';
import './style.css'

export default function EditType() {


    const editVar = useSelector((state) => state.editTypeState.editType)
    const [bytes, setBytes] = useState([]);
    const [editJSON, setEditJSON] = useState([])
    const userL = useSelector((state) => state.userState.userLogado)
    var user = userL ? userL.uid : null

    console.log(editJSON)

    async function putType(type) {
        await api.put(`types?login=${user}&type_name=${type}`, editJSON)
            .then((res) => {
                console.log(res.data)
                if (res.data === '') {
                    console.log('Erro ao editar')
                }
                else {
                    console.log('Editado com sucesso')
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }



    return (
        <Container>
            <ReactJson style={{ borderRadius: 5 }} onEdit={(e) => setEditJSON(e.updated_src)} src={editVar} theme="monokai" />
            <Button style={{ marginBottom: 6, marginTop:15, marginLeft:'92%', background:'#0C6B35', color:'#FFF' }} onClick={() => putType(editVar.name)} variant="outlined">Salvar</Button>
        </Container>
    )
}