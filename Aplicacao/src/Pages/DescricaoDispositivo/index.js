import React,{useState} from 'react'
//import './styles.css';

import DeveloperBoardIcon from '@material-ui/icons/DeveloperBoard';
import DoneIcon from '@material-ui/icons/Done'; //ícones
import CloseIcon from '@material-ui/icons/Close';
import {stampToDateAndHour} from '../../script/timeStampToDate'

// import mqttIcon from './icon-mqtt.png'
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
} from '@material-ui/core';
import { Add, ArrowBack } from '@material-ui/icons';
import {withStyles, makeStyles} from '@material-ui/core/styles';

import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import api from '../../Components/Connections/api'

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
        display: 'flex',
        direction: 'row',
        alignItems: 'center',
        padding: theme.spacing(2),
        textAlign: 'left',
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'left',
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

const LightTooltip = withStyles((theme) => ({
    tooltip: {
      backgroundColor: theme.palette.common.black,
      color: 'white',
      boxShadow: theme.shadows[1],
      fontSize: 11,
    },
  }))(Tooltip);

export default function DescricaoDispositivo(props) {   
    const dispName = props.location.state.name              
    const dispEUI = props.location.state.device    
    const dispType = props.location.state.type   
    const dispStatus = props.location.state.status    
    const dispDateActivation = props.location.state.act_date
    const userName = JSON.parse(localStorage.getItem('Auth_user')).name
    const uri = 'mqtt.ibti.network' 
    const topico = 'ibti/'+userName+'/'+dispEUI
    // const [appKey, setAppKey] = useState(null);            

    console.log(`
        Device object: ${props.location.state}
        Topico: ${topico}                
    `)
    
    for(let key in props.location.state) {
        console.log(key + ":", props.location.state[key]);
    }
        
    let dataFormatada = stampToDateAndHour(dispDateActivation)
    
    // console.log(selectType)
    const classes = useStylesGrid();
    const comunicacao = useStylesComunicacao();

    return (                
        <Container fluid style={{marginTop: '5px'}}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Paper className={classes.paperHeader}>  
                        {/* <img src={DeveloperBoardIcon} alt="mqtt logo" width="70"></img>                         */}
                        <DeveloperBoardIcon fontSize='large'/>
                        <span className={classes.title}>Descrição do dispositivo</span>
                    </Paper>
                </Grid>    
                <Grid item xs={12}>
                    <Paper className={classes.paper}>                        
                        <strong>Informações Gerais</strong>   
                        <hr/>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6} md={4} >
                                <Typography className={comunicacao.title}>
                                    NOME DO DISPOSTIVO
                                </Typography>   
                                <Typography className={comunicacao.content}>                                    
                                    {dispName}
                                </Typography>                                   
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <Typography className={comunicacao.title}>
                                    Tipo de Dispostivivo
                                </Typography>   
                                <Typography className={comunicacao.content}>
                                    {dispType}
                                </Typography>                                   
                            </Grid>                     
                            <Grid item xs={12} sm={6} md={4}>
                                <Typography className={comunicacao.title}>
                                    Status
                                </Typography>   
                                <Typography className={comunicacao.content}>
                                    { dispStatus }
                                </Typography>                                   
                            </Grid>         
                            <Grid item xs={12} sm={6} md={4}>
                                <Typography className={comunicacao.title}>
                                    Dispositivo EUI
                                </Typography>   
                                <Typography className={comunicacao.content}>
                                    { dispEUI }
                                </Typography>                                   
                            </Grid> 
                            <Grid item xs={12} sm={6} md={4}>
                                <Typography className={comunicacao.title}>
                                    Data e Hora de Ativação
                                </Typography>   
                                <Typography className={comunicacao.content}>
                                    { dataFormatada }
                                </Typography>                                   
                            </Grid>                                                                                                                                                                   
                        </Grid>
                    </Paper>
                </Grid>                           
                <Grid item xs={12}>
                    <Paper className={classes.paper}>                        
                        <strong>Comunicação com o dispositivo</strong>   
                        <hr/>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={4}>
                                <Typography className={comunicacao.title}>
                                    NOME DE USUÁRIO
                                </Typography>   
                                <Typography className={comunicacao.content}>
                                    {userName}
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
                                    {dispEUI ? dispEUI : '{vazio}' }
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
                                    mosquitto_pub -h '{uri}' -p '1883' -u {userName} -t '{dispEUI}' -m 'payload'///
                                </Typography>                                   
                            </Grid>
                        </Grid>                         
                    </Paper>
                </Grid>                               
            </Grid>
        </Container>            
    )
}
