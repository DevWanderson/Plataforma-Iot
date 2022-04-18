import React, { useContext, useState, useEffect } from 'react';
import './style.css';
import {
    TextField,
    Typography,
    Button,
    Avatar,
    Snackbar,
    Alert,
    Paper,
    InputAdornment,
    IconButton,
    OutlinedInput,
    InputLabel,
    FormControl
} from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles'
import { Link, withRouter } from 'react-router-dom';
import { AuthContext } from '../../../Components/Context/contextAuth';
import LogoIBTI from '../../../Assets/Logo-IBTI.svg';
import checkOk from '../../../Assets/icon-check.png'
import checkError from '../../../Assets/icon-close.png'
import { Visibility, VisibilityOff } from '@material-ui/icons';




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
    const [visible, setVisible] = useState(true);
    const classes = useStyle();
    const { cadastro } = useContext(AuthContext)

    const [validationInput, setValidationInput] = useState({
        case: false,
        number: false,
        caractere: false,
        length: false
    })

    const setSecurity = (password) => {
        const regexUppercase = new RegExp(/^(?=.*[A-Z]).+$/)
        const regexLowercase = new RegExp(/^(?=.*[a-z]).+$/)
        const regexNumber = new RegExp(/^(?=.*[0-9]).+$/)
        const regexCaractere = new RegExp(/^(?=.*[@$!%?&#]).+$/)
        const length = password.length >= 8

        setValidationInput({
            case: regexUppercase.test(password) && regexLowercase.test(password),
            number: regexNumber.test(password),
            caractere: regexCaractere.test(password),
            length
        })
        setPassword(password)

    }

    function handleSeePass() {
        setVisible(true);
        console.log(visible)
    }

    function handleClosePass() {

    }



    async function handleCadastrar() {
        if (validationInput.case == true &&
            validationInput.number == true &&
            validationInput.length == true &&
            validationInput.caractere == true) {
            cadastro(email, password, name, enterprise, lastName)
        } else if (password == '' || password == null) {
            return validationInput.case == false || validationInput.number == false || validationInput.length == false || validationInput.caractere == false
        } else {
            console.log(validationInput)
            alert(`Senha incorreta!!`)
        }

    }



    useEffect(() => {

    }, [])




    return (
        <div className="containerCadastro">
            <div className="headerCadastro">
                <Avatar src={LogoIBTI} />
                <Typography variant="h5">IBTI - Plataforma-IoT</Typography>
            </div>
            <Paper style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 20, width: '45%' }}>

                <div className="boxInputsCadastro" onKeyPress={e => {
                    if (e.key === 'Enter') {
                        handleCadastrar()
                    }
                }}>
                    <Typography className='' variant="h4">Cadastro</Typography>
                    <ValidationTextField required value={name} onChange={(e) => setName(e.target.value)} type="text" className={classes.input} variant="outlined" label="Nome" />
                    <ValidationTextField required defaultValue='Success' value={lastName} onChange={(e) => setLastName(e.target.value)} type="text" className={classes.input} variant="outlined" label="Sobrenome" />
                    <ValidationTextField required defaultValue='Success' value={email} onChange={(e) => setEmail(e.target.value)} className={classes.input} variant="outlined" label="E-mail" />
                    <FormControl className={classes.input} variant="outlined">
                        <InputLabel>{validationInput.case == true && validationInput.number == true && validationInput.length == true && validationInput.caractere == true ? <img src={checkOk} width={20} height={20} /> : <img src={checkError} width={20} height={20} />} </InputLabel>
                        <OutlinedInput
                            placeholder='A senha deve conter no minimo 8 caracteres'
                            required
                            value={password}
                            onChange={(password) => setSecurity(password.target.value)}
                            type={visible ? 'password' : 'text'}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setVisible(!visible)}>
                                        {visible ? <VisibilityOff style={{ fontSize: 25 }} /> : <Visibility style={{ fontSize: 25 }} />}
                                    </IconButton>
                                </InputAdornment>

                            }
                        />
                    </FormControl>
                    {password && password.length > 0 ? (
                        <div style={{ display: 'flex', width: '190%', flexDirection: 'column', marginTop: -18 }}>
                            <Typography style={{ color: '#616161' }}>{validationInput.case == true ? <img src={checkOk} width={10} height={10} /> : <img src={checkError} width={10} height={10} />} Letras maiúscula e minúsculas</Typography>
                            <Typography style={{ color: '#616161' }}> {validationInput.number == true ? <img src={checkOk} width={10} height={10} /> : <img src={checkError} width={10} height={10} />} Números</Typography>
                            <Typography style={{ color: '#616161' }}> {validationInput.length == true ? <img src={checkOk} width={10} height={10} /> : <img src={checkError} width={10} height={10} />} 8 digitos ou mais</Typography>
                            <Typography style={{ color: '#616161' }}> {validationInput.caractere == true ? <img src={checkOk} width={10} height={10} /> : <img src={checkError} width={10} height={10} />} Caractere especiais (@$!%?&#)</Typography>
                        </div>
                    ) :
                        ''
                    }

                    <ValidationTextField defaultValue='Success' value={enterprise} onChange={(e) => setEnterprise(e.target.value)} type="text" className={classes.input} variant="outlined" label="Empresa" />

                </div>
                <div className="boxButtonCadastro">
                    <ButtonAccess onClick={handleCadastrar}>Cadastrar</ButtonAccess>
                    Já tem uma conta?<Link to="/login"><Typography>Acesse aqui</Typography></Link>
                </div>

            </Paper>
        </div>
    )
}

export default withRouter(Cadastro);