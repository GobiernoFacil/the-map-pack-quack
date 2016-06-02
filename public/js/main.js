// BIG MAP APP
//
//
//

/*
 * [ V A R   D E F I N I T I O N ]
 * --------------------------------------------------------------------------------
 *
 *
 */

var appINAI = {
  // las opciones de color disponibles
  BREW_COLORS :["OrRd", "PuBu", "BuPu", "Oranges", 
    "BuGn", "YlOrBr", "YlGn", "Reds", 
    "RdPu", "Greens", "YlGnBu", "Purples", 
    "GnBu", "Greys", "YlOrRd", "PuRd", "Blues", 
    "PuBuGn", "Spectral", "RdYlGn", "RdBu", 
    "PiYG", "PRGn", "RdYlBu", "BrBG", 
    "RdGy", "PuOr", "Set2", "Accent", 
    "Set1", "Set3", "Dark2", "Paired", 
    "Pastel2", "Pastel1"],
  // los settings del mapa
  mapSettings : {
    div  : "map", // el id del div que contendrá el mapa
    lat  : 22.442167,
    lng  : -100.110350,
    zoom : 5,
  },
  // el CSS para cada estado
  stateStyle : {
    weight      : 1,
    opacity     : 0.6,
    fillOpacity : 1,         
    color       : 'black',
  },
  // se inician variables internas
  map          : null, // el mapa de leaflet
  states       : null, // un array con los estados
  brew         : null, // el objeto de color
  // las opciones del objeto de color
  brewSettings : {
    colorNum : 5, // el número de colores
    colorKey : 10, // la clave de color (BREW_COLORS)
    classify : "jenks" // el método para hacer la separación de color. Sepa :P
  },
  states_array : [], // el array con objetos, datos y geometrías.
  
  //
  // [ La función de inicio ]
  //
  initialize : function(estados, inai, select){
    // se obtiene una referencia al appINAI, para usarla dentro de las funciones de este método
    var that = this;

    // se crea el mapa de leaflet
    this.map = L.map(this.mapSettings.div).setView([
      this.mapSettings.lat, 
      this.mapSettings.lng
    ],this.mapSettings.zoom);

    // se carga el gejson de los estados
    d3.json(estados, function(error, json){
      // ya que cargó el geojson de los estados, configura algunas variables internas
      that.setStates(json);
      // se carga a hora la info del INAI
      d3.json(inai, function(error, _json){
        // cuando se tiene la info del INAI, se configuran otras variables internas
        that.mapData(_json);
        // se pinta de colores el mapa
        that.filterData(select);
      });
    });
  },

  // [ COMENTAR DESPÚES ]
  //
  //
  setStates : function(estados){
    var that = this;
    this.states = L.geoJson(estados, {
      style         : this.stateStyle,
      onEachFeature : function(feature, layer) {
        that.states_array.push({
          id      : feature.properties.id,
          feature : feature,
          layer   : layer
        });

        layer.on({
          mouseover : function(){
            console.log(feature.properties);
            layer.setStyle({color : "red"});
          }
          //mouseout  : this.resetHighlight.bind(this),
          //click     : this.zoomToFeature.bind(this)
        });
      },
    }).addTo(this.map);
  },

  // [ COMENTAR DESPÚES ]
  //
  //
  mapData : function(INAIdata){
    this.states_array = this.states_array.map(function(state){
      state.feature.properties.data = INAIdata.filter(function(data){
        return data.id == state.feature.properties.id;
      })[0];
      return state;
    });
  },

  // [ COMENTAR DESPÚES ]
  //
  //
  filterData : function(e){
    var select = e.currentTarget || e,
        index  = select.value,
        data   = this.states_array.map(function(state){
          return +state.feature.properties.data[index] || 0;
        });
    this.brewColor(data);
    this.states_array.forEach(function(state){
      state.layer.setStyle({
        fillColor : this.brew.getColorInRange(+state.feature.properties.data[index] || 0),
        fill : this.brew.getColorInRange(+state.feature.properties.data[index] || 0)
      });
    }, this);

    return data;
  },

  // [ COMENTAR DESPÚES ]
  //
  //
  brewColor : function(data){
    this.brew = new classyBrew();
    this.brew.setSeries(data);
    this.brew.setNumClasses(this.brewSettings.colorNum);
    this.brew.setColorCode(this.BREW_COLORS[this.brewSettings.colorKey]);
    this.brew.classify(this.brewSettings.classify);
  }
};

// INICIA EL MAPA
appINAI.initialize("js/json/estados.json", "js/json/inai-data.json", document.querySelector("select"));

// ACTIVA EL SELECTOR DE VARIABLE
var selector = document.querySelector("select");
selector.addEventListener("change", function(e){
  appINAI.filterData(e);
});