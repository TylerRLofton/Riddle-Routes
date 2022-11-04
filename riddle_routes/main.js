import Feature from "ol/Feature";
import Map from "ol/Map";
import Overlay from 'ol/Overlay';
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import View from "ol/View";
import { Circle as CircleStyle, Fill, RegularShape, Stroke, Style, Text } from "ol/style";
import { LineString, Point } from "ol/geom";
import { getVectorContext } from "ol/render";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { transform } from "ol/proj";
import ZoomSlider from 'ol/control/ZoomSlider';
import {defaults as defaultControls} from 'ol/control'
import {fromLonLat, toLonLat} from 'ol/proj';
import {toStringHDMS} from 'ol/coordinate';
import Select from 'ol/interaction/Select';
import Openrouteservice from 'openrouteservice-js'
import GeoJSON from 'ol/format/GeoJSON';

let orsDirections = new Openrouteservice.Directions({ api_key: "5b3ce3597851110001cf62483b87bc36de04409eb746fa7da358e0c2"});


const pos = fromLonLat([-81.047220, 29.19024]);
var posX;
var posY;
var blueLightTowerCount = 15;
var blueLightTower = new Array(blueLightTowerCount);
var blueLightTowerPositionX = new Array(blueLightTowerCount);
var blueLightTowerPositionY = new Array(blueLightTowerCount);
var startX;
var startY;
var endX;
var endY;
var startRouteMarker;
var routeJSON;
var routePoints = new Array();
var routeLine;
var getRoute = "https://api.openrouteservice.org/v2/directions/foot-walking?api_key=5b3ce3597851110001cf62483b87bc36de04409eb746fa7da358e0c2&start=-81.047220,%2029.19024&end=-81.04934,%2029.18818";
var startLongLat = [-81.047220, 29.19024];
var endlongLat = [-81.04934, 29.18818];
var routePointsVectorLayer;
var routePointsVectorSource;

for(let i = 0; i <= blueLightTowerCount; i++){
    blueLightTowerPositionX[i] = 29.18818 + Math.random() * 0.0001 * i;
    blueLightTowerPositionY[i] = -81.04965 - Math.random() * 0.0001 * i;
}

for (let i = 0; i < blueLightTowerCount; ++i) {
  blueLightTower[i] = new Feature({
    geometry: new Point(transform([blueLightTowerPositionY[i], blueLightTowerPositionX[i]], "EPSG:4326", "EPSG:3857")),
   size: 10,
    type: "blueLightTower",
  });
};

const BlueLightstyle = {
  "10": new Style({
    image: new RegularShape({
      points: 5,
      radius: 5,
      radius2: 7,
      angle: 0,
      fill: new Fill({ color: 'blue' }),
      stroke: new Stroke({ color: 'white', width: 1 }),
    }),
    text: new Text({
      font: '12px sans-serif',
      text: 'Blue Light Tower',
      fill: new Fill({
        color: 'blue',
      }),
      offsetY: -10,
      padding: [2, 2, 2, 2],
    }),
  }),
};


const startRouteStyle = { "11": new Style({
    image: new RegularShape({
      points: 4,
      radius: 9,
      radius2: 15,
      angle: 0,
      fill: new Fill({ color: 'green' }),
      stroke: new Stroke({ color: 'white', width: 1 }),
    }),
    text: new Text({
      font: '20px sans-serif',
      text: 'Route Start',
      fill: new Fill({
        color: 'Black',
      }),
      offsetY: 15,
      padding: [2, 2, 2, 2],
    }),
  })
};

startRouteMarker = new Feature({
  geometry: new Point(transform([-81.047220, 29.19024], "EPSG:4326", "EPSG:3857")),
  size: 11,
});


const routeMarkerVecorSource = new VectorSource({
  features: [startRouteMarker],
  wrapX: false,
});

const routeMarkerVectorLayer = new VectorLayer({
  source: routeMarkerVecorSource,
  style: function (feature) {
    return startRouteStyle[feature.get("size")];
  },
});
routeMarkerVectorLayer.setVisible(false);
const BlueLightvectorSource = new VectorSource({
  features: blueLightTower,
  wrapX: false
});

const BlueLightvector = new VectorLayer({
  source: BlueLightvectorSource,
  style: function (blueLightTower) {
  return BlueLightstyle[blueLightTower.get('size')];
  },
});

const mapView = new View({
  center: transform([-81.04934, 29.18818], "EPSG:4326", "EPSG:3857"),
  zoom: 18,
  extent: [-9024000, 3398000,  -9021000, 3401000 ],
});

