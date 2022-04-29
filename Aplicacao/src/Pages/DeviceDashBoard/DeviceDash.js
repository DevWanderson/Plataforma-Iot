import React, { useState, useEffect } from 'react';
import './DeviceDash.css'
import SearchDevice from '../../Components/SearchDevice/SearchDevice';
import { makeStyles } from '@material-ui/core/styles';
import RouterIcon from '@material-ui/icons/Router';
import BatteryChargingFullIcon from '@material-ui/icons/BatteryChargingFull';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import DataUsageIcon from '@material-ui/icons/DataUsage';
import img from '../../Assets/rising.png';
import { useDispatch, useSelector } from 'react-redux';
import { stampToDate, stampToDateAndHour } from '../../Utils/timeStampToDate'
import { DataGrid } from '@material-ui/data-grid';
import SingleMap from '../../Components/Map/Map-telemetry';
import Graph from '../../Components/Graph/Figure';
import Load from '../../Components/Loading/index';
import { Paper } from '@material-ui/core';
import ReqData from '../../Components/ReqData';




const useStylePC = makeStyles(() => ({
    router: {
        color: '#009ED8',
        fontSize: 50,
    },

    battery: {
        color: '#43E255',
        fontSize: 50,
    },


    circle: {
        color: '#43E255',
        fontSize: 120,
    },

    info: {
        color: '#648DAE',
        fontSize: 20,
        justifyContent: 'center',
        display: 'flex',
        alignItems: 'center'

    }

}))




