import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
    Container,
    Grid,
    makeStyles,
    Card,
    Typography,
    TextField,
    FormControl,
    InputAdornment,
    CardContent,
    Paper,
    Button,
    MenuItem,
    CircularProgress,
    Fade
} from '@material-ui/core';
import {
    Search,
    Whatshot,
    Opacity,
    BatteryStd,
    Room,
    CalendarToday,
    ArrowUpward,
    ArrowDownward
} from '@material-ui/icons';
import Autocomplete from '@material-ui/lab/Autocomplete';
import clsx from 'clsx';
import './styles.css';
import Lottie from 'react-lottie';
import Bateria from '../../Assets/bateria.json';
import { selecionarDevice } from '../../store/Modulos/Devices/actions';





import Graph from './graph';
import Map from '../Map/map-container';
import Info from '../Indicator';
import { Fragment } from 'react';

const useStyle = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    card: {
        padding: theme.spacing(1),
        textAlign: 'center',
        marginBottom: theme.spacing(3),


    },
    cardInfo: {
        padding: theme.spacing(1),
        textAlign: 'center',
        marginBottom: theme.spacing(3),
        width: '50%',
        marginInline: 5,
    },
    textIput: {
        margin: theme.spacing(1),
        borderRadius: 100,
        width: '45%',
        borderRadius: 100,
    },
    form: {
        width: '100%',
        margin: theme.spacing(1),
        justifyContent: 'center',
        alignItems: 'center'
    }
}))

const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: Bateria,

}




