<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>El generador de mapas</title>
  <link rel="stylesheet" type="text/css" href="js/bower_components/leaflet/dist/leaflet.css">
  <link rel="stylesheet" type="text/css" href="css/style.css">
</head>
<body>
  <!-- los controles temporales -->
  <form>
    <select>
      <option value="indice_2008">indice 2008</option>
      <option value="indice_2009">indice 2009</option>
      <option value="indice_2010">indice 2010</option>
      <option value="indice_2011">indice 2011</option>
      <option value="indice_2012">indice 2012</option>
      <option value="indice_2013">indice 2013</option>
      <option value="indice_2014" selected>indice 2014</option>
    </select>
  </form>

  <!-- el mapa! -->
  <div id="map"></div>

<script src="js/bower_components/d3/d3.js"></script>
<script src="js/bower_components/leaflet/dist/leaflet.js"></script>
<script src="js/libs/classybrew/build/classybrew.min.js"></script>
<script src="js/main.js"></script>
<script></script>
</body>
</html>