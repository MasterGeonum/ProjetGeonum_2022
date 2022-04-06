var map = L.map('map');
var osmUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
var osmAttrib = 'Map data © OpenStreetMap contributors';
var osm = new L.TileLayer(osmUrl, { attribution: osmAttrib }).addTo(map);
map.setView([45.733, 4.832], 12);



//Récupérer les collèges
data = JSON.parse(document.getElementById("getdata").dataset.markers);
data = data[0][0]

//Gestion couche collèges
var group_layer = new L.layerGroup();
var college_layer = L.geoJSON(data);

var collegeIcon = new L.icon({
  iconUrl: 'images/school.png',
  shadowUrl: 'images/marker-shadow.png',
  iconSize: [36, 36],
  iconAnchor: [18, 18],
  shadowAnchor: [15, 25]
});

//Gestion event filtre collèges
function change_categorie() {
  document.getElementById("filtre_college");
  var type_coll = filtre_college.options[filtre_college.selectedIndex].text;
  group_layer.clearLayers();

  L.geoJson(data, {
    pointToLayer: function (feature, latlng) {
      return new L.marker(latlng, { icon: collegeIcon });
    },
    filter: function (feature, layer) {
      return feature.properties.nom_college == type_coll;
    }
  }).addTo(group_layer);
  group_layer.addTo(map);
  group_layer.on("click", clickZoom);
}

//Gestion couches offres
var displayed_object = L.geoJSON();
var offres_layer = new L.LayerGroup();
var features = [];

//Récupérer les offres
fetch('offres', { credentials: 'include' })
  .then(response => response.json())
  .then(data => {
    console.log(data);
    process(data)
  });

