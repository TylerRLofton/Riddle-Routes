import Feature from "ol/Feature";
import Map from "ol/Map";
import Overlay from "ol/Overlay";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import View from "ol/View";
import {
  Circle as CircleStyle,
  Fill,
  RegularShape,
  Stroke,
  Style,
  Text,
} from "ol/style";
import { LineString, Point } from "ol/geom";
import { getVectorContext } from "ol/render";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { transform } from "ol/proj";
import ZoomSlider from "ol/control/ZoomSlider";
import { defaults as defaultControls } from "ol/control";
import { fromLonLat, toLonLat } from "ol/proj";
import { toStringHDMS } from "ol/coordinate";
import Select from "ol/interaction/Select";
import Openrouteservice from "openrouteservice-js";
import GeoJSON from "ol/format/GeoJSON";

let orsDirections = new Openrouteservice.Directions({
  api_key: "5b3ce3597851110001cf62483b87bc36de04409eb746fa7da358e0c2",
});

const pos = fromLonLat([-81.04722, 29.19024]);
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
var endRouteMarker;
var routeJSON;
var routePoints = new Array();
var routeLine;
var getRoute =
  "https://api.openrouteservice.org/v2/directions/foot-walking?api_key=5b3ce3597851110001cf62483b87bc36de04409eb746fa7da358e0c2&start=-81.047220,%2029.19024&end=-81.04934,%2029.18818";
var startLongLat = [-81.04722, 29.19024];
var endlongLat = [-81.04934, 29.18818];
var routePointsVectorLayer;
var routePointsVectorSource;
var setRouteClicked;
var pathfindingStarted = false;
var distance;
var displayXY = new Array(2);
var florrPlanPath;
var currentFloor = 1;
var evChargingStationLocations = [[-81.049812, 29.186605],[-81.045533, 29.188660],[-81.045552, 29.188636],[-81.048935, 29.190061],[-81.048966, 29.190037],[-81.052744, 29.191744],[-81.047117, 29.193713]];
var evChargingStations = new Array(evChargingStationLocations.length);
var HandicapParkingSpotsLocations = new Array();
HandicapParkingSpotsLocations = [ [ -81.05216667,	29.19102778],[-81.05623333,	29.19569167],[-81.05406667,	29.19426944],[-81.05366944,	29.19201111],[-81.05291944,	29.18858611],[-81.05259722,	29.18919167],[-81.05221389,	29.18919167],[-81.05214722,	29.18919167],[-81.05258611,	29.18995556],[-81.05085556,	29.18916389],[-81.05293333,	29.19090278],[-81.052775,	29.19112222],[-81.05247222,	29.19116111],[-81.05221389,	29.19101389],[-81.05172222,	29.191],[-81.05117222,	29.19086944],[-81.05095556,	29.19073333],[-81.05068889,	29.18875556],[-81.051275,	29.18839722],[-81.05124167,	29.18737778],[-81.05106944,	29.187125],[-81.05087778,	29.18715],[-81.05038889,	29.18671389],[-81.04978889,	29.18625556],[-81.04736389,	29.18784722],[-81.04756944,	29.18806389],[-81.04734722,	29.18853889],[-81.04727778,	29.18861111],[-81.04734444,	29.18879722],[-81.04622222,	29.18809722],[-81.04582222,	29.18833611],[-81.04547778,	29.188775],[-81.04621667,	29.18905278],[-81.04858611,	29.19026111],[-81.04960556,	29.19042778],[-81.05081111,	29.19165],[-81.05276944,	29.19180278],[-81.04300833,	29.184],[-81.04511667,	29.19105],[-81.04540556,	29.19113056],[-81.045025,	29.19332778],[-81.04726944,	29.19376944],[-81.04732222,	29.19344722],[-81.04792222,	29.19350556],[-81.04733889,	29.19133611],[-81.04924444,	29.192225],[-81.04935833,	29.192475],[-81.05083333,	29.19321667],[-81.05127778,	29.1934],[-81.05104722,	29.1939],[-81.05115833,	29.19418611],];
var HandicapParkingSpots = new Array(HandicapParkingSpotsLocations.length);
var BikeRackLocations = new Array();
BikeRackLocations = [[-81.05301389,	29.19035556],[-81.05301389,	29.19047778],[-81.05300833,	29.19064444],[-81.05298056,	29.19073889],[-81.05288611,	29.19085],[-81.05280833,	29.19093889],[-81.05258611,	29.19116389],[-81.05096944,	29.19045],[-81.05114167,	29.19045556],[-81.05168889,	29.19015833],[-81.05142222,	29.19062778],[-81.05045833,	29.19004722],[-81.04895556,	29.188375],[-81.04959167,	29.18822778],[-81.04963333,	29.18797222],[-81.05114444,	29.18710278],[-81.05091667,	29.18630833],[-81.05129167,	29.18719167],[-81.05096667,	29.18680278],[-81.05075278,	29.18663611],[-81.04448889,	29.189875]];
var BikeRacks = new Array(BikeRackLocations.length);
var buildingNumber = 0;
document.getElementById("floorPlans").style.display = "none";
document.getElementById("saveStart").style.display = "none";
document.getElementById("saveStop").style.display = "none";
document.getElementById("image").style.display = "none";
document.getElementById("upFloor").style.display = "none";  
document.getElementById("downFloor").style.display = "none";  



