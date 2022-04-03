import React, { useState } from 'react';
import DoneIcon from '@material-ui/icons/Done'; //ícones
import CloseIcon from '@material-ui/icons/Close';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import MuiAlert from '@material-ui/lab/Alert';
//import { verificarExistenciaEUI } from '../../Utils/verificarExistenciaEUI';
import ButtonsCadastro from '../../Components/ButtonsCadastro';
import LoadingCadastro from '../../Components/LoadingCadastro';
import './styles.css';

import {
    Container,
    Grid,
    Typography,
    TextField,
    FormControlLabel,
    FormGroup,
    Switch,
    MenuItem,
    Button,
    IconButton,
    Paper,
    Tooltip,
    Snackbar,
} from '@material-ui/core';
import { Add, ArrowBack } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import api from '../../Components/Connections/api'
import everynetIcon from './icon-everynet.png'

const AdicionarTipoBtn = withStyles((theme) => ({
    root: {
        color: '#FFF',
        backgroundColor: '#18591C',
        '&:hover': {
            backgroundColor: '#5BA971'
        },
        padding: '5px 2px',
        margin: '10px',
    }
}))(Button)

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStylesGrid = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    title: {
        marginLeft: '15px',
        color: 'rgb(85, 85, 85)',
        textTransform: 'inherit',
        fontSize: '1.3rem',
        fontWeight: '600',
        // fontFamily: "'Open Sans', sans-serif",
        opacity: '1',
        cursor: 'unset',
    },
    paperHeader: {
        padding: theme.spacing(2),
        textAlign: 'left',
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        //   color: theme.palette.text.secondary,
    },
    formfield: {
        marginBottom: '10px',
    },
    btnConfirm: {
        margin: '8px',
        backgroundColor: 'green',
        padding: '8px',
        borderRadius: '5px',
        color: 'white',
        '&:hover': {
            backgroundColor: 'darkgreen',
            color: 'white',
        },
    },

    btnCancel: {
        backgroundColor: '#aaa',
        padding: '10px 8px',
        borderRadius: '5px',
        color: 'white',
        '&:hover': {
            backgroundColor: '#888',
            color: 'white',
        },
    },
}));

const LightTooltip = withStyles((theme) => ({
    tooltip: {
        backgroundColor: theme.palette.common.black,
        color: 'white',
        boxShadow: theme.shadows[1],
        fontSize: 11,
    },
}))(Tooltip);

