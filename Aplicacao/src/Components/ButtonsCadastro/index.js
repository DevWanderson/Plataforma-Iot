import React from 'react'
import { IconButton, Tooltip } from '@material-ui/core'
import { withStyles, makeStyles } from '@material-ui/core/styles';
import DoneIcon from '@material-ui/icons/Done'; //ícones
import CloseIcon from '@material-ui/icons/Close';
import { Link } from 'react-router-dom';

const LightTooltip = withStyles((theme) => ({
    tooltip: {
        backgroundColor: theme.palette.common.black,
        color: 'white',
        boxShadow: theme.shadows[1],
        fontSize: 11,
    },
}))(Tooltip);

const useStyles = makeStyles({
    center: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnConfirm: {
        margin: '8px',
        backgroundColor: 'green',
        padding: '8px',
        borderRadius: '5px',
        color: 'white',
        '&:hover': {
            backgroundColor: 'darkgreen',
            color: 'white',
        },
    },
    btnCancel: {
        backgroundColor: '#aaa',
        padding: '5px 8px',
        borderRadius: '5px',
        color: 'white',
        '&:hover': {
            backgroundColor: '#888',
            color: 'white',
        },
    },
})

export default function ButtonsCadastro(props) {
    const classes = useStyles()
    return (
        <div className={classes.center}>
            <LightTooltip title="Cadastrar" aria-label="cadastrar" placement="left-start">
                <IconButton variant="contained" onClick={() => { props.Cadastro() }} className={classes.btnConfirm}>
                
                    <DoneIcon />
                
                </IconButton>
            </LightTooltip >

            <LightTooltip title="Cancelar" aria-label="cancelar" placement="right-end">
                <Link to='dispositivos-cadastrados' className={classes.btnCancel} >
                    <CloseIcon />
                </Link>
            </LightTooltip>
        </div>
    )
}
