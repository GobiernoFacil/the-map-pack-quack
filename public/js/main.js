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

//
// [ define las variables para genera el mapa ]
//
//
var MAP = {
  div  : "map",
  lat  : 22.442167,
  lng  : -100.110350,
  zoom : 5,
},

st = {
    weight      : 1,
    opacity     : 0.6,
    fillOpacity : 0,         
    color       : 'black',
  },
states,
states_array = [],
map    = L.map(MAP.div).setView([MAP.lat, MAP.lng], MAP.zoom);


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
          layer.setStyle({color : "red"});
        }
        //mouseout  : this.resetHighlight.bind(this),
        //click     : this.zoomToFeature.bind(this)
      });
    },
  }).addTo(map);

  d3.json("js/json/inai-data.json", function(e,d){
    console.log(d);
  });
});
