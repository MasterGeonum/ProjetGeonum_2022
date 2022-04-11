/* Style creation*/

function getColor1(d) {
    return d > 11.9 ? '#ca304a' :
            d > 10.90 ? '#f4a582' :
                d > 9.76 ? '#f7f7f7' :
                    d > 8.26 ? '#7ccabc' :
                        '#019c80';
};

function Mystyle1(feature) {
    return {
        fillColor: getColor1(feature.properties.moy_pm),
        weight: 0.8,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

function getColor2(d) {
    return d == "A" ? '#ff0069' :
            d == "B" ? '#1e70fc' :
                d == "C" ? '#fcae1d' :
                    d == "D" ? '#009338' :
                        '#7333ae';
};

function Mystyle2(feature) {
    return {
        color: getColor2(feature.properties.ligne),
        weight: 6,
        opacity: 1,
    
    };
}

function BufferOverStyle(feature) {
    return {
        fillColor: getColor3(feature.properties.reglementa),
        weight: 0.8,
        opacity: 1,
        color: 'white',
        fillOpacity: 1
    };
}

function getColor3(d){
    return d === 'Gratuit' ? '#539733' :
                d === 'Payant' ? '#d99108' :
                    d === 'Zone bleue' ? '#1068b1' :
                        '#3d3d3d';
};

var circleOptions = {
    color: 'white',
    fillColor: 'white',
    opacity:0,
    fillOpacity: 0
 }

var Icon_Payant = L.icon({
    iconUrl:"pictures/park_logo_payant.png",
    iconSize: [15, 15],
    iconAnchor: [7,7]    
})

var Icon_Gratuit = L.icon({
    iconUrl:"pictures/park_logo_gratuit.png",
    iconSize: [15, 15],
    iconAnchor: [7,7]    
})

var Icon_Zbleue = L.icon({
    iconUrl:"pictures/park_logo_zbleue.png",
    iconSize: [15, 15],
    iconAnchor: [7,7]    
})

var Icon_Autre = L.icon({
    iconUrl:"pictures/park_logo.png",
    iconSize: [15, 15],
    iconAnchor: [7,7]    
})


/* Geojson imports*/


var parking= L.geoJson(pts_parking,{
    pointToLayer: function (feature,latlng){
        switch (feature.properties.reglementa){
            case 'Gratuit' : return L.marker(latlng, {
                icon : Icon_Gratuit});
            case 'Payant' : return L.marker(latlng, {
                icon : Icon_Payant});
            case 'Zone bleue' : return L.marker(latlng, {
                icon : Icon_Zbleue});
            default: return L.marker(latlng, {
            icon : Icon_Autre});
        }
    }
});


var iris_pm = L.geoJson(iris, {
style: Mystyle1
});

var metro_trace = L.geoJson(lignes_metro, {
    style: Mystyle2
});


/* Parking mouseover */


var points_park=L.geoJSON(pts_parking,{
    pointToLayer: function(feature,latlng){
        return L.circle(latlng,300,circleOptions);
    },
    onEachFeature: mouse_events
})


function mouse_events(feature, leaflet_object) {
    leaflet_object.bindTooltip(feature.properties.nom+"<br>"+feature.properties.usage+"<br>"+"Nombre de places : "+feature.properties.capacite);
    leaflet_object.on('mouseover',on_mouseover);
    leaflet_object.on('mouseout',on_mousout);
}
    
    function on_mouseover(event){
        var my_leaflet_object = event.target;
        my_leaflet_object.setStyle(BufferOverStyle(my_leaflet_object.feature));
        my_leaflet_object.bringToFront();
    }

    function on_mousout(event){
        var my_leaflet_object= event.target;
        points_park.resetStyle(event.target);

    }


/* Map settings */


var Stamen_Toner = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	subdomains: 'abcd',
	minZoom: 0,
	maxZoom: 20,
	ext: 'png'
});

var baseMaps = {
    "Fond de plan": Stamen_Toner
};

var overlayMaps = {
    "Iris": iris_pm,
    "Parkings": parking,
    "Metro": metro_trace
    
};

var map = L.map('map', {layers: [Stamen_Toner,iris_pm,parking,metro_trace,points_park]}),
    metro= [
        L.polyline([[45.705637585701126,4.888004184374848],[45.70909428601663,4.887235761887564],[45.71380055920529,4.888167715485796],[45.718988028956076,4.887790039485871],[45.72170322451361,4.886781884496988],[45.72382090630691,4.887220927108964],[45.729392620683996,4.886714442578735],[45.73474742153407,4.889553497965593],[45.73608191874001,4.889149674702653],[45.74199114413824,4.883258645240296],[45.743591183110716,4.877286459280197],[45.755966597459306,4.841385567428094],[45.75604120608987,4.834831129433443],[45.75991332019337,4.828576269704592],[45.76106006883167,4.821133932391566,],[45.76506253491372,4.806793539809585],[45.766126270107705,4.805531213697621],[45.77594963247837,4.80528296426884],[45.77880362179411,4.803020029016412],[45.78068836127313,4.804447723294087]]),
        L.polyline([[45.76220341599465,4.821862808345094],[45.76002127902339,4.826003952871672]]),
        L.polyline([[45.749606314011174,4.826874391635897],[45.756749845531246,4.831578310026731],[45.75839292853049,4.834585678256787],[45.760887081744116,4.835733297591814],[45.76762765441217,4.836128007446201],[45.76862562577019,4.837514146557144],[45.76871381713175,4.844024763833917],[45.771039761633006,4.868790401732148],[45.770842089816924,4.87248399390608],[45.764522996130204,4.906842574535079],[45.76320137159014,4.913371796819704],[45.76095707369683,4.921095093017623]]),
        L.polyline([[45.7853194285579,4.832604503186497],[45.782258863372476,4.828616076749771],[45.77899414698382,4.827551155421506],[45.774472351675385,4.830727514722802],[45.774449871290926,4.83294238292104],[45.77098160063667,4.836223217188234],[45.76798397646727,4.836066019200024]]),
        L.polyline([[45.75999526624082,4.82602351548363],[45.75720692909136,4.816561778886587]]),
        L.polyline([[45.77044053002937,4.863175968935646],[45.768206891608685,4.859228889256524],[45.76283499003921,4.859593988842484],[45.761720705446194,4.858266509719602,],[45.76045874206618,4.8488281481846],[45.757597765179106,4.846066969546346],[45.75366031067041,4.846922233070471],[45.724134924981534,4.829329241168998],[45.721718914011745,4.827688230249003],[45.718113638522375,4.822409990150962],[45.716758078694916,4.815219430849116]])
    ],
    markers=[];