blueLightTowerPositionX = [ 29.188023, 29.189273, 29.187171, 29.189105, 29.187809, 29.195856, 29.188898, 29.194542, 29.193504, 29.193037, 29.186448, 29.191851, 29.192116, 29.193837, 29.193429, 29.192857, 29.192114, 29.192647, 29.194058, 29.192204, 29.189695, 29.188954, 29.191735]
blueLightTowerPositionY = [ -81.048705,-81.049556,-81.051308,-81.051467,-81.047514,-81.055217,-81.046075,-81.053793,-81.053045,-81.054257,-81.049739,-81.052743,-81.053628,-81.051109,-81.049903,-81.049600,-81.048675,-81.047916,-81.046517,-81.044828,-81.044228,-81.046141,-81.052686]




for (let i = 0; i < blueLightTowerCount; ++i) {
  blueLightTower[i] = new Feature({
    geometry: new Point(
      transform(
        [blueLightTowerPositionY[i], blueLightTowerPositionX[i]],
        "EPSG:4326",
        "EPSG:3857"
      )
    ),
    size: 10,
    type: "blueLightTower",
  });
}

for( let i = 0; i < BikeRacks.length; ++i){
  BikeRacks[i] = new Feature({
    geometry: new Point(
      transform(
        BikeRackLocations[i],
        "EPSG:4326",
        "EPSG:3857"
      )
    ),
    size: 30,
    type: "BikeRacks",
  });
}
for( let i = 0; i < evChargingStations.length; ++i){
  evChargingStations[i] = new Feature({
    geometry: new Point(
      transform(
        evChargingStationLocations[i],
        "EPSG:4326",
        "EPSG:3857"
      )
    ),
    size: 40,
    type: "evChargingStations",
  });
}
for(let i = 0; i < HandicapParkingSpotsLocations.length; i++){
  HandicapParkingSpots[i] = new Feature({
    geometry: new Point(
      transform(
        HandicapParkingSpotsLocations[i],
        "EPSG:4326",
        "EPSG:3857"
      )
    ),
    size: 20,
    type: "HandicapParkingSpots",
  });
}
const evChargingStationsVectorSource = new VectorSource({
  features: evChargingStations,
  wrapx: false,
});

const evChargingStationsVector = new VectorLayer({
  source: evChargingStationsVectorSource,
  style: new Style({
    image: new CircleStyle({
      radius: 5,
      fill: new Fill({
        color: "Gold",
      }),
    }),
    text: new Text({
      text: "EV Charging Station",
      fill: new Fill({
        color: "Black",
      }),
      offsetY: -10,
      padding: [2, 2, 2, 2],
    }),
      stroke: new Stroke({
        color: "rgba(0, 0, 255, 1)",
        width: 1,
      }),
  }),
});

const bikeRackVectorSource = new VectorSource({
  features: BikeRacks,
  wrapx: false,
});

