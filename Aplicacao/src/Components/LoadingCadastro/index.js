import React, { useState } from 'react'
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import SuccessAnimation from '../../Components/SuccessAnimation'
import { makeStyles } from '@material-ui/core/styles'

const useStylesGrid = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    circularProgress: {
        color: '#FF9400',
    }
}))

export default function LoadingCadastro(props) {
    const classes = useStylesGrid()

    return (
        <div>
            <Backdrop className={classes.backdrop} open={props.loading.openBackdrop}>
                {props.loading.showSuccess ?
                    <SuccessAnimation device={props.device} page={props.redirectToPage} />
                    :
                    <CircularProgress className={classes.circularProgress} size={80} />
                }
            </Backdrop>
        </div>
    )
}