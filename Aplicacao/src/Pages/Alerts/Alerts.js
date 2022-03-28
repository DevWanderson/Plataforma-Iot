import React, { useState } from 'react';
import './Alerts.css';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import SelectDeviceAlerts from './SelectDeviceAlerts/SelectDeviceAlerts';
import LogicAlerts from './LogicAlerts/LogicAlerts';
import NotificationAlerts from './NotificationAlerts/NotificationAlerts';
import FinalAlerts from './FinalAlerts/FinalAlerts';
import { useEffect } from 'react';
import ScreenNotification from '../../Components/ScreenNotification/ScreenNotification';
import { useDispatch, useSelector } from 'react-redux';
import {statusLoad} from '../../store/Modulos/Devices/actions';
import Loading from '../../Components/Loading';
import SuccessAnimationGeneric from '../../Components/SuccessAnimationGenric/SucessAnimationGeneric';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    backButton: {
        marginRight: theme.spacing(1),
    },
    instructions: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    teste: {
        color: 'red',
        backgroundColor: 'yellow'
    }

}));


const AdicionarTipoBtn = withStyles((theme) => ({
    root: {
        color: '#FFF',
        // backgroundColor: '#22A14D',
        backgroundColor: '#3F51B5',

        '&:hover': {
            // backgroundColor: '#2FED6F'
            backgroundColor: '#5063d1'
        },
        padding: '5px 10px',
        margin: '10px',
    }
}))(Button)


function getSteps() {
    return ['Selecione o dispositivo', 'Crie a lógica do alerta', 'Crie o corpo do alerta', 'Confirmação'];
}

function getStepContent(stepIndex) {
    switch (stepIndex) {
        case 0:
            return 'Selecione o dispostivo desejado.';
        case 1:
            return 'Crie a lógica do alerta desejado.';
        case 2:
            return 'Escolha como deseja ser notificado.';
        case 3:
            return 'Confirme o alerta criado.';
        default:
            return 'Erro';
    }
}



