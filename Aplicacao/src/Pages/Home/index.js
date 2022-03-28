import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { DataGrid } from '@material-ui/data-grid';
import './Home.css';
import { makeStyles } from '@material-ui/core/styles';
import RouterIcon from '@material-ui/icons/Router';
import MemoryIcon from '@material-ui/icons/Memory';
import BatteryChargingFullIcon from '@material-ui/icons/BatteryChargingFull';
import DevicesMap from '../../Components/Map/Map-dashboard';
import { stampToDateAndHour } from '../../script/timeStampToDate'
import { Redirect } from 'react-router-dom'
import Load from '../../Components/Loading/index'
// import { selectData } from '../../script/timeStampToDate'


const useStylePC = makeStyles(() => ({
    router: {
        color: '#009ED8',
        fontSize: 50,
    },

    chip: {
        color: '#C41F1F',
        fontSize: 50,
    },

    battery: {
        color: '#43E255',
        fontSize: 50,
    }

}))



export default function Home() {
    const data = useSelector(state => state)
    const devices = useSelector((state) => state.devicesState.devices);
    const [allDevices, setAlldevices] = useState(0);
    const [lastSeen, setLastSeen] = useState([]);
    const [allDevicesActives, setAllDevicesActives] = useState([]);
    const classesIconPC = useStylePC();


    useEffect(() => {
        setAlldevices(devices.length);

        setLastSeen(
            devices.map(last => {
                if (last.last_seen) {
                    let date = stampToDateAndHour(last.last_seen);
                    return date
                } else {
                    let dia = "Não há dados"
                    return dia;
                }

            })
        );

        setAllDevicesActives(devices.filter(device => device.status != 0));

    }, [data])

    useEffect(() => {
        console.log("chamando req...")
        // selectData();
    }, [])


    const columns = [
        { field: 'id', headerName: 'ID', width: 100 },
        { field: 'nomeDispositivo', headerName: 'Nome do dispositivo', width: 250 },
        { field: 'tipo', headerName: 'Tipo', width: 150 },
        { field: 'vistoPorUltimo', headerName: 'Visto por último', width: 250 }
    ];

    const rows = devices.map((row, i) => {

        return (
            {
                id: i + 1,
                nomeDispositivo: row.name != '' ? row.name : "Não há dados",
                tipo: row.type != '' ? row.type : "Não há dados",
                vistoPorUltimo: lastSeen[i],
            })

    })

    return (

        <React.Fragment>

            {data.devicesState.statusLoad === true ?
                
                    <Load />
                    
                
                :


                <div className="containerHome">



                    <div className="divDataDeviceHome">

                        <div className="dataDevicesHome">
                            <div className="squareDataHome">
                                <p>Sensores: <span>{allDevices}</span> </p>
                                <RouterIcon className={classesIconPC.router}></RouterIcon>
                            </div>

                            <div className="squareDataHome">
                                <p>Sensores Ativos: <span>{allDevicesActives.length}</span></p>
                                <MemoryIcon className={classesIconPC.chip}></MemoryIcon>
                            </div>

                            <div className="squareDataHome">
                                <p>Bateria: <span>12W</span></p>
                                <BatteryChargingFullIcon className={classesIconPC.battery}></BatteryChargingFullIcon>
                            </div>

                        </div>


                        <div className="listDevicesHome">
                            <h2>Dispositivos</h2>
                            <div style={{ height: 400, width: '98%' }}>
                                <DataGrid autoHeight rows={rows} columns={columns} pageSize={5} />
                            </div>
                        </div>

                    </div>


                    <div className="divMapHome">
                        <DevicesMap />
                    </div>

                </div>
            }

        </React.Fragment>

    );

}