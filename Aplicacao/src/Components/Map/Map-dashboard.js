import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Container } from '@material-ui/core'
import { getDate, getlatitude, getlongitude } from '../../utils/functions'
import { updateAllDevicesData } from '../../store/actions'

import MapCreator from '../../utils/map-lib'
import L from 'leaflet'


export default function DevicesMap(props) {
    const devices = useSelector((state) => state.devices);
    const deviceData = useSelector((state) => state.deviceData);
    const deviceProps = useSelector((state) => state.deviceProps);

    const [gpsDevices, setGpsDevices] = useState({})
    const [map, setMap] = useState(null)
    const [timer, setTimer] = useState(true)
    const [markerList, setMarkerList] = useState([])

    /*______________________________________________________________________________________
      __________________________________ Lógica do Mapa ____________________________________
      ______________________________________________________________________________________*/

    useEffect(() => MapCreator(setMap), []);
    useEffect(() => {
        if (map) {   setTimeout(() => {
            map.setView([-15.775187, -47.90657], 11)
            const coordinates = [-15.711, -47.911]
            L.marker(coordinates).addTo(map).bindPopup("<b>IBTI</b>").setOpacity(0.5).openPopup();

            var popup = L.popup();
            function onMapClick(e) {
                popup
                    .setLatLng(e.latlng)
                    .setContent("You clicked the map at " + e.latlng.toString())
                    .openOn(map);
            }
            map.on('click', onMapClick);
        }, 1000); }
    }, [map]);

    useEffect(() => {
        if (!timer) {
            setTimeout(() => setTimer(true), 15000)
        }
        else {
            setTimer(false)
            updateAllDevicesData()
        }
    }, [timer]);

    useEffect(() => {
        if (map) {
            if (markerList.length > 0)
                markerList.forEach(marker => marker.removeFrom(map))

            const nMarkerList = gpsDevices.map(dev => {
                const lat = dev.lat
                const long = dev.long

                const marker = L.marker([lat, long]).addTo(map)
                
                marker.bindPopup(
                    `Dispositivo: <b>${devices[dev.eui].name}</b> <p>Último envio: ${getDate(dev.ts)}`
                    + ` ${dev.bateria ? `<br/> Bateria: ${dev.bateria}V`:''}</p>`
                    + ` <p>Latitude: ${getlatitude(dev.lat)}`
                    + ` <br/>Longitude: ${getlongitude(dev.long)}`
                    + ` ${dev.velocidade ? `<br/> Velocidade: ${dev.velocidade}km/s` : ''}`
                    + ` ${dev.altitude ? `<br/> Altitude: ${dev.altitude}m` : ''}</p>`
                );
                return marker
            })
            setMarkerList(nMarkerList)
        }
    }, [gpsDevices]);


    /*______________________________________________________________________________________
      _________________________ Lógica da seleção de dispositivos __________________________
      ______________________________________________________________________________________*/

    useEffect(() => {
        //  Agrupa somente os dispositivos com dados válidos
        var data = []
        for(var dev in devices){
            if(devices[dev].status === 1)
            if(deviceData[dev] !== undefined)
            if(deviceData[dev].length > 0)
            if(deviceData[dev][0].lat && deviceData[dev][0].long)
            if(Math.abs(deviceData[dev][0].lat) <= 90 && Math.abs(deviceData[dev][0].long) <= 180)
            if(Math.abs(deviceData[dev][0].lat) != 0  && Math.abs(deviceData[dev][0].long) != 0)
                data.push( {eui: dev, ...deviceData[dev][0]} )
        }
        setGpsDevices(data)
    }, [deviceData]);

    /*______________________________________________________________________________________
      __________________________________ Layout do Mapa ____________________________________
      ______________________________________________________________________________________*/

    const height = props.height ? props.height : "480px"

    return (
        <Container style={{ maxWidth: 1600 }} >
            <div id="mapContainer" style={{ height: height, marginBottom: '2%' }}></div>
        </Container>
    )
}