function process(donnees) {

  // gestion filtres
  var filtre_type = document.getElementById('filtre_type').type.value;
  var filtre_taille = document.getElementById('filtre_taille').taille.value;
  var filtre_lieu = document.getElementById('filtre_lieu').lieu.value;
  var semaine = document.getElementById('semaine').value;


  // Type de structure
  var selectElement = document.querySelector('#filtre_type');
  selectElement.addEventListener('change', (event) => {
    filtre_type = event.target.value;
    console.log(filtre_taille, filtre_type, filtre_lieu)
    offres_layer.clearLayers();
    var displayed_object = L.geoJson(donnees, { filter: offerFilter, pointToLayer: offreIcon, onEachFeature: ajouteOffre });
    displayed_object.bindPopup(style_popup);
    displayed_object.on("click", clickZoom);
    displayed_object.addTo(offres_layer);
    listeOffres();
    var counter = displayed_object.getLayers().length;
    control.setCount(counter);
  });

  // Taille
  var selectElement = document.querySelector('#filtre_taille');
  selectElement.addEventListener('change', (event) => {
    filtre_taille = event.target.value;
    console.log(filtre_taille, filtre_type, filtre_lieu)
    offres_layer.clearLayers();
    var displayed_object = L.geoJson(donnees, { filter: offerFilter, pointToLayer: offreIcon, onEachFeature: ajouteOffre });
    displayed_object.bindPopup(style_popup);
    displayed_object.on("click", clickZoom);
    displayed_object.addTo(offres_layer);
    listeOffres();
    var counter = displayed_object.getLayers().length;
    control.setCount(counter);
  });

  // Lieu
  var selectElement = document.querySelector('#filtre_lieu');
  selectElement.addEventListener('change', (event) => {
    filtre_lieu = event.target.value;
    console.log(filtre_taille, filtre_type, filtre_lieu)
    offres_layer.clearLayers();
    var displayed_object = L.geoJson(donnees, { filter: offerFilter, pointToLayer: offreIcon, onEachFeature: ajouteOffre });
    displayed_object.bindPopup(style_popup);
    displayed_object.on("click", clickZoom);
    displayed_object.addTo(offres_layer);
    listeOffres();
    var counter = displayed_object.getLayers().length;
    control.setCount(counter);
  });

  // Semaine
  var selectElement4 = document.querySelector('#semaine');
  selectElement4.addEventListener('change', (event) => {
    semaine = event.target.value;
    offres_layer.clearLayers();
    var displayed_object = L.geoJson(donnees, { filter: offerFilter, pointToLayer: offreIcon, onEachFeature: ajouteOffre });
    displayed_object.bindPopup(style_popup);
    displayed_object.on("click", clickZoom);
    displayed_object.addTo(offres_layer);
    listeOffres();
    var counter = displayed_object.getLayers().length;
    control.setCount(counter);
  });

  // Selectionne mes checkbox
  var checkboxes = document.querySelectorAll("#domaine");
  //Par défaut tous les les domaines sont cochés
  var filtre_domaine = ['Maintenance', 'Énergie/Environnement', 'Informatique', 'Urbanisme', 'Administration', 'Culture', 'RessourcesHumaines', 'Management', 'Bâtiment', 'Aéronautique', 'Droit', 'Habitat/Logement', 'Commerce', 'Secours', 'Economie/Finances', 'Santé/Social']

  // Array.forEach pour ajouter un event listener sur chaque checkbox
  checkboxes.forEach(function (checkbox) {
    checkbox.addEventListener('change', (event) => {
      filtre_domaine =
        Array.from(checkboxes) // Convertit checkbox en un array pour utiliser les filtres.
          .filter(i => i.checked) // Array.filter pour enlever les checkbox non checkées.
          .map(i => i.value) // Array.map  pour extraire les valeurs des checkbox de l'array

      console.log(filtre_domaine)
      offres_layer.clearLayers()

      var displayed_object = L.geoJson(donnees, { filter: offerFilter, pointToLayer: offreIcon, onEachFeature: ajouteOffre });
      displayed_object.bindPopup(style_popup);
      displayed_object.on("click", clickZoom);
      displayed_object.addTo(offres_layer);
      listeOffres();
      var counter = displayed_object.getLayers().length;
      control.setCount(counter);


    });
  });

  function offreIcon(feature, latlng) {
    let myIcon = L.icon({
      iconUrl: 'images/business.png',
      shadowUrl: 'images/marker-shadow.png',
      iconSize: [35, 35],
      iconAnchor: [17, 17],
      shadowAnchor: [15, 30],
      popupAnchor: [0, 0]
    })
    return new L.marker(latlng, { icon: myIcon })
  }

  var displayed_object = L.geoJson(donnees, { filter: offerFilter, pointToLayer: offreIcon, onEachFeature: ajouteOffre });
  displayed_object.bindPopup(style_popup);
  displayed_object.on("click", clickZoom);
  displayed_object.addTo(offres_layer);

  offres_layer.addTo(map);

  listeOffres()

  //Count number of offers
  var counter = displayed_object.getLayers().length;

  L.MarkerCounterControl = L.Control.extend({
    options: {
      position: 'topright'
      //control position - allowed: 'topleft', 'topright', 'bottomleft', 'bottomright'
    },

    onAdd: function (map) {
      var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control fitall');
      this.button = L.DomUtil.create('a', '', container);
      this.button.style.width = 'auto';
      this.button.style.padding = '2px 5px';
      this.button.innerHTML = '0 Markers';
      L.DomEvent.disableClickPropagation(this.button);

      return container;
    },
    setCount(count) {
      this.button.innerHTML = count + ' Offres';
    }
  });

  var control = new L.MarkerCounterControl().addTo(map);
  control.setCount(counter)

  function offerFilter(feature) {
    if (filtre_domaine.includes(feature.properties.domaine) && /* (filtre_ville == "Sans préférence" || feature.properties.commune == filtre_ville)  && */ (filtre_type == "Sans préférence" || feature.properties.type_structure == filtre_type) && (filtre_taille == "Sans préférence" || feature.properties.taille_structure == filtre_taille) && feature.properties.week == semaine && (filtre_lieu == "Sans préférence" || feature.properties.type_metier == filtre_lieu || feature.properties.type_metier == "Intérieur/Extérieur")) return true
  }
}

function ajouteOffre(feature, layer) {
  features.push(layer.feature);
}

