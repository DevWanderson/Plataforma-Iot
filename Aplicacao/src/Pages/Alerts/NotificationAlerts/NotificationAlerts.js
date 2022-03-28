import React, { useEffect, useState } from 'react';
import './NotificationAlerts.css';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import TelegramIcon from '@material-ui/icons/Telegram';
import EmailIcon from '@material-ui/icons/Email';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import TextFieldsIcon from '@material-ui/icons/TextFields';
import TimerIcon from '@material-ui/icons/Timer';

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


export default function NotificationAlerts(props) {

    const classes = useStyles()

    const [stateName, setStateName] = useState(true) //Campo obrigatório em sem check
    const [statePeriod, setStatePeriod] = useState(true) //Campo obrigatório em sem check
    const [stateTelegram, setStateTelegram] = useState(false);
    const [stateEmail, setStateEmail] = useState(false)
    const [stateMessage, setStateMessage] = useState(true)//Campo obrigatório em sem check
    const [name, setName] = useState('')
    const [period, setPeriod] = useState(5);
    const [telegram, setTelegram] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {

        if (stateName === false) { //Caso o usuário desmarque o checkbox, o valor do input é zerado
            setName('');
        }

        if (statePeriod === false) { //Caso o usuário desmarque o checkbox, o valor do input é zerado
            setPeriod('');
        }

        if (stateEmail === false) { //Caso o usuário desmarque o checkbox, o valor do input é zerado
            setEmail('');
        }

        if (stateTelegram === false) { //Caso o usuário desmarque o checkbox, o valor do input é zerado
            setTelegram('');
        }

        if (stateMessage === false) { //Caso o usuário desmarque o checkbox, o valor do input é zerado
            setMessage('');
        }


    }, [stateName, statePeriod, stateEmail, stateTelegram, stateMessage])

    useEffect(() => {


        props.get([name, period, telegram, email, message])

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [name, period, telegram, email, message])


    return (
        <div className='containerNotificationAlert' style={{ display: props.step === 2 ? 'flex' : 'none' }}>

            <label>

                <Checkbox
                    color='primary'
                    onChange={() => { setStateName(!stateName) }}
                    disabled
                />

                <TextField
                    id="outlined-basic"
                    label="Nome do alerta (Obrigatório)"
                    variant="outlined"
                    disabled={stateName === false ? true : false}
                    onChange={(event) => { setName(event.target.value) }}
                    value={name}
                    style={{ width: '100%' }}
                />

                <TextFieldsIcon className={classes.message} />
            </label>


            <label>
                <Checkbox
                    color='primary'
                    onChange={() => { setStatePeriod(!statePeriod) }}
                    disabled
                />

                <TextField
                    id="outlined-basic"
                    label="Intervalo de alerta em s (Obrigatório)"
                    variant="outlined"
                    disabled={statePeriod === false ? true : false}
                    onChange={ (event) => { setPeriod(event.target.value) } }
                    value={period}
                    style={{ width: '100%' }}
                    type='number'
                />

                <TimerIcon className={classes.message} />
            </label>

            <label>
                <Checkbox
                    color='primary'
                    onChange={() => { setStateTelegram(!stateTelegram) }}
                />

                <TextField
                    id="outlined-basic"
                    label="Telegram"
                    variant="outlined"
                    disabled={stateTelegram === false ? true : false}
                    onChange={(event) => { setTelegram(event.target.value) }}
                    value={telegram}
                    style={{ width: '100%' }}
                />

                <TelegramIcon className={classes.telegram} />
            </label>

            <label>
                <Checkbox
                    color='primary'
                    onChange={() => { setStateEmail(!stateEmail) }}

                />

                <TextField
                    id="outlined-basic"
                    label="E-mail"
                    variant="outlined"
                    disabled={stateEmail === false ? true : false}
                    onChange={(event) => { setEmail(event.target.value) }}
                    value={email}
                    style={{ width: '100%' }}
                    type='email'
                />

                <EmailIcon className={classes.email} />
            </label>

            <label>
                <Checkbox
                    color='primary'
                    onChange={() => { setStateMessage(!stateMessage) }}
                    disabled
                />

                <TextareaAutosize
                    aria-label="minimum height"
                    minRows={3}
                    placeholder="Mensagem de alerta (Obrigatório)"
                    style={{ width: '100%', paddingInline: '10px', border: '1px #C4C4C4 solid', borderRadius: '5px', outlineColor: '#3F51B5', paddingBlock: '10px' }}
                    disabled={stateMessage === false ? true : false}
                    onChange={(event) => { setMessage(event.target.value) }}
                    value={message}
                />

                <TextFieldsIcon className={classes.message} />
            </label>

        </div>

    );
}