const bikeRackVectorLayer = new VectorLayer({
  source: bikeRackVectorSource,
  style: new Style({
    image: new CircleStyle({
      radius: 5,
      fill: new Fill({
        color: "grey",
      }),
    }),
    text: new Text({
      text: "Bike Rack",
      fill: new Fill({
        color: "grey",
      }),
      offsetY: -10,
      padding: [2, 2, 2, 2],
    }),
      stroke: new Stroke({
        color: "rgba(0, 0, 255, 1)",
        width: 1,
      }),
  }),
});

const handicapParkingSource = new VectorSource({
  features: HandicapParkingSpots,
  wrapX: false,
});

const HandicapParkingLayer = new VectorLayer({
  source: handicapParkingSource,
  style: new Style({
    image: new CircleStyle({
      radius: 5,
      fill: new Fill({color: 'green',}),
    }),
    text: new Text({
        font: "12px sans-serif",
        text: "Hanicapped Parking",
        fill: new Fill({
          color: "green",
        }),
        offsetY: -10,
        padding: [2, 2, 2, 2],
      }),
      stroke: new Stroke({
        color: 'Green',
        width: 1,
      }),
    }),
  });

const BlueLightstyle = {
  10: new Style({
    image: new RegularShape({
      points: 5,
      radius: 5,
      radius2: 7,
      angle: 0,
      fill: new Fill({ color: "blue" }),
      stroke: new Stroke({ color: "white", width: 1 }),
    }),
    text: new Text({
      font: "12px sans-serif",
      text: "Blue Light Tower",
      fill: new Fill({
        color: "blue",
      }),
      offsetY: -10,
      padding: [2, 2, 2, 2],
    }),
  }),
};

