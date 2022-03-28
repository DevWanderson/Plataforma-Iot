import React, { useState } from 'react';
import {
    Container,
    Grid,
    FormGroup,
    Button,
    TextField,
    Paper,
    MenuItem,
    Card,
    CardContent,
    IconButton,
    Tooltip,
    Box,
    Snackbar,
    Checkbox,
    FormControlLabel,
}
    from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import { RemoveCircleOutline, Add } from '@material-ui/icons'
import { Link } from 'react-router-dom';
import { VscSymbolOperator } from 'react-icons/vsc';
import './styles.css';
import api from '../../Components/Connections/api'
import { makeStyles, withStyles } from '@material-ui/core/styles';
import MuiAlert from '@material-ui/lab/Alert';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import ButtonsCadastro from '../../Components/ButtonsCadastro';

const AdicionarVarBtn = withStyles((theme) => ({
    root: {
        color: '#FFF',
        backgroundColor: "#18591C",
        '&:hover': {
            backgroundColor: '#5BA971',
        },
    }
}))(Button)

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
    titleVariable: {
        color: 'rgb(85, 85, 85)',
        textTransform: 'inherit',
        fontSize: '1.1rem',
        fontWeight: '600',
        // fontFamily: "'Open Sans', sans-serif",
        opacity: '1',
    },
    paperHeader: {
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
        backgroundColor: 'blue',
    },
    operation: {
        margin: '0 10px',
        textAlign: 'right',
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    leftPosition: {
        display: 'flex',
        direction: 'row',
        justifyContent: 'flex-start'
    }
}));

const LightTooltip = withStyles((theme) => ({
    tooltip: {
        backgroundColor: theme.palette.common.black,
        color: 'white',
        boxShadow: theme.shadows[1],
        fontSize: 11,
    },
}))(Tooltip);

