import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectSetor } from '../../Reducers/ReduxSetor/SetorActions';
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
   
} from '@material-ui/core';
import { Delete, Add, AllInclusive } from '@material-ui/icons';
import api from '../../Components/Connections/api'
import './styles.css'


export default function Setor() {
    const selectedSetor = useSelector((state) => state.setorState.selectSetor)
    const setor = useSelector((state) => state.setorState.setor)
    const device = useSelector((state) => state.deviceState.selectedDevice)
    const userL = useSelector((state) => state.userState.userLogado)
    //var user = userL ? userL.uid : null


    const dispatch = useDispatch();

    const [open, setOpen] = useState(false);
    const [nameSetor, setNameSetor] = useState([])

    function handleClose() {
        setOpen(false)
    }

    function handleOpen() {
        setOpen(true)
    }

    async function handleDeleteDepartament(gerencia) {
        await api.delete(`departments?login=${userL.uid}&name=${gerencia}`)
            .then((res) => {
                let newListSetor = setor.filter(item => item.gerencia !== gerencia)
                dispatch(selectSetor(newListSetor))
                //alert(`Setor ${res.data} com sucesso`)
            })
            .catch((err) => {
                console.log('Erro ao deletar' + err)
            })
    }

    async function handleAddSetor() {
        const data = {
            name: nameSetor,
            dev_eui: device
        }
        await api.post(`new_department?login=${userL.uid}`, data)
            .then((res) => {
                    let newListAdd = setor.filter(item => item.data !== data)
                    dispatch(selectSetor(newListAdd))
                    setNameSetor('')
                    console.log(`Eviado com sucesso`)
            })
            .catch((err) => {
                console.log(`Erro ao enviar ${err}`)
            })
    }



    


    return (
        
            <FormControl variant='outlined' style={{ width: '60%', marginTop: 10, marginBottom: 10 }}>
                <InputLabel>Setor</InputLabel>
                <Select
                    value={selectedSetor}
                    onChange={(e) => dispatch(selectSetor(e.target.value))}
                    displayEmpty
                    label="Setor"
                    defaultValue={selectedSetor}

                >
                    {
                        setor && setor.map((s, index) => (
                            <MenuItem style={{ justifyContent: 'space-between' }} key={s} value={s}>{s} </MenuItem>
                        ))

                    }

                    
                </Select>
            </FormControl>
    )
}