const startRouteStyle = {
  11: new Style({
    image: new RegularShape({
      points: 4,
      radius: 9,
      radius2: 15,
      angle: 0,
      fill: new Fill({ color: "green" }),
      stroke: new Stroke({ color: "white", width: 1 }),
    }),
    text: new Text({
      font: "20px sans-serif",
      text: "Route start",
      fill: new Fill({
        color: "Black",
      }),
      offsetY: 15,
      padding: [2, 2, 2, 2],
    }),
  }),
};
startRouteMarker = new Feature({
  geometry: new Point(
    transform([-81.04822, 29.19024], "EPSG:4326", "EPSG:3857")
  ),
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


const endRouteStyle = {
  3: new Style({
    image: new RegularShape({
      points: 4,
      radius: 9,
      radius2: 15,
      angle: 0,
      fill: new Fill({ color: "red" }),
      stroke: new Stroke({ color: "white", width: 1 }),
    }),
    text: new Text({
      font: "20px sans-serif",
      text: "Route end",
      fill: new Fill({
        color: "Black",
      }),
      offsetY: 15,
      padding: [2, 2, 2, 2],
    }),
  }),
};
endRouteMarker = new Feature({
  geometry: new Point(
    transform([-81.04722, 29.19024], "EPSG:4326", "EPSG:3857")
  ),
  size: 3,
});
const endRouteMarkerVecorSource = new VectorSource({
  features: [endRouteMarker],
  wrapX: false,
});
const endRouteMarkerVectorLayer = new VectorLayer({
  source: endRouteMarkerVecorSource,
  style: function (feature) {
    return endRouteStyle[feature.get("size")];
  },
});
endRouteMarkerVectorLayer.setVisible(false);

const BlueLightvectorSource = new VectorSource({
  features: blueLightTower,
  wrapX: false,
});

const BlueLightvector = new VectorLayer({
  source: BlueLightvectorSource,
  style: function (blueLightTower) {
    return BlueLightstyle[blueLightTower.get("size")];
  },
});

const buildingsSource = new VectorSource({
  url: 'buildings.geojson',
  format: new GeoJSON(),
});

const buildingsLayer = new VectorLayer({
  source: buildingsSource,
  style: new Style({
    fill: new Fill({
      color: 'rgba(255, 255, 255, 0.1)',
    }),
    stroke: new Stroke({
      color: '#319FD3',
      width: 0,
    }),
  }),
});

const mapView = new View({
  center: transform([-81.04934, 29.18818], "EPSG:4326", "EPSG:3857"),
  zoom: 18,
  extent: [-9024000, 3398000, -9021000, 3401000],
});

const map = new Map({
  target: "map",
  layers: [
    new TileLayer({ source: new OSM() }),
    BlueLightvector,
    routeMarkerVectorLayer,
    endRouteMarkerVectorLayer,
    buildingsLayer,
    HandicapParkingLayer,
    bikeRackVectorLayer,
    evChargingStationsVector,
  ],
  view: mapView,
});

document.getElementById("startPathfinding").style.display = "none";

document.getElementById("ToggleBlueLights").addEventListener("click", function () {
  BlueLightvector.setVisible(!BlueLightvector.getVisible());
  });

document.getElementById("saveStart").addEventListener("click", function () {
  setRouteClicked = true;
  document.getElementById("saveStart").textContent =
    "Click on map to set start point";
 // document.getElementById("mySidenav").style.width = "0px";
});

function setStartRoute() {
  startX = posX;
  startY = posY;
  startLongLat = toLonLat([startX, startY]);
  document.getElementById("saveStart").textContent = "Start point saved at " + startLongLat;
  getRoute =
    "https://api.openrouteservice.org/v2/directions/foot-walking?api_key=5b3ce3597851110001cf62483b87bc36de04409eb746fa7da358e0c2&start=" +
    startLongLat[0] +
    ",%20" +
    startLongLat[1] +
    "&end=" +
    endlongLat[0] +
    ",%20" +
    endlongLat[1];

  //console.log(startLongLat);
  //console.log(getRoute);
  startRouteMarker.getGeometry().setCoordinates(
      transform([startLongLat[0], startLongLat[1]], "EPSG:4326", "EPSG:3857"));
  routeMarkerVectorLayer.setVisible(true);
  document.getElementById("startPathfinding").style.display = "block";
  document.getElementById("startPathfinding").textContent = "Start Pathfinding";
  //create if satement to clear pathfinding when clicked again
  if (pathfindingStarted == true) {
    routeVectorSource.clear();
    pathfindingStarted = false;
  }
}



function setEndRoute() {
  endX = posX;
  endY = posY;
  endlongLat = toLonLat([endX, endY]);
  getRoute =
    "https://api.openrouteservice.org/v2/directions/foot-walking?api_key=5b3ce3597851110001cf62483b87bc36de04409eb746fa7da358e0c2&start=" +
    startLongLat[0] +
    ",%20" +
    startLongLat[1] +
    "&end=" +
    endlongLat[0] +
    ",%20" +
    endlongLat[1];
  endRouteMarker.getGeometry().setCoordinates(transform([endlongLat[0], endlongLat[1]], "EPSG:4326", "EPSG:3857") );
  //console.log(getRoute);
  console.log(endlongLat);

  endRouteMarkerVectorLayer.setVisible(true);
  if (pathfindingStarted == true) {
    routePointsVectorSource.clear();
    pathfindingStarted = false;
  }
}

document.getElementById("startPathfinding").addEventListener("click", function () {
    pathfindingStarted = true;

    document.getElementById("startPathfinding").textContent =
      "Pathfinding working";

    var request = new XMLHttpRequest();

    request.open("GET", getRoute);

    request.setRequestHeader(
      "Accept",
      "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8"
    );

    request.onreadystatechange = function () {
      if (this.readyState === 4) {
        console.log("Status:", this.status);
        document.getElementById("startPathfinding").textContent =
          "Pathfinding Complete";
        routeJSON = JSON.parse(this.responseText);

       // console.log(routeJSON);
        for (let i = 0; i < routeJSON.features[0].geometry.coordinates.length;i++
        ) {
          //console.log(routeJSON.features[0].geometry.coordinates[i]);
          routePoints[i] = transform(
            [
              routeJSON.features[0].geometry.coordinates[i][0],
              routeJSON.features[0].geometry.coordinates[i][1],
            ],
            "EPSG:4326",
            "EPSG:3857"
          );
          distance = 3.281 * routeJSON.features[0].properties.summary.distance;
          console.log(distance);
        }

        console.log(routePoints);

        routeLine = new Feature({
          geometry: new LineString(routePoints),
        });
        //routePointsVectorSource.clear();
        routePointsVectorSource = new VectorSource({
          features: [routeLine],
          wrapX: false,
        });

        routePointsVectorLayer = new VectorLayer({
          source: routePointsVectorSource,
          style: new Style({
            fill: new Fill({
              color: "blue ",
            }),
            stroke: new Stroke({
              color: "blue",
              width: 7,
            }),
          }),
        });

        map.addLayer(routePointsVectorLayer);

        //BlueLightvector.setVisible(false);
      }
    };
    request.send();
  });

map.on("click", function (evt) {

  //buldingoutline = toString(evt.coordinate);
  console.log((evt.coordinate));
  posX = evt.coordinate[0];
  posY = evt.coordinate[1];
  displayXY =  toLonLat(evt.coordinate)


  displayXY[0] = displayXY[0].toFixed(5);
  displayXY[1] = displayXY[1].toFixed(5);

  document.getElementById("aboutBtn").style.display = "block";
  document.getElementById("aboutBtn").textContent = "You clicked at \n  " + displayXY;
  document.getElementById("clientsBtn").style.display = "block";
  document.getElementById("servicesBtn").style.display = "block";
  document.getElementById("directionsBtn").style.display = "block";
  document.getElementById("directionsBtn").text = "Directions to clicked point";
  document.getElementById("image").style.display = "none";
  document.getElementById("saveStart").style.display = "none";
  document.getElementById("saveStop").style.display = "none";
  document.getElementById("floorPlans").style.display = "none";
  document.getElementById("upFloor").style.display = "none";  
  document.getElementById("downFloor").style.display = "none";

  if (setRouteClicked == true) {
    setStartRoute();
    setRouteClicked = false;
  }
  var feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
    console.log(feature.get('name'));
    
    if (feature.get("size") == 10) {
      document.getElementById("aboutBtn").textContent = "Blue Light Tower";
      document.getElementById("clientsBtn").style.display = "none";
      document.getElementById("servicesBtn").style.display = "block";
      document.getElementById("servicesBtn").textContent = "Location: " + displayXY;
      document.getElementById("image").src = "./blueLightTower.jpg";
      document.getElementById("image").style.display = "block";
      document.getElementById("directionsBtn").text = "Directions to Blue Light Tower";
    }
    if (feature.get("size") == 20) {
      document.getElementById("aboutBtn").textContent = "Handicapped Parking";
      document.getElementById("clientsBtn").style.display = "none";
      document.getElementById("servicesBtn").style.display = "Block";
      document.getElementById("servicesBtn").textContent = "Location: " + displayXY;
      document.getElementById("image").src = "./HandicapParking.png";
      document.getElementById("directionsBtn").text = "Directions to Handicapped Parking Spot";
      document.getElementById("image").style.display = "block";
    }
    if (feature.get("size") == 30) {
      document.getElementById("aboutBtn").textContent = "Bike Rack";
      document.getElementById("clientsBtn").style.display = "none";
        document.getElementById("servicesBtn").style.display = "block";
      document.getElementById("servicesBtn").textContent = " View Floor Plan";
      document.getElementById("image").src = "./BikeRack.jpg";
      document.getElementById("image").style.display = "block";
      document.getElementById("directionsBtn").text = "Directions to Bike Rack";
    }
    if (feature.get("size") == 40) {
      document.getElementById("aboutBtn").textContent = "Ev Charging Station";
      document.getElementById("clientsBtn").style.display = "none";
      document.getElementById("servicesBtn").style.display = "Block";
      document.getElementById("servicesBtn").textContent = "Location: " + displayXY;
      document.getElementById("image").src = "./chargingStation.jpg";
      document.getElementById("directionsBtn").text = "Directions to Charging Station";
      document.getElementById("image").style.display = "block";
    }
    if (feature.get('building') == 419) {
      document.getElementById("aboutBtn").textContent = feature.get('name');
      document.getElementById("clientsBtn").style.display = "none";
      document.getElementById("servicesBtn").style.display = "block";
      buildingNumber = feature.get('building');
      document.getElementById("servicesBtn").textContent = " View Floor Plan";
      document.getElementById("image").src = './project-EmbryRiddleCollegeofArtsSciences01-1.jpg';
      document.getElementById("directionsBtn").text = "Directions to " + feature.get('name');
      document.getElementById("image").style.display = "block";
    }
    if (feature.get('building') == 610) {
      document.getElementById("aboutBtn").textContent =  feature.get('name');
      document.getElementById("clientsBtn").style.display = "none";
      document.getElementById("servicesBtn").style.display = "block";
      buildingNumber = feature.get('building');
      document.getElementById("servicesBtn").textContent = " View Floor Plan";
      document.getElementById("image").src = './StudentUnionImage.jpg';
      document.getElementById("image").style.display = "block";
      document.getElementById("directionsBtn").text = "Directions to " + feature.get('name');
    }
    if (feature.get('building') == 618) {
      document.getElementById("aboutBtn").textContent =  feature.get('name');
      document.getElementById("clientsBtn").style.display = "none";
      document.getElementById("servicesBtn").style.display = "block";
      buildingNumber = feature.get('building');
      document.getElementById("servicesBtn").textContent = " View Floor Plan";
      document.getElementById("image").src = './LehmanBuilding.jpg';
      document.getElementById("image").style.display = "block";
      document.getElementById("directionsBtn").text = "Directions to " + feature.get('name');
    }
    if (feature.get('building') == 602) {
      document.getElementById("aboutBtn").textContent =  feature.get('name');
      document.getElementById("clientsBtn").style.display = "none";
      document.getElementById("servicesBtn").style.display = "block";
      buildingNumber = feature.get('building');
      document.getElementById("servicesBtn").textContent = " View Floor Plan";
      document.getElementById("image").src = './Jim W Handerson Adminstration & Welcome Center.jpg';
      document.getElementById("image").style.display = "block";
      document.getElementById("directionsBtn").text = "Directions to " + feature.get('name');
    } 
    if (feature.get('building') == 261) {
      document.getElementById("aboutBtn").textContent = feature.get('name');
      document.getElementById("clientsBtn").style.display = "none";
      document.getElementById("servicesBtn").style.display = "block";
      buildingNumber = feature.get('building');
      document.getElementById("servicesBtn").textContent = " View Floor Plan";
      document.getElementById("image").src = './eagle-fitness-center.jpg';
      document.getElementById("image").style.display = "block";
      document.getElementById("directionsBtn").text = "Directions to " + feature.get('name');
    }
    if (feature.get('building') == 331) {
      document.getElementById("aboutBtn").textContent = feature.get('name');
      document.getElementById("clientsBtn").style.display = "none";
      document.getElementById("servicesBtn").style.display = "block";
      buildingNumber = feature.get('building');
      document.getElementById("servicesBtn").textContent = " View Floor Plan";
      document.getElementById("image").src = './WillieMillerInstructionalCenter.jpg';
      document.getElementById("image").style.display = "block";
      document.getElementById("directionsBtn").text = "Directions to " + feature.get('name');
    }

  });

  document.getElementById("mySidenav").style.width = "650px";
});

