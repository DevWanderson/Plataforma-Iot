/*
    Autor: Daniel Pinheiro
    https://github.com/Daniel-Pinheiro
 */

import L from 'leaflet'

const IBTIcoordinate = [-15.711046913, -47.91090066]

export function MapCreator(setMap)
{
	const container = document.getElementById("mapContainer")
	container.innerHTML = "<div id='map' style='height: 100%;'></div>";

	var map = L.map('map').setView(IBTIcoordinate, 13);

	L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
		maxZoom: 18,
		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
			'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		id: 'mapbox/streets-v11',
		tileSize: 512,
		zoomOffset: -1
	}).addTo(map);

	setMap(map)
}

export const icon = L.icon({
	iconUrl: 'map-images/marker-icon.png',
	shadowUrl: 'map-images/marker-shadow.png',

	iconSize:     [25, 41], // size of the icon
	shadowSize:   [41, 41], // size of the shadow
	iconAnchor:   [12.5, 40], // point of the icon which will correspond to marker's location
	shadowAnchor: [12, 41],  // the same for the shadow
	popupAnchor:  [0, -34] // point from which the popup should open relative to the iconAnchor
});
