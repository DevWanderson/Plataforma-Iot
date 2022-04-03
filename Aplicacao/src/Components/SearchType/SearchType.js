import React from 'react';
import './SearchType.css'
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { useEffect } from 'react';
import { addType } from '../../Reducers/ReduxAlertType/AlertActions';


const useStyles = makeStyles((theme) => ({
    button: {
        display: 'block',
        marginTop: theme.spacing(2),
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
}));

export default function SearchType(props) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [open, setOpen] = React.useState(false);

    const redux = useSelector(state => state)
    const [types, setTypes] = useState([])
    const [typeSelected, setTypeSelected] = useState('');


    useEffect(() => {
        setTypes(redux.typeState.dadosType)
    }, [redux.typeState.dadosType])

    useEffect(() => {
        dispatch(addType(typeSelected))
    }, [typeSelected])

    const handleChange = (event) => {
        setTypeSelected(event.target.value);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    return (
        <div className='containerSearchType'>

            <FormControl className={classes.formControl} variant='outlined'>
                <InputLabel id="demo-controlled-open-select-label">Tipo</InputLabel>
                <Select
                    labelId="demo-controlled-open-select-label"
                    id="demo-controlled-open-select"
                    open={open}
                    onClose={handleClose}
                    label="Tipo"
                    onOpen={handleOpen}
                    value={typeSelected}
                    onChange={handleChange}
                    
                >
                    {types == '' ?
                        < MenuItem value='vazio'>Não há tipos</MenuItem>
                        :

                        types.map(item => {
                            return <MenuItem value={item}>{item}</MenuItem>
                        })

                    }

                </Select>
            </FormControl>

        </div >

    );
}