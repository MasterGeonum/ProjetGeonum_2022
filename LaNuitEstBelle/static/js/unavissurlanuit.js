// Side panel

$(document).ready(function () {
  $('.container_openpanel').click(function () {
    $('.menu-hide').toggleClass('show');
    $('.menu-tab').toggleClass('active');
  });
  $('#map').hover(function () {
    $('.menu-hide').removeClass('show');
    $('.menu-tab').removeClass('active');
  });
});

var map = L.map('map');
// PARAMETRES DE LA CARTE
var carto = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
var cartoAttrib = 'Map data © Carto';
var cartourl = new L.TileLayer(carto, { attribution: cartoAttrib }).addTo(map);

var arcgis = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
var arcgisAttrib = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';
var arcgisurl = new L.TileLayer(arcgis, { attribution: arcgisAttrib });

map.setView([45.733, 3.032], 7);
map.options.maxZoom = 12;
map.options.minZoom = 7;
var bounds = [[52.000, -7.00], [41.000, 10.00]];
map.setMaxBounds(bounds);

L.geolet({ position: 'topleft' }).addTo(map);

var geocoder = L.Control.geocoder(
  options = {
    position: 'topleft'
  },
).addTo(map);


var baseLayers = {
  'Plan': cartourl,
  'Satellite': arcgisurl
};

L.control.layers(baseLayers).addTo(map);

L.control.scale(
  {
    position: 'bottomright',
    imperial: false
  }
).addTo(map);

// COUCHE ETOILES
/* Zone étoiles*/
function getColor(value) {
  return value == 1 ? '#242558' :
    value == 2 ? '#3f3f90 ' :
      value == 3 ? '#595ac7' :
        value == 4 ? '#7474ff' :
          value == 5 ? '#a29cd0 ' :
            value == 6 ? '#e3d074' :
              value == 7 ? '#fded71 ' :
                '#000141';
}
fetch('etoiles_opti_reproj', { credentials: 'include' })
  .then(response => response.json())
  .then(data => {
    style(data);
  })
  ;

function style(donnees) {
  var etoile = L.geoJson(donnees, {
    style: style
  }
  );

  function style(features) {
    return {
      color: getColor(features.properties.starclass),
      fillColor: getColor(features.properties.starclass),
      weight: 1,
      fillOpacity: 0.5,
      opaciy: 0.6,
      zIndex: 0

    };
  };
  etoile.addTo(map);

  /*
    $('#slide').slider({
      min: 0,
      max: 1,
      step: 0.01,
      value: 1,
      slide: function (e, ui) {
        function updateOpacity(value) {
          etoile.setOpacity(value);
        }
      }
    })*/
}


// Légende
var legend = L.control({ position: 'bottomleft' });
legend.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'info legend');
  div.innerHTML += "<h5>Nombre d'étoiles <br> visibles dans le ciel</h5>";
  div.innerHTML += '<i style="background: #242558"></i><span>0 - 100</span><br>';
  div.innerHTML += '<i style="background: #3f3f90"></i><span>100 - 200</span><br>';
  div.innerHTML += '<i style="background: #595ac7"></i><span>200 - 250</span><br>';
  div.innerHTML += '<i style="background: #7474ff"></i><span>250 - 500</span><br>';
  div.innerHTML += '<i style="background: #a29cd0"></i><span>500 - 1 000</span><br>';
  div.innerHTML += '<i style="background: #e3d074"></i><span>1 000 - 1 800</span><br>';
  div.innerHTML += '<i style="background: #fded71"></i><span> + 1 800</span><br>';
  return div;
};

legend.addTo(map);








// COUCHE AVIS
// Réglages CARTO 
var config = {
  cartoUsername: "matougeonum",
  cartoInsertFunction: "insert_crowd_mapping_data",
  cartoTablename: "crowdmap_basic",
  drawOptions: {
    draw: {
      polygon: false,
      polyline: false,
      rectangle: false,
      circle: false,
      circlemarker: false,
      marker: true
    },
    edit: false,
    remove: false
  }
};


var cartoData = null;
var sqlQuery = "SELECT the_geom, description, name, ville FROM " + config.cartoTablename;


//Recherche des données

var getData = "https://" + config.cartoUsername + ".carto.com/api/v2/sql?format=GeoJSON&q=" + sqlQuery;

var avis_etoiles = L.icon({
  iconUrl: './images/star.png',
  iconSize: [20, 20]
});

var layer_group = L.layerGroup([]);

var cartoData = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, { icon: avis_etoiles }).bindPopup('' + (feature.properties.description).replaceAll('"', '') + '<br>Proposé par ' + (feature.properties.name).replaceAll('"', '') + '<br>Dans la ville de ' + (feature.properties.ville).replaceAll('"', ''));
  }
});

