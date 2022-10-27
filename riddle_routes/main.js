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


var blueLightTowerCount = 15;
var blueLightTower = new Array(blueLightTowerCount);
var blueLightTowerPositionX = new Array(blueLightTowerCount);
var blueLightTowerPositionY = new Array(blueLightTowerCount);
var startX;
var startY;
var endX;
var endY;


for(let i = 0; i <= blueLightTowerCount; i++){
    blueLightTowerPositionX[i] = 29.18818 + Math.random() * 0.0001 * i;
    blueLightTowerPositionY[i] = -81.04965 - Math.random() * 0.0001 * i;
}

for (let i = 0; i < blueLightTowerCount; ++i) {
  blueLightTower[i] = new Feature({
    geometry: new Point(transform([blueLightTowerPositionY[i], blueLightTowerPositionX[i]], "EPSG:4326", "EPSG:3857")),
   size: 10,
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
  layers: [new TileLayer({source: new OSM() }), BlueLightvector],
  view: mapView,
  controls: defaultControls().extend([new ZoomSlider()]),
});

document.getElementById('ToggleBlueLights').addEventListener('click', function () {
 BlueLightvector.setVisible(!BlueLightvector.getVisible());
});
const pos = fromLonLat([-81.047220, 29.19024]);
var posX
var posY

document.addEventListener('click', function (evt) {
   posX = evt.clientX;
   posY = evt.clientY;
//  console.log(posX, posY);
});

document.getElementById('popupClose').addEventListener('click', function () {
  document.querySelector('.ol-popup').style.display = 'none';
});


map.on('click', function (evt) {
  var feature = map.forEachFeatureAtPixel(evt.pixel,
      function (feature) {
        document.querySelector('.ol-popup').style.top = posY + 'px';
        if (feature.get('size') == 10) {
          document.querySelector('.ol-popup').style.left = evt.clientX + 'px';
          document.querySelector('.ol-popup').style.display = 'block';
          }
      });
      document.getElementById('saveStart').addEventListener('click', function () {
        startX = evt.coordinate[0];
        startY = evt.coordinate[1];
        console.log(startX, startY);
      });
      document.getElementById('saveStop').addEventListener('click', function () {
        endX = evt.coordinate[0];
        endtY = evt.coordinate[1];
        console.log(endX, endY);
      });
});



map.render();
