import React, { useEffect, useState } from 'react';
import { Table, TableContainer, TableHead, TableRow, TableCell, Paper, Grid } from '@material-ui/core';
import api from '../../Components/Connections/api';



export default function Forecast() {
    const [forecast, setForecast] = useState([])
    console.log(forecast)

    useEffect(() => {
        async function reqFore() {
            await api.get('/forecast')
                .then((res) => {
                    setForecast(res.data)
                })
                .catch((err) => {
                    alert(`Erro ao carregar ${err}`)
                })
        }
        reqFore()
    }, [forecast])

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Grid item xs={6}>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableCell>Forecast</TableCell>
                            </TableHead>
                            <TableRow>
                                {
                                    forecast.map((fore) => (
                                        <TableCell>{fore.forecasting}</TableCell>
                                    ))
                                }
                            </TableRow>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </Grid>
    )
}