document.getElementById('servicesBtn').addEventListener('click', function(){
  if (buildingNumber == 419) {
    florrPlanPath =  '/Floor Plans/College of Arts and Science/01.png';
    document.getElementById("upFloor").style.display = "block";  
    document.getElementById("downFloor").style.display = "block";  
    document.getElementById("floorPlans").src = florrPlanPath;
    document.getElementById("floorPlans").style.display = "block";
    document.getElementById("floorPlans").style.zIndex = 1;
  }
  if (buildingNumber == 610) {
    document.getElementById("upFloor").style.display = "block";  
    document.getElementById("downFloor").style.display = "block";  
    document.getElementById("floorPlans").src = florrPlanPath;
    document.getElementById("floorPlans").style.display = "block";
    document.getElementById("floorPlans").style.zIndex = 1;
  }
  if (buildingNumber == 618) {
    document.getElementById("upFloor").style.display = "block";  
    document.getElementById("downFloor").style.display = "block";  
    document.getElementById("floorPlans").src = florrPlanPath;
    document.getElementById("floorPlans").style.display = "block";
    document.getElementById("floorPlans").style.zIndex = 1;
  }
  if (buildingNumber == 602) {
    document.getElementById("upFloor").style.display = "block";  
    document.getElementById("downFloor").style.display = "block";  
    document.getElementById("floorPlans").src = florrPlanPath;
    document.getElementById("floorPlans").style.display = "block";
    document.getElementById("floorPlans").style.zIndex = 1;
  }
  if (buildingNumber == 261) {
    florrPlanPath = '/Floor Plans/Fitness Center/01.png';
    document.getElementById("upFloor").style.display = "block";  
    document.getElementById("downFloor").style.display = "block";  
    document.getElementById("floorPlans").src = florrPlanPath;
    document.getElementById("floorPlans").style.display = "block";
    document.getElementById("floorPlans").style.zIndex = 1;
  }
  if (buildingNumber == 331) {
    document.getElementById("upFloor").style.display = "block";  
    document.getElementById("downFloor").style.display = "block";  
    document.getElementById("floorPlans").src = florrPlanPath;
    document.getElementById("floorPlans").style.display = "block";
    document.getElementById("floorPlans").style.zIndex = 1;
  }
});

