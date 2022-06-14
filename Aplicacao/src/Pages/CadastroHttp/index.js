import React, { useState, useEffect } from 'react'
import './styles.css';
import MuiAlert from '@material-ui/lab/Alert';
import { Delete } from '@material-ui/icons';
import { verificarExistenciaEUI } from '../../Utils/verificarExistenciaEUI';
import ButtonsCadastro from '../../Components/ButtonsCadastro';
import LoadingCadastro from '../../Components/LoadingCadastro';
import { QRCodeCanvas } from 'qrcode.react'
import ErroSnack from '../../Components/ErroSnack/erroSnack';
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
    Select,
    InputLabel,
    FormControl,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Hidden,


} from '@material-ui/core';

import { Add, ArrowBack } from '@material-ui/icons';
import { withStyles, makeStyles } from '@material-ui/core/styles';

import { Link } from 'react-router-dom';
import { dispatch, useDispatch, useSelector } from 'react-redux'
import api from '../../Components/Connections/api'
import { style } from 'dom-helpers';
let icon = 'https://files.tago.io/5bbcb03b667d7a002e56664b/storage/http_icon.svg'

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



export default function CadastroHttp() {
    const user = JSON.parse(localStorage.getItem('Auth_user')).name // Busca o login e o local storage
    const userUID = JSON.parse(localStorage.getItem('Auth_user')).uid //Busca o Id do usuário no firebase
    const uri = 'iotibti.ddns.net'
    const [nameDevice, setNameDevice] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [openModalQr, setOpenModalQr] = useState(false);
    const [qrCodeUser, setQrCodeUser] = useState('')
    const qrCode = qrCodeUser

    const [dispositivoEUI, setDispositivoEUI] = useState('');
    const [appKey, setAppKey] = useState('');
    const topico = `ibti/${appKey.MQTTuser ? appKey.MQTTuser : 'user não gerado'}/${dispositivoEUI ? dispositivoEUI : '{vazio}'}`
    const [cadastro, setCadastro] = useState()


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

    async function QRCode() {
        //https://iotibti.ddns.net:8000/token?login=sSaR00DpyhR3151N534tXPd4d4m1
        await api.get(`token?login=${userUID}`)
            .then((res) => {
                setQrCodeUser(res.data)
                console.log(res.data)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    async function selectKey() {
        await api.get(`/user?login=${userUID}`)
            .then((res) => {
                setAppKey(res.data)
                console.log(appKey)
            })
    }

    useEffect(() => {
        selectKey()
        QRCode()
    }, [])
    /////////////////////////////////////////////

    /////////////// Backdrop ////////////////////
    const [loading, setLoading] = React.useState({ openBackdrop: false, showSuccess: false });
    /////////////////////////////////////////////





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

                await api.post('/devices?login=' + user + '&dev_type=mqtt', data)
                    .then((res) => {

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

    //criação de campos
    const [campoVar, setCampoVar] = useState([]);
    const [addCampo, setAddCampo] = useState('');
    const [unidade, setUnidade] = useState('');
    const [saveVar, setSaveVar] = useState([]);
    const [openSnack, setOpenSnack] = useState(false);


    function handleOpenModal() {
        setOpenModal(true)
    }

    function handleCloseModalQr() {
        setOpenModalQr(false)
    }

    function handleOpenModalQr() {
        setOpenModalQr(true)
    }

    function saveVariaveis() {
        setSaveVar([...campoVar])
        setOpenModal(false)
    }


    function handleCloseModal() {
        setOpenModal(false)
        //campoVar.length = 0 // serve para zerar o array

    }

    function handleClear(id) {
        let newList = campoVar.filter(item => item.id !== id)
        setCampoVar(newList)
    }

    function handleInput() {
        if (addCampo === '' || unidade === '') {
            alert('Digite no campo em branco')
            //return <ErroSnack open={handleOpenSnack} duration={2000} close={handleCloseSnack} descriptionErro="Erro ao Salvar" closeAlert={handleCloseSnack}/>

        }
        else {
            let newVar = [...campoVar]
            let data = {
                id: new Date().getTime(),
                variaveis: addCampo,
                unidade: unidade
            }
            newVar.push(data)
            setCampoVar(newVar)
            setAddCampo('')
            setUnidade('')

        }

    }

    useEffect(() => {

    }, [campoVar, unidade, saveVar])



    return (
        <React.Fragment>
            <LoadingCadastro device={nameDevice} loading={loading} setLoading={setLoading} redirectToPage={"/dispositivos-cadastrados"} />
            <Container fluid style={{ marginTop: '5px' }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Paper className={classes.paperHeader}>
                            <img src={icon} alt="mqtt logo" width="70"></img>
                            <span className={classes.title}>Cadastro - Dispositivo HTTP</span>
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
                                <div className="divCombo">

                                    <button onClick={handleOpenModal}><Add /> Adicionar Variáveis</button>
                                </div>
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
                                        NOME DE USUÁRIO HTTP
                                    </Typography>
                                    <Typography className={comunicacao.content}>
                                        {appKey.MQTTuser ? appKey.MQTTuser : 'user não gerado'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Typography className={comunicacao.title}>
                                        Senha
                                    </Typography>
                                    <Typography className={comunicacao.content}>
                                        {appKey.MQTTpsw ? appKey.MQTTpsw : 'Senha não foi gerada'}
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
                                <Grid item xs={12} sm={4}>
                                    <Typography className={comunicacao.title}>
                                        QRCODE
                                    </Typography>
                                    <Typography className={comunicacao.content}>
                                        <button onClick={() => handleOpenModalQr()} style={{ background: 'transparent', border: 'none', textDecoration: 'underline', cursor: 'pointer' }}>{qrCode ? qrCode : '{vazio}'}</button>
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
                                        HTTP URI
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
                                <Grid item xs={12}>
                                    <Typography className={comunicacao.title}>
                                        EXEMPLO DE FORMATO JSON
                                    </Typography>
                                    <Typography className={comunicacao.command}>
                                        {'"{"a": 1, "b": 2,'}
                                        <span style={{ color: "red" }}>"ts": 839463900</span>
                                        {'}"'}
                                        <Typography style={{ fontSize: 12 }}>
                                            ts: Unix TimeStamp
                                        </Typography>

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

                <Dialog fullWidth={30} open={openModal} onClose={handleCloseModal}>
                    <DialogTitle onClose={handleCloseModal} >
                        <Typography variant="h6" className="titleDialog">Adicionar uma nova variável</Typography>
                    </DialogTitle>

                    <DialogContent>
                        <div className="dialogCampo">
                            <TextField
                                className="inputDialog"
                                autoFocus
                                label="Adicionar variável"
                                type="text"
                                variant="outlined"
                                name="variaveis"
                                value={addCampo}
                                onChange={(e) => setAddCampo(e.target.value)}
                                onKeyPress={e => {
                                    if (e.key === 'Enter') {
                                        handleInput()
                                    }
                                }}
                            />
                            <TextField
                                label="Unidade"
                                type="text"
                                variant="outlined"
                                name="variaveis"
                                value={unidade}
                                onChange={(e) => setUnidade(e.target.value)}
                                onKeyPress={e => {
                                    if (e.key === 'Enter') {
                                        handleInput()
                                    }
                                }}
                            />
                            <Button onClick={handleInput} variant="outlined" color="secondary">Adicionar</Button>
                        </div>
                        <DialogContentText className="varAdd">
                            {
                                campoVar && campoVar.map((m, index) => (
                                    <Hidden>
                                        <Paper key={m.id} className="variaveis">
                                            <span>
                                                <label>{`Variável: ${m.variaveis}`}</label>
                                                <label>{`Unidade: ${m.unidade}`}</label>
                                            </span>
                                            <button onClick={() => { handleClear(m.id) }}><Delete style={{ fontSize: 20 }} />Delete</button>
                                        </Paper>
                                    </Hidden>
                                ))
                            }

                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button color="primary" onClick={saveVariaveis}>Salvar</Button>
                        <Button color="primary" onClick={handleCloseModal}>Cancelar</Button>
                    </DialogActions>
                </Dialog>

                <Dialog fullWidth={30} open={openModalQr} onClose={handleCloseModalQr}>
                    <DialogTitle onClose={handleCloseModal} >
                        <Typography variant="h6" className="titleDialog">QRCODE</Typography>
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText style={{alignItems:'center', justifyContent:'center', display:'flex'}}>
                            <QRCodeCanvas value={qrCodeUser} size={220}/>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button color="primary" onClick={handleCloseModalQr}>Fechar</Button>
                    </DialogActions>
                </Dialog>

            </Container>
        </React.Fragment>
    )
}
