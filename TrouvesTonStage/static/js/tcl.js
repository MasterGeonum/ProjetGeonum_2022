//Réseau de transport TCL grouplayer
var tcl = new L.LayerGroup();

//Ligne de Metro 
//style
function metroStyle(feature) {
  switch (feature.properties.ligne) {
      case 'A': return { color: "#E8308A" };
      case 'B': return { color: "#0075BF" };
      case 'C': return { color: "#F59C00" };
      case 'D': return { color: "#009E3D" };
  }
};


//Highlight ligne
function highlight_metro (feature, layer) {
  layer.bindPopup(feature.properties.ligne);
  layer.on('mouseover', function () {
      this.setStyle({
        weight: 5
      });
  });
  layer.on('mouseout', function () {
      metro_tcl.resetStyle(this);
  });
}
//Ajout au grouplayer tcl
var metro_tcl = L.geoJSON(metro, {style:metroStyle, onEachFeature:highlight_metro})
metro_tcl.addTo(tcl);


//Ligne de tramway
//style
function tramStyle(feature) {
return {
  color: '#8C368C'
}
};
//Highlight ligne
function highlight_tram (feature, layer) {
  layer.bindPopup(feature.properties.ligne);
  layer.on('mouseover', function () {
      this.setStyle({
        weight: 5
      });
  });
  layer.on('mouseout', function () {
      tram_tcl.resetStyle(this);
  });
}
//Ajout au grouplayer tcl
var tram_tcl = L.geoJSON(tram, {style:tramStyle, onEachFeature:highlight_tram})
tram_tcl.addTo(tcl);

//Metro stop
//style
function metroIcon(feature, latlng) {
  let myIcon = new L.icon({
    iconUrl: 'images/metro_logo.png',
    shadowUrl: 'images/marker-shadow.png',
    iconSize: [17, 12],
    iconAnchor: [8, 6],
    shadowSize: [22, 22],
    shadowAnchor: [6, 14]
  })
  return new L.marker(latlng, { icon: myIcon })
}
//Popup survol
function tooltip(feature, layer) {
    layer.bindTooltip(feature.properties.nom);
}
//Ajout au grouplayer tcl
var arret_metro_tcl = L.geoJSON(arret_metro, {pointToLayer: metroIcon, onEachFeature: tooltip})
arret_metro_tcl.addTo(tcl);


//Tramway stop
function tramIcon(feature, latlng) {
  let myIcon = new L.icon({
    iconUrl: 'images/tram_logo.svg',
    shadowUrl: 'images/marker-shadow.png',
    iconSize: [15, 10],
    iconAnchor: [7, 5],
    shadowSize: [20, 20],
    shadowAnchor: [5, 13]
  })
  return new L.marker(latlng, { icon: myIcon })
}
//Ajout au grouplayer tcl
var arret_tram_tcl = L.geoJSON(arret_tram, {pointToLayer: tramIcon, onEachFeature: tooltip})
arret_tram_tcl.addTo(tcl);


// Button TCL
// Author: Jerroyd Moore
L.Control.Button = L.Control.extend({
  includes: L.Evented.prototype || L.Mixin.Events,
  options: {
      position: 'topleft',
  },
  initialize: function (label, options) {
      L.setOptions(this, options);
      var button = null;

      if (label instanceof HTMLElement) {
          button = label;
          try {
              button.parentNode.removeChild(button);
          } catch (e) { }
      } else if (typeof label === "string") {
          button = L.DomUtil.create('button', this.options.className);
          button.style.backgroundImage = "url(https://webzine.one/wp-content/uploads/TCL.png)";
          button.style.backgroundSize = "30px 30px";
          button.style.width = '32px';
          button.style.height = '32px';
          button.innerHTML = label;
      } else {
          throw new Error('L.Control.Button: failed to initialize, label must either be text or a dom element');
      }

      L.DomUtil.addClass(button, this.options.position);

      this._container = button;

      return this;
  },
  isToggled: function () {
      return L.DomUtil.hasClass(this._container, this.options.toggleButton);
  },
  _fireClick: function (e) {
      this.fire('click');

      if (this.options.toggleButton) {
          var btn = this._container;
          if (this.isToggled()) {
              L.DomUtil.removeClass(this._container, this.options.toggleButton);
          } else {
              L.DomUtil.addClass(this._container, this.options.toggleButton);
          }
      }
  },
  onAdd: function (map) {
      if (this._container) {
          L.DomEvent.on(this._container, 'click', this._fireClick, this);
          var stop = L.DomEvent.stopPropagation;
          L.DomEvent.on(this._container, 'mousedown', stop)
                    .on(this._container, 'touchstart', stop)
                    .on(this._container, 'dblclick', stop)
                    .on(this._container, 'mousewheel', stop)
                    .on(this._container, 'MozMozMousePixelScroll', stop)
          this.fire('load');

          this._map = map;
      }

      return this._container;
  },
  onRemove: function (map) {
      if (this._container && this._map) {
          L.DomEvent.off(this._container, 'click', this._fireClick, this);
          L.DomEvent.off(this._container, 'mousedown', stop)
                    .off(this._container, 'touchstart', stop)
                    .off(this._container, 'dblclick', stop)
                    .off(this._container, 'mousewheel', stop)
                    .off(this._container, 'MozMozMousePixelScroll', stop)

          this.fire('unload');
          this._map = null;
      }

      return this;
  }
});

//Création du bouton TCL
var button = new L.Control.Button( '',{
  toggleButton: 'active'
});
button.addTo(map);
button.on('click', function () {
    if (button.isToggled()) {
      map.removeLayer(tcl)
    } else {
      tcl.addTo(map);
    }
});