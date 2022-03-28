import React, { useContext, useState } from 'react';
import './style.css';
import {
    TextField,
    Typography,
    Button,
    Avatar
} from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles'
import { Link, withRouter } from 'react-router-dom';
import { AuthContext } from '../../../Components/Context/contextAuth';
import LogoIBTI from '../../../Assets/Logo-IBTI.png';


const useStyle = makeStyles((theme) => ({
    input: {
        width: '200%',
        marginBottom: '10%'
    }
}))

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

const ValidationTextField = withStyles({
    root: {
        '& input:valid + fieldset': {
            borderColor: 'green',
            borderWidth: 2,
        },
        '& input:invalid + fieldset': {
            borderColor: 'red',
            borderWidth: 2,
        },
        '& input:valid:focus + fieldset': {
            borderLeftWidth: 6,
            padding: '4px !important', // override inline-style
        },
    },
})(TextField);



function Cadastro() {
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')
    const [enterprise, setEnterprise] = useState('');
    const classes = useStyle();
    const { cadastro } = useContext(AuthContext)

    async function handleCadastrar() {
        cadastro(email, password, name, enterprise, lastName)
        console.log(email)
    }

    return (
        <div className="containerCadastro">
            <div className="headerCadastro">
                <Avatar src={LogoIBTI} />
                <Typography variant="h5">IBTI - Plataforma-IoT</Typography>
            </div>
            <div className="boxCadastro">
                <div className="boxInputsCadastro" onKeyPress={e => {
                    if (e.key === 'Enter') {
                        handleCadastrar()
                    }
                }}>
                    <Typography className='' variant="h4">Cadastro</Typography>
                    <ValidationTextField required defaultValue='Success' value={name} onChange={(e) => setName(e.target.value)} type="text" className={classes.input} variant="outlined" label="Nome" />
                    <ValidationTextField required defaultValue='Success' value={lastName} onChange={(e) => setLastName(e.target.value)} type="text" className={classes.input} variant="outlined" label="Sobrenome" />
                    <ValidationTextField required defaultValue='Success' value={email} onChange={(e) => setEmail(e.target.value)} className={classes.input} variant="outlined" label="E-mail" />
                    <ValidationTextField required defaultValue='Success' value={password} onChange={(e) => setPassword(e.target.value)} type="password" className={classes.input} variant="outlined" label="Senha" />
                    <ValidationTextField defaultValue='Success' value={enterprise} onChange={(e) => setEnterprise(e.target.value)} type="text" className={classes.input} variant="outlined" label="Empresa" />

                </div>
                <div className="boxButtonCadastro">
                    <ButtonAccess onClick={handleCadastrar}>Cadastrar</ButtonAccess>
                    Já tem uma conta<Link to="/login"><Typography>Acesse</Typography></Link>
                </div>
            </div>
        </div>
    )
}

export default withRouter(Cadastro);