// Afficher les offres dans l'emprise de la carte
function listeOffres() {
  document.getElementById("myList").innerHTML = '';
  for (var i = 0; i < features.length; i++) {
    document.getElementById("myList").innerHTML +=
      "<div id='" + i + "' class='div_liste'><titre_stage_2>" + features[i].properties.titre_stage + "</titre_stage_2><br/>"
      + "<div class='structure_domaine_2'><structure>" + features[i].properties.nom_structure + "</structure>"
      + "<domaine> (" + features[i].properties.domaine + ")</domaine></div><br/>"
      + "<div class='description'>" + features[i].properties.description + "</div>"
      + "<div class='logo'><img src='" + features[i].properties.logo_structure_1 + "' width='80px'/></div>"
      + "<div class='adresse'>" + features[i].properties.adresse_offre + ", <br/>"
      + features[i].properties.code_postal + " " + features[i].properties.commune + "</div>"
      + "<div class='periode'>" + features[i].properties.periode_stage + " </div></div>"
  }
  features = [];
}



function style_popup(layer) {
  return "<div class='titre_stage'>" + layer.feature.properties.titre_stage + "</div>"
    + "<div class='structure_domaine'><b>" + layer.feature.properties.nom_structure + "</b>"
    + " (" + layer.feature.properties.domaine + ")</div><br/>"
    + "<div class='description'>" + layer.feature.properties.description + "</div>"
    + "<div class='logo'><img src='" + layer.feature.properties.logo_structure_1 + "' width='80px'/></div>"
    + "<div class='adresse'>" + layer.feature.properties.adresse_offre + ", <br/>"
    + layer.feature.properties.code_postal + " " + layer.feature.properties.commune + "</div>"
    + "<div class='periode'>" + layer.feature.properties.periode_stage + " </div>";
}


// Centrer les offres au clic
function clickZoom(e) {
  var long = e.latlng.lng;
  var bounds = map.getBounds();
  var north_bound = bounds.getNorth();
  var south_bound = bounds.getSouth();
  var lat = e.latlng.lat;
  var ratio = ((lat - south_bound) / (north_bound - south_bound))
  var lat = south_bound + (ratio + 0.27) * (north_bound - south_bound)
  map.panTo([lat, long], map.getZoom());
}





// Fonction pour cocher/décocher toutes les cases à cocher
function toggle(source) {
  checkboxes = document.getElementsByName('domaines');
  for (var i = 0, n = checkboxes.length; i < n; i++)
    checkboxes[i].checked = source.checked;
}

// Barre de recherche d'adresse
var geocoderBAN = L.geocoderBAN({
  collapsed: false,
  style: 'searchBar',
  resultsNumber: 5,
  placeholder: 'Entrez votre adresse'
}).addTo(map);

//Adress research + isochrone
geocoderBAN.markGeocode = function (feature) {
  let myIcon = L.icon({
    iconUrl: 'images/home.png',
    shadowUrl: 'images/marker-shadow.png',
    iconSize: [35, 35], // width and height of the image in pixels
    iconAnchor: [17, 17], // point of the icon which will correspond to marker's location
    shadowAnchor: [15, 30],
    popupAnchor: [0, -15] // point from which the popup should open relative to the iconAnchor
  })
  latlng = [feature.geometry.coordinates[1], feature.geometry.coordinates[0]]
  console.log(latlng)
  this._map.setView(latlng, 14)
  this.geocodeMarker = new L.Marker(latlng, { icon: myIcon })
    .bindPopup(feature.properties.label)
    .addTo(this._map)
    .openPopup()

  var myInit = {
    method: 'GET',
    mode: 'cors',
    cache: 'default'
  };

  //style
  function isoStyle(feature) {
    return {
      color: '#8C368C'
    }
  };

  lat = latlng[0]
  long = latlng[1]
  console.log(lat)
  console.log(long)
  let url = "/test?lat=" + lat + "&long=" + long
  fetch(url, myInit)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      L.geoJson(data, { style: isoStyle }).bindTooltip("Zone que tu peux parcourir de chez toi en 15 minutes à pied").addTo(map);
    })

}