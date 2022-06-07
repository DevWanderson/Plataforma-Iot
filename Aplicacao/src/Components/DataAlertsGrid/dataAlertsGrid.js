import React, {useEffect, useState} from 'react';
import { DataGrid} from "@material-ui/data-grid";
import api from '../Connections/api';
import { useDispatch, useSelector } from 'react-redux';


function DataGridForAlert() {
    const alertasSalvos = useSelector((state) => state.savedAlertsState.saveAlerts);
    

    const columns = [
        {field: "msg", headerName:"Mensagem", width:300},
        {field: "ts", headerName:"Times", width:200},
        {field: "dev_name", headerName:"Dispositivo", width:230},
        {field: "mode", headerName:"Canal", width:200},

    ];

    const rows = alertasSalvos && alertasSalvos.map((row, i) => {
        return(
            {
                id: i + 1,
                dev_name: row[0].dev_name,
                mode: row[0].mode,
                msg: row[0].msg,
                ts: row[0].ts,
            })

    })

    console.log(rows);

    return (
        <div style={{height:300, width:"100%"}}>
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={4}
                rowsPerPageOptions={[4]}/>
        </div>
    );
}

export default DataGridForAlert;