document.getElementById('upFloor').addEventListener('click', function(){
  if (buildingNumber == 419) {
    if(currentFloor < 5){
      currentFloor++;
     florrPlanPath =  '/Floor Plans/College of Arts and Science/0'+ currentFloor+'.png';
    };
    document.getElementById("floorPlans").src = florrPlanPath;
  }
  if (buildingNumber == 610) {
  }
  if (buildingNumber == 618) {
  }
  if (buildingNumber == 602) {
  }
  if (buildingNumber == 261) {
    if(currentFloor < 2){
      currentFloor++;
      florrPlanPath =  '/Floor Plans/Fitness Center/0'+ currentFloor+'.png';
     };
     document.getElementById("floorPlans").src = florrPlanPath;
  }
  if (buildingNumber == 331) {
  }
});

document.getElementById('downFloor').addEventListener('click', function(){
  if (buildingNumber == 419) {
    if(currentFloor > 1){
      currentFloor --;
     florrPlanPath =  '/Floor Plans/College of Arts and Science/0'+ currentFloor+'.png';
    };
    document.getElementById("floorPlans").src = florrPlanPath;
  }
  if (buildingNumber == 610) {
  }
  if (buildingNumber == 618) {
  }
  if (buildingNumber == 602) {
  }
  if (buildingNumber == 261) {
    if(currentFloor > 1){
      currentFloor --;
      florrPlanPath =  '/Floor Plans/Fitness Center/0'+currentFloor+'.png';
     };
     document.getElementById("floorPlans").src = florrPlanPath;
  }
  if (buildingNumber == 331) {
  }
});

