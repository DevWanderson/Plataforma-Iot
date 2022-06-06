import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, TextField, Typography, Checkbox, FormControlLabel, Divider } from '@material-ui/core';
import ReactJson from 'react-json-view';
import './style.css'

export default function EditType() {


    const editVar = useSelector((state) => state.editTypeState.editType)
    const [bytes, setBytes] = useState([]);
    const [editJSON, setEditJSON] = useState([])

    console.log(editJSON)
    useEffect(() => {
        setBytes(editVar)
    }, [editVar])



    return (
        <Container>
            
                    <ReactJson style={{borderRadius:5}} onEdit={(e) => setEditJSON(e.updated_src)} src={bytes}  theme="monokai"/>
                   {/*  {
                        Object.keys(editVar).map((key, index) => (
                            <div>
                                <div  >
                                    <TextField
                                        style={{ margin: 10, width: '30%' }}
                                        variant='outlined'
                                        value={editVar[key]}
                                        InputLabelProps={{ shrink: true }}
                                        label={String([key]).toUpperCase()}
                                    />
                                    {
                                        /* Object.keys(editVar[key]).map((varia, index) => (
                                            <div key={index}>
                                                {JSON.stringify(editVar[key].signed)}
                                                {
                                                    editVar[key][varia] !== null || '' ?
                                                        <TextField
                                                            style={{ margin: 10, width: '30%' }}
                                                            variant='outlined'
                                                            value={editVar[key][varia].bytes}
                                                            InputLabelProps={{ shrink: true }}
                                                            label={String([varia]).toUpperCase()}
                                                        />
                                                        :
                                                        ''
                                                }
                                            </div>
                                        )) */
                                    }
                                    {
                                        /* index === 4 ?
                                            <FormControlLabel
                                                style={{ marginLeft: 2 }}
                                                control={
                                                    <Checkbox
                                                        checked={editVar[key]}
                                                        onChange={() => { }}
                                                        color="primary"
                                                    />

                                                }
                                                label={String([key]).toUpperCase()}
                                            /> :
                                            '' 
                                    }
                                </div>
                            </div>
                        ))
                    } */}

                
            
        </Container>
    )
}