export default function CadastroEvery() {
    const [nameDevice, setNameDevice] = useState('');
    const [dispositivoEUI, setDispositivoEUI] = useState('');
    const [aplicacaoEUI, setAplicacaoEUI] = useState('');
    //const [tags, setTags] = useState([]);
    const [netWorkSessionKey, setNetWorkSessionKey] = useState('');
    const [applicationSessionKey, setApplicationiSessionKey] = useState('');
    const [checkActivation, setCheckActivation] = useState(false);
    const [selectType, setSelectType] = useState('');
    const [deviceAddr, setDeviceAddr] = useState('');
    const [appKey, setAppKey] = useState(null);
    const [cadastro, setCadastro] = useState([])
    const dispatch = useDispatch()

    //const cadastroEveryNet = useSelector((state) => state.deviceState.cadastroEvery);
    const selectedDevice = useSelector((state) => state.deviceState.selectedDevice);
    const dadosTypes = useSelector((state) => state.typeState.dadosType);
    //const devices = useSelector((state) => state.deviceState.devices);

    /////////////// Message /////////////////////
    const [openMessage, setOpenMessage] = React.useState(false);
    const [txtMessage, setTxtMessage] = React.useState('')
    const noSpecialCarac = /\W|_/;

    const showMessage = () => {
        setOpenMessage(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenMessage(false);
    };
    /////////////////////////////////////////////

    /////////////// Backdrop ////////////////////
    const [loading, setLoading] = React.useState({ openBackdrop: false, showSuccess: false });
    /////////////////////////////////////////////

    

    async function Cadastro() {
        const user = JSON.parse(localStorage.getItem('Auth_user')).uid
      
        if (nameDevice == '' || dispositivoEUI == '') {
            setTxtMessage("O campo Nome e Dispositivo EUI não podem ser vazios!")
            showMessage()
        } else if (
            noSpecialCarac.test(dispositivoEUI) ||
            noSpecialCarac.test(aplicacaoEUI) ||
            noSpecialCarac.test(netWorkSessionKey) ||
            noSpecialCarac.test(appKey) ||
            noSpecialCarac.test(deviceAddr)
        ) { //Verifica se há algum caractere especial no EUI                
            setTxtMessage("O campos específicos do dispositivo não podem conter espaços ou caracteres especiais!")
            showMessage()
        } else {
            setLoading({ openBackdrop: true, showSuccess: false }) //Abre o backdrop com o loading 
            /* if (await verificarExistenciaEUI(user, dispositivoEUI)) {
                setTxtMessage(`O dispositivo com EUI: ${dispositivoEUI} já está cadastrado!`)
                showMessage()
                console.log("Dispositivo já está cadastrado")
            } */
            
                if (checkActivation === false) {
                    setAppKey(null)
                }
                const data = {
                    name: nameDevice,
                    dev_addr: deviceAddr,
                    dev_eui: dispositivoEUI,
                    app_eui: aplicacaoEUI,
                    //tags: tags,
                    nwkskey: netWorkSessionKey,
                    appskey: applicationSessionKey,
                    activation: checkActivation === false ? 'ABP' : 'OTAA',
                    type: selectType,
                    app_key: appKey,
                }

                await api.post(`devices?login=${user}&dev_type=everynet`, data)
                    .then((res) => {
                     
                        if (res.data != '') {
                            setLoading({ openBackdrop: true, showSuccess: true }) //Fecha o backdrop com o loading 
                            
                        }
                    })
                    .catch((err) => {
                        console.log(err)
                        setLoading({ openBackdrop: false, showSuccess: false }) //Fecha o backdrop com o loading 
                        setTxtMessage(`Erro ao cadastrar dispositivo!`)
                        showMessage()
                    })
                setCadastro(data)
            
        }
    }


 

    const classes = useStylesGrid();


    return (
        <React.Fragment>
            <LoadingCadastro loading={loading} setLoading={setLoading} redirectToPage={"/dispositivos-cadastrados"} />
            <Container fluid style={{ marginTop: '5px' }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Paper className={classes.paperHeader}>
                            <img src={everynetIcon} alt="everynet logo" width="70"></img>
                            <span className={classes.title}>Cadastro - Dispositivo Everynet</span>
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            <FormGroup >
                                <TextField className={classes.formfield} variant="filled" label="Nome do Dispositivo" required value={nameDevice} onChange={(e) => setNameDevice(e.target.value)} />
                                <TextField
                                    className={classes.formfield}
                                    variant="filled"
                                    label="Device Address"
                                    value={deviceAddr}
                                    onChange={(e) => setDeviceAddr(e.target.value)}
                                    helperText={
                                        deviceAddr.includes(" ") && "Este campo não pode conter espaços"
                                        ||
                                        noSpecialCarac.test(deviceAddr) && "Este campo não pode conter caracteres especiais"
                                    }
                                    error={noSpecialCarac.test(deviceAddr) ? (true) : (false)}
                                />
                                <TextField
                                    className={classes.formfield}
                                    variant="filled"
                                    label="Dispositivo EUI"
                                    required
                                    value={dispositivoEUI}
                                    onChange={(e) => setDispositivoEUI(e.target.value)}
                                    helperText={
                                        dispositivoEUI.includes(" ") && "Este campo não pode conter espaços"
                                        ||
                                        noSpecialCarac.test(dispositivoEUI) && "Este campo não pode conter caracteres especiais"
                                    }
                                    error={noSpecialCarac.test(dispositivoEUI) ? (true) : (false)}
                                />
                                <TextField
                                    className={classes.formfield}
                                    variant="filled"
                                    label="Aplicação EUI"
                                    value={aplicacaoEUI}
                                    onChange={(e) => setAplicacaoEUI(e.target.value)}
                                    helperText={
                                        aplicacaoEUI.includes(" ") && "Este campo não pode conter espaços"
                                        ||
                                        noSpecialCarac.test(aplicacaoEUI) && "Este campo não pode conter caracteres especiais"
                                    }
                                    error={noSpecialCarac.test(aplicacaoEUI) ? (true) : (false)}
                                />
                                <TextField
                                    className={classes.formfield}
                                    variant="filled" label="Network Session Key"
                                    value={netWorkSessionKey}
                                    onChange={(e) => setNetWorkSessionKey(e.target.value)}
                                    helperText={
                                        netWorkSessionKey.includes(" ") && "Este campo não pode conter espaços"
                                        ||
                                        noSpecialCarac.test(netWorkSessionKey) && "Este campo não pode conter caracteres especiais"
                                    }
                                    error={noSpecialCarac.test(netWorkSessionKey) ? (true) : (false)}
                                />
                                <TextField
                                    className={classes.formfield}
                                    variant="filled"
                                    label="Application Session Key"
                                    value={applicationSessionKey}
                                    onChange={(e) => setApplicationiSessionKey(e.target.value)}
                                    helperText={
                                        applicationSessionKey.includes(" ") && "Este campo não pode conter espaços"
                                        ||
                                        noSpecialCarac.test(applicationSessionKey) && "Este campo não pode conter caracteres especiais"
                                    }
                                    error={noSpecialCarac.test(applicationSessionKey) ? (true) : (false)}
                                />
                                <div className="activationGrid">
                                    <FormControlLabel
                                        control={<Switch color="primary" checked={checkActivation} onChange={(e) => setCheckActivation(e.target.checked)} />}
                                        label={checkActivation === true ? "Activation OTAA" : "Activation ABP"}
                                    />
                                    {
                                        checkActivation
                                            ?
                                            <TextField className={classes.formfield} variant="filled" label="Application Key" value={appKey} onChange={(e) => setAppKey(e.target.value)} />
                                            :
                                            ''
                                    }

                                </div>
                            </FormGroup>
                            <FormGroup row style={{ textAlign: "left" }}>
                                {/* <Grid item xs={12} sm={4} justifyContent="flex-start"> */}
                                <TextField padding-inline-start="-10" className={classes.formfield} variant="filled" label="Tipo" select onChange={(e) => setSelectType(e.target.value)} style={{ width: "calc(100% - 90px)", display: 'flex', justifyContent: 'flex-start' }}>
                                    {
                                        dadosTypes.length && (dadosTypes.length > 0) ? dadosTypes.map((item) => (
                                            <MenuItem key={item} value={item}>{item} </MenuItem>
                                        )) :
                                            <MenuItem>Nenhum tipo cadastrado</MenuItem>
                                    }
                                </TextField>
                                <Link to="/dispositivos-cadastrados/cadastroEverynet/cadastroTipo">
                                    <AdicionarTipoBtn variant="contained" color="primary"><Add /></AdicionarTipoBtn>
                                </Link>
                                {/* </Grid>*/}
                            </FormGroup>
                        
                            <ButtonsCadastro Cadastro={Cadastro}/>
                       
                        </Paper>
                    </Grid>
                </Grid>
                <div className={classes.root}>
                    <Snackbar open={openMessage} autoHideDuration={6000} onClose={handleClose}>
                        <Alert onClose={handleClose} severity="error">
                            {txtMessage}
                        </Alert>
                    </Snackbar>
                </div>
            </Container>
        </React.Fragment>
    )
}