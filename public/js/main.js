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
  div     : "map",
  lat     : 22.442167,
  lng     : -100.110350,
  zoom    : 5,
  token   : "",
  maxZoom : 18,
  id      : 'mapbox.light',
  baseURL : 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=',
  attribution : 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
    '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="http://mapbox.com">Mapbox</a>'
};

var st = {
    weight      : 1,
    opacity     : 0.6,
    fillOpacity : 0,         
    color       : 'black',
  };

var map = L.map(MAP.div).setView([MAP.lat, MAP.lng], MAP.zoom);
/*
var states = L.geoJson(data, {
      style: st
    }).addTo(this.map);
*/

d3.json("js/json/estados.json", function(e, d){
  states = L.geoJson(d, {
      style: st,
      onEachFeature : function(feature, layer) {
        layer.on({
        mouseover : function(){
          //console.log(feature);
          console.log( this.feature.properties);
          //console.log(layer);
        }
        //mouseout  : this.resetHighlight.bind(this),
        //click     : this.zoomToFeature.bind(this)
      });
    },
  }).addTo(map);
});
