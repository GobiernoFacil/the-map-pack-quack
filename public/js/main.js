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
  // a dictionary for the valiable values. Is used to mix all the years of a given index,
  // tom make a single calculation for the data range (e.g. get the values from 2008 to 2014 to
  // define the color range)
  dataMap : {
    pob_conapo : [{key : "pob_conapo_2016", year : 2016}],
    presupuesto : [{
      key  : "presupuesto_2014",
      year : 2014
    },
    {
      key  : "presupuesto_2015",
      year : 2015
    },
    {
      key  : "presupuesto_2016",
      year : 2016
    }],
    percapita : [{key : "percapita_2016", year : 2016}],
    solicitudes : [{
      key  : "solicitudes_2008",
      year : 2008
    },
    {
      key  : "solicitudes_2009",
      year : 2009
    },
    {
      key  : "solicitudes_2010",
      year : 2010
    },
    {
      key  : "solicitudes_2011",
      year : 2011
    },
    {
      key  : "solicitudes_2012",
      year : 2012
    },
    {
      key  : "solicitudes_2013",
      year : 2013
    },
    {
      key  : "solicitudes_2014",
      year : 2014
    }],
    indice : [{
      key  : "indice_2008",
      year : 2008
    },
    {
      key  : "indice_2009",
      year : 2009
    },
    {
      key  : "indice_2010",
      year : 2010
    },
    {
      key  : "indice_2011",
      year : 2011
    },
    {
      key  : "indice_2012",
      year : 2012
    },
    {
      key  : "indice_2013",
      year : 2013
    },
    {
      key  : "indice_2014",
      year : 2014
    }],
    "resolucion_sobreseer":[{key          : "resolucion_sobreseer", year : null}],
   "resolucion_desechar":[{key            : "resolucion_desechar", year : null}],
   "resolucion_revocar":[{key             : "resolucion_revocar", year : null}],
   "resolucion_confirmar":[{key           : "resolucion_confirmar", year : null}],
   "resolucion_modificar":[{key           : "resolucion_modificar", year : null}],
   "resolucion_tramite":[{key             : "resolucion_tramite", year : null}],
   "resolucion_no_interpuesto":[{key      : "resolucion_no_interpuesto", year : null}],
   "resolucion_orden_entregar":[{key      : "resolucion_orden_entregar", year : null}],
   "resolucion_revocar_parcial":[{key     : "resolucion_revocar_parcial", year : null}],
   "resolucion_revocados":[{key           : "resolucion_revocados", year : null}],
   "resolucion_improcedente":[{key        : "resolucion_improcedente", year : null}],
   "resolucion_desechado":[{key           : "resolucion_desechado", year : null}],
   "resolucion_confirmar_respuesta":[{key : "resolucion_confirmar_respuesta", year : null}]
  },

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
        _index = select.value,
        index  = this.dataMap[_index],
        keys   = index.map(function(ind){
          return ind.key;
        }),
        data     = [],
        selected = keys[0];

        keys.forEach(function(k){
          data = data.concat(this.states_array.map(function(state){
            return +state.feature.properties.data[k] || 0;
          }));
        }, this);

    this.brewColor(data);

    this.states_array.forEach(function(state){
      state.layer.setStyle({
        fillColor : this.brew.getColorInRange(+state.feature.properties.data[selected] || 0),
        fill : this.brew.getColorInRange(+state.feature.properties.data[selected] || 0)
      });
    }, this);
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