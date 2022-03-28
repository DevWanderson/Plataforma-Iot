import React from 'react';
import './FinalAlerts.css'
import { makeStyles } from '@material-ui/core/styles';
import TelegramIcon from '@material-ui/icons/Telegram';
import EmailIcon from '@material-ui/icons/Email';

const useStyles = makeStyles((theme) => ({
    telegram: {
        color: '#34AADF',
        margin: '10px',
    },

    email: {
        color: '#DE5145',
        margin: '10px',
    },

    message: {
        color: '#3C4043',
        margin: '10px',
    }
}))


export default function FinalAlerts(props) {

    const classes = useStyles()

    return (
        <div className='containerFinalAlerts' style={{ display: props.step === 3 ? 'flex' : 'none' }}>
            <div className='devicesFinalAlerts'>
                <h4 style={{ fontWeight: 600 }}>Dispositivos selecionados</h4>
                <span className='listDeviceFinalAlerts'>
                    {props.devices.map(item => {
                        return <p className='liFinalAlerts' key={item}>{item}</p>
                    })}
                </span>

            </div>

            <div className='logicFinalAlerts'>

                <h4 style={{ fontWeight: 600 }}>Lógica de alerta:</h4>


                <div className='tableOpFinalAlerts'>

                    <p className='headerTableFinalAlerts'>Variável</p>
                    <p className='headerTableFinalAlerts'>Operação</p>
                    <p className='headerTableFinalAlerts'>Valor</p>

                    {props.logic.length != 0 ?
                        props.logic.map(item => {
                            return (
                                <>
                                    <p >{item.variable}</p>
                                    <p >{item.operation}</p>
                                    <p >{item.maxValue ? `Max: ${item.maxValue} | Min: ${item.minValue}` : item.value}</p>

                                </>
                            );


                        })
                        :
                        <p style={{ backgroundColor: 'white', position: 'absolute', textAlign: 'center', width: '100%' }}> Não há nenhuma operação adicionada</p>
                    }

                </div>


            </div>

            <div className='contactFinalAlerts'>
                <h4 style={{ fontWeight: 600 }}>Alertar em:</h4>
                <div className='dataContactFinalAlerts'>
                    {props.payload.telegram === '' ? '' : <p> <strong>Telegram:</strong>  {props.payload.telegram}  <TelegramIcon className={classes.telegram} /></p>}
                    {props.payload.email === '' ? '' : <p> <strong>Email:</strong>  {props.payload.email} <EmailIcon className={classes.email} /></p>}
                </div>

            </div>

            <div className='messageFinalAlerts'>
                <h4 style={{ fontWeight: 600 }}>Mensagem:</h4>
                <span className='dataMessageFinalAlerts'>
                    <p>{props.payload.msg}</p>
                </span>

            </div>
        </div >

    );
}