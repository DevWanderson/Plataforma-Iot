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
            {/*  <div className='containerInput'>
                <TextField style={{ margin: 10, width: '30%' }} variant='outlined' value={editVar.name} InputLabelProps={{ shrink: true }} label="Name" />
                <Typography variant='h5'>Váriaveis</Typography>
                <div className='var'>
                    <div style={{ display: "flex" }}>
                        <TextField style={{ margin: 10, width: '21%', marginBottom: 25 }} variant='outlined' value={editVar.variables} InputLabelProps={{ shrink: true }} label="LAT" />
                        <TextField style={{ margin: 10, width: '21%', marginBottom: 25 }} variant='outlined' value={editVar.name} InputLabelProps={{ shrink: true }} label="BYTE" />
                        <TextField style={{ margin: 10, width: '21%', marginBottom: 25 }} variant='outlined' value={editVar.name} InputLabelProps={{ shrink: true }} label="BYTE" />
                    </div>
                    <FormControlLabel
                        style={{ marginLeft: 2 }}
                        control={
                            <Checkbox
                                checked={true}
                                onChange={() => { }}
                                color="primary"
                            />

                        }
                        label="SIGNED"
                    />
                    <Divider style={{ marginBottom: 20 }} />
                    <div style={{ display: "flex" }}>
                        <TextField style={{ margin: 10, width: '21%', marginBottom: 20 }} variant='outlined' value={editVar.name} InputLabelProps={{ shrink: true }} label="LONG" />
                        <TextField style={{ margin: 10, width: '21%', marginBottom: 20 }} variant='outlined' value={editVar.name} InputLabelProps={{ shrink: true }} label="BYTE" />
                        <TextField style={{ margin: 10, width: '21%', marginBottom: 20 }} variant='outlined' value={editVar.name} InputLabelProps={{ shrink: true }} label="BYTE" />
                    </div>
                    <FormControlLabel
                        style={{ marginLeft: 2 }}
                        control={
                            <Checkbox
                                checked={true}
                                onChange={() => { }}
                                color="primary"
                            />

                        }
                        label="SIGNED"
                    />
                    <Divider style={{ marginBottom: 20 }} />
                    <div style={{ display: "flex" }}>
                        <TextField style={{ margin: 10, width: '21%', marginBottom: 20 }} variant='outlined' value={editVar.name} InputLabelProps={{ shrink: true }} label="ALTITUDE" />
                        <TextField style={{ margin: 10, width: '21%', marginBottom: 20 }} variant='outlined' value={editVar.name} InputLabelProps={{ shrink: true }} label="BYTE" />
                        <TextField style={{ margin: 10, width: '21%', marginBottom: 20 }} variant='outlined' value={editVar.name} InputLabelProps={{ shrink: true }} label="BYTE" />
                    </div>
                    <FormControlLabel
                        style={{ marginLeft: 2 }}
                        control={
                            <Checkbox
                                checked={true}
                                onChange={() => { }}
                                color="primary"
                            />

                        }
                        label="SIGNED"
                    />

                    <Divider style={{ marginBottom: 20 }} />
                    <div style={{ display: "flex" }}>
                        <TextField style={{ margin: 10, width: '21%', marginBottom: 20 }} variant='outlined' value={editVar.name} InputLabelProps={{ shrink: true }} label="VELOCIDADE" />
                        <TextField style={{ margin: 10, width: '21%', marginBottom: 20 }} variant='outlined' value={editVar.name} InputLabelProps={{ shrink: true }} label="BYTE" />
                        <TextField style={{ margin: 10, width: '21%', marginBottom: 20 }} variant='outlined' value={editVar.name} InputLabelProps={{ shrink: true }} label="BYTE" />
                    </div>
                    <FormControlLabel
                        style={{ marginLeft: 2 }}
                        control={
                            <Checkbox
                                checked={true}
                                onChange={() => { }}
                                color="primary"
                            />

                        }
                        label="SIGNED"
                    />
                    <Divider style={{ marginBottom: 20 }} />
                    <div style={{ display: "flex" }}>
                        <TextField style={{ margin: 10, width: '5%', marginBottom: 20 }} variant='outlined' value={editVar.name} InputLabelProps={{ shrink: true }} label="SIZE" />
                        <TextField style={{ margin: 10, width: '5%', marginBottom: 20 }} variant='outlined' value={editVar.name} InputLabelProps={{ shrink: true }} label="ORDER" />
                    </div>
                    <FormControlLabel
                        style={{ marginLeft: 2 }}
                        control={
                            <Checkbox
                                checked={true}
                                onChange={() => { }}
                                color="primary"
                            />

                        }
                        label="GLOBAL"
                    />


                </div>
                <button className='btnSalvar'>Salvar</button>
            </div> */}
        </Container>
    )
}