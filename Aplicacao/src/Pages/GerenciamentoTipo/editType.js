import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, TextField, Typography, Checkbox, FormControlLabel, Divider } from '@material-ui/core';
import './style.css'

export default function EditType() {


    const editVar = useSelector((state) => state.editTypeState.editType)

    useEffect(() => {
        console.log(editVar)
    }, [editVar])






    return (
        <Container>
            {
                <div>
                    {Object.keys(editVar).map((key, index) => (
                        <div>
                            <div key={index} >
                                <TextField 
                                style={{ margin: 10, width: '30%' }} 
                                variant='outlined' value={editVar[key]} 
                                InputLabelProps={{ shrink: true }} 
                                label={String([key]).toUpperCase()} 
                                />
                            </div>
                        </div>
                    ))}
                </div>
            }
        </Container>
    )
}