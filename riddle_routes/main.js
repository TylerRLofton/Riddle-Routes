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


var blueLightTowerCount = 15;
const blueLightTower = new Array(blueLightTowerCount);
var blueLightTowerPositionX = new Array(blueLightTowerCount);
var blueLightTowerPositionY = new Array(blueLightTowerCount);

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
const popup = new Overlay({
  element: document.getElementById('popup'),
});
map.addOverlay(popup);

const riddle = new Overlay({
  position: pos,
  element: document.getElementById('Embry-Riddle'),
});

map.addOverlay(riddle);

const element = popup.getElement();

map.on('click', function (evt) {
  const coordinate = evt.coordinate;
  const hdms = toStringHDMS(toLonLat(coordinate));
  popup.setPosition(coordinate);
  //blueLightTower[1].setGeometry(coordinate);
  let popover = bootstrap.Popover.getInstance(element);
  if (popover) {
    popover.dispose();
  }
  popover = new bootstrap.Popover(element, {
    animation: false,
    container: element,
    content: '<p>The location you clicked was:</p><code>' + hdms + '</code>',
    html: true,
    placement: 'top',
  });
  popover.show();
});
map.render();
