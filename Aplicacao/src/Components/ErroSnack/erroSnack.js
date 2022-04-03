import React, { useState } from 'react';
import { Snackbar } from '@material-ui/core';

export function ErroSnack({ openSnack, close, descriptionErro, vertical, horizontal }) {

    return (
        <Snackbar 
        key={vertical + horizontal} 
        open={openSnack} 
        onClose={close} 
        message={descriptionErro}/>  
    )
}