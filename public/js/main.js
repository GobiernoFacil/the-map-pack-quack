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
  mapSettings : {
    div  : "map",
    lat  : 22.442167,
    lng  : -100.110350,
    zoom : 5,
  },
  stateStyle : {
    weight      : 1,
    opacity     : 0.6,
    fillOpacity : 0,         
    color       : 'black',
  },
  map          : null,
  states       : null,
  states_array : [],
  //
  //
  //
  initialize : function(estados, inai){
    var that = this;
    this.map = L.map(this.mapSettings.div).setView([
      this.mapSettings.lat, 
      this.mapSettings.lng
    ],this.mapSettings.zoom);

    d3.json(estados, function(error, json){
      that.setStates(json);
      d3.json(inai, function(error, _json){
        that.mapData(_json);
      });
    });
  },
  //
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

  //
  //
  //
  mapData : function(INAIdata){
    this.states_array = this.states_array.map(function(state){
      state.feature.properties.data = INAIdata.filter(function(data){
        return data.id == state.feature.properties.id;
      })[0];
      return state;
    });
  }
};

appINAI.initialize("js/json/estados.json", "js/json/inai-data.json");
//
// [ define las variables para genera el mapa ]
//
//
/*

d3.json("js/json/estados.json", function(e, d){

  states = L.geoJson(d, {
      style: st,
      onEachFeature : function(feature, layer) {
        states_array.push({
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
  }).addTo(map);

  d3.json("js/json/inai-data.json", function(e,d){
    states_array = states_array.map(function(state){
      state.feature.properties.data = d.filter(function(data){
        return data.id == state.feature.properties.id;
      })[0];
      return state;
    });
  });
});
*/


