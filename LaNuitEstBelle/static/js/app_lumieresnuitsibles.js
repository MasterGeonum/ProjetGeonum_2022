import { getLayer, getLayer2, getLayer3, getLayer4, getLayer5 } from '/js/data_lumieresnuitsibles.js';

async function app_tom () {
    
// Création de la carte Leaflet
var map = L.map('map');
var CartoDB_DarkMatter = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
var osmAttrib = 'OpenStreetMap contributors - La nuit est belle';

var osm = new L.TileLayer(CartoDB_DarkMatter, { attribution: osmAttrib }).addTo(map);
map.setView([47, 2.42], 5);

//Couleur des polygones par classe d'intensité
function getColor(value) {
  return value == 1 ? '#1a1c4c' :
    value == 2 ? '#061080' :
      value == 3 ? '#104762' :
        value == 4 ? '#186452' :
          value == 5 ? '#2f8266' :
            value == 6 ? '#41a441' :
              value == 7 ? '#37c143' :
                value == 8 ? '#3cd041' :
                  value == 9 ? '#24dc13' :
                    value == 10 ? '#00f12c' :
                      value == 11 ? '#00ff01' :
                        value == 12 ? '#9cff23' :
                          value == 13 ? '#d4ff29' :
                            value == 14 ? '#e8ff9d' :
                              value == 15 ? '#f7ffb3' :
                                '#A8A8A8';
}


//Style 
function pol_style(feature) {
  return {
    color: getColor(feature.properties.classe),
    fillColor: getColor(feature.properties.classe),
    fillOpacity: 1,
    opacity: 1,
    weight: 1,
    zIndex: 8
  }
};

function com_style(feature) {
  return {
    fillOpacity: 0,
	opacity: 0,
    weight: 0
  }
};

var dep_style = {
    fillOpacity: 0,
    opacity: 0,
    zIndex: 10
};

function dep_style_actif(feature) {
  return {
    color: 'white',
    fillColor: 'white',
    fillOpacity: 0.2,
    opacity: 1,
    weight: 3
  }
};

const pollution_lyr_1992 = await getLayer('pollution_1992');
const pollution_lyr_2002 = await getLayer2('pollution_2002');
const pollution_lyr = await getLayer3('pollution_2013');

pollution_lyr_1992.setStyle(pol_style);
pollution_lyr_2002.setStyle(pol_style);
pollution_lyr.setStyle(pol_style);


//légende
var legend = L.control({ position: 'bottomleft' });

legend.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'info legend');

  div.innerHTML += "<h4>Intensité de pollution lumineuse</h4>";
  div.innerHTML += '<i style="background: #f7ffb3"></i><span>Forte pollution</span><br>';
  div.innerHTML += '<i style="background: #e8ff9d"></i><span></span><br>';
  div.innerHTML += '<i style="background: #d4ff29"></i><span></span><br>';
  div.innerHTML += '<i style="background: #9cff23"></i><span></span><br>';
  div.innerHTML += '<i style="background: #00ff01"></i><span></span><br>';
  div.innerHTML += '<i style="background: #00f12c"></i><span></span><br>';
  div.innerHTML += '<i style="background: #24dc13"></i><span></span><br>';
  div.innerHTML += '<i style="background: #3cd041"></i><span></span><br>';
  div.innerHTML += '<i style="background: #37c143"></i><span></span><br>';
  div.innerHTML += '<i style="background: #41a441"></i><span></span><br>';
  div.innerHTML += '<i style="background: #2f8266"></i><span></span><br>';
  div.innerHTML += '<i style="background: #186452"></i><span></span><br>';
  div.innerHTML += '<i style="background: #104762"></i><span></span><br>';
  div.innerHTML += '<i style="background: #061080"></i><span></span><br>';
  div.innerHTML += '<i style="background: #1a1c4c"></i><span>Faible pollution</span><br>';

  return div;
};

legend.addTo(map);

//échelle
L.control.scale(
  {
    position: 'bottomright',
    imperial: false
  }
).addTo(map);


// recherche commune
var geocoder = L.Control.geocoder({
    position: 'topleft'
  },
).addTo(map);


// TIMELINE

const progress = document.getElementById('progress')
const prev = document.getElementById('prev')
const next = document.getElementById('next')
const circles = document.querySelectorAll('.circle')


var activ_1992 = document.getElementById('step1')
var activ_2002 = document.getElementById('step2')
var activ_2013 = document.getElementById('step3')
activ_2013.classList.add('active')
var currentActive = 3;
var previousActive = 2;

prev.disabled = false
next.disabled = true

