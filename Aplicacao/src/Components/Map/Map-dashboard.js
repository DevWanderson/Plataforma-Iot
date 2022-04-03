/*
    Autor: Daniel Pinheiro
    https://github.com/Daniel-Pinheiro
 */

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Container } from '@material-ui/core'
import { getDate, getlatitude, getlongitude } from '../../Utils/functions'
import { updateAllDevicesData } from '../../Utils/stateControllers'

import { MapCreator, icon } from './map-lib'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'


export default function DevicesMap(props) {
    const devices = useSelector((state) => state.devsInfoState.devices)
    const devicesData = useSelector((state) => state.devsInfoState.devicesData);
    const selectedSetor = useSelector((state) => state.setorState.selectSetor);

    const [gpsDevices, setGpsDevices] = useState({})
    const [map, setMap] = useState(null)
    const [timer, setTimer] = useState(true)
    const [markerList, setMarkerList] = useState([])

    /*______________________________________________________________________________________
      __________________________________ Lógica do Mapa ____________________________________
      ______________________________________________________________________________________*/

    useEffect(() => MapCreator(setMap), []);
    useEffect(() => {
        if (map) {
            map.setView([-15.775187, -47.90657], 11)
            const coordinates = [-15.711, -47.911]
            L.marker(coordinates, {icon: icon}).addTo(map).bindPopup("<b>IBTI</b>").setOpacity(0.5).openPopup();

            var popup = L.popup();
            function onMapClick(e) {
                popup
                    .setLatLng(e.latlng)
                    .setContent("You clicked the map at " + e.latlng.toString())
                    .openOn(map);
            }
            map.on('click', onMapClick);
        }
    }, [map]);

    useEffect( async() => {
        if (!timer) {
            setTimeout(() => setTimer(true), 12000)
        }
        else {
            await updateAllDevicesData()
            setTimer(false)
        }
    }, [timer]);

    useEffect(() => {
        if (map) {
            if (markerList.length > 0)
                markerList.forEach(marker => marker.removeFrom(map))

            const nMarkerList = gpsDevices.map(dev => {
                const lat = dev.lat
                const long = dev.long

                const marker = L.marker([lat, long], {icon: icon}).addTo(map)
                
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
            if(devices[dev].department === selectedSetor || selectedSetor == 'Todos')
            if(devicesData[dev] !== undefined)
            if(devicesData[dev].length > 0)
            if(devicesData[dev][0].lat && devicesData[dev][0].long)
            if(Math.abs(devicesData[dev][0].lat) <= 90 && Math.abs(devicesData[dev][0].long) <= 180)
            if(Math.abs(devicesData[dev][0].lat) != 0  && Math.abs(devicesData[dev][0].long) != 0)
                data.push( {eui: dev, ...devicesData[dev][0]} )
        }
        setGpsDevices(data)
    }, [devicesData]);

    /*______________________________________________________________________________________
      __________________________________ Layout do Mapa ____________________________________
      ______________________________________________________________________________________*/

    const height = props.height ? props.height : "480px"

    return (
        <Container style={{ maxWidth: 1600 }} >
            <div id="mapContainer" style={{ height: height, marginTop: '1%' }}></div>
        </Container>
    )
}
