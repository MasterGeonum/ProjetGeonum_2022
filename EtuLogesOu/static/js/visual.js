                //                    I.                   //
                // INITIALISATION DE LA PAGE CARTOGRAPHIQUE//
                //                                         //

var map = L.map('map');
var Stamen_Toner = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	subdomains: 'abcd',
	minZoom: 0,
	maxZoom: 20,
	ext: 'png'
}).addTo(map);
var CartoDB = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    attribution: '©️ <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    minZoom: 0,
    maxZoom: 20,
    ext: 'png'
});
var Openstreetmapfr = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '©️ <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    minZoom: 0, 
    maxZoom: 20
});

map.setView([45.75845852715632, 4.840543487659031], 12.5);

                //                    II.                  //
                //    CREATION DE LA FONCTION 'PROCESS'    //
                //   INTEGRE TOUTES LES OPERATIONS CARTO   //

function process(donnee){
  // Echelle //
    var scale = L.control.scale(
        options = {
            position: 'bottomleft',
            maxWidth: 100,
            metric: true,
            imperial: false,
            updateWhenIdle: false},
    ).addTo(map);
//  DISCRETISATION DU 'SCORE TOTAL'  //
    //  création d'une liste vide pour stocker les valeurs de la série score_total
    var valeur =[];
    //  boucle insérant les valeurs dans la liste  
    for (var j = 0; j < donnee.features.length ; j++) {
        valeur.push(donnee.features[j].properties.score_total);
        }
    //  Tri croissant des valeurs
    valeur.sort();
    //  Définition des seuils de classification, en fonction de la distribution
    var seuil_1 = valeur[Math.floor(5*valeur.length/10)];
    var seuil_2 = valeur[Math.floor(7*valeur.length/10)];
    var seuil_3 = valeur[Math.floor(8.5*valeur.length/10)];
    var seuil_4 = valeur[Math.floor(9.8*valeur.length/10)];

//  DEFINITION DES STYLES //
    //  création d'une liste vide pour stocker les valeurs de la série score_total
    function StyleCarreaux(feature) {
        return {
            fillColor: getColorCarreaux(feature.properties.score_total),
            weight: 0,
            fillOpacity: 0.85
        };
    };
    function getColorCarreaux(d) {
        return d >= seuil_4 ? '#8F1123' :
                d > seuil_3 ? '#E41A38' :
                    d > seuil_2 ? '#E76980' :
                        d > seuil_1 ? '#E5CED2' :
                            'transparent';
    };

    function value_filter(feature) {
        if (feature.properties.score_total > seuil_1)
        return true
    };
    //  Style - Quartiers

    function Style_quart(feature) {
        return {
            color: '#ff833b',
            fillColor:'transparant',
            fillOpacity : 0.01,
            weight : 1.5,
            
        };
    };

    function Quartier_Mouse_Events(feature,leaflet_object) {
        leaflet_object.on({
            mouseover: Quartier_Name_Appear,
            mouseout: Quartier_Reset_Name
        });
    };

    function Quartier_Name_Appear(event) {
        var layer = event.target;
        layer.bindTooltip(layer.feature.properties.nom, {
            className: "custom-tooltip",
            direction: "center",
            opacity : 0.8
        })
    
        layer.setStyle({
            weight: 4,
            color: '#FFFFFF',
            dashArray: '',
            fillOpacity: 0.7
        });
    };

    function Quartier_Reset_Name(event) {
        quarcom.resetStyle(event.target);
    };

     //  Style - Quartiers

    function Style_metro(feature) {
        return {
            color: getColorMetro(feature.properties.code_tri_ligne),
            weight: getWeight(feature.properties.famille_transport),
            opacity: 1,
        
        };
    };
    function getColorMetro(d) {
        return d == "A" ? '#ff0069' :
                d == "B" ? '#1e70fc' :
                    d == "C" ? '#fcae1d' :
                        d == "D" ? '#009338' :
                            '#7333ae';
    };
    function getWeight(d) {
        return d == "MET" ? 8 :
                d == "FUN" ? 2 :
                     4 ;
    };

     //  Style - Carreaux
    
    function Carreaux_Info_Appear(event) {
        var layer = event.target;
    
        layer.setStyle({
            weight: 5,
            color: '#FFFFFF',
            dashArray: '',
            fillOpacity: 0.7
        });
    };
    
    function Carreaux_Reset_Style(event) {
        carreaux.resetStyle(event.target);
    };
    
    function mouse_events(feature,leaflet_object) {
        leaflet_object.on({
            click: getData,
            mouseover: Carreaux_Info_Appear,
            mouseout: Carreaux_Reset_Style
        });
    };

     //  Style - Campus
     var campus_choix = donnee.features[0].properties.campus;

     var Icon_campus = L.icon({
        iconUrl:"static/images/campus_logo.png",
        iconSize: [30, 30],
        iconAnchor: [7,7]    
    });


//  APPEL DES COUCHES //
     //  GeoJSON affichés par défaut à la carte

    var carreaux = L.geoJson(donnee,{filter:value_filter,
        onEachFeature:mouse_events,
        style: StyleCarreaux
    }).addTo(map);

    var campus_carte = L.geoJson(campus,{
        pointToLayer: function (feature,latlng){
            switch (feature.properties.code_campus){
                case campus_choix : return L.marker(latlng, {
                    icon : Icon_campus});                
                default: return false;
            }
        }
    }).addTo(map);

    //  GeoJSON non affichés

    var quarcom = L.geoJSON(quartier,{
        onEachFeature:Quartier_Mouse_Events,
        style:Style_quart
    });
    
    var metrotra = L.geoJSON(metrotram,{
        style:Style_metro
    });

     //  Structuration dans le control panel
    
    var baseLayers = {
        "Noir et Blanc" : Stamen_Toner,
        "Neutre" : CartoDB,
        "Détaillé" : Openstreetmapfr      
    };
    
    var overlays = {
        "Ton résultat - Carreaux" : carreaux,
        "Ton campus" : campus_carte,
        "Quartiers de la Métropole" : quarcom,
        "Réseau Métro/Tramway" : metrotra
    };

     //  Création de la variable carte, qui englobe toutes les couches et styles
    var carte=L.control.layers(baseLayers, overlays).addTo(map);

//  TRANSMISSION DES INFORMATIONS VERS LA PAGE HTML //
     //  Fonction permettant de questionner un carreau lors d'un clic (appelée plus haut)
    function getData (event) {
        var layer = event.target;    
        layer.setStyle({
            weight: 5,
            fillColor: '#C0632B',
            dashArray: '',
            fillOpacity: 1
        });
         //  Déclaration des différentes requêtes vers la page HTML
        var my_leaflet_object = event.target;

        info_quartier = my_leaflet_object.feature.properties.nom;
        document.getElementById("info_quartier").innerHTML = info_quartier;
        
        score_tot = Math.floor(my_leaflet_object.feature.properties.score_total*10);
        document.getElementById("score_global").innerHTML = score_tot;
        
        score_t = Math.floor(my_leaflet_object.feature.properties.score_t*10);
        document.getElementById("score_transport").innerHTML = score_t;
        
        score_l = Math.floor(my_leaflet_object.feature.properties.score_l*10);
        document.getElementById("score_logement").innerHTML = score_l;
        
        score_cdv = Math.floor(my_leaflet_object.feature.properties.score_cdv*10);
        document.getElementById("score_cdv").innerHTML = score_cdv;
        
        info_loyer = my_leaflet_object.feature.properties.loyer;
        document.getElementById("info_loyer").innerHTML = info_loyer;

        info_type = my_leaflet_object.feature.properties.piece;
        document.getElementById("info_type").innerHTML = info_type;
        
        info_transport = Math.floor(my_leaflet_object.feature.properties.transport);
        document.getElementById("info_transport").innerHTML = info_transport;
    };
    
//  RENVOI DE LA FONCTION PROCESS//
    return carte
};



                //                    III.                  //
                //        APPEL DE LA FONCTION FETCH        //
                //  INTERROGE LE GSJON CREER PAR LA REQUETE //


fetch('static/json/res.json', { headers : { 
    'Content-Type': 'application/json',
    'Accept': 'application/json'
   } })
   .then((response) => response.json())
   .then((data) => {
       process(data);
});