export default function Alerts() {
    const classes = useStyles();
    const steps = getSteps();
    const dispatch = useDispatch();
    const redux = useSelector(state=>state)

    const [activeStep, setActiveStep] = useState(0);
    const [selectedDevices, setSelectedDevices] = useState([]);
    const [logic, setLogic] = useState([]);
    const [contactAlert, setContactAlert] = useState([]);
    const [payload, setPayload] = useState({});

    const [status, setStatus] = useState(false); //Estado para para passar para tela de erro
    const [notice, setNotice] = useState(''); //Estado para para passar para tela de erro
    const [isLoading, setIsLoading] = useState(false); //para aparecer Loading quando terminar de cadastrar alerta
    const [animation, setAnimation] = useState(false)

    useEffect(() => {
        console.log(selectedDevices)
        console.log(logic)
        console.log(contactAlert)
        console.log(payload);
        if (selectedDevices.length !== 0 && logic.length !== 0) { // monta payload para enviar para o backend
            setPayload({
                devices: selectedDevices,
                logic: logic,
                name: contactAlert[0],
                period: contactAlert[1],
                telegram: contactAlert[2],
                email: contactAlert[3],
                msg: contactAlert[4],
            })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedDevices, logic, contactAlert])

    useEffect(() => {
        setIsLoading(redux.devicesState.statusLoad)
    }, [redux.devicesState.statusLoad])


    const handleNext = () => { //Como o botão de próximo é o mesmo para todas as páginas, tenho que fazer 2 ifs para cada tela.

        //PASSO 1 == 0 

        if (selectedDevices.length !== 0 && activeStep === 0) {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }

        if (selectedDevices.length === 0 && activeStep === 0) {
            setStatus(false); //Esse false é para que antes de setar o status pra true eu garanta que sempre haverá troca de estado, para haver renderização
            setTimeout(() => {
                setStatus(true);
            }, 100)
            setNotice('Selecione algum dispositivo antes do próximo passo.')
        }

        //PASSO 2 == 1

        if (selectedDevices.length !== 0 && logic.length !== 0 && activeStep === 1) {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }

        if (activeStep === 1 && logic.length === 0) {
            setStatus(false); // Esse false é para que antes de setar o status pra true eu garanta que sempre haverá troca de estado, para haver renderização
            setTimeout(() => {
                setStatus(true);
            }, 100)
            setNotice('Crie alguma lógica antes do próximo passo.')
        }

        //PASSO 3 == 2


        if (selectedDevices.length !== 0 && logic.length !== 0 && activeStep === 2) {
            if(contactAlert[2] !== '' || contactAlert[3] !== ''){
                if (contactAlert[0] !== '' && contactAlert[1] !== ''  && contactAlert[4] !== '') {
                    setActiveStep((prevActiveStep) => prevActiveStep + 1);
                }
            } else{
                setStatus(false); // Esse false é para que antes de setar o status pra true eu garanta que sempre haverá troca de estado, para haver renderização
                setTimeout(() => {
                    setStatus(true);
                }, 100)
                setNotice('Preencha o campo "Telegram" ou "E-mail".')
            }  
        }


        if (selectedDevices.length !== 0 && logic.length !== 0 && activeStep === 2) {
            if (contactAlert[0] === '' || contactAlert[1] === ''  || contactAlert[4] === '') {
                setStatus(false); // Esse false é para que antes de setar o status pra true eu garanta que sempre haverá troca de estado, para haver renderização
                setTimeout(() => {
                    setStatus(true);
                }, 100)
                setNotice('Preencha todos os campos obrigatórios')
            }

        }

        //PASSO FINAL

        if(selectedDevices.length !== 0 && logic.length !== 0 && activeStep === 3){
            console.log('teste')

            dispatch(statusLoad(true))

            fetch('http://192.168.1.242:8000/alerts?user=bruno', {
                method: 'POST',
                body: JSON.stringify(payload)
            }).then(res => {
                console.log(res)
                if (res.status === 201) {
                    setAnimation(true)
                } else {
                    alert('erro')
                    window.location.replace('/home')
                }
                dispatch(statusLoad(false))
            }).catch(erro => {
                console.log(erro)

            })

        }

    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    function getSelectedDevices(array) {
        setSelectedDevices(array)
    }

    function getLogic(array) {
        setLogic(array)
    }

    function getContactAlert(array) {
        setContactAlert(array)
    }

    function sendPayload() {
        fetch('http://192.168.1.242:8000/alerts?user=bruno', {
            method: 'POST',
            body: JSON.stringify(payload)
        }).then(res => {
            console.log(res)
        }).catch(erro => {
            console.log(erro)
        })

        // setTimeout(() => {
        //     dispatch(statusLoad(true))
        //     setAnimation(true)
        // }, 50)

        // setTimeout(() => {
        //     dispatch(statusLoad(false))
        // }, 3000)

    }


    // useEffect(() => {
    //     console.log(redux.devicesState.statusLoad)
    // }, [redux.devicesState.statusLoad])

    return (
        <>
            {isLoading === true ?
                <Loading />
            :
                <>
                    <SuccessAnimationGeneric status={animation} local={'/'} />
                    <ScreenNotification notice={notice} status={status} />

                    <div className={classes.root}>

                        <Stepper activeStep={activeStep} alternativeLabel color="success" >
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel >{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper  >

                        <div className='containerModalAlerts'>
                            <SelectDeviceAlerts step={activeStep} get={getSelectedDevices} />
                            <LogicAlerts step={activeStep} get={getLogic} />
                            <NotificationAlerts step={activeStep} get={getContactAlert} />
                            <FinalAlerts
                                step={activeStep}
                                devices={selectedDevices}
                                logic={logic}
                                contact={contactAlert}
                                payload={payload}
                            />
                        </div>


                        <div className='containerButtonsAlerts'>
                            {activeStep === steps.length ? (
                                <div>
                                    <Typography className={classes.instructions}>Alerta criado com sucesso!</Typography>
                                    <Button onClick={handleReset}>Criar novo alerta</Button>
                                </div>
                            ) : (
                                <div>
                                    <Typography className={classes.instructions}>{getStepContent(activeStep)}</Typography>
                                    <div>
                                        <Button
                                            disabled={activeStep === 0}
                                            onClick={handleBack}
                                            className={classes.backButton}
                                        >
                                            Voltar
                                        </Button>
                                        <AdicionarTipoBtn variant="contained" onClick={handleNext}  >
                                            {activeStep === steps.length - 1 ? 'Finalizar' : 'Próximo'}
                                        </AdicionarTipoBtn>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* <button onClick={sendPayload}>Renato</button> */}
                </>
            }

        </>
    );
}