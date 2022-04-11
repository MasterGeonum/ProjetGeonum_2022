var map = L.map('map');
var CartoDB = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    attribution: '©️ <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    minZoom: 0,
    maxZoom: 20,
    ext: 'png'
}).addTo(map);
var Openstreetmapfr = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '©️ <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    minZoom: 0, 
    maxZoom: 20
}).addTo(map);


var baseLayers = {
    "OpenstreetMap" : Openstreetmapfr,
    "Osm CartoDB" : CartoDB,
};

L.control.layers(baseLayers).addTo(map);

map.setView([45.73577, 4.8345], 14);

// function process(donnee){ 

//     // valeurs = [];
//     // for (let i in donnee.features){
//     //     for (j in donnee.features[j]){
//     //         for (h in donnee.features[j][h]){
//     //             valeurs.push(h)
//     //         }
            
//     //     }

//     // }
    
//     console.log(valeurs);



//     function getColor1(d) {
//         return d > classes[4] ? '#ca304a' :
//                 d > classes[3] ? '#f4a582' :
//                     d > classes[2] ? '#f7f7f7' :
//                         d > classes[1] ? '#7ccabc' :
//                             'transparent';
//     };

//     function Mystyle1(feature) {
//         return {
//             fillColor: getColor1(feature.properties.score_total),
//             weight: 0.8,
//             fillOpacity: 0.7
//         };
//     };

//     var carreaux = L.geoJson(donnee, {
//         style: Mystyle1
//         });

// return carreaux.addTo(map);
// };



// function get_classe(donnee){
//     var valeur =[];
//         for (var j = 0; j < donnee.features.length ; j++) {
//             for (var i = 0; i < donnee.features[j].properties.score_total.length; i++) {
//             score = donnee.features[j].properties.score_total[i];
//             valeur.push(score);
//             }
//         }
//         console.log(valeur)};


function process(donnee){
    
    var valeur =[];
    for (var j = 0; j < donnee.features.length ; j++) {
        valeur.push(donnee.features[j].properties.score_total);
        }
    valeur.sort();
    var seuil_1 = valeur[Math.floor(5*valeur.length/10)];
    var seuil_2 = valeur[Math.floor(7*valeur.length/10)];
    var seuil_3 = valeur[Math.floor(8.5*valeur.length/10)];
    var seuil_4 = valeur[Math.floor(9.8*valeur.length/10)];
    console.log(seuil_1);
    console.log(seuil_2);
    console.log(seuil_3);
    console.log(seuil_4);
    function Mystyle1(feature) {
        return {
            fillColor: getColor1(feature.properties.score_total),
            weight: 0,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.95
        };
    }
    
    function getColor1(d) {
                return d > seuil_4 ? '#E51B38' :
                        d > seuil_3 ? '#E76980' :
                            d > seuil_2 ? '#E8A2AD' :
                                d > seuil_1 ? '#E6CFD3' :
                                    'transparent';
            };


    function value_filter(feature) {
        if (feature.properties.score_total > seuil_1) 
        return true


    };

    function mouse_events(feature, leaflet_object) {
        leaflet_object.bindTooltip('score'+'<br>'+feature.properties.score_total);
     }
        
    var carreaux = L.geoJson(donnee,{filter: value_filter,
        onEachFeature:mouse_events,
        style: Mystyle1    
    }).addTo(map);
    return carreaux
//fonction filter dans la doc, lier à la variable seuil

};



fetch('json/res.json', { headers : { 
    'Content-Type': 'application/json',
    'Accept': 'application/json'
   } })
   .then((response) => response.json())
   .then((data) => {
       process(data);
   });

// Autre fetch sera dans une fonction quand on clique sur le "on", on appelera une autre adresse du serveur deja parametrer 
fetch('json/res_sansTC.json', { headers : { 
    'Content-Type': 'application/json',
    'Accept': 'application/json'
   } })
   .then((response) => response.json())
   .then((data) => {
       process(data);
   });

/*
fetch('/requete')
.then(response) (des trucs)
.then(data) {
    process(data)
}

function process(data) {
    L.geoJson(data).addTo(map)
}


var Carreaux =  L.geoJson(carreaux_quartier, {
    style: Mystyle1
    }).addTo(map);
;
*/

//Création d'une liste des valeurs de score total
//     // var score = decoded_json.donnee.features.properties.score_total;

//     // for (var i = 0; i < donnee.features.properties.score_total.length; i++) {
//     //     score.push.apply(donnee.features.properties.score_total[i]);
//     // }
        
//     function getvalue(data){
//     const object = {}
//     const score = [];
//         for (let key in object) {
//            let data = object[key];
//            let aux = [];
//            for (let i = 0; i < data.length; i++) {
//             for (let j = 0; j < i.length; j++) 
//               for (x in data[j]) {
//                  aux.push(data[i][j][x].score_total);
//               }
//            }
//            score.push(aux);
//         }
//         return score};

    
//      score2= getvalue(donnee);
//      console.log(score2);

    
//     // console.log(score);
// //


    // function get_percentile($percentile, $array) {
    //     $array.sort(function (a, b) { 
    //         return a - b; });
        
    //         $index = ($percentile/100) * $array.length;
    //         if (Math.floor($index) == $index) {
    //             $result = ($array[$index-1] + $array[$index])/2;
    //         }
    //         else {
    //             $result = $array[Math.floor($index)];
    //         }
    //         return $result;
    // }
    
    // $scores = score2;
 
    // value_1 = get_percentile(40,$scores);
    // value_2 = get_percentile(55,$scores);
    // value_3 = get_percentile(70,$scores);
    // value_4 = get_percentile(85,$scores);