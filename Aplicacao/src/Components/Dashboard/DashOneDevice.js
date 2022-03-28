import React from 'react';
import '../../Pages/DeviceDashBoard/DeviceDash.css'
import SearchDevice from '../../Components/SearchDevice/SearchDevice';
import { makeStyles } from '@material-ui/core/styles';
import RouterIcon from '@material-ui/icons/Router';
import BatteryChargingFullIcon from '@material-ui/icons/BatteryChargingFull';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import DataUsageIcon from '@material-ui/icons/DataUsage';
import img from '../../Assets/rising.png';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { useEffect } from 'react';
import { stampToDate, stampToDateAndHour } from '../../script/timeStampToDate'
import { DataGrid } from '@material-ui/data-grid';



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

export default function DashOneDevice() {

    const classesIconPC = useStylePC();
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
    const [copia, setCopia] = useState([]);

    useEffect(() => {

        setSelectedDevice(data.devicesState.selectedDevice ? data.devicesState.selectedDevice : selectedDevice);
        setDataDevice(data.devicesState.dadosDevice.length > 0 ? [...data.devicesState.dadosDevice] : [{ "dado": "sem dado" }]);
        setTypeDevice(data.devicesState.devices.filter(filterDevice => filterDevice.device == selectedDevice)[0])
        setDate(typeDevice == undefined ? 0 : typeDevice.last_seen)
        setKeyType(typeDevice ? Object.keys(typeDevice) : keyType)
        setKeyData(data.devicesState.dadosDevice[0] ? Object.keys(data.devicesState.dadosDevice[0]) : [])
        setCopia([...data.devicesState.dadosDevice])
        setColumns(keyData === [] ?
            [{ field: 'noData', headerName: 'No Data', width: 150 }]
            :

            keyData.map(item => { return { field: item, [item]: item, width: 200 } })
        )


        setRows(

            copia.map((item, i) => {
                Object.keys(item).map(key => {

                    if (!isNaN(item[key])) {
                        if (key == 'ts') {
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

    }, [data]);

    function getBattery(array) {
        let exist = array.filter((item) => {
            if (item === 'bateria') {
                return item
            }
        })

        if (exist == 'bateria') {
            return true
        } else {
            return false
        }
    }

    return (

        <div className={battery === false ? 'divDataDeviceDashNoBaterry' : 'divDataDeviceDash'}>

            <div className="divDeviceTypeDash">
                <div>
                    <h3>Dispositivo: <span>{typeDevice == undefined ? '' : typeDevice[keyType[0]]}</span></h3>
                </div>
                <div className='divDeviceTypeDataDash'>
                    <p>Tipo: <span>{typeDevice == undefined ? '' : typeDevice[keyType[1]]}</span> </p>
                    <p>Status: <span>{typeDevice == undefined ? '' : typeDevice[keyType[2]] == 0 ? 'Inativo' : "Ativo"}</span> </p>
                    <p>Data: <span>{typeDevice == undefined || isNaN(typeDevice[keyType[4]]) ? 'N/A' : stampToDate(typeDevice[keyType[4]])}</span></p>
                    <p>Visto por último: <span>{typeDevice == undefined || isNaN(typeDevice[keyType[4]]) ? 'N/A' : stampToDateAndHour(typeDevice[keyType[4]])}</span>  </p>
                </div>

            </div>

            <div className="divImgDeviceDash">
                <div className="divImgDeviceTitleDash">
                    <h3>Dispositivo</h3>
                    <RouterIcon className={classesIconPC.router} />
                </div>
                <div className="divImgDeviceIMGDash">
                    <img src={img} alt="device" />
                </div>


            </div>

            <div className="divTwinSquareDash">

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

                            <div key={i} className="divTwinRectangleDash">

                                <div key={i} className="divTwinDataDash">
                                    <h5>{item}</h5>
                                    <InfoOutlinedIcon className={classesIconPC.info} />
                                </div>

                                <div key={i} className="divTwinDataDash">
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
    );
}