const map = new Map({
  target: 'map',
  layers: [new TileLayer({source: new OSM() }), BlueLightvector, routeMarkerVectorLayer],
  view: mapView,
  controls: defaultControls().extend([new ZoomSlider()]),
});

document.getElementById('startPathfinding').style.display ='none';
document.getElementById('ToggleBlueLights').addEventListener('click', function () {
 BlueLightvector.setVisible(!BlueLightvector.getVisible());
 routeMarkerVectorLayer.setVisible(!routeMarkerVectorLayer.getVisible());
});


document.getElementById('popupClose').addEventListener('click', function () {
  document.querySelector('.ol-popup').style.display = 'none';
  document.getElementById('startPathfinding').style.display ='none';
});

document.getElementById('saveStart').addEventListener('click', function () {
  startX = posX;
  startY = posY;
  startLongLat = toLonLat([startX, startY]);
  document.getElementById('saveStart').textContent = 'Start Saved at ' + toLonLat([startX, startY]);

 getRoute = "https://api.openrouteservice.org/v2/directions/foot-walking?api_key=5b3ce3597851110001cf62483b87bc36de04409eb746fa7da358e0c2&start="+startLongLat[0]+",%20"+ startLongLat[1] +"&end="+ endlongLat[0] + ",%20" + endlongLat[1];
 //console.log(startLongLat);
 //console.log(getRoute);
 startRouteMarker.getGeometry().setCoordinates(transform([startLongLat[0], startLongLat[1]], "EPSG:4326", "EPSG:3857"));
 //routeMarkerVectorLayer.setVisible(true);
  routePointsVectorSource.clear();
});

document.getElementById('saveStop').addEventListener('click', function () {
  endX = posX;
  endY = posY;
  document.getElementById('startPathfinding').style.display ='block';
  document.getElementById('startPathfinding').textContent = 'GO!';
  endlongLat = toLonLat([endX, endY]);
  getRoute = "https://api.openrouteservice.org/v2/directions/foot-walking?api_key=5b3ce3597851110001cf62483b87bc36de04409eb746fa7da358e0c2&start="+startLongLat[0]+",%20"+ startLongLat[1] +"&end="+ endlongLat[0] + ",%20" + endlongLat[1];
  document.getElementById('saveStop').textContent = 'End Saved at ' + toLonLat([endX, endY]);
  //console.log(getRoute);
  //console.log(endlongLat);

});

document.getElementById('startPathfinding').addEventListener('click', function () {
  var request = new XMLHttpRequest();

  request.open('GET', getRoute);

  request.setRequestHeader('Accept', 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8');

  request.onreadystatechange = function () {
      if (this.readyState === 4) {
       console.log('Status:', this.status);
        document.getElementById('startPathfinding').textContent = 'Pathfinding Complete';
        routeJSON = JSON.parse(this.responseText);

        for(let i = 0; i < routeJSON.features[0].geometry.coordinates.length; i++){
         // console.log(routeJSON.features[0].geometry.coordinates[i]);
         routePoints[i] = (transform([routeJSON.features[0].geometry.coordinates[i][0], routeJSON.features[0].geometry.coordinates[i][1]], "EPSG:4326", "EPSG:3857"))  
        }

        console.log(routePoints);

        routeLine = new Feature({
         geometry: new LineString(routePoints),
        });
        
         routePointsVectorSource = new VectorSource({
          features: [routeLine],
          wrapX: false,
        });

         routePointsVectorLayer = new VectorLayer({
          source: routePointsVectorSource,
          style: new Style({
            fill: new Fill({
              color: 'Blue ',
            }),
            stroke: new Stroke({
              color: 'blue',
              width: 5,
            }),
          }),
        });

        map.addLayer(routePointsVectorLayer);


        //BlueLightvector.setVisible(false);
      }
      };
      request.send();
      document.getElementById('startPathfinding').textContent = 'Pathfinding Started';

});

map.on('click', function (evt) {

  console.log(evt.pixel);
  posX = evt.coordinate[0];
  posY = evt.coordinate[1];
  
  var feature = map.forEachFeatureAtPixel(evt.pixel,
      function (feature) {
       
        if (feature.get('size') == 10) {
         
          
          }
      });
      document.querySelector('.ol-popup').style.top = evt.pixel[1] + 'px';
      document.querySelector('.ol-popup').style.left = evt.pixel[0]  + 'px';
      document.querySelector('.ol-popup').style.display = 'block';
});

map.render();