document.getElementById("hamburger").addEventListener("click", function () {
  document.getElementById("hamburger").style.display = "none";
    document.getElementById("aboutBtn").style.display = "block";
    document.getElementById("aboutBtn").textContent = "About";
    document.getElementById("clientsBtn").style.display = "block";
    document.getElementById("servicesBtn").style.display = "block";
    document.getElementById("directionsBtn").style.display = "block";
    document.getElementById("image").style.display = "none";
  document.getElementById("mySidenav").style.width = "550px";
});

document.getElementById("closeNav").addEventListener("click", function () {
  document.getElementById("mySidenav").style.width = "0";
  document.getElementById("hamburger").style.display = "block";
  document.getElementById("floorPlans").style.display = "none";
  document.getElementById("upFloor").style.display = "none";  
  document.getElementById("downFloor").style.display = "none";  
  console.log(pathfindingStarted);

  if(pathfindingStarted == false){
   endRouteMarkerVectorLayer.setVisible(false);
   routeMarkerVectorLayer.setVisible(false);
   document.getElementById("startPathfinding")
  }
  if(pathfindingStarted == true){
    routePointsVectorSource.clear();
    endRouteMarkerVectorLayer.setVisible(false);
    routeMarkerVectorLayer.setVisible(false);
   }


});

document.getElementById("directionsBtn").addEventListener("click", function () {
  document.getElementById("aboutBtn").style.display = "none";
  document.getElementById("clientsBtn").style.display = "none";
  document.getElementById("servicesBtn").style.display = "block";
  document.getElementById("servicesBtn").textContent = " View Floor Plan";
  document.getElementById("directionsBtn").style.display = "none";
  document.getElementById("saveStart").style.display = "block";
  document.getElementById("saveStop").style.display = "block";
  document.getElementById("saveStop").textContent ="End saved at " + endlongLat[0] + ", " + endlongLat[1];
  setEndRoute();
});

map.render();
