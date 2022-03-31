import { getLayer, getLayer2, getLayer3, getLayer4, getLayer5, getLayer6 } from '/js/data_toulousebynight.js';

async function app () {

var map = L.map('map', { drawControl: true });
var osmUrl = 'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png';
var osmAttrib = 'Map data ©️ CartoDB contributors';

var osmNuit = new L.TileLayer(osmUrl, {attribution: osmAttrib}).addTo(map);

map.setView([43.604652, 1.444209], 14);

//Ajouter les données

const bati_commerces = await getLayer('commerces_final');
const quartiers = await getLayer2('zones_quartiers_finale');
const bati_entreprises = await getLayer3('entreprises_final');
const bati_loisirs = await getLayer4('loisirs_final');
const bati_residences = await getLayer5('residentiel_final');
const bati_public = await getLayer6('public_final');


// Pourcentages

var info = document.getElementById("pourcentage");
var pourcentgen = 0
var coeff_quartiers = 1

function getpourcentages(layer){
  var pourcent_fin = 0;
    for (var i = 0; i < Object.keys(layer.features).length; i++){
        if (checkWhocheck().includes(layer.features[i].properties.libelle_des_grands_quartiers)){
          var pourcent = parseFloat((layer.features[i].properties._partPart).replace(/,/g, '.'));
          pourcent_fin = pourcent_fin+pourcent;
        } else {
        }
      }
      console.log(pourcent_fin)
      return pourcent_fin
  }

// checkbox

function makeButtons(c) {
  for (var i = 0; i < c.length; i++) {
    $('#container_quartiers').append('<label><input type="checkbox" class="switch" id="' + c[i] + '"/>' + c[i] +'</label>');
  }
}
makeButtons((quartiers.quartier_categ).sort());

// Check if checkbox is checked

$('#tout').prop('checked', true);
$('.switch').prop('checked', true);

function checkWhocheck(){
  var idSelector = function() { return this.id; };
  var coche = $("input[class=switch]:checked").map(idSelector).get();
  return coche
}

// Checkbox drop-down

$("#container_quartiers").hide();
$("#wrapper").hide();

$('.drop-down-button').on('click', function () {
  var $dropDownList = $('#container_quartiers');
  var $dropArrow = $('.drop-down .drop-arrow');

  $dropDownList.slideToggle('fast');

  if ($dropArrow.hasClass('arrow-up')) {
      $dropArrow.removeClass('arrow-up');
  } else {
      $dropArrow.addClass('arrow-up');
  }
});


// Fonction qui gère les autres

$(".switch").on('change',function(e) {
  $('#tout').prop('checked', false);
  var $boxes = $('input[class=switch]:checked');
  var quartierres = getpourcentages(quartiers.quartier);
  var coeff_quartiers = quartierres/100;
  info.innerHTML = '' + Math.round(pourcentgen * coeff_quartiers * 100) / 100 + '%'
  if ($boxes.length > 0){
      checkWhocheck()
      bati_commerces.setStyle(stylelight);
      bati_entreprises.setStyle(stylelight);
      bati_loisirs.setStyle(stylelight);
      bati_residences.setStyle(stylelight);
      bati_public.setStyle(stylelight);
  }
});

// Fonction qui gère le switchall

$('#tout').on('change',function(e) {
  if ($('#tout').prop('checked', true)){
    $('.switch').prop('checked', true);
    bati_commerces.setStyle(stylelight);
    bati_entreprises.setStyle(stylelight);
    bati_loisirs.setStyle(stylelight);
    bati_residences.setStyle(stylelight);
    bati_public.setStyle(stylelight);
    coeff_quartiers = 1;
    info.innerHTML = '' + Math.round(pourcentgen * coeff_quartiers * 100) / 100 + '%'
  }
  else {
    $('#tout').prop('checked', false)
    $('.switch').prop('checked', false)
    
  }
});

//Coloriage
function getColor(value) {
  return value > 80 ? '#ffffff' :
          value > 70  ? '#fdfdf6' :
          value > 60  ? '#fbfaec' :
          value > 50  ? '#f9f8e3' :
          value > 40  ? '#f7f5d9' :
          value > 30  ? '#f5f2d0' :
          value > 20  ? '#f3f0c6' :
          value > 10  ? '#f1edbd' :
          value > 6  ? '#eeeab3' :
                      '#A8A8A8';
}

function selectattributes(features){
if (checkWhocheck().includes(features.properties.libelle_des_grands_quartiers)){
  return getColor(features.properties.Intensite)
} else {
  return '#000000'
}}

function stylelight(features) {
return {
  weight:12,
  opacity: 0.1,
  color: selectattributes(features),
  dashArray: '1',
  fillOpacity: 1
};
}

// function styledark() {
// return {
//   weight:12,
//   opacity: 0.1,
//   color: '#000000',
//   dashArray: '1',
//   fillOpacity: 1
// };
// }

bati_commerces.setStyle(stylelight);
bati_entreprises.setStyle(stylelight);
bati_loisirs.setStyle(stylelight);
bati_residences.setStyle(stylelight);
bati_public.setStyle(stylelight);

bati_commerces.eachLayer(function (layer){
  layer.bindPopup("Quartier : " + layer.feature.properties.libelle_des_grands_quartiers + "", {
  direction: 'up',
  permanent: false,
  sticky: true,
  opacity: 0.75,
  className: 'tooltip_quartiers' 
  })
});
bati_entreprises.eachLayer(function (layer){
  layer.bindPopup("Quartier : " + layer.feature.properties.libelle_des_grands_quartiers + "", {
    direction: 'up',
    permanent: false,
    sticky: true,
    opacity: 0.75,
    className: 'tooltip_quartiers' 
    })
})
bati_loisirs.eachLayer(function (layer){
  layer.bindPopup("Quartier : " + layer.feature.properties.libelle_des_grands_quartiers + "", {
    direction: 'up',
    permanent: false,
    sticky: true,
    opacity: 0.75,
    className: 'tooltip_quartiers' 
    })
})
bati_residences.eachLayer(function (layer){
  layer.bindPopup("Quartier : " + layer.feature.properties.libelle_des_grands_quartiers + "", {
    direction: 'up',
    permanent: false,
    sticky: true,
    opacity: 0.75,
    className: 'tooltip_quartiers' 
    })
})
bati_public.eachLayer(function (layer){
  layer.bindPopup("Quartier : " + layer.feature.properties.libelle_des_grands_quartiers + "", {
    direction: 'up',
    permanent: false,
    sticky: true,
    opacity: 0.75,
    className: 'tooltip_quartiers' 
    })
})


// add buttons
$("#button1").click(function(event) {
    event.preventDefault();
    if (map.hasLayer(bati_commerces)) {
      $(this).removeClass('selected');
      map.removeLayer(bati_commerces);
      pourcentgen = parseFloat(pourcentgen-21);
      info.innerHTML = '' + pourcentgen * coeff_quartiers + '%'
    } else {
      map.addLayer(bati_commerces);
      $(this).addClass('selected');
      pourcentgen = parseFloat(pourcentgen+21);
      info.innerHTML = '' + pourcentgen * coeff_quartiers + '%'
    };
  });

  $("#button2").click(function(event) {
    event.preventDefault();
    if (map.hasLayer(bati_entreprises)) {
      $(this).removeClass('selected');
      map.removeLayer(bati_entreprises);
      pourcentgen = parseFloat(pourcentgen-23);
      info.innerHTML = '' + pourcentgen * coeff_quartiers + '%'
    } else {
      map.addLayer(bati_entreprises);
      $(this).addClass('selected');
      pourcentgen = parseFloat(pourcentgen+23);
      info.innerHTML = '' + pourcentgen * coeff_quartiers + '%'
    };
  });

  $("#button3").click(function(event) {
    event.preventDefault();
    if (map.hasLayer(bati_loisirs)) {
      $(this).removeClass('selected');
      map.removeLayer(bati_loisirs);
      pourcentgen = parseFloat(pourcentgen-19);
      info.innerHTML = '' + pourcentgen * coeff_quartiers + '%'
    } else {
      map.addLayer(bati_loisirs);
      $(this).addClass('selected');
      pourcentgen = parseFloat(pourcentgen+19);
      info.innerHTML = '' + pourcentgen * coeff_quartiers + '%'
    };
  });

  $("#button4").click(function(event) {
    event.preventDefault();
    if (map.hasLayer(bati_residences)) {
      $(this).removeClass('selected');
      map.removeLayer(bati_residences);
      pourcentgen = parseFloat(pourcentgen-19);
      info.innerHTML = '' + pourcentgen * coeff_quartiers + '%'
    } else {
      map.addLayer(bati_residences);
      $(this).addClass('selected');
      pourcentgen = parseFloat(pourcentgen+19);
      info.innerHTML = '' + pourcentgen * coeff_quartiers + '%'
    };
  });

  $("#button5").click(function(event) {
    event.preventDefault();
    if (map.hasLayer(bati_public)) {
      $(this).removeClass('selected');
      map.removeLayer(bati_public);
      pourcentgen = parseFloat(pourcentgen-18);
      info.innerHTML = '' + pourcentgen * coeff_quartiers + '%'
    } else {
      map.addLayer(bati_public);
      $(this).addClass('selected');
      pourcentgen = parseFloat(pourcentgen+18);
      info.innerHTML = '' + pourcentgen * coeff_quartiers + '%'
    };
  });

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

  // Echelle

var scale = new L.control.scale(
  {
      position: 'bottomleft',
      imperial: false
    },
)

scale.addTo(map);

// Légende

var legend = new L.control({ position: 'topright' });
legend.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'info legend');
  div.innerHTML += "<h5>Pollution lumineuse produite par les bâtiments</h5>";
  div.innerHTML += '<i style="background: #ffffff borders: #000000"></i><span>Forte pollution</span><br>';
  div.innerHTML += '<i style="background: #fdfdf6"></i><span></span><br>';
  div.innerHTML += '<i style="background: #fbfaec"></i><span></span><br>';
  div.innerHTML += '<i style="background: #f9f8e3"></i><span></span><br>';
  div.innerHTML += '<i style="background: #f7f5d9"></i><span>Pollution moyenne</span><br>';
  div.innerHTML += '<i style="background: #f5f2d0"></i><span></span><br>';
  div.innerHTML += '<i style="background: #f3f0c6"></i><span></span><br>';
  div.innerHTML += '<i style="background: #f1edbd"></i><span></span><br>';
  div.innerHTML += '<i style="background: #eeeab3"></i><span>Faible pollution</span><br>';
  return div;
};

legend.addTo(map);







}

app();

$(document).ready(function(){
  setTimeout(()=> {
      $('#loading').remove();
  } , 18000);
});
