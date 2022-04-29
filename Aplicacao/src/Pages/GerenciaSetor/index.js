import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectSetor, setor } from '../../Reducers/ReduxSetor/SetorActions';
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
    //const selectedSetor = useSelector((state) => state.setorState.selectSetor)
    const setorRedux = useSelector((state) => state.setorState.setor)
    const device = useSelector((state) => state.deviceState.selectedDevice)
    const userL = useSelector((state) => state.userState.userLogado)
    var user = userL ? userL.uid : null


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
    useEffect(()=> {
        getSetor()
    },[setorRedux])

    async function getSetor() {
        await api.get(`departments?login=${user}`)
            .then((res) => {
                dispatch(setor(res.data))
            })
            .catch((err) => {
                console.log(err)
            })
    }


    async function handleDeleteDepartament(gerencia) {

        await api.delete(`departments?login=${user}&name=${setorName}`)
            .then((res) => {
                let newListSetor = setorRedux.filter(item => item.gerencia !== gerencia)
                dispatch(setor(newListSetor))
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
            await api.post(`new_department?login=${user}`, data)
                .then((res) => {
                    let newListAdd = setorRedux.filter(item => item.data !== data)
                    dispatch(setor(newListAdd))
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
                setorRedux && setorRedux.map((gerencia, index) => (
                    <div className="styleGerencia" key={index}>
                        <Typography className="textStyle" >{gerencia}{index === 0 ? <AllInclusive style={{ fontSize: 35 }} /> : <Button style={{ marginBottom: 6 }} onClick={() => openDelConfirm(gerencia)} variant="outlined" color="secondary"> <Delete /></Button>}</Typography>
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