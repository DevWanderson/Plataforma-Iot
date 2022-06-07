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
            <ReactJson style={{ borderRadius: 5 }} onEdit={(e) => setEditJSON(e.updated_src)} src={bytes} theme="monokai" />
        </Container>
    )
}