export default function DeviceDash(props) {

    const classesIconPC = useStylePC();
    const dispatch = useDispatch();
    const conditionRequest = React.createRef();

    const data = useSelector(state => state);
    const setorDados = useSelector((state) => state.setorState.dadosSetor);
    const [keyType, setKeyType] = useState([{ message: 'Sem chave do tipo' }]);
    const [selectedDevice, setSelectedDevice] = useState('Nenhum dispositivo selecionado');
    const [typeDevice, setTypeDevice] = useState([{ message: 'Sem tipo' }]);
    const [dataDevice, setDataDevice] = useState([{ "dado": "sem dado" }]);
    const [date, setDate] = useState(0);
    const [keyData, setKeyData] = useState([])
    const [columns, setColumns] = useState([{ field: 'noData', headerName: 'No Data', width: 150 }])
    const [rows, setRows] = useState([{ id: 1, noData: 'Sem dado' }])
    const [dataDash, setDataDash] = useState([]);
    const [battery, setBaterry] = useState(false);
    const [rowsDashSquare, setRowsDashSquare] = useState();
    const [page, setPage] = useState(5);



    function getBattery(array) {
        // eslint-disable-next-line array-callback-return
        let exist = array.filter((item) => {
            if (item === 'bateria') {
                return item
            }
        })

        if (exist === 'bateria') {
            return true
        } else {
            return false
        }
    }




    useEffect(() => {

        setSelectedDevice(data.deviceState.selectedDevice ? data.deviceState.selectedDevice : selectedDevice);
        setDataDevice(data.deviceState.dadosDevice.length > 0 ? [...data.deviceState.dadosDevice] : [{ "dado": "sem dado" }]);
        setTypeDevice(data.setorState.dadosSetor.filter(filterDevice => filterDevice.device === selectedDevice)[0])
        // eslint-disable-next-line eqeqeq
        setDate(typeDevice == undefined ? 0 : typeDevice.last_seen)
        setKeyType(typeDevice ? Object.keys(typeDevice) : keyType)
        setKeyData(data.deviceState.dadosDevice[0] ? Object.keys(data.deviceState.dadosDevice[0]) : [])
        setColumns(keyData === [] ?
            [{ field: 'noData', headerName: 'No Data', width: 150 }]
            :

            keyData.map(item => { return { field: item, [item]: item, width: 200 } })
        )

        setRows(

            dataDevice.map((item, i) => {
                // eslint-disable-next-line array-callback-return
                Object.keys(item).map(key => {

                    if (!isNaN(item[key])) {
                        if (key === 'ts') {
                            item[key] = stampToDateAndHour(item[key])
                        }
                        else {
                            //item[key] = parseFloat(item[key].toFixed(2))
                            //console.log(`Aqui ${item[key] = parseFloat(item[key].toFixed(2))}`)
                        }
                    }
                })
                item.id = i + 1
                return item
            })

        )

        setBaterry(getBattery(keyData))
        setRowsDashSquare(dataDevice[0]);
        // console.log(data) 
        // console.log(conditionRequest.current.innerHTML)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    useEffect(() => {


    }, [typeDevice, keyType])




    return (
        <div className='containerDeviceDash'>

            <div className='searchDeviceDash'>
                <ReqData />
                <SearchDevice />
            </div>

            {data.loadState.statusLoad === true ?
                <Load />
                :

                <React.Fragment>

                    <div className='divDataDeviceDash' >

                        <div className="divDeviceTypeDash">
                            <Paper style={{ borderRadius: 10, padding: 38, margin: 5, width: 500 }}>


                                <div>
                                    {/* eslint-disable-next-line eqeqeq */}
                                    <h3>Dispositivo: <span>{typeDevice == undefined ? '' : typeDevice[keyType[0]]}</span></h3>
                                </div>
                                <div className='divDeviceTypeDataDash'>
                                    {/* eslint-disable-next-line eqeqeq */}
                                    {keyType.length == 7 || keyType.length == 8 ? <p>EUI: <span ref={conditionRequest}>{typeDevice == undefined ? 'N/A' : typeDevice[keyType[6]]}</span> </p> : <p>EUI: <span ref={conditionRequest}>{typeDevice == undefined ? 'N/A' : typeDevice[keyType[8]]}</span> </p>}
                                    {/* eslint-disable-next-line eqeqeq */}
                                    <p>Tipo: <span>{typeDevice == undefined ? 'N/A' : typeDevice[keyType[1]]}</span> </p>
                                    {/* eslint-disable-next-line eqeqeq */}
                                    <p>Status: <span>{typeDevice == undefined ? 'N/A' : typeDevice[keyType[2]] == 0 ? 'Inativo' : "Ativo"}</span> </p>
                                    {/* eslint-disable-next-line eqeqeq */}
                                    <p>Data de ativação: <span>{typeDevice == undefined || isNaN(typeDevice[keyType[3]]) ? 'N/A' : stampToDate(typeDevice[keyType[3]])}</span></p>
                                    {/* eslint-disable-next-line eqeqeq */}
                                    <p>Visto por último: <span>{typeDevice == undefined || isNaN(typeDevice[keyType[4]]) ? 'N/A' : stampToDateAndHour(typeDevice[keyType[4]])}</span>  </p>
                                    {/* eslint-disable-next-line eqeqeq */}
                                    <p>Setor: <span ref={conditionRequest}>{typeDevice == undefined ? 'N/A' : typeDevice[keyType[7]]}</span> </p>
                                </div></Paper>

                        </div>

                        {/* organiza o Paper */}
                        <div className={dataDevice[0].dado === "sem dado" ? 'divTwinSquareNoDataDash' : 'divTwinSquareDash'}>
                            <Paper style={{ borderRadius: 10, padding: 40, margin: 5, width: 500 }}>

                                {Object.keys(dataDevice).length <= 0 ?

                                    <div className="divTwinRectangleDash">

                                        <div className="divTwinDataDash">
                                            <h5>Sem dado</h5>
                                            <InfoOutlinedIcon className={classesIconPC.info} />
                                        </div>

                                        <div className="divTwinDataDash">
                                            <div className="divTwinInfoDash">
                                                <span>N/A</span>
                                            </div>

                                        </div>
                                    </div>

                                    :

                                    Object.keys(dataDevice[0]).map((item, i) => {
                                        return (
                                            <div className='infoDevice' key={i}>{/* aqui organiza os dados */}
                                                <h5>{item}:</h5>
                                                <span style={{ fontSize: 19, marginTop: -2, color: '#a09f9f' }}>{dataDevice[0][item]}</span>
                                            </div>
                                        )
                                    })

                                }
                            </Paper>


                        </div>

                    </div>

                    {dataDevice[0].dado === "sem dado" ? <div></div> :
                        <div className="divInfoMapsDash">

                            <div className="graphDash"><Paper style={{ borderRadius: 10, padding: 60, marginTop: 30, width: 1010 }}>
                                <Graph /></Paper>
                            </div>

                            {
                                typeDevice && typeDevice.type === 'temp' ? '' :
                                    (
                                        <div className="mapDash"><Paper style={{ borderRadius: 10, padding: 60, marginTop: 30, width: 1010 }}>
                                            <SingleMap /></Paper>
                                        </div>
                                    )
                            }

                        </div>
                    }
                    <div className="divTableDash" >
                        <Paper style={{ width: 1000, padding: 20 }}>
                            <h3>Últimos dados recebidos:</h3>

                            {/* eslint-disable-next-line eqeqeq */}
                            {rows == undefined || rows == '' || columns == undefined || columns == '' ?
                                <div className='tableEmpty'>
                                    Não há dados armazenados para este dispositivo
                                </div>
                                :
                                <React.Fragment>
                                    <div>
                                        <DataGrid autoHeight rows={rows} columns={columns} pageSize={page} />
                                    </div>
                                    <select className="selectPage" name="quantity" onChange={(event) => { setPage(event.target.value) }}>
                                        <option value="5" selected></option>
                                        <option value="5">5</option>
                                        <option value="20">20</option>
                                        <option value="50">50</option>
                                        <option value="100">100</option>
                                    </select>
                                </React.Fragment>
                            }</Paper>

                    </div>

                </React.Fragment>

            }

        </div>

    );
}