$.getJSON(getData, function (data) {
  cartoData.addData(data);

  layer_group.addLayer(cartoData);
  layer_group.addTo(map);

  let tableau = data['features'];
  function liste_avis() {
    var liste = []
    for (var i = 0; i < tableau.length; i++) {
      if (!liste.includes(data['features'][i]['properties']['ville'])) {
        $('#monselect').append('<option value="' + (data['features'][i]['properties']['ville']).replaceAll('"', '') + '">' + (data['features'][i]['properties']['ville']).replaceAll('"', '') + '</option>');
      }
      liste.push(data['features'][i]['properties']['ville'])
    }
    return liste
  }
  liste_avis()

});


function choix_avis() {
  var choice = document.getElementById("monselect").value;
  console.log(choice);
  console.log(cartoData);
  var theColor;
  switch (choice) {

  }

  layer_group.clearLayers();
  map.removeLayer(layer_group);

  cartoData = L.geoJSON(null, {
    pointToLayer: function (feature, latlng) {
      return L.marker(latlng, { icon: avis_etoiles }).bindPopup('' + (feature.properties.description).replaceAll('"', '') + '<br>Proposé par ' + (feature.properties.name).replaceAll('"', '') + '<br>Dans la ville de ' + (feature.properties.ville).replaceAll('"', ''));
    },
    filter: function (feature, layer) {
      return ((feature.properties.ville).replaceAll('"', '') == choice);
    },

  });


  $.getJSON(getData, function (data) {
    cartoData.addData(data);
  });
  layer_group.addLayer(cartoData);
  layer_group.addTo(map);
}



// Ajout du marqueur
var drawnItems = new L.FeatureGroup();
var drawControl = new L.Control.Draw(config.drawOptions);
var controlOnMap = false;
function startEdits() {
  if (controlOnMap === true) {
    map.removeControl(drawControl);
    controlOnMap = false;
  }
  map.addControl(drawControl);
  controlOnMap = true;
}
function stopEdits() {
  map.removeControl(drawControl);
  controlOnMap = false;
}

map.on(L.Draw.Event.CREATED, function (e) {
  var layer = e.layer;
  map.addLayer(drawnItems);
  drawnItems.addLayer(layer);
  dialog.dialog("open");
});

var dialog = $("#dialog").dialog({
  autoOpen: false,
  height: 270,
  width: 350,
  modal: true,
  position: {
    my: "center center",
    at: "center center",
    of: "#map"
  },
  buttons: {
    "Ajouter ce point": setData,
    Cancel: function () {
      dialog.dialog("close");
      refreshLayer();
    }
  },
  close: function () {
    form[0].reset();
    refreshLayer();
    console.log("Dialog closed");
  }
});

form = dialog.find("form").on("submit", function (event) {
  event.preventDefault();
  setData();
});

// Ajout des données de la bd
function setData() {
  var enteredUsername = "'" + JSON.stringify(username.value.replace("'", "''")) + "'"
  var enteredDescription = "'" + JSON.stringify(description.value.replace("'", "''")) + "'";
  var enteredVille = "'" + JSON.stringify(ville.value.replace("'", "''")) + "'";
  drawnItems.eachLayer(function (layer) {
    var drawing = "'" + JSON.stringify(layer.toGeoJSON().geometry) + "'",
      sql = "SELECT " + config.cartoInsertFunction + "(";
    sql += drawing;
    sql += "," + enteredDescription;
    sql += "," + enteredUsername;
    sql += "," + enteredVille;
    sql += ");";

    console.log(drawing);

    // Enregistrement des données
    $.ajax({
      type: 'POST',
      url: 'https://' + config.cartoUsername + '.carto.com/api/v2/sql?',
      crossDomain: true,
      data: { "q": sql },
      dataType: 'geojson',
      success: function (responseData, textStatus, jqXHR) {
        console.log("Data saved");
      },
      error: function (responseData, textStatus, errorThrown) {

        console.log("Problem saving the data");
      }
    });


    var newData = layer.toGeoJSON();
    newData.properties.description = description.value;
    newData.properties.name = username.value;
    newData.properties.ville = ville.value;

    cartoData.addData(newData);

  });

  dialog.dialog("close");
}

// Refresh les données
function refreshLayer() {
  console.log("drawnItems has been cleared");
  map.removeLayer(drawnItems);
  drawnItems = new L.FeatureGroup()
  if (map.hasLayer(cartoData)) {
    map.removeLayer(cartoData);
  };

}
refreshLayer()

$(document).ready(function(){
  setTimeout(()=> {
      $('#loading').remove();
  } , 9000);
});