export default function CadastroTipo({ navigation }) {
    const [form, setForm] = useState({ cards: [] });
    const [cadastro, setCadastro] = useState();
    const [args, setArgs] = useState([]);
    const [operations, setOperations] = useState([
        {
            id: 0, name: 'Operação', value: null
        },
        {
            id: 1, name: "Soma", value: "sum"
        },
        {
            id: 2, name: "Divisão", value: "div"
        },
        {
            id: 3, name: "Multiplicação", value: "mux"
        },
        {
            id: 4, name: "Máscara", value: "mask"
        },
    ]);
    const [ordemByte, setOrdemBytes] = useState([{ id: 0, name: '', value: '' }, { id: 1, name: 'Little-endian (trás p/ frente)', value: 'little' }, { id: 2, name: 'Big-endian (frente p/ trás)', value: 'big' },])
    const [saveOrdemByte, setSaveOrdemByte] = useState(1);
    const [tamanhoByte, setTamanhoByte] = useState('');
    const [nome, setNome] = useState('');

    ////////////// Checkbox para tipo global ///////////////
    const [checkGlobal, setCheckGlobal] = React.useState(true);

    const handlecheckGlobal = (event) => {
        setCheckGlobal(event.target.checked);
        console.log("Checkbox tipo global: " + checkGlobal)
    };

    ////////////// Checkbox para Signed ////////////////
    const [checkSigned, setCheckSigned] = React.useState([]);

    const handlecheckSigned = (e, index) => {
        setCheckSigned(checkSigned, [e.target.checked]);
        console.log(`
            Checkbox signed (sinalizada): $(checkSigned) 
            e.target.name = ${e.target.name} 
            even.targe.checked = ${e.target.checked}
        `)
        let newForm = { ...form }
        newForm.cards[index][e.target.name] = e.target.checked;
        setForm(newForm)
    };

    const [indexForm, setIndexForm] = React.useState(0);

    const addNewCamp = () => {
        console.log("Index form: " + indexForm)
        setCheckSigned([...checkSigned, indexForm])
        // setCheckSigned([{index: indexForm, checked: false}])
        console.log("checkSigned: " + JSON.stringify(checkSigned))
        // console.log(`array index and elements object: ${checkSigned[indexForm].checked}`)

        setIndexForm(indexForm + 1)

        let newForm = { ...form }
        let newCard = {
            variavel: "",
            bitInicial: "",
            bitFinal: "",
            saveArgs: [],
            operationsSelects: []
        }

        //##### Código temporário para Demo ##### //
        // newCard["signed"] = true //fixa o signed (sinalizada) para true
        //#########################################

        if (newCard["signed"] == undefined) {
            newCard["signed"] = false
        }

        newForm.cards.push(newCard);
        setForm(newForm)
    }


    const addNewOperation = (index) => {
        let newForm = { ...form }
        let newOperationSelect = {
            operacao: [],
            args: []
        }
        newForm.cards[index].operationsSelects.push(newOperationSelect);
        newForm.cards[index].saveArgs.push(newOperationSelect);
        setForm(newForm)
    }

    const onFormUpdate = (e, index) => {
        let newForm = { ...form }
        newForm.cards[index][e.target.name] = e.target.value;
        setForm(newForm)
    }

    function onOperationSelectUpdate(e, cardIndex, selectIndex) {
        let newForm = { ...form };
        newForm.cards[cardIndex].operationsSelects[selectIndex].operacao = e.target.value;
        setForm(newForm);
    }

    function newArgs(e, cardIndex, selectIndex) {
        let newForm = { ...form };
        newForm.cards[cardIndex].saveArgs[selectIndex].args = e.target.value;
        setForm(newForm);
    }

    function onOrdemByte(e) {
        setOrdemBytes(e.target.value)
    }

    function operationRemove(cardIndex, selectIndex) {
        console.log(`Index variable: ${cardIndex}`)
        let newForm = { ...form };
        newForm.cards[cardIndex].operationsSelects.splice(selectIndex, 1);
        setForm(newForm);
    }

    const variableRemove = (cardIndex, selectIndex) => {
        //setForm([...newCard.filter((_, index) => index !== position)])
        console.log(`Index variable: ${cardIndex}`)
        let newForm = { ...form };
        console.log(`New forms old: ${newForm.cards}`)
        newForm.cards.forEach(element => {
            console.log(element)
        });
        newForm.cards.splice(cardIndex, 1)
        setForm(newForm);
        console.log(`New forms current: ${newForm.cards}`)
        newForm.cards.forEach(element => {
            console.log(element)
        });
    }

    console.log(cadastro)

    async function Cadastro() {
        // showLoading()
        console.log("--- Cadastro de tipo ---")

        if (nome == '' || tamanhoByte == '' || saveOrdemByte > 0) {
            setContentMessage({ msg: 'Os campos nome, ordem dos bits e tamanho do byte são obrigatórios!', severity: 'error' })
            openMessage()
        } else {
            const data = {
                name: nome,
                tamanhoByte: tamanhoByte,
                ordemByte: saveOrdemByte,
                variables: form,
                global: checkGlobal, // Fixo: tipo acessível para todos os usuário - *mudar depois            
            }
            const user = JSON.parse(localStorage.getItem('Auth_user')).name

            console.log("#### Data ####")
            Object.keys(data).forEach(element => {
                console.log(element + ' - ' + data[element])
            });

            console.log("#### Data -> variables")
            Object.keys(data).forEach(element => {
                console.log(element.variables)
            });
            console.log(JSON.stringify(data))

            // api.post('/types?user=' + user, data)
            //     .then(res => {
            //         console.log('Data: ' + res.data)
            //         if (res.data == '') {
            //             closeLoading()
            //             setContentMessage({ msg: 'Ocorreu um erro ao cadastrar o Tipo!', severity: 'error' })
            //             openMessage()
            //         } else {
            //             setContentMessage({ msg: 'Tipo cadastrado cadastrado com sucesso', severity: 'success' })
            //             closeLoading()
            //             openMessage()
            //         }
            //     })
            //     .catch((err) => {
            //         console.log('Erro: ' + err)
            //         closeLoading()
            //         setContentMessage({ msg: 'Ocorreu um erro ao cadastrar o Tipo!', severity: 'error' })
            //         openMessage()
            //     })
        }
    }

    /////////////// Message /////////////////////
    const [contentMessage, setContentMessage] = React.useState([])
    const [message, setMessage] = React.useState(false);

    const openMessage = () => {
        setMessage(true);
    };

    const closeMessage = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setMessage(false);
    };

    function Alert(props) {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
    }
    /////////////////////////////////////////////

    //////////////// Loading ////////////////////    
    const [open, setOpen] = React.useState(false);
    const showLoading = () => {
        setOpen(true);
    };

    const closeLoading = () => {
        setOpen(false);
    };
    //////////////////////////////////////////////

    const classes = useStylesGrid();

    return (
        <Container fluid style={{ marginTop: '5px' }} >
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Paper className={classes.paperHeader}>
                        {/* <img src={mqttIcon} alt="mqtt logo" width="70"></img>                         */}
                        <span className={classes.title}>Cadastro do Tipo</span>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        <FormGroup onSubmit={Cadastro}>
                            <FormGroup>
                                <Grid container spacing={1}>
                                    <Grid item xs={12} className={classes.leftPosition}>
                                        <FormControlLabel
                                            style={{ marginBottom: 0 }}
                                            control={
                                                <Checkbox
                                                    checked={checkGlobal}
                                                    onChange={handlecheckGlobal}
                                                    name="checkGlobal"
                                                    color="primary"
                                                />
                                            }
                                            label="Global"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField className={classes.formField} required variant="filled" label="Nome do Tipo" value={nome} onChange={(e) => setNome(e.target.value)} fullWidth />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField className={classes.formField} required variant="filled" label="Ordem dos Bits de Dados" select value={saveOrdemByte} onChange={e => setSaveOrdemByte(e.target.value)} fullWidth="true" >
                                            {ordemByte.map((byte) => (
                                                <MenuItem key={byte.id} value={byte.value}>{byte.name}</MenuItem>
                                            ))}
                                        </ TextField>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField className={classes.formField} required variant="filled" label="Tamanho Byte" value={tamanhoByte} onChange={(e) => setTamanhoByte(e.target.value)} fullWidth />
                                    </Grid>
                                </Grid>
                            </FormGroup>

                            {form.cards.length > 0 && form.cards.map((card, index) => (
                                <Card key={index} style={{ marginBottom: 20, marginTop: 20 }} variant="outlined">
                                    <Grid
                                        container
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        style={{ padding: '5px 10px' }}
                                    >
                                        <span className={classes.titleVariable}>{`Variável ${index + 1}`}</span>
                                        <LightTooltip title={`Remover Variável ${index + 1}`} aria-label="remover" placement="left-start">
                                            <IconButton size='small' onClick={() => variableRemove(index)} color="secondary"><CancelIcon style={{ fontSize: 30 }} /></IconButton>
                                        </LightTooltip>
                                    </Grid>
                                    <Box >

                                    </Box>
                                    <CardContent>
                                        <FormGroup>
                                            <Grid container spacing={1}>
                                                <Grid item xs={12}>
                                                    <TextField variant="filled" label={`Nome da variável ${index + 1}`} name="variavel" value={card.variavel} onChange={(e) => onFormUpdate(e, index)} fullWidth />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <TextField variant="filled" label={`Byte inicial ${index + 1}`} name="bitInicial" value={card.bitInicial} onChange={(e) => onFormUpdate(e, index)} fullWidth />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <TextField variant="filled" label={`Byte final ${index + 1}`} name="bitFinal" value={card.bitFinal} onChange={(e) => onFormUpdate(e, index)} fullWidth />
                                                </Grid>
                                                <Grid item xs={12} className={classes.leftPosition}>
                                                    <FormControlLabel
                                                        style={{ marginBottom: 0 }}
                                                        // checked={true}
                                                        control={
                                                            <Checkbox
                                                                // defaultChecked                                                                
                                                                onChange={(e) => handlecheckSigned(e, index)}
                                                                name="signed"
                                                                color="primary"
                                                                inputProps={{ 'aria-label': 'secondary checkbox' }}
                                                            />
                                                        }
                                                        label="Sinalizada"

                                                    />


                                                </Grid>
                                                <Grid item xs>
                                                    {form.cards[index].operationsSelects &&
                                                        form.cards[index].operationsSelects.length > 0 &&
                                                        form.cards[index].operationsSelects.map((operationSelect, i) => (
                                                            <FormGroup row key={i} >
                                                                <Grid container spacing={1} direction="row" justifyContent="flex-start" alignItems="center" style={{ margin: '0 10px', textAlign: 'right' }}>
                                                                    <Grid item xs={12} sm={3} >
                                                                        <TextField variant="outlined" select label="Operação" value={form.cards[index].operationsSelects[i].operacao} onChange={(e) => onOperationSelectUpdate(e, index, i)} fullWidth>
                                                                            {operations.map((operation) => (
                                                                                <MenuItem key={operation.id} value={operation.value}>{operation.name}</MenuItem>
                                                                            ))}
                                                                        </TextField>
                                                                    </Grid>
                                                                    <Grid item xs={12} sm={3}>
                                                                        <TextField variant="outlined" label="ARGS" name="saveArgs" onChange={(e) => newArgs(e, index, i)} fullWidth />
                                                                    </Grid>
                                                                    <Grid item xs={12} sm={1}>
                                                                        <LightTooltip title="Remover operação" aria-label="remover" placement="right-start">
                                                                            <Button variant="contained" color="secondary" onClick={() => operationRemove(index, i)}  ><RemoveCircleOutline style={{ fontStyle: 30 }} /></Button>
                                                                        </LightTooltip>
                                                                    </Grid>
                                                                </Grid>
                                                            </FormGroup>
                                                        ))
                                                    }
                                                </Grid>
                                            </Grid>
                                            <FormGroup row>
                                                <LightTooltip title="Adicionar operação" aria-label="adicionar" placement="right-start">
                                                    <Button style={{ width: 50, height: 50, margin: '10px 0' }} onClick={() => addNewOperation(index)} color="primary" variant="contained"><VscSymbolOperator size={25} /></Button>
                                                </LightTooltip>
                                            </FormGroup>
                                        </FormGroup>
                                    </CardContent>
                                </Card>
                            ))
                            }
                            <FormGroup row>
                                <LightTooltip title="Adicionar variável" aria-label="adicionar" placement="right-start">
                                    <AdicionarVarBtn style={{ margin: '10px 0' }} variant="contained" color="primary" onClick={() => addNewCamp()}><Add style={{ margin: 'auto', color: 'white' }} /> Variável</AdicionarVarBtn>
                                </LightTooltip>
                            </FormGroup>
                        </FormGroup>
                        <ButtonsCadastro Cadastro={Cadastro} />
                    </Paper>
                </Grid>
            </Grid>
            <Snackbar open={message} autoHideDuration={6000} onClose={closeMessage}>
                <Alert onClose={closeMessage} severity={contentMessage.severity}>
                    {contentMessage.msg}
                </Alert>
            </Snackbar>
            <div>
                <Backdrop className={classes.backdrop} open={open}>
                    <CircularProgress color="inherit" />
                </Backdrop>
            </div>
        </Container>
    )
}