export default function Dashboard() {
    const selectedDevice = useSelector((state) => state.devicesState.selectedDevice);
    const devices = useSelector((state) => state.devicesState.devices);
    const dadosDevice = useSelector((state) => state.devicesState.dadosDevice);
    const dispatch = useDispatch();
    const classes = useStyle();
    console.log('aqui' , JSON.stringify(dadosDevice))

    const [searchDevice, setSeactDevice] = useState('');
    const [query, setQuery] = useState(false);

    const timerRef = React.useRef();


    useEffect(() => {
        clearTimeout(timerRef.current);
        handleLoading()
        getPropsDevice()

    }, [selectedDevice, dadosDevice, searchDevice])

    const maiorVbat = 3.8, menorVbat = 2.4

    var cargaBateria = verificaProp("bateria", dadosDevice) - menorVbat;
    var cargaBateria = 100 * cargaBateria / (maiorVbat - menorVbat);
    if (cargaBateria > 100) cargaBateria = 100;

    console.log(dadosDevice.filter((device) => device.device === selectedDevice)[0] ?
        dadosDevice.filter((device) => device.device === selectedDevice)[0].type : "UNDEFINED");

    function verificaLista(lista) {
        const dado = (selectedDevice === '') ? lista : lista.filter((dado) => dado.device === selectedDevice)
        return (dado.length > 0) ? dado[0] : []
    }
    function verificaProp(prop, lista) {
        const selDados = verificaLista(lista)
        return selDados[prop]
    }
    function getPropsDevice() {
        const selDados = verificaLista(dadosDevice)
        return Object.keys(selDados)
    }

    function handleLoading() {
        clearTimeout(timerRef.current);
        setQuery('progress');
        timerRef.current = window.setTimeout(() => {
            setQuery(true)

        }, 2000)
    }

    const device = verificaProp('device', devices);
    const propsDevice = getPropsDevice()


    const CardsInfo = () => {
        return (
            <React.Fragment>
                <Grid item xs={7}>
                    <Card className={classes.card}>
                        <Graph />

                    </Card>
                </Grid>
                <Grid item xs={5}>
                    {(propsDevice.includes('temp') && propsDevice.includes('hum')) ? (
                        <div style={{ display: 'flex', height: 190 }}>
                            <Card className={classes.cardInfo}>
                                <CardContent style={{ flexDirection: 'row', display: 'flex', justifyContent: 'space-between' }}>
                                    <div style={{ textAlign: 'left' }}>
                                        <Typography variant="h6">Umidade</Typography>
                                        <Typography>{verificaProp("hum", dadosDevice).toFixed(0)}%</Typography>
                                    </div>
                                    <Opacity style={{ color: '#26A6F7', fontSize: 50 }} />
                                </CardContent>
                                <div style={{ marginLeft: 130, padding: 18, display: 'flex' }}>
                                    <ArrowUpward style={{ color: '#36D943' }} />
                                    <Typography>20%</Typography>
                                </div>

                            </Card>

                            <Card className={classes.cardInfo}>
                                <CardContent style={{ flexDirection: 'row', display: 'flex', justifyContent: 'space-between' }}>
                                    <div style={{ textAlign: 'left' }}>
                                        <Typography variant="h6">Temperatura</Typography>
                                        <Typography>{verificaProp("temp", dadosDevice).toFixed(1)}°C</Typography>
                                    </div>
                                    <Whatshot style={{ color: '#FD0D1B', fontSize: 50 }} />
                                </CardContent>
                                <div style={{ marginLeft: 130, padding: 18, display: 'flex' }}>
                                    <ArrowDownward style={{ color: '#FD0D1B' }} />
                                    <Typography>10%</Typography>
                                </div>
                            </Card>
                        </div>
                    ) : ""}

                    {propsDevice.includes('bateria') ? (
                        <Card style={{ height: 220, width: '98%' }} className={classes.cardInfo}>
                            <CardContent style={{ flexDirection: 'row', display: 'flex', justifyContent: 'space-between' }}>
                                <div style={{ textAlign: 'left' }}>
                                    <Typography variant="h6">Bateria</Typography>
                                    <Typography>{cargaBateria.toFixed(0)}%</Typography>
                                </div>
                                <BatteryStd style={{ color: '#36D943', fontSize: 50 }} />
                            </CardContent>
                            <Lottie options={defaultOptions} width={520} height={200} style={{ marginTop: -55 }} />
                        </Card>
                    ) : ""}
                </Grid>


                <Grid item xs={7}>
                    <Card className={classes.card}>
                        {(dadosDevice.length > 0) ? <Map /> : ''}
                    </Card>
                </Grid>
                <Grid item xs={5}>
                    <Paper elevation={3} style={{ padding: 20, textAlign: 'center', borderRadius: 9 }} >
                        <Typography variant="h5">Nome do Dispositivo</Typography>
                        <div style={{ display: 'flex', justifyContent: 'space-evenly', marginTop: 15 }}>
                            <Card style={{ height: 120 }}>
                                <div style={{ width: 200, height: 90, display: 'flex', justifyContent: 'space-between', padding: 10 }}>
                                    <Typography>Localização</Typography>
                                    <Room style={{ color: '#FD0D1B', fontSize: 40 }} />
                                </div>
                                <div style={{ marginTop: -20 }}>
                                    <Typography variant="h6">Centro Tecnologico</Typography>
                                </div>
                            </Card>
                            <Card >
                                <div style={{ width: 200, height: 90, display: 'flex', justifyContent: 'space-between', padding: 10 }}>
                                    <Typography>Data de Último Envio</Typography>
                                    <CalendarToday style={{ color: '#26A6F7', fontSize: 40 }} />
                                </div>
                                <div style={{ marginTop: -20 }}>
                                    <Typography variant="h6">20/04/2021</Typography>
                                </div>
                            </Card>
                        </div>
                        <Button style={{ background: '#262626', color: '#FFF', marginTop: 20, left: 140 }}>Informações</Button>
                    </Paper>
                </Grid>
            </React.Fragment>
        )
    }



    return (
        <Container className={classes.root}>
            <FormControl className={clsx(classes.form)} >
                <Autocomplete
                    className={clsx(classes.textIput)}
                    id="autocomplete"
                    value={selectedDevice}

                    onChange={(event, newValue) => {
                        if (newValue) {
                            const disp = newValue.split()
                            dispatch(selecionarDevice(disp[0]))
                        } else {
                            console.log('erro')
                        }
                    }
                    }
                    inputValue={searchDevice}

                    onInputChange={(event, inputValue) => { setSeactDevice(inputValue) }}
                    options={devices.map(option => option.device)}
                    style={{ width: 300 }}
                    renderInput={(params) => <TextField {...params} label="Pesquisar Dispositivo" variant="outlined" />}
                />



            </FormControl>
            <Grid container spacing={8}>
                <Grid container item xs={12} spacing={3}>
                    {query === true ? (
                        <CardsInfo />
                    ) : (
                        <Fade
                            in={query === 'progress'}
                            style={{ transitionDelay: query === 'progress' ? '800ms' : '0ms', marginLeft: '50%', marginTop: '20%' }}
                            unmountOnExit
                        >
                            <CircularProgress />
                        </Fade>

                    )}
                </Grid>
            </Grid>
        </Container>
    )
}