function checkActive() {
  if (currentActive == 1) {
    map.removeLayer(pollution_lyr_2002);
    map.addLayer(pollution_lyr_1992);
  }
  else {
    if (currentActive == 2) {
      if (previousActive == 1) {
        map.removeLayer(pollution_lyr_1992);
      } else {
        map.removeLayer(pollution_lyr);
        map.removeLayer(communes_lyr);
        map.removeLayer(departement);
        $('.cover_diagramme').toggleClass('active');
        $('.msg_diagramme').toggleClass('active');
      }
      map.addLayer(pollution_lyr_2002);

    }
    else {
      if (currentActive == 3) {
        map.removeLayer(pollution_lyr_2002);
        map.addLayer(pollution_lyr);
        map.addLayer(departement);
        map.addLayer(communes_lyr);
        $('.cover_diagramme').removeClass('active');
        $('.msg_diagramme').removeClass('active');
      }
    }
  }
}

next.addEventListener('click', () => {
  previousActive = currentActive
  currentActive++

  if (currentActive > circles.length) {
    currentActive = circles.length
  }
  console.log(currentActive)
  updatetimeline()
})

prev.addEventListener('click', () => {
  previousActive = currentActive
  currentActive--

  if (currentActive < 1) {
    currentActive = 1
  }
  console.log(currentActive)
  updatetimeline()
})

function updatetimeline() {

  circles.forEach((circle, idx) => {
    if (idx < currentActive) {
      circle.classList.add('active')
    } else {
      circle.classList.remove('active')
    }
  })

  const actives = document.querySelectorAll('.active')

  if (currentActive === 1) {
    prev.disabled = true
    progress.style.width = 30 + '%'
  } else if (currentActive === circles.length) {
    next.disabled = true
    progress.style.width = 90 + '%'
  } else {
    prev.disabled = false
    next.disabled = false
    progress.style.width = 50 + '%'
  }
  checkActive()
}

var liste_valeurs = [0, 0, 0, 12, 14, 58, 14, 23, 2, 0, 1]

// DEPARTEMENTS

function mouse_event(dep) {
  dep.on('mouseover', function (actif) {
    dep.setStyle({
      color: 'white',
      fillColor: 'white',
      fillOpacity: 0.2,
      opacity: 1,
      weight: 3
    });
    console.log("data")
    console.log(dep)
    console.log("data1")
    console.log(dep.feature.properties.class_0)
    data.datasets[0].data = [
      dep.feature.properties.class_100, 
      dep.feature.properties.class_90, 
      dep.feature.properties.class_80, 
      dep.feature.properties.class_70, 
      dep.feature.properties.class_60, 
      dep.feature.properties.class_50, 
      dep.feature.properties.class_40, 
      dep.feature.properties.class_30, 
      dep.feature.properties.class_20, 
      dep.feature.properties.class_10, 
      dep.feature.properties.class_0];
    config.options.plugins.title.text = dep.feature.properties.NOM_DEP;
    myChart.update()
  });
  dep.on('mouseout', function (cache) {
    departement.resetStyle(cache.target);
  })
}


var departement = await getLayer5('departements', dep_style);

departement.setStyle(dep_style);
departement.eachLayer(function (layer){
  mouse_event(layer)
})



const labels = [
  '100%',
  '90%',
  '80%',
  '70%',
  '60%',
  '50%',
  '40%',
  '30%',
  '20%',
  '10%',
  '0%',
];

var data = {
  labels: labels,
  datasets: [{
    label: '',
    backgroundColor: 'rgb(48 232 42)',
	  borderRadius: 50,
    //borderColor: ,
    data: liste_valeurs,
  }]
};

//diagramme

const config = {
  type: 'bar',
  data: data,
  options: {
    scales: {
		  x: {
			  title: {
				  display: true,
				  text: 'Part du territoire (en %)'
			  },
				beginAtZero: true,
				max: 100,
				ticks: {
          stepSize: 20
			}
		  },
		  y: {
			  title: {
				  display: true,
				  text: 'Intenisté de pollution lumineuse'
			  },
				
			}
		  },
    indexAxis: 'y',
    elements: {
      bar: {
        borderWidth: 0,
      }
    },
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'DEPARTEMENT'
      }
    }
  },
};

const myChart = new Chart(
  document.getElementById('diagramme'),
  config
);



//communes

var communes_lyr = await getLayer4('commune');
communes_lyr.setStyle(com_style)
communes_lyr.eachLayer(function (layer){
  layer.bindPopup(layer.feature.properties.COMMUNE + "<br>" + "<br>"
  + "Pollution lumineuse = " + layer.feature.properties.intensity + "%" + "<br>"
  + "Population = " + layer.feature.properties.POPULATION + " habitants" + "<br>"
  + "Superficie = " + layer.feature.properties.superficie + "km²")
})

// const myEventForwarder = new L.eventForwarder({
//   map: map,
//   // events to forward
//   events: {bindPopup: true}
// });

// // enable event forwarding
// myEventForwarder.enable();

updatetimeline()

// Side panel

$(document).ready(function(){
  $('.container_openpanel').click(function(){
    $('.menu-hide').toggleClass('show');
    $('.menu-tab').toggleClass('active');
  });
  $('#map').hover(function(){
    $('.menu-hide').removeClass('show');
    $('.menu-tab').removeClass('active');
  });
});

}

app_tom();

$(document).ready(function(){
  setTimeout(()=> {
      $('#loading').remove();
  } , 40000);
});