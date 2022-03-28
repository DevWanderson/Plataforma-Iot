import React from 'react';
import './DeviceDash.css'
import SearchDevice from '../../Components/SearchDevice/SearchDevice';
import { makeStyles } from '@material-ui/core/styles';
import RouterIcon from '@material-ui/icons/Router';
import BatteryChargingFullIcon from '@material-ui/icons/BatteryChargingFull';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import DataUsageIcon from '@material-ui/icons/DataUsage';
import img from '../../Assets/rising.png';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { useEffect } from 'react';
import { stampToDate, stampToDateAndHour } from '../../script/timeStampToDate'
import { DataGrid } from '@material-ui/data-grid';
import SingleMap from '../../Components/Map/Map-telemetry';
import Graph from './Figure';
import Load from '../../Components/Loading/index'
import { selecionarDevice } from '../../store/Modulos/Devices/actions';



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
        fontSize: 50
    }

}))




export default function DeviceDash(props) {

    const classesIconPC = useStylePC();
    const dispatch = useDispatch();
    const conditionRequest = React.createRef();

    const data = useSelector(state => state);
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

    // function teste() {
    //     if (conditionRequest.current.innerHTML === "") {
    //         dispatch(selecionarDevice('')) // foi colocado para garantir que toda vez que entre na tela de telemetria a pagina não apareça 
    //     }
    // }

    setTimeout(() => {
        console.log(conditionRequest.current)
    }, 1000) //parei aqui


    // useEffect(() => {

    //     if (conditionRequest.current.innerHTML === "") {
    //         dispatch(selecionarDevice('')) // foi colocado para garantir que toda vez que entre na tela de telemetria a pagina não apareça 
    //     }

    // }, [])



    useEffect(() => {

        setSelectedDevice(data.devicesState.selectedDevice ? data.devicesState.selectedDevice : selectedDevice);
        setDataDevice(data.devicesState.dadosDevice.length > 0 ? [...data.devicesState.dadosDevice] : [{ "dado": "sem dado" }]);
        setTypeDevice(data.devicesState.devices.filter(filterDevice => filterDevice.device === selectedDevice)[0])
        // eslint-disable-next-line eqeqeq
        setDate(typeDevice == undefined ? 0 : typeDevice.last_seen)
        setKeyType(typeDevice ? Object.keys(typeDevice) : keyType)
        setKeyData(data.devicesState.dadosDevice[0] ? Object.keys(data.devicesState.dadosDevice[0]) : [])
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
                        } else {
                            item[key] = parseFloat(item[key].toFixed(2))
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

    useEffect(()=>{
        console.log(typeDevice)
        console.log(keyType)
    },[typeDevice, keyType])




    return (
        <div className='containerDeviceDash'>

            <div className='searchDeviceDash'>
                <SearchDevice></SearchDevice>
            </div>

            {data.devicesState.statusLoad === true ?
                <Load />
                :

                <React.Fragment>

                    <div className={battery === false ? 'divDataDeviceDashNoBaterry' : 'divDataDeviceDash'} >

                        <div className="divDeviceTypeDash">


                            <div>
                                {/* eslint-disable-next-line eqeqeq */}
                                <h3>Dispositivo: <span>{typeDevice == undefined ? '' : typeDevice[keyType[0]]}</span></h3>
                            </div>
                            <div className='divDeviceTypeDataDash'>
                                 {/* eslint-disable-next-line eqeqeq */}
                                <p>EUI: <span ref={conditionRequest}>{typeDevice == undefined ? 'N/A' : typeDevice[keyType[6]]}</span> </p>
                                  {/* eslint-disable-next-line eqeqeq */}
                                <p>Tipo: <span>{typeDevice == undefined ? 'N/A' : typeDevice[keyType[1]]}</span> </p>
                                   {/* eslint-disable-next-line eqeqeq */}
                                <p>Status: <span>{typeDevice == undefined ? 'N/A' : typeDevice[keyType[2]] == 0 ? 'Inativo' : "Ativo"}</span> </p>
                                    {/* eslint-disable-next-line eqeqeq */}
                                <p>Data de ativação: <span>{typeDevice == undefined || isNaN(typeDevice[keyType[3]]) ? 'N/A' : stampToDate(typeDevice[keyType[3]])}</span></p>
                                     {/* eslint-disable-next-line eqeqeq */}
                                <p>Visto por último: <span>{typeDevice == undefined || isNaN(typeDevice[keyType[4]]) ? 'N/A' : stampToDateAndHour(typeDevice[keyType[4]])}</span>  </p>
                            </div>

                        </div>

                        <div className="divImgDeviceDash">
                            <div className="divImgDeviceTitleDash">
                                <h3>Imagem Dispositivo</h3>
                                <RouterIcon className={classesIconPC.router} />
                            </div>
                            <div className="divImgDeviceIMGDash">
                                <img src={img} alt="device" />
                            </div>


                        </div>

                        <div className={dataDevice[0].dado === "sem dado" ? 'divTwinSquareNoDataDash' : 'divTwinSquareDash'}>
                            {/*console.log(dataDevice[0])*/}
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

                                        <div key={`r${i}`} className="divTwinRectangleDash">

                                            <div key={`t${i}`} className="divTwinDataDash">
                                                <h5>{item}</h5>
                                                <InfoOutlinedIcon className={classesIconPC.info} />
                                            </div>

                                            <div key={`i${i}`} className="divTwinDataDash">
                                                <div className="divTwinInfoDash">
                                                    <span>{dataDevice[0][item]}</span>
                                                </div>

                                            </div>
                                        </div>

                                    )
                                })

                            }


                        </div>

                        {battery === false ?
                            <div className="none">
                                <div className="none ">
                                    <h5>Bateria</h5>
                                    <BatteryChargingFullIcon className={classesIconPC.battery} />
                                </div>
                                <div className="none ">
                                    <DataUsageIcon className={classesIconPC.circle} />
                                    <p>10V</p>
                                </div>
                            </div>

                            :
                            <div className="divBatteryDash">
                                <div className="divBatteryTitleDash ">
                                    <h5>Bateria</h5>
                                    <BatteryChargingFullIcon className={classesIconPC.battery} />
                                </div>
                                <div className="divBatteryStatusDash ">
                                    <DataUsageIcon className={classesIconPC.circle} />

                                    <p> {isNaN(dataDevice[0].bateria) ? 0 : dataDevice[0].bateria} V </p>

                                </div>
                            </div>
                        }



                    </div>

                    <div className="divInfoMapsDash">

                        <div className="graphDash">
                            <Graph />
                        </div>

                        <div className="mapDash">
                            <SingleMap />
                        </div>

                    </div>

                    <div className="divTableDash" >

                        <h2>Tabela de dados:</h2>

                        {/* eslint-disable-next-line eqeqeq */}
                        {rows == undefined || rows == '' || columns == undefined || columns == '' ?
                            <div className='tableEmpty'>
                                Não há dados para tabela
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
                        }

                    </div>

                </React.Fragment>

            }

        </div>

    );
}