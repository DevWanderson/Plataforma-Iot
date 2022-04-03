import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectSetor } from '../../Reducers/ReduxSetor/SetorActions';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
    DialogActions,
    Divider,
    TextField,
    Container,
    DialogContentText

} from '@material-ui/core';
import { Delete, Add, AllInclusive } from '@material-ui/icons';
import api from '../../Components/Connections/api'
import './styles.css'


export default function GerenciaSetor() {
    const selectedSetor = useSelector((state) => state.setorState.selectSetor)
    const setor = useSelector((state) => state.setorState.setor)
    const device = useSelector((state) => state.deviceState.selectedDevice)
    const userL = useSelector((state) => state.userState.userLogado)
    //var user = userL ? userL.uid : null


    const dispatch = useDispatch();
    

    const [nameSetor, setNameSetor] = useState([]);
    const [setorName, setSetorName] = useState([]);
    const [deleteConfirm, setDeleteConfirm] = useState(false);


    const openDelConfirm = (gerencia) => {
        setDeleteConfirm(true);
        setSetorName(gerencia)




    };

    const closeDelConfirm = () => {
        setDeleteConfirm(false);
    };


    async function handleDeleteDepartament(gerencia) {

        await api.delete(`departments?login=${userL.uid}&name=${setorName}`)
            .then((res) => {
                let newListSetor = setor.filter(item => item.gerencia !== gerencia)
                dispatch(selectSetor(newListSetor))
                closeDelConfirm()
                //alert(`Setor ${res.data} com sucesso`)
            })
            .catch((err) => {
                console.log('Erro ao deletar' + err)
            })
    }

    async function handleAddSetor() {
        if (nameSetor == '') {
            alert(`O campo setor não pode estar vazio`)
        } else {
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
    }

    return (
        <Container fluid className="containerSetor">
            <div className="adicinarSetor">
                <TextField className="campoAddSetor" required label="Setor" variant="outlined" value={nameSetor} onChange={(e) => setNameSetor(e.target.value)} />
                <button className='btnSetor' onClick={handleAddSetor} variant="outlined" color="primary"><Add />Cadastrar Setor</button>
            </div>
            {
                setor && setor.map((gerencia, index) => (
                    <div className="styleGerencia">
                        <Typography className="textStyle" key={index}>{gerencia}{index === 0 ? <AllInclusive style={{ fontSize: 35 }} /> : <Button style={{ marginBottom: 6 }} onClick={() => openDelConfirm(gerencia)} variant="outlined" color="secondary"> <Delete /></Button>}</Typography>
                        <Divider />
                    </div>
                ))
            }
            <Dialog
                open={deleteConfirm}
                onClose={closeDelConfirm}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Remoção de dispositivo</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Ao clicar em confirmar o alerta <strong>{setorName}</strong> será deletado.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDelConfirm} color="primary">
                        Cancelar
                    </Button>
                    {/* <Button onClick={closeDelConfirm, deleteDisp(dev)} color="primary" autoFocus> */}
                    <Button onClick={() => handleDeleteDepartament(setorName)} color="primary" autoFocus>
                        Confirmar
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    )
}