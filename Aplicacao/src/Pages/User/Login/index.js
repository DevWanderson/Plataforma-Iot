import React, { useState, useContext } from 'react';
import './style.css'
import {
    Grid,
    Paper,
    TextField,
    Typography,
    Button,
    Avatar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions
} from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles'
import { useDispatch } from 'react-redux';
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
    const [password, setPassword] = useState('');
    const [open, setOpen] = useState(false);
    const { logar, recoverPassword } = useContext(AuthContext)

    async function handleLogin() {
        logar(email, password)
    }

    async function handleResetPass(){
        recoverPassword(email);
        setEmail('');
        setOpen(false);
    }

    function handleClose() {
        setOpen(false);
    }

    function handleOpen() {
        setOpen(true);
    }



    return (
        <div className='containerLogin'>
            <div className='headerLogin'>
                <Avatar className='' src={LogoIBTI} />
                <Typography variant="h5">IBTI - Plataforma-IoT</Typography>
            </div>

            <Paper className='boxLogin'>
                <div className='boxInputsLogin' onKeyPress={e => {
                    if (e.key === 'Enter') {
                        handleLogin()
                    }
                }}>

                    <Typography className='' variant="h4">Login</Typography>
                    <TextField style={{ width: '50%' }} value={email} onChange={(e) => setEmail(e.target.value)} type="email" className='' variant="outlined" label="Login" />
                    <TextField style={{ width: '50%', marginBottom: 10 }} value={password} onChange={(e) => setPassword(e.target.value)} type="password" className='' variant="outlined" label="Senha" />
                </div>
                <div className='boxButtonLogin'>

                    <ButtonAccess style={{ marginBottom: 0 }} onClick={handleLogin}>Acessar</ButtonAccess>

                    <Link to="/cadastro" style={{ textDecoration: 'none' }}>
                        <Typography>Registre-se</Typography>
                    </Link>
                    <button onClick={handleOpen} className='btnEsqueciAsenha'>
                        <Typography>Esqueci a senha</Typography>
                    </button>
                </div>
            </Paper>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Recuperar senha</DialogTitle>
                <DialogContent>
                    <TextField type='email' variant='outlined' label="Digite o e-mail"/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button onClick={handleResetPass}>Enviar</Button>
                </DialogActions>
            </Dialog>
        </div >

    )
}

export default Login