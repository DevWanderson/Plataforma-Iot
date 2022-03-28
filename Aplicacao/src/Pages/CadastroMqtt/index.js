import React, { useState } from 'react'
import './styles.css';
import mqttIcon from './icon-mqtt.png'
import MuiAlert from '@material-ui/lab/Alert';
import { verificarExistenciaEUI } from '../../script/verificarExistenciaEUI';
import ButtonsCadastro from '../../Components/ButtonsCadastro';
import LoadingCadastro from '../../Components/LoadingCadastro';
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
import { withStyles, makeStyles } from '@material-ui/core/styles';

import { Link } from 'react-router-dom';
import { dispatch, useDispatch, useSelector } from 'react-redux'
import api from '../../Components/Connections/api'
import { selecionarDevice } from '../../store/Modulos/Devices/actions';

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
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));

const useStylesComunicacao = makeStyles((theme) => ({
    // root: {
    //     flexGrow: 1,
    // },
    title: {
        color: 'rgb(85, 85, 85)',
        textTransform: 'uppercase',
        fontSize: '0.875em',
        fontWeight: '400',
        opacity: '1',
        cursor: 'inherit',
    },
    content: {
        fontFamily: "monospace",
        color: 'rgb(85, 85, 85)',
        textTransform: 'inherit',
        fontSize: '1rem',
        fontWeight: '600',
        opacity: '1',
        cursor: 'unset',
    },
    command: {
        fontFamily: "monospace",
        fontWeight: '100',
        backgroundColor: '#eee',
        padding: '7px',
        borderRadius: '5px'
    }
}))

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}



export default function CadastroMqtt() {
    const user = JSON.parse(localStorage.getItem('Auth_user')).name
    const uri = 'mqtt.ibti.network'
    const [nameDevice, setNameDevice] = useState('');
    const [dispositivoEUI, setDispositivoEUI] = useState('');
    const topico = 'ibti/' + user + '/' + dispositivoEUI
    const [appKey, setAppKey] = useState(null);
    const [cadastro, setCadastro] = useState()
    const cadastroMQTT = useSelector((state) => state.devicesState.cadastroMQTT);
    console.log("has space: " + dispositivoEUI.includes(" "))
    /////////////// Message /////////////////////
    const [openMessage, setOpenMessage] = React.useState(false);
    const [txtMessage, setTxtMessage] = React.useState('')
    const dispatch = useDispatch();
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


    console.log(`
        Topico: ${topico} 
        appkey: ${appKey}           
    `)



    async function Cadastro() {
        if (nameDevice == '' || dispositivoEUI == '') {
            setTxtMessage("O campo Nome e EUI não podem ser vazios!")
            showMessage()
        } else if (noSpecialCarac.test(dispositivoEUI)) { //Verifica se há algum caractere especial no EUI                      
            setTxtMessage("O campo de EUI não pode conter espaços e nem caracteres especiais!")
            showMessage()
        } else {
            setLoading({ openBackdrop: true, showSuccess: false })
            if (await verificarExistenciaEUI(user, dispositivoEUI)) {
                setLoading({ openBackdrop: false, showSuccess: false })
                setTxtMessage(`O dispositivo com EUI: ${dispositivoEUI} já está cadastrado!`)
                showMessage()
            } else {
                const data = {
                    name: nameDevice,
                    dev_eui: dispositivoEUI,
                }

                await api.post('/devices?user=' + user + '&dev_type=mqtt', data)
                    .then((res) => {
                        console.log(`Data response: ${res.data}`)
                        if (res.data == '') {
                            setLoading({ openBackdrop: false, showSuccess: false }) //fecha o círculo de loading
                            console.log("Erro ao cadastrar")
                            setTxtMessage("Erro ao cadastrar dispostivo!")
                            showMessage()
                        } else {
                            // showSuccessIcon()
                            setLoading({ openBackdrop: true, showSuccess: true }) //Mostra a animação de sucesso
                            // window.location.href = "/dispositivos-cadastrados"   //Posteriomente mensagem de sucesso será enviada para essa view 
                        }
                    })
                    .catch((err) => {
                        setLoading({ openBackdrop: false, showSuccess: false }) //fecha o círculo de loading
                        console.log(err)
                        setTxtMessage("Erro ao cadastrar dispostivo!")
                        showMessage()
                    })
                setCadastro(data)

            }
        }
    }


    // console.log(selectType)
    const classes = useStylesGrid();
    const comunicacao = useStylesComunicacao();

    const noSpecialCarac = /\W|_/;

    return (
        <React.Fragment>
            <LoadingCadastro device={nameDevice} loading={loading} setLoading={setLoading} redirectToPage={"/dispositivos-cadastrados"} />
            <Container fluid style={{ marginTop: '5px' }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Paper className={classes.paperHeader}>
                            <img src={mqttIcon} alt="mqtt logo" width="70"></img>
                            <span className={classes.title}>Cadastro - Dispositivo MQTT</span>
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            <FormGroup >
                                <TextField
                                    className={classes.formfield}
                                    value={nameDevice}
                                    onChange={(e) => setNameDevice(e.target.value)}
                                    id="filled-Nome"
                                    label="Nome"
                                    helperText="Nome para o dispositivo"
                                    variant="filled"
                                    required
                                />
                                <TextField
                                    className={classes.formfield}
                                    value={dispositivoEUI}
                                    onChange={(e) => setDispositivoEUI(e.target.value)}
                                    id="filled-devEUI"
                                    label="EUI"
                                    helperText={
                                        dispositivoEUI.includes(" ") && "Este campo não pode conter espaços"
                                        ||
                                        noSpecialCarac.test(dispositivoEUI) && "Este campo não pode conter caracteres especiais"
                                        ||
                                        "EUI para o dispositivo"
                                    }
                                    variant="filled"
                                    error={noSpecialCarac.test(dispositivoEUI) ? (true) : (false)}
                                    required
                                />
                            </FormGroup>
                            <ButtonsCadastro Cadastro={Cadastro} />
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper className={classes.paperHeader}>
                            <strong>Comunicação com o dispositivo</strong>
                            <hr />
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={4}>
                                    <Typography className={comunicacao.title}>
                                        NOME DE USUÁRIO
                                    </Typography>
                                    <Typography className={comunicacao.content}>
                                        {user}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Typography className={comunicacao.title}>
                                        Senha (key)
                                    </Typography>
                                    <Typography className={comunicacao.content}>
                                        'senha gerada ao criar usuário'
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Typography className={comunicacao.title}>
                                        DEVICE EUI
                                    </Typography>
                                    <Typography className={comunicacao.content}>
                                        {dispositivoEUI ? dispositivoEUI : '{vazio}'}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Typography className={comunicacao.title}>
                                        TÓPICO
                                    </Typography>
                                    <Typography className={comunicacao.content}>
                                        {topico}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography className={comunicacao.title}>
                                        MQTT URI
                                    </Typography>
                                    <Typography className={comunicacao.content}>
                                        {uri}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography className={comunicacao.title}>
                                        MOSQUITTO
                                    </Typography>
                                    <Typography className={comunicacao.command}>
                                        mosquitto_pub -h '{uri}' -p '1883' -u '{user}' -t '{topico}' -m 'payload'///
                                    </Typography>
                                </Grid>
                            </Grid>
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
