import L from 'leaflet'

const IBTIcoordinate = [-15.711046913, -47.91090066]


export default function MapCreator(setMap)
{
	const link = document.createElement('link');
	link.rel="stylesheet"
	link.href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
	//link.onload = afterCSSload

	const container = document.getElementById("mapContainer")
	container.innerHTML = "<div id='map' style='height: 100%;'></div>";
	container.appendChild(link);

	// function afterCSSload(){
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
	// }
}