L.control.layers(baseMaps, overlayMaps).addTo(map);


map.fitBounds(metro_trace.getBounds());


/* Caption */


var htmlLegend_Iris = L.control.htmllegend({
    position: 'bottomright',
    legends: [{
        name: 'Concentration annuelle moyenne en pm2.5 par IRIS',
        layer: iris_pm,
        elements: [{
            label: 'Forte concentration (entre 12 et 14,4)',
            html: '',
            style: {
                'background-color': '#ca304a',
                'width': '20px',
                'height': '20px'
            }
        }, {
            label: 'Concentration assez forte (entre 10,9 et 12)',
            html: '',
            style: {
                'background-color': '#f4a582',
                'width': '20px',
                'height': '20px'
            }
        }, {
            label: 'Concentration moyenne (entre 9,8 et 10,9)',
            html: '',
            style: {
                'background-color': '#f7f7f7',
                'width': '20px',
                'height': '20px'
            }
        }, {
            label: 'Concentration assez faible (entre 8,3 et 9,8)',
            html: '',
            style: {
                'background-color': '#7ccabc',
                'width': '20px',
                'height': '20px'
            }
        }, {
            label: 'Concentration faible (entre 5,5 et 8,3)',
            html: '',
            style: {
                'background-color': '#019c80',
                'width': '20px',
                'height': '20px'
            }
        }
    ]
    }],
    collapseSimple: true,
    detectStretched: false,
    collapsedOnInit: true,
    disableVisibilityControls : true
})
map.addControl(htmlLegend_Iris)



var htmlLegend_metro = L.control.htmllegend({
    position: 'bottomright',
    legends: [{
        name: 'Métro',
        layer: metro_trace,
        elements: [{
            label: 'Ligne A',
            html: '',
            style: {
                'background-color': '#ff0069',
                'width': '20px',
                'height': '20px'
            }
        }, {
            label: 'Ligne B',
            html: '',
            style: {
                'background-color': '#1e70fc',
                'width': '20px',
                'height': '20px'
            }
        }, {
            label: 'Ligne C',
            html: '',
            style: {
                'background-color': '#fcae1d',
                'width': '20px',
                'height': '20px'
            }
        }, {
            label: 'Ligne D',
            html: '',
            style: {
                'background-color': '#009338',
                'width': '20px',
                'height': '20px'
            }
        }, {
            label: 'Funiculaires',
            html: '',
            style: {
                'background-color': '#7333ae',
                'width': '20px',
                'height': '20px'
            }
        }
    ]
    }],
    collapseSimple: true,
    detectStretched: true,
    visibleIcon: 'icon icon-eye',
    collapsedOnInit: true,
    hiddenIcon: 'icon icon-eye-slash'
})

map.addControl(htmlLegend_metro)


var htmlLegend_parking = L.control.htmllegend({
    position: 'bottomright',
    legends: [{
        name: 'Parkings',
        layer: parking,
        elements: [{
            label: 'Gratuit',
            html: '<img src="images/park_logo_gratuit.png" alt="" width="20" height=20/>'
        }, {
            label: 'Payant',
            html: '<img src="images/park_logo_payant.png" alt="" width="20" height=20/>'     
        }, {
            label: 'Zone Bleue',
            html: '<img src="images/park_logo_zbleue.png" alt="" width="20" height=20/>'
        }, {
            label: 'Autres',
            html: '<img src="images/park_logo.png" alt="" width="20" height=20/>'
        }
    ]
    }],
    collapseSimple: true,
    detectStretched: true,
    visibleIcon: 'icon icon-eye',
    disableVisibilityControls: true,	
    hiddenIcon: 'icon icon-eye-slash'
})
map.addControl(htmlLegend_parking);

/* Animated */

(function(){
    var metroIcon = L.icon({
        iconUrl: 'images/metro_icon.png',
        iconSize: [25, 25],
        iconAnchor: [12.5, 12.5],
        shadowUrl: null
    });

    $.each(metro, function(i, metro_ligne) {
        var marker = L.animatedMarker(metro_ligne.getLatLngs(), {
            icon: metroIcon,
            autoStart: false,
            onEnd: function() {
                $(this._shadow).fadeOut();
                $(this._icon).fadeOut(3000, function(){
                map.removeLayer(this);
                });
            } 
        });

        map.addLayer(marker);
        markers.push(marker);
    });

    $(function() {
    $('#start').click(function() {
        console.log('start');
        $.each(markers, function(i, marker) {
        marker.start();
        });

        $(this).hide();
    });
});
}());