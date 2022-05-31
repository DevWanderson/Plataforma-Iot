import React, {useEffect, useState} from 'react';
import { useSelector } from 'react-redux';
import { DataGrid} from "@material-ui/data-grid";
/* import { DataGrid } from '@mui/x-data-grid'; */
import axios from 'axios';
import api from '../Connections/api';

function DataGridForAlerts() {
    const [data, setData] = useState([]);
    
    /* const userUID = JSON.parse(localStorage.getItem('Auth_user'))
    let user = userUID ? userUID.uid : null */

    const getAlertsData = async () => {
        await api.get(`/saved_alerts?limited1&login=${user}`)
            .then((res) =>{
                setData(res.data)
            })
    } 
    useEffect(() => {
        getAlertsData();
    }, []);

    const columns = [
        {field: "msg", headerName:"Mensagem", width:200},
        {field: "ts", headerName:"Times", width:200},
        {field: "dev_name", headerName:"Dispositivo", width:200},
        {field: "mode", headerName:"Canal", width:200},

    ];

    const rows = data.map((row) => {
        return(
            {
        msg: row.msg,
        ts: row.ts,
        dev_name: row.dev_name,
        mode: row.mode,
            })

    })

    console.log(data);

    return (
        <div style={{height:500, width:"100%"}}>
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={4}
                rowsPerPageOptions={[4]}/>
        </div>
    );
}

export default DataGridForAlerts;