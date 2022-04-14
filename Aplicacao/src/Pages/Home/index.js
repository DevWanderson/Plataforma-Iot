import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { stampToDateAndHour } from '../../Utils/timeStampToDate'
import { lastTsBeforeOf } from '../../Utils/functions';
import { Paper } from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import { makeStyles } from '@material-ui/core/styles';
import './Home.css';

import Tooltip from "@material-ui/core/Tooltip";
import RouterIcon from '@material-ui/icons/Router';
import VibrationIcon from '@material-ui/icons/Vibration';
import MemoryIcon from '@material-ui/icons/Memory';
import NotificationsActive from '@material-ui/icons/NotificationsActive'
import DevicesMap from '../../Components/Map/Map-dashboard';
import Load from '../../Components/Loading/index'
import api from '../../Components/Connections/api';
import Combo from '../../Components/SelectDeviceCombo';

// import { selectData } from '../../Utils/timeStampToDate'


const useStylePC = makeStyles(() => ({
    vibration: {
        color: '#F84242',
        fontSize: 30,
    },
    router: {
        color: '#0C53B7',
        fontSize: 30,
    },

    chip: {
        color: '#B7811C',
        fontSize: 30,
    },

    battery: {
        color: '#0F7B55',
        fontSize: 30,
    }

}))


export default function Home() {
    const data = useSelector(state => state)
    const setorDados = useSelector((state) => state.setorState.dadosSetor);
    const devicesData = useSelector((state) => state.devsInfoState.devicesData);
    const [allDevices, setAlldevices] = useState(0);
    const [allGerenciaAlertas, setAllGerenciaAlertas] = useState(0);
    const [lastSeen, setLastSeen] = useState([]);
    const [appKey, setAppKey] = useState('');
    const [allActiveDevices, setAllActiveDevices] = useState([]);
    const classesIconPC = useStylePC();
    const userUID = JSON.parse(localStorage.getItem('Auth_user'))
    let user = userUID ? userUID.uid : null



    useEffect(() => {
        setAlldevices(setorDados.length);
        setLastSeen(
            setorDados.map(last => {
                if (last.last_seen) {
                    let date = stampToDateAndHour(last.last_seen);
                    return date
                } else {
                    let dia = "Não há dados"
                    return dia;
                }

            })
        );
        setAllActiveDevices(setorDados.filter(device => device.status != 0));

        const secs24hs = lastTsBeforeOf(24)
        const devsWithDataUntil24hs = setorDados.filter(data => (devicesData[data.device].length > 0
            && devicesData[data.device][0].ts >= secs24hs
            && data.status != 0))
        setAllActiveDevices(devsWithDataUntil24hs.length);

    }, [data])

    async function selectKey() {
        await api.get(`/user?login=${user}`)
            .then((res) => {
                setAppKey(res.data)
            })
    }
    useEffect(() => {
        console.log("chamando req...")
        // selectData();
        selectKey()
    }, [])


    const columns = [
        { field: 'id', headerName: 'ID', width: 100 },
        { field: 'nomeDispositivo', headerName: 'Nome do dispositivo', width: 250 },
        { field: 'tipo', headerName: 'Tipo', width: 150 },
        { field: 'vistoPorUltimo', headerName: 'Visto por último', width: 250 }
    ];

    const rows = setorDados.map((row, i) => {
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
            <div style={{ display: 'flex', /*justifyContent: 'flex-end',*/ marginRight: -30 }}>
                <Combo />
            </div>
            {data.loadState.statusLoad === true ?

                <Load />


                :


                <div className="containerHome">
                    <div className="divDataDeviceHome">
                        <div className="dataDevicesHomeAlert">
                            <div className="squareDataHomeAlert">
                                <div className='circleIconSVibration'>
                                    <VibrationIcon className={classesIconPC.vibration}></VibrationIcon>
                                </div>
                                <span>{allDevices}</span>
                                <p>Sensores com Alerta </p>
                            </div>
                        </div>
                        <div className="dataDevicesHome">
                            <div className="squareDataHome">
                                <div className='circleIconSCadatrados'>
                                    <MemoryIcon className={classesIconPC.chip}></MemoryIcon>
                                </div>
                                <span>{allDevices}</span>
                                <p>Sensores Cadastrados </p>
                            </div>
                        </div>
                        <div className="dataDevicesHomeRouter">
                            <Tooltip title="Dispositivos ativos que enviaram dados nas últimas 24 horas">
                                <div className="squareDataHomeRouter">
                                    <div className='circleIconSDados'>
                                        <RouterIcon className={classesIconPC.router}></RouterIcon>
                                    </div>
                                    <span>{allActiveDevices}</span>
                                    <p>Sensores com Dados</p>
                                </div>
                            </Tooltip>
                        </div>
                        <div className="dataDevicesHomeBattery">
                            <div className="squareDataHomeBattery">
                                <div className='circleIconAEnviados'>
                                    <NotificationsActive className={classesIconPC.battery} />
                                </div>
                                <span>{appKey.n_alerts}</span>
                                <p>Alertas Enviados</p>
                            </div>
                        </div>


                    </div>
                    <div className="listMapDevice">
                        <div className="listDevicesHome">
                            <div style={{ height: 400, width: 415 }}><Paper style={{ borderRadius: 10, padding: 10 }}>
                                <h2>Dispositivos</h2>
                                <DataGrid autoHeight rows={rows} columns={columns} pageSize={4} /></Paper>
                            </div>
                        </div>
                        <div className="divMapHome">
                            <Paper style={{ width:415,height:400 }}>
                                <DevicesMap height={360} />
                            </Paper>
                        </div>
                    </div>
                </div>
            }

        </React.Fragment>

    );

}