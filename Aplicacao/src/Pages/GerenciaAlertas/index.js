import React, { useState, useEffect, useCallback } from 'react';
import api from '../../Components/Connections/api';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { alertas } from '../../Reducers/ReduxGerenciamentoAlerts/AlertGeActions';
import InfoTelegram from '../../Components/InfoTelegram';
import {
    Container,
    Table,
    TableCell,
    TableBody,
    TableHead,
    Button,
    Typography,
    TableRow,
    TableContainer,
    Paper,
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent,
    DialogContentText,


} from '@material-ui/core';
import './styles.css';
import { Delete, Add } from '@material-ui/icons';
import Combo from '../../Components/SelectDeviceCombo';

export default function GerenciaAlertas() {
    const userUID = JSON.parse(localStorage.getItem('Auth_user')).uid
    const selectedSetor = useSelector((state) => state.setorState.selectSetor);
    const alertasGerencia = useSelector((state) => state.alertasState.alertas);
    //const [alertas, setAlertas] = useState([]);
    const [message, setMessage] = useState(false);
    const [contentMessage, setContentMessage] = useState([])
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [disp, setDisp] = useState([])
    const [nome, setNome] = useState([])
    const dispatch = useDispatch();


    const openMessage = () => {
        setMessage(true);
    };

    const closeMessage = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setMessage(false);
    };

    const openDelConfirm = (device, name) => {
        setDeleteConfirm(true);
        setDisp(device);
        setNome(name);

    };

    const closeDelConfirm = () => {
        setDeleteConfirm(false);

    };




    async function handleAlerts() {
        await api.get(`alerts?login=${userUID}&department=${selectedSetor}`)
            .then((res) => {
                dispatch(alertas(res.data))
                //setAlertas(res.data);

            })
            .catch((err) => {
                console.log(err)
            })
    }
    useEffect(() => {
        handleAlerts()

    }, [disp, nome, selectedSetor, alertasGerencia])






    function sinais(alerta) {
        if (alerta === 'gt') {
            console.log('aqui maior')

        }
        if (alerta === 'lt') {
            console.log('aqui menor')

        }
    }

    async function handleDelete(device, name) {
        await api.delete(`alerts?login=${userUID}&dev_eui=${disp}&name=${nome}`)
            .then((res) => {
                let newList = alertasGerencia.filter(item => item.device !== device)
                //setAlertas(newList)
                dispatch(alertas(newList))
                closeDelConfirm()
                if (res.data == '') {
                    console.log("Erro ao deletar")
                    setContentMessage({ msg: "Erro ao deletar o dispositivo " + nome + "!", severity: "error" })
                    openMessage()
                }
                //React irá pra abrir a rota dos dispositivos-cadastrados                                

                console.log("Alerta deletado com sucesso")
                openMessage()
                setContentMessage({ msg: "Dispositivo  deletado com sucesso!", severity: "success" })
                console.log(res.data)

            })
            .catch((err) => {
                console.log(`Erro ${err}`)
                setContentMessage({ msg: "Erro ao deletar o alerta " + nome + "!", severity: "error" })
                openMessage()
            })
    }

    return (
        <Container fluid >
            <div style={{display:'flex', justifyContent:'flex-end', marginRight:-60}}>
                <Combo />
            </div>
            <InfoTelegram />
            <div className='btnAddNewAlert'>
                <Link to="/alertas" style={{ textDecoration: 'none', color: '#FFF' }}>
                    <button><Add />Criar Novo Alerta</button>
                </Link>
            </div>
            <div className="tabela">
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Nome do dispositivo</TableCell>
                                <TableCell align="center">Nome do alerta</TableCell>
                                <TableCell align="center">Lógica de alertas</TableCell>
                                <TableCell align="center">Alerta em</TableCell>
                                <TableCell align="center">Mensagem</TableCell>
                                <TableCell align="center">Deletar</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                alertasGerencia && alertasGerencia.map((alerta, index) => (
                                    <>
                                        <TableRow key={index} >
                                            <TableCell align="center">{alerta.device}</TableCell>
                                            <TableCell align="center">{alerta.name}</TableCell>
                                            <TableCell align="center">{`${alerta.arg_1} ${alerta.if} ${alerta.arg_2}`}</TableCell>
                                            <TableCell align="center">Telegram</TableCell>
                                            <TableCell align="center">{alerta.msg}</TableCell>
                                            <TableCell align='center'><Button variant="outlined" color="secondary" style={{backgroundColor: '#FF1616', color:'#fff',borderRadius:'50px',padding:'17px'}} onClick={() => openDelConfirm(alerta.device, alerta.name)}><Delete /></Button></TableCell>
                                        </TableRow>
                                    </>
                                ))
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>

            <Dialog
                open={deleteConfirm}
                onClose={closeDelConfirm}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Remoção de dispositivo</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Ao clicar em confirmar o alerta <strong>{nome}</strong> será deletado.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDelConfirm} color="primary">
                        Cancelar
                    </Button>
                    {/* <Button onClick={closeDelConfirm, deleteDisp(dev)} color="primary" autoFocus> */}
                    <Button onClick={() => handleDelete(nome, disp)} color="primary" autoFocus>
                        Confirmar
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    )
}
