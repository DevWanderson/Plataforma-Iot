import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Container,
    Checkbox,
    FormControlLabel,
    TextField
} from '@material-ui/core'
import { getDate, getlatitude, getlongitude } from '../../utils/functions'
import { setClient, setCurrentTopic} from '../../store/actions'
import {host, options} from '../../Components/Connections/mqtt'
import { downloadData } from '../../utils/download_functions'
import MapCreator from '../../utils/map-lib'
import L from 'leaflet'
import mqtt from 'mqtt';


export default function SingleMap(props) {
    const devices = useSelector((state) => state.devices)
    const selectedDevice = useSelector((state) => state.selectedDevice)

    const devData = useSelector((state) => state.deviceData);
    const deviceData = devData[selectedDevice]
    const deviceProps = useSelector((state) => state.deviceProps[selectedDevice]);

    const client = useSelector((state) => state.MQTTclient)
    const currentTopic = useSelector((state) => state.MQTTcurrentTopic)

    const [map, setMap] = useState(null)
    const [newData, setNewData] = useState( deviceData.length>0 ? deviceData[0]: {} )
    const [marker, setMarker] = useState(null)
    const [polyline, setPolyline] = useState(null)
    const [dayCheck, setDayCheck] = useState(false);
    const [dateField, setDateField] = useState('')
    const [dataMap, setDataMap] = useState([])

    const height = props.height ? props.height : "450px"

    /*______________________________________________________________________________________
      __________________________________ Lógica do MQTT ____________________________________
      ______________________________________________________________________________________*/

      useEffect(() => {
        if (!client) {
            const clientMQTT = mqtt.connect(host, options)
            clientMQTT.on('connect', () => {
                // console.log('MQTT connected!')
            });

            clientMQTT.on('error', (err) => {
                console.error('MQTT Connection error: ', err);
                client.end();
            });
            clientMQTT.on('reconnect', () => {
                // console.log('Reconnecting MQTT');
            });
            setClient(clientMQTT)
        }
        else {
            client.on('message', (topic, buffer) => {
                const msg = buffer.toString().replace("ObjectId(", "").replace(")", "").replaceAll("'", '"')
                // console.log(`tópico: ${topic}`)
                // console.log(msg)
                const message = JSON.parse(msg)
                setNewData(message)
            });
            // console.log('MQTT message event trigged!')
        }
    }, [client])

    useEffect(() => {
        if (deviceData.length>0){
            const lastDate = new Date(deviceData[0].ts * 1000)
            setDateField(lastDate.toISOString().slice(0, 10))
            setNewData(deviceData[0])
        } 
        else setNewData({})

        if (client) {
            const user = JSON.parse(localStorage.getItem('Auth_user')).name

            if (client.connected) {
                const nextTopic = `ibtioutput/${user}/${selectedDevice}`
                if (nextTopic !== currentTopic) {
                    if (currentTopic) {
                        client.unsubscribe(currentTopic)
                        // console.log(`unsubscribed topic: ${currentTopic}`)
                    }
                    client.subscribe(nextTopic)
                    // console.log(`subscribed topic: ${nextTopic}`)
                    setCurrentTopic(nextTopic)
                }
            }
        }
    }, [selectedDevice, devData])

    /*______________________________________________________________________________________
      _____________________________ Lógica da data específica ______________________________
      ______________________________________________________________________________________*/

    useEffect(() => {
        if (dayCheck && dateField !== '' && deviceProps.includes('lat') && deviceProps.includes('long')) {
            const selectedDate = new Date(dateField + ' 00:00:00')
            const dateStr = selectedDate.toLocaleString().slice(0, 10)

            downloadData(`dev_eui=${selectedDevice}&date=${dateStr}&limit=1000`).then(data => setDataMap(data))
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
            var marker = L.marker([-15.711, -47.911])

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
            if (!dayCheck && devices[selectedDevice] && Math.abs(newData.lat)>.1 && Math.abs(newData.long)>.1) {
                const coordinates = [newData.lat, newData.long]
                // console.log(coordinates)

                marker.bindPopup(
                    `${devices[selectedDevice] ? `<b>Dispositivo: ${devices[selectedDevice].name}</b> `:''}<p>Último envio: ${getDate(newData.ts)} <br/>Bateria: ${newData.bateria ? newData.bateria : 0}V</p> <p>Latitude: ${getlatitude(newData.lat)} <br/>Longitude: ${getlongitude(newData.long)}</p>`
                ).setLatLng(coordinates).setOpacity(1.0)
                map.setView(coordinates)
            }
            else {
                marker.bindPopup("Dispositivo sem localização").setOpacity(0)
            }
        }
    }, [newData, devices, marker]);

    useEffect(() => {   // <- Controlado pelo campo de data
        if (dayCheck && deviceProps.includes('long') && dataMap) {
            const listCoords = dataMap.map(data => [data.lat, data.long])//.slice(0, 1000)
            if (listCoords.length > 0) {
                marker.setLatLng(listCoords[0]).setOpacity(1.0)
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

            <div id="mapContainer" style={{ height: height, marginBottom: '2%' }}></div>
        </Container>
    )
}
