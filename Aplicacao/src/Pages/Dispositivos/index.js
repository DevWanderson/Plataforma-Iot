import React, { useEffect, useState } from 'react';
import { stampToDate } from '../../Utils/timeStampToDate'
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux'
import api from '../../Components/Connections/api'
import './styles.css';
import { Link, Redirect } from 'react-router-dom';
import MuiAlert from '@material-ui/lab/Alert';
import DoneIcon from '@material-ui/icons/Done';
import Clear from '@material-ui/icons/Clear';
import { atualizarDevices } from '../../Reducers/ReduxDevices/DeviceActions'
import { selecionarDevice } from '../../Reducers/ReduxDevices/DeviceActions';
import ModalConexoes from '../../Components/ModalConexoes/ModalConexoes';
import Load from '../../Components/Loading';
import Combo from '../../Components/SelectDeviceCombo';
import {
    Container,
    Card,
    CardActions,
    CardContent,
    Typography,
    Button,
    TextField,
    FormControl,
    InputAdornment,
    Slide,
    AppBar,
    Toolbar,
    List,
    ListItem,
    IconButton,
    ListItemText,
    Divider,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Snackbar,
    Tooltip,
    MenuItem,
    InputLabel,
    Select
} from '@material-ui/core';
import {
    Search,
    Edit,
    Delete,
    Add,
    LocationOn,
    Router,
    HelpOutline,
    Close,
    DeveloperBoardRounded,
} from '@material-ui/icons';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import DeveloperBoardIcon from '@material-ui/icons/DeveloperBoard';

