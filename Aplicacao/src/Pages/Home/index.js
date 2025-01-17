import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { stampToDateAndHour, stampToDate } from '../../Utils/timeStampToDate'
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
import DataGridForAlert from '../../Components/DataAlertsGrid/dataAlertsGrid';
import ReqData from '../../Components/ReqData';
import { Chart } from 'react-google-charts';


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
    const alertasGerencia = useSelector((state) => state.alertasState.alertasGeral);
    const setorDados = useSelector((state) => state.setorState.dadosSetor);
    const devicesData = useSelector((state) => state.devsInfoState.devicesData);
    const [allDevices, setAlldevices] = useState(0);
    const [lastSeen, setLastSeen] = useState([]);
    const [appKey, setAppKey] = useState('');
    const [allActiveDevices, setAllActiveDevices] = useState([]);
    const [dash, setDash] = useState([]);
    const [linkDash, setLinkDash] = useState('');
    const classesIconPC = useStylePC();
    const userUID = JSON.parse(localStorage.getItem('Auth_user'))
    let user = userUID ? userUID.uid : null




    useEffect(() => {

        setAlldevices(setorDados.length);
        dataDash() 
       
        console.log(Object.values(dash))
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

    async function dataDash() {
        await api.get(`/dash_percent_array?login=${user}`)
            .then((res) => {
                setDash(res.data)
                
            })
            .catch((error) => { console.log(error) })
    }

    async function selectKey() {
        await api.get(`/user?login=${user}`)
            .then((res) => {
                setAppKey(res.data)
            })
    }

    async function dashHome(){
        await api.get(`home_mb?login=${user}`)
        .then((res) => {
            setLinkDash(res.data)
        })
        .catch((err) =>{
            console.log(err);
        })
    }

    useEffect(() => {
        console.log("chamando req...")
        // selectData();
        selectKey();
        dataDash()
        console.log(dash)
        dashHome()
    }, [])



    const columns = [
        { field: 'id', headerName: 'ID', width: 100 },
        { field: 'nomeDispositivo', headerName: 'Nome do dispositivo', width: 350 },
        { field: 'tipo', headerName: 'Tipo', width: 180 },
        { field: 'vistoPorUltimo', headerName: 'Visto por último', width: 250 },
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
            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingLeft:190 }}>
                <ReqData />
            </div>
            {data.loadState.statusLoad === true ?

                <Load />
                :
                <div className="containerHome">
                    {/* <div className="divDataDeviceHome">
                        <div className="dataDevicesHomeAlert">
                            <div className="squareDataHomeAlert">
                                <div className='circleIconSVibration'>
                                    <VibrationIcon className={classesIconPC.vibration}></VibrationIcon>
                                </div>
                                <span>{alertasGerencia.length}</span>
                                <p>Alertas cadastrados </p>
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
                    </div> */}
                    <iframe src={linkDash} width="100%" style={{ height: 700, border:'none' }}/>
                    <div className="divMapGraf">
                        <div className="divMapHome">
                            <Paper style={{ width: 470, height: 400 }}>
                                <DevicesMap height={370} />
                            </Paper>
                        </div>
                        <div className="divGraf">
                            <Paper style={{ width: 470, height: 400, borderRadius: 10 }}>
                                <h2 style={{paddingLeft:10, paddingTop:15, alignContent:'center', paddingLeft:100}}>Atividades por Dispositivos</h2>
                                <Chart
                                    options={{pieHole: 0.4}}
                                    chartType="PieChart"
                                    data={dash}
                                    width={450}
                                    height={350}
                                    legendToggle
                                />
                            </Paper>

                        </div>
                    </div>
                    <div className="listDevicesHome">
                        <div style={{ height: 300, width: 990 }}><Paper style={{ borderRadius: 10, padding: 10, paddingBottom: 30 }}>
                            <h2>Dispositivos</h2>
                            <DataGrid autoHeight rows={rows} columns={columns} pageSize={4} /></Paper>
                        </div>
                    </div>
                    <div className="listDevicesHomeG">
                        <div style={{ height: 300, width: 990 }}><Paper style={{ borderRadius: 10, padding: 10, paddingBottom: 30 }}>
                            <h2>Alertas salvos</h2>
                            <DataGridForAlert autoHeight rows={rows} columns={columns} pageSize={4} /></Paper>
                        </div>
                    </div>
                </div>
            }

        </React.Fragment>

    );

}