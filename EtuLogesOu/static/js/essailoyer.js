var map = L.map('map');
var osmUrl = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
var osmAttrib = 'Map data ©️ OpenStreetMap contributors';
var osm = new L.TileLayer(osmUrl, { attribution: osmAttrib }).addTo(map);
map.setView([45.733, 4.832], 12);


fetch('loyer', { credentials: 'include' })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        L.geoJson(data).addTo(map);
    })
;