const useStyles = makeStyles((theme) => ({
    cards: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        // flexWrap: 'wrap',
        marginBottom: '20px',
        boxShadow: '1px 1px 2px 1px rgba(0,0,0,0.21)',
        borderRadius: '10px',
    },
    buttons: {
        borderRadius: '15px',
        width: '120px',
        height: '35px',
        padding: '10px'
    },
    cardContent: {
        width: '80%',
        padding: '15px',
    },
    cardActions: {
        display: 'flex',
        // flex: 1,
        flexDirection: 'column',
        alignSelf: 'stretch',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        width: '20%',
    },
    formfield: {
        // display: 'flex',
        // flexDirection: 'row',
        // justifyContent: 'flex-end',
    },
    form: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textIput: {
        marginTop: '15px',
        borderRadius: 100,
        width: '45%',
        borderRadius: 100,
    },
    appBar: {
        position: 'relative',
        backgroundColor: '#262626'
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    btnConfirm: {
        marginLeft: 5,
        backgroundColor: '#23A14E',
        padding: '5px',
        borderRadius: '5px',
        color: '#fff',
        '&:hover': {
            backgroundColor: '#23A14E',
            color: '#fff',
        },
    },
    btnCancel: {
        marginLeft: 5,
        backgroundColor: '#a73636',
        padding: '5px',
        borderRadius: '5px',
        color: '#fff',
        '&:hover': {
            backgroundColor: '#a73636',
            color: '#fff',
        },
    },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function Dispositivos() {
    const req = useSelector((state) => state.loadState.statusLoad)
    const selectedDevice = useSelector((state) => state.deviceState.selectedDevice);
    const setorDados = useSelector((state) => state.setorState.dadosSetor);
    const devices = useSelector((state) => state.deviceState.devices);
    const dispatchDevices = useDispatch()
    const [filterDevice, setFilterDevice] = useState('');
    const [filteredCountries, setFilteredCounries] = useState([]);
    const [open, setOpen] = useState(false);
    const [editSetor, setEditSetor] = useState();
    const setor = useSelector((state) => state.setorState.setor);
    const selectedSetor = useSelector((state) => state.setorState.selectSetor)




    useEffect(() => {
        setFilteredCounries(
            setorDados.filter(coutry => {

                return coutry.name.toLowerCase().includes(filterDevice.toLowerCase())
                    || coutry.type.toLowerCase().includes(filterDevice.toLowerCase())

            })
        );



    }, [filterDevice, setorDados])




    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const [name, setName] = React.useState('')
    const [deleteConfirm, setDeleteConfirm] = React.useState(false);
    const [euiCurrent, setEuiCurrent] = React.useState(''); //dispositivo eui que irá para confirmação para deletar.
    const [fieldEdit, setFieldEdit] = React.useState(false);
    const [validacaoSetor, setValidacaoSetor] = useState('')

    const closeFieldEdit = () => {
        setFieldEdit(false)
    }

    const openFieldEdit = (dev) => {
        setFieldEdit(true)
        setName(dev.name)
        setEuiCurrent(dev.device);
        setEditSetor(dev);
    }





    const openDelConfirm = (eui) => {

        setDeleteConfirm(true);
        setEuiCurrent(eui);
    };

    const closeDelConfirm = () => {
        setDeleteConfirm(false);
    };

    const classes = useStyles();

    function foundIcon(typeDevice) {
        return typeDevice === "gps_dragino_v2" ||
            typeDevice === "android_gps" ? <LocationOn style={{ fontSize: 40, cursor: 'pointer' }} color="error" /> :
            typeDevice === "temp" ? <Router style={{ color:'#004AAD', fontSize: 40, cursor: 'pointer' }} color="primary" /> : <DeveloperBoardIcon style={{ color:'#545454', fontSize: 40, cursor: 'pointer' }} />
    }

    const clearCampo = () => {
        setFilterDevice('')
    }

    async function updateDisp(dev) {
        let eui = dev.device
        const user = JSON.parse(localStorage.getItem('Auth_user')).uid
        alert(`Aqui ${JSON.parse(localStorage.getItem('Auth_user')).uid}`)


        const data = {
            name: name,
        }
        closeFieldEdit();
        await api.put(`/devices?login=${user}&dev_eui=${eui}`, data)
            .then((res) => {
                // closeLoading() //fecha o círculo de loading
                if (res.data == '') {
                    console.log("Erro ao editar")
                    setContentMessage({ msg: "Erro ao editar o dispositivo " + eui, severity: "error" })
                    openMessage()
                } else {
                    console.log("Dispositivo editado com sucesso")
                    setContentMessage({ msg: "Dispositivo " + eui + " editado com sucesso!", severity: "success" })
                    openMessage()
                    clearCampo()
                    listDevices(user)
                    dispatchDevices(selecionarDevice(''))

                }

            })
            .catch((err) => {
                // closeLoading() //fecha o círculo de loading
                console.log(err)
                setContentMessage({ msg: "Erro ao editar o dispositivo " + eui, severity: "error" })
                openMessage()
            })
    }

    async function handleSelectSetor(dev) {
        const user = JSON.parse(localStorage.getItem('Auth_user')).uid
        var data = {
            name: editSetor,
            dev_eui: dev
        }
        await api.post(`departments?login=${user}`, data)
            .then((res) => {
                console.log(`Sucesso ${res.data}`)
                openMessage()
                clearCampo()
                listDevices(user)
                dispatchDevices(selecionarDevice(''))
                closeFieldEdit()

            })
            .catch((err) => {
                console.log(err);
            })
    }



    async function listDevices(user) {
        await api.get(`devices?login=${user}`)
            .then((res) => {
                if (devices === '') {
                    const devices = res.data.map(dev => ({ device: dev[0], ...dev[1] }))
                    dispatchDevices(atualizarDevices(devices))

                }

            })
            .catch((err) => {
                console.log(err)
            })
    }

    async function deleteDisp() {
        closeDelConfirm()
        const user = JSON.parse(localStorage.getItem('Auth_user')).uid
        setFilterDevice('')
        dispatchDevices(selecionarDevice(''))

        await api.delete('/devices?login=' + user + '&dev_eui=' + euiCurrent)
            .then((res) => {
                // closeLoading() //fecha o círculo de loading
                if (res.data == '') {
                    console.log("Erro ao deletar")
                    setContentMessage({ msg: "Erro ao deletar o dispositivo " + euiCurrent + "!", severity: "error" })
                    openMessage()
                }
                //React irá pra abrir a rota dos dispositivos-cadastrados                                

                console.log("Dispositivo deletado com sucesso")
                openMessage()
                setContentMessage({ msg: "Dispositivo " + euiCurrent + " deletado com sucesso!", severity: "success" })

                listDevices(user)

            })
            .catch((err) => {
                // closeLoading() //fecha o círculo de loading
                console.log(err)
                setContentMessage({ msg: "Erro ao deletar o dispositivo " + euiCurrent + "!", severity: "error" })
                openMessage()
            })
    }

    /////////////// Message /////////////////////
    const [contentMessage, setContentMessage] = React.useState([])
    const [message, setMessage] = React.useState(false);

    const openMessage = () => {
        setMessage(true);
    };

    const closeMessage = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setMessage(false);
    };
    /////////////////////////////////////////////

    const LightTooltip = withStyles((theme) => ({
        tooltip: {
            backgroundColor: theme.palette.common.black,
            color: 'white',
            boxShadow: theme.shadows[1],
            fontSize: 11,
        },
    }))(Tooltip);

    return (
        <React.Fragment>
            <div style={{display:'flex', justifyContent:'flex-end', marginRight:-60}}>
                <Combo/>
            </div>
            {req ?
                <Load />
                :
                <Container fluid>
                  
                        {
                            <div>
                                <FormControl className={(classes.form)} >
                                    <TextField
                                        className={(classes.textIput)}
                                        label="Pesquisar Dispositivo"
                                        variant="outlined"
                                        value={filterDevice}
                                        type="search"
                                        onChange={e => setFilterDevice(e.target.value)}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Search />
                                                </InputAdornment>
                                            )
                                        }} />
                                </FormControl>
                            </div>
                        }
                        {
                            <div className="divAddButton">
                                <button onClick={handleClickOpen} className="bt btAdd"><Add style={{ margin: 'auto', color: 'white' }} /> Dispositivo</button>
                            </div>
                        }
                    {
                        (filteredCountries.length > 0) ? filteredCountries.map((dev) => (
                            <Card key={dev.name} className={classes.cards}>
                                <CardContent className={classes.cardContent}>
                                    <Typography className="dataDevices" display="inline">
                                        Nome do Dispositivo:
                                    </Typography>

                                    {fieldEdit && euiCurrent == dev.device ?
                                        <span /* onBlur={(e) => {
                                            if (!e.currentTarget.contains(e.relatedTarget)) {
                                                // Não acionado ao clicar no button "Editar"                                           
                                                closeFieldEdit()
                                            }
                                        }} */
                                        >
                                            <span className={classes.formfield}>
                                                <TextField
                                                    style={{ paddingLeft: 7 }}
                                                    autoFocus
                                                    value={name} //O name do dev deve ficar no value                                                                                                                            
                                                    onChange={(e) => setName(e.target.value)}
                                                />
                                                <LightTooltip title="Editar" aria-label="editar" placement="left-start">
                                                    <IconButton variant="contained" onClick={() => { updateDisp(dev) }} className={classes.btnConfirm}>
                                                        <DoneIcon />
                                                    </IconButton>
                                                </LightTooltip >
                                                <LightTooltip title="Cancelar" aria-label="cancelar" placement="left-start">
                                                    <IconButton variant="contained" onClick={() => closeFieldEdit()} className={classes.btnCancel}>
                                                        <Clear />
                                                    </IconButton>
                                                </LightTooltip >
                                            </span>
                                        </span>
                                        :
                                        <Typography className="dataDevices" display="inline" to={{ pathname: "/dispositivos-cadastrados/descricao", state: dev }}>
                                            <span id={'name-eui_' + dev.device}> {dev.name} </span>
                                        </Typography>
                                    }

                                    <Typography className="dataDevices" display="inline"><br />
                                        Setor:
                                    </Typography>
                                    {fieldEdit && euiCurrent == dev.device ?
                                        <span /* onBlur={(e) => {
                                            if (!e.currentTarget.contains(e.relatedTarget)) {
                                                // Não acionado ao clicar no button "Editar"                                           
                                                closeFieldEdit()
                                            }
                                        }} */
                                        >
                                            <span className={classes.formfield}>
                                                <FormControl>
                                                    <InputLabel></InputLabel>
                                                    <Select
                                                        style={{ color:'#858585',paddingLeft: 7, top: -20 }}
                                                        native
                                                        defaultValue={dev.department}
                                                        //value={dev.department}
                                                        onChange={(e) => setEditSetor(e.target.value)}
                                                    >
                                                        {
                                                            setor && setor.map((s, index) => (
                                                                <option key={index} value={s}>{s}</option>
                                                            ))
                                                        }
                                                    </Select>
                                                </FormControl>
                                                <LightTooltip title="Editar" aria-label="editar" placement="left-start">
                                                    <IconButton variant="contained" onClick={() => handleSelectSetor(dev.device)} className={classes.btnConfirm}>
                                                        <DoneIcon />
                                                    </IconButton>
                                                </LightTooltip >
                                                <LightTooltip title="Cancelar" aria-label="cancelar" placement="left-start">
                                                    <IconButton variant="contained" onClick={() => closeFieldEdit()} className={classes.btnCancel}>
                                                        <Clear />
                                                    </IconButton>
                                                </LightTooltip >

                                            </span>
                                        </span>
                                        :
                                        <span > {dev.department == null && setor.length > 0 ? 'Todos' : dev.department} </span>
                                    }



                                    <Typography className="dataDevices" >
                                        Status: <span>{dev.status != 1 ? 'Inativo' : 'Ativo'}</span>
                                    </Typography>
                                    <Typography className="dataDevices">
                                        Data de Ativação: <span>{stampToDate(dev.act_date)}</span>
                                    </Typography>
                                    <Typography className="dataDevices">
                                        Tipo de Dispositivo: <span>{dev.type}</span>
                                    </Typography>
                                    <Typography className="dataDevices">
                                        EUI:  <span>{dev.device}</span>
                                    </Typography>
                                </CardContent>
                                <CardActions className={classes.cardActions} >
                                    <div>
                                        <Link onClick={(() => { dispatchDevices(selecionarDevice(dev.device)) })} to={"/dados-do-dispositivo"}>{ }{foundIcon(dev.type)}</Link>
                                    </div>
                                    <div className="cardBtn">
                                        <button className="bt btOptionsUpdate" onClick={() => { openFieldEdit(dev) }}>
                                            <Edit style={{ width: '15px' }} />
                                        </button>
                                        <button className="bt btOptionsDelete" onClick={() => { openDelConfirm(dev.device) }}>
                                            <Delete style={{ width: '15px' }} />
                                        </button>
                                    </div>
                                </CardActions>
                            </Card>
                        )) :
                            <h1>Nenhum resultado encontrado</h1>
                    }

                    <div>
                        <Dialog
                            open={deleteConfirm}
                            onClose={closeDelConfirm}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">Remoção de dispositivo</DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    Ao clicar em confirmar o dispositivo com EUI <strong>{euiCurrent}</strong> será deletado.
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={closeDelConfirm} color="primary">
                                    Cancelar
                                </Button>
                                {/* <Button onClick={closeDelConfirm, deleteDisp(dev)} color="primary" autoFocus> */}
                                <Button onClick={deleteDisp} color="primary" autoFocus>
                                    Confirmar
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                    <ModalConexoes open={open} setOpen={setOpen} />

                    <div className={classes.root}>
                        <Snackbar open={message} autoHideDuration={6000} onClose={closeMessage}>
                            <Alert onClose={closeMessage} severity={contentMessage.severity}>
                                {contentMessage.msg}
                            </Alert>
                        </Snackbar>
                    </div>
                </Container>
            }
        </React.Fragment>
    )
}
