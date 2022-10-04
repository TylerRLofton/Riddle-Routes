import Feature from "ol/Feature";
import Map from "ol/Map";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import View from "ol/View";
import { Circle as CircleStyle, Fill, RegularShape, Stroke, Style } from "ol/style";
import { LineString, Point } from "ol/geom";
import { getVectorContext } from "ol/render";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { transform } from "ol/proj";
import ZoomSlider from 'ol/control/ZoomSlider';
import {defaults as defaultControls} from 'ol/control'

const blueLightTowerCount = 1;
const blueLightTower = new Array(blueLightTowerCount);

for (let i = 0; i < blueLightTowerCount; ++i) {
  blueLightTower[i] = new Feature({
    geometry: new Point(transform([-81.04935, 29.18818], "EPSG:4326", "EPSG:3857")),
    labelPoint: new Point(transform([-81.04965, 29.18818], "EPSG:4326", "EPSG:3857")),
    size: 15,
    name: 'My_point',
  });
};

const BlueLightstyle = {"15": new Style({
    image: new RegularShape({
      points: 5,
      radius: 7,
      radius2: 3,
      angle: 0,
      fill: new Fill({ color: 'blue' }),
      stroke: new Stroke({ color: 'black', width: 1 })
    })
  }),
};

const BlueLightvectorSource = new VectorSource({
  features: blueLightTower,
  wrapX: false
});

const BlueLightvector = new VectorLayer({
  source: BlueLightvectorSource,
  style: function (blueLightTower) {
    return BlueLightstyle[blueLightTower.get("size")];
  }
});

const mapView = new View({
  center: transform([-81.04934, 29.18818], "EPSG:4326", "EPSG:3857"),
  zoom: 10,
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

map.render();
