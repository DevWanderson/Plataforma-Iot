/*
    Autor: Daniel Pinheiro
    https://github.com/Daniel-Pinheiro
 */

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Container,
    Checkbox,
    FormControlLabel,
    TextField
} from '@material-ui/core'

import { getDate, getlatitude, getlongitude } from '../../Utils/functions'
import { updateDeviceData } from '../../Utils/stateControllers'
import { downloadData } from '../../Utils/download_functions'
import { MapCreator, icon } from './map-lib'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'


export default function SingleMap(props) {
    const devices = useSelector((state) => state.devsInfoState.devices)
    const currentDevice = useSelector((state) => state.devsInfoState.currentDevice)
    const deviceData = useSelector((state) => state.devsInfoState.deviceData);
    const deviceProps = useSelector((state) => state.devsInfoState.deviceUnits);
    
    const height = props.height    
    const [map, setMap] = useState(null)
    const [timer, setTimer] = useState(true)
    const [newData, setNewData] = useState( deviceData.length>0 ? deviceData[0]: {} )
    const [marker, setMarker] = useState(null)
    const [polyline, setPolyline] = useState(null)
    const [dayCheck, setDayCheck] = useState(false);
    const [dateField, setDateField] = useState()
    const [dataMap, setDataMap] = useState([])

    /*______________________________________________________________________________________
      _________________________ Lógica da atualização em real time _________________________
      ______________________________________________________________________________________*/
    useEffect( async() => {
        if (!timer) {
            setTimeout(() => setTimer(true), 5000)
        }
        else {
            await updateDeviceData(currentDevice)
            setTimer(false)
        }
    }, [timer]);

    useEffect(() => {
        if (devices[currentDevice])
            if (devices[currentDevice].last_seen){
                const lastDate = new Date(devices[currentDevice].last_seen * 1000)
                setDateField(lastDate.toISOString().slice(0, 10))
            }
    }, [currentDevice])

    useEffect(() => {
        if(!dayCheck){
            if (deviceData.length>0)    setNewData(deviceData[0])
            else                        setNewData({})
        }
    }, [currentDevice, deviceData])

    /*______________________________________________________________________________________
      _____________________________ Lógica da data específica ______________________________
      ______________________________________________________________________________________*/

    useEffect(() => {
        if (dayCheck && dateField !== '' && ('lat','long') in deviceProps) {
            const selectedDate = new Date(dateField + ' 00:00:00').valueOf()/1000
            downloadData(`dev_eui=${currentDevice}&date=${selectedDate}&limit=4000`).then(data => setDataMap(data))
        }
        else
            if (polyline) polyline.setLatLngs([])

    }, [dayCheck, dateField])

    /*______________________________________________________________________________________
      __________________________________ Lógica do Mapa ____________________________________
      ______________________________________________________________________________________*/

    useEffect(() => MapCreator(setMap), []);
    useEffect(() => {
        if (map) {
            var marker = L.marker([-15.711, -47.911], {icon: icon})

            marker.addTo(map)
                .bindPopup("<b>IBTI</b>").openPopup();

            var popup = L.popup();
            function onMapClick(e) {
                popup
                    .setLatLng(e.latlng)
                    .setContent("You clicked the map at " + e.latlng.toString())
                    .openOn(map);
            }
            map.on('click', onMapClick);

            setMarker(marker)
            setPolyline(L.polyline([], { color: 'red' }).addTo(map))
        }
    }, [map]);

    useEffect(() => {   // <- Controlado pelo MQTT e o SearchDevice
        if (marker) {
            if (!dayCheck && devices[currentDevice] && Math.abs(newData.lat)>.1 && Math.abs(newData.long)>.1) {
                const coordinates = [newData.lat, newData.long]
                // console.log(coordinates)

                marker.bindPopup(
                    `${devices[currentDevice] ? `<b>Dispositivo: ${devices[currentDevice].name}</b> `:''}<p>Último envio: ${getDate(newData.ts)} <br/>Bateria: ${newData.bateria ? newData.bateria : 0}V</p> <p>Latitude: ${getlatitude(newData.lat)} <br/>Longitude: ${getlongitude(newData.long)}</p>`
                ).setLatLng(coordinates).setOpacity(1.0)
                map.setView(coordinates)
            }
            else {
                marker.bindPopup("Dispositivo sem localização").setOpacity(0)
            }
        }
    }, [newData, devices, marker]);

    useEffect(() => {   // <- Controlado pelo campo de data
        if (dayCheck && dataMap && ('lat','long') in deviceProps) {
            const listCoords = dataMap.filter(data => ( data.lat!=0 || data.long!=0)).map(data => [data.lat, data.long])
            if (listCoords.length > 0) {
                marker.bindPopup(
                    `${devices[currentDevice] ? `<b>Dispositivo: ${devices[currentDevice].name}</b> `:''}<p>Último envio: ${getDate(dataMap[0].ts)} <br/>Latitude: ${getlatitude(dataMap[0].lat)} <br/>Longitude: ${getlongitude(dataMap[0].long)}</p>`
                ).setLatLng(listCoords[0]).setOpacity(1.0)
                map.setView(listCoords[0]);

                polyline.setLatLngs(listCoords)
                map.fitBounds(polyline.getBounds());     // zoom the map to the polyline
            }
        }
    }, [dataMap])

    /*______________________________________________________________________________________
      ___________________________________ View do Mapa _____________________________________
      ______________________________________________________________________________________*/

    return (
        <Container style={{ color:"black", maxWidth: 1600 }} >
            <FormControlLabel
                control={<Checkbox color="prmary" value={dayCheck} onChange={(e) => setDayCheck(e.target.checked)} style={{ marginBottom: '2%' }} />}
                label="Dia específico" />
            {dayCheck === true ?
                <TextField label="Dia" variant="outlined" type="date" value={dateField} onChange={(e) => setDateField(e.target.value)} style={{ marginLeft: '2%', marginBottom: '2%' }} />
                : ''}

            <div id="mapContainer" style={{ height: height ? height : "450px", marginBottom: '2%' }}></div>
        </Container>
    )
}
