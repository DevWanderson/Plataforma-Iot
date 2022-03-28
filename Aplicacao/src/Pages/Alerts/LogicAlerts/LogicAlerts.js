import React from 'react';
import './LogicAlerts.css';
import { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import { useSelector } from 'react-redux';
import api from '../../../Components/Connections/api'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

const useStyles = makeStyles((theme) => ({
    button: {
        display: 'block',
        marginTop: theme.spacing(2),
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    delete: {
        color: '#C60606',
        fontSize: 30,
    }
}));

export default function LogicAlerts(props) {

    const classes = useStyles();
    const redux = useSelector(state => state)

    const [allVariables, setAllVariables] = useState([]); //Variaveis de acordo com o tipo 
    const [variable, setVariable] = useState(''); //Variável selecionada pelo usuário
    const [variableOpen, setVariableOpen] = useState(false);

    const [operation, setOperation] = useState('');
    const [operationOpen, setOperationOpen] = useState(false);

    const [value, setValue] = useState(''); //Valor digitado pelo usuário
    const [minValue, setMinValue] = useState('');
    const [maxValue, setMaxValue] = useState('');

    const [reqTypes, setReqTypes] = useState([]); //São as variaveis do tipo escolhido.

    const [arrayOperation, setArrayOperations] = useState([]);


    // Funções select variável

    const handleChangeVariable = (event) => {
        setVariable(event.target.value);
    };
    const handleCloseVariable = () => {
        setVariableOpen(false);
    };
    const handleOpenVariable = () => {
        setVariableOpen(true);
    };

    // Funções select operações

    const handleChangeOperation = (event) => {
        setOperation(event.target.value);
    };
    const handleCloseOperation = () => {
        setOperationOpen(false);
    };
    const handleOpenOperation = () => {
        setOperationOpen(true);
    };

    // Funções input com valor da informação que o usuário inserir 

    const handleChangeValue = (event) => {
        setValue(event.target.value)
    }

    const handleChangeMinValue = (event) => {
        setMinValue(event.target.value)
    }

    const handleChangeMaxValue = (event) => {
        setMaxValue(event.target.value)
    }

    //Funções para salvar a operação na array e deletar operação da array

    function saveOp() {

        if (variable !== '' && operation !== '') {

            if (value !== '') {

                setArrayOperations([...arrayOperation, {
                    id: new Date().getTime(),
                    variable,
                    operation,
                    value,

                }])

            }

            if (minValue !== '' && maxValue !== '') {

                setArrayOperations([...arrayOperation, {
                    id: new Date().getTime(),
                    variable,
                    operation,
                    maxValue,
                    minValue,

                }])

            }

        }

        setVariable('')
        setOperation('')
        setMinValue('')
        setMaxValue('')
        setValue('')
    }

    function deleteOp(id) {
        let newList = arrayOperation.filter(item => item.id !== id)
        setArrayOperations(newList)
    }


    //Efeitos 

    useEffect(() => {

        async function get() {

            await api
                .get(`types?user=bruno&type_name=${redux.typeSelected}`)
                .then(response => setReqTypes(response.data))
                .catch(erro => console.log(erro))

        }

        if (redux.typeSelected != '') {
            get();
        }

    }, [redux.typeSelected]) //Faz requisição a api para retornar lista de variaveis do tipo selecionado 

    useEffect(() => {

        console.log(reqTypes)

        if (reqTypes != null) {
            if (reqTypes.length !== 0) {
                let newList = Object.keys(reqTypes.variables)
                setAllVariables(newList)
            }
        }

    }, [reqTypes]) //Altera o estado da lista de variaveis com o resultado da requisição  

    useEffect(() => {
        console.log(arrayOperation)
        props.get(arrayOperation);
    }, [arrayOperation]) //Salva no componente pai o array de operações

    useEffect(() => {
        setArrayOperations([]);
    }, [redux.typeSelected]) //Caso o usuário volte para o passo 1 e altere o tipo, as operações são zeradas

    return (
        <div className='containerGeralLogicAlerts' style={{ display: props.step === 1 ? 'flex' : 'none' }}>

            <div className='containerBoxLogicAlerts'>

                <h5 >Operação</h5>
                {/* <div className='fecharLogicAlerts'>x</div> */}

                <div>
                    <FormControl className={classes.formControl}>
                        <InputLabel id="demo-controlled-open-select-label">Variável</InputLabel>
                        <Select
                            labelId="demo-controlled-open-select-label"
                            id="demo-controlled-open-select"
                            open={variableOpen}
                            onClose={() => { setVariableOpen(false); }}
                            onOpen={() => { setVariableOpen(true); }}
                            value={variable}
                            onChange={(event) => { setVariable(event.target.value) }}
                        >
                            <MenuItem value=''>Selecione um tipo</MenuItem>
                            {allVariables.length != 0 ?

                                allVariables.map(item => {
                                    return <MenuItem key={item} value={item}>{item}</MenuItem>
                                })
                                :

                                ''
                            }


                        </Select>
                    </FormControl>
                </div>

                <div>
                    <FormControl className={classes.formControl}>
                        <InputLabel id="demo-controlled-open-select-label">Operação</InputLabel>
                        <Select
                            labelId="demo-controlled-open-select-label"
                            id="demo-controlled-open-select"
                            open={operationOpen}
                            onClose={() => { setOperationOpen(false); }}
                            onOpen={() => { setOperationOpen(true); }}
                            value={operation}
                            onChange={(event) => { setOperation(event.target.value); }}
                        >
                            <MenuItem value=''>Selecione um tipo</MenuItem>
                            <MenuItem value='>'> &gt; Maior</MenuItem>
                            <MenuItem value='>='> &gt;= Maior ou igual</MenuItem>
                            <MenuItem value='<'> &lt; Menor</MenuItem>
                            <MenuItem value='<='> &lt;= Menor ou igual</MenuItem>
                            <MenuItem value='='> = Igual</MenuItem>
                            <MenuItem value='<>'> &lt; & &gt;  Entre</MenuItem>
                        </Select>
                    </FormControl>
                </div>

                <div >
                    {operation == '<>' ?
                        <div style={{ textAlign: 'center' }}>
                            <TextField
                                label="Mínimo"
                                value={minValue}
                                onChange={(event) => { setMinValue(event.target.value) }}
                                style={{ marginRight: '10px', width: '120px' }}
                            />

                            <TextField
                                label="Máximo"
                                value={maxValue}
                                onChange={(event) => { setMaxValue(event.target.value) }}
                                style={{ width: '120px' }}
                            />
                        </div>

                        :

                        <TextField
                            label="Valor"
                            value={value}
                            onChange={(event) => { setValue(event.target.value) }}
                            style={{ width: '120px' }}
                        />
                    }

                </div>



            </div>


            <div className='containerAddMoreLogicAlerts' >
                <div className='moreLogicAlerts' onClick={saveOp}>+</div>
                <p>Adicionar Operação</p>
            </div>


            <h5 className='alinhadorLogicAlerts'>Lista de Operações</h5>

            <div className='tableOpLogicAlerts'>

                <p className='headerTableLogicAlerts'>Variável</p>
                <p className='headerTableLogicAlerts'>Operação</p>
                <p className='headerTableLogicAlerts'>Valor</p>
                <p className='headerTableLogicAlerts' >Excluir</p>

                {arrayOperation.length != 0 ?
                    arrayOperation.map(item => {
                        return (
                            <>
                                <p >{item.variable}</p>
                                <p >{item.operation}</p>
                                <p >{item.maxValue ? `Max: ${item.maxValue} | Min: ${item.minValue}` : item.value}</p>
                                <p className='deleteLogicAlerts' onClick={() => { deleteOp(item.id) }} ><DeleteForeverIcon className={classes.delete} /></p>
                            </>
                        );


                    })
                    :
                    <p style={{ backgroundColor: 'white', position: 'absolute', textAlign: 'center', width: '100%' }}> Não há nenhuma operação adicionada</p>
                }

            </div>


        </div>



    );
}



