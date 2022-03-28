import React, { useState, useContext } from 'react';
import './style.css'
import {
    Grid,
    Paper,
    TextField,
    Typography,
    Button,
    Avatar
} from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles'
import { Link, Redirect } from 'react-router-dom';
import LogoIBTI from '../../../Assets/Logo-IBTI.png';
import { AuthContext } from '../../../Components/Context/contextAuth';


const ButtonAccess = withStyles(() => ({
    root: {
        color: '#FFF',
        background: '#262626',
        '&:hover': {
            backgroundColor: '#777777',
        },
        width: '100%',
        borderRadius: 20,
        marginBottom: '5%'

    }
}))(Button)

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')

    const { logar } = useContext(AuthContext)

    async function handleLogin() {
        logar(email, password)
    }

    
    return (
        <div className='containerLogin'>
            <div className='headerLogin'>
                <Avatar className='' src={LogoIBTI} />
                <Typography variant="h5">IBTI - Plataforma-IoT</Typography>
            </div>
            <div className='boxLogin'>
                <div className='boxInputsLogin' onKeyPress={e => {
                    if (e.key === 'Enter') {
                        handleLogin()
                    }
                }}>

                    <Typography className='' variant="h4">Login</Typography>
                    <TextField style={{ width: '50%' }} value={email} onChange={(e) => setEmail(e.target.value)} type="email" className='' variant="outlined" label="Login" />
                    <TextField style={{ width: '50%' }} value={password} onChange={(e) => setPassword(e.target.value)} type="password" className='' variant="outlined" label="Senha" />
                </div>
                <div className='boxButtonLogin'>
                    
                        <ButtonAccess style={{ marginBottom: 0 }} onClick={handleLogin}>Acessar</ButtonAccess>
                    
                    <Link to="/cadastro">
                        <Typography>Registre-se</Typography>
                    </Link>
                </div>
            </div>

        </div >

    )
}

export default Login