import * as Cesium from "cesium";
import Chart from "chart.js/auto";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";
import { facilities, landmarks, scenes, yamuna } from "./story.js";

const token = import.meta.env.VITE_CESIUM_ION_TOKEN;
if (token) Cesium.Ion.defaultAccessToken = token;

const statusEl = document.getElementById("status");
function setStatus(text) {
  if (statusEl) statusEl.textContent = text;
}

let viewer;
let chart;
let current = 0;
let facilitiesSource;
let tileset;
const placeEntities = new Map();

function placeById(id) {
  return landmarks.find((place) => place.id === id);
}

function sceneTarget(scene) {
  if (scene.placeId) return placeById(scene.placeId);
  return { lon: scene.camera.lon, lat: scene.camera.lat };
}

function geodesicMeters(a, b) {
  const start = Cesium.Cartographic.fromDegrees(a.lon, a.lat);
  const end = Cesium.Cartographic.fromDegrees(b.lon, b.lat);
  return new Cesium.EllipsoidGeodesic(start, end).surfaceDistance;
}

function pathLength(points) {
  let total = 0;
  for (let i = 1; i < points.length; i += 1) total += geodesicMeters(points[i - 1], points[i]);
  return total;
}

function km(meters) {
  return `${(meters / 1000).toFixed(1)} km`;
}

function unlockCamera() {
  if (viewer) viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
}

async function flyToScene(scene) {
  unlockCamera();
  const target = sceneTarget(scene);
  const destination = Cesium.Cartesian3.fromDegrees(target.lon, target.lat, scene.height || scene.camera?.height || 600);
  const orientation = {
    heading: Cesium.Math.toRadians(scene.camera?.heading ?? 25),
    pitch: Cesium.Math.toRadians(scene.camera?.pitch ?? -35),
    roll: 0
  };

  if (scene.method === "setView") {
    viewer.camera.setView({ destination, orientation });
    return;
  }

  if (scene.method === "boundingSphere") {
    const sphere = new Cesium.BoundingSphere(Cesium.Cartesian3.fromDegrees(target.lon, target.lat, 0), 180);
    await viewer.camera.flyToBoundingSphere(sphere, {
      duration: 3.2,
      offset: new Cesium.HeadingPitchRange(orientation.heading, orientation.pitch, scene.height || 700)
    });
    return;
  }

  if (scene.method === "lookAt") {
    viewer.camera.flyTo({
      destination,
      orientation,
      duration: 2.4,
      complete: () => {
        viewer.camera.lookAt(
          Cesium.Cartesian3.fromDegrees(target.lon, target.lat, 20),
          new Cesium.HeadingPitchRange(Cesium.Math.toRadians(35), Cesium.Math.toRadians(-28), 480)
        );
      }
    });
    return;
  }

  if (scene.method === "flyToEntity") {
    const entity = viewer.entities.getById(scene.entityId || scene.placeId);
    if (entity) {
      await viewer.flyTo(entity, { duration: 3, offset: new Cesium.HeadingPitchRange(orientation.heading, orientation.pitch, scene.height || 650) });
      return;
    }
  }

  await viewer.camera.flyTo({ destination, orientation, duration: 3.2 });
}

function updateAnalysis(scene) {
  const here = sceneTarget(scene);
  const others = landmarks
    .filter((place) => place.lon !== here.lon || place.lat !== here.lat)
    .map((place) => ({ place, meters: geodesicMeters(here, place) }))
    .sort((a, b) => a.meters - b.meters);
  const nearest = others[0];
  const circuit = pathLength(landmarks.map((place) => ({ lon: place.lon, lat: place.lat })).concat(landmarks[0]));
  const parikrama = pathLength([
    { lon: 77.47, lat: 27.51 },
    { lon: 77.49, lat: 27.5 },
    { lon: 77.47, lat: 27.485 },
    { lon: 77.45, lat: 27.49 },
    { lon: 77.47, lat: 27.51 }
  ]);
  document.getElementById("analysis").innerHTML = `
    <p><b>Camera.</b> ${scene.method}</p>
    <p><b>Nearest stop.</b> ${nearest ? `${nearest.place.name}, ${km(nearest.meters)}` : "You are on the overview."}</p>
    <p><b>Full temple circuit.</b> ${km(circuit)}</p>
    <p><b>Govardhan parikrama sample.</b> ${km(parikrama)}</p>
    <p><b>Walk radius.</b> 500 m around the active place.</p>
  `;
  const radius = viewer.entities.getById("walk-radius");
  if (radius) {
    radius.position = Cesium.Cartesian3.fromDegrees(here.lon, here.lat);
    radius.show = Boolean(scene.placeId);
  }
}

async function loadWeather(scene) {
  const here = sceneTarget(scene);
  const box = document.getElementById("weather");
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${here.lat}&longitude=${here.lon}&current=temperature_2m,weather_code,wind_speed_10m`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Weather ${response.status}`);
    const data = await response.json();
    const current = data.current;
    box.textContent = `${current.temperature_2m}°C, wind ${current.wind_speed_10m} km/h at this stop.`;
  } catch (error) {
    box.textContent = "Live weather did not load. The map still works.";
    console.warn(error);
  }
}

function showStory(index) {
  const scene = scenes[index];
  document.getElementById("sceneTitle").textContent = scene.title;
  document.getElementById("sceneDescription").textContent = scene.description;
  document.getElementById("sceneCounter").textContent = `${index + 1} / ${scenes.length}`;
  document.querySelectorAll(".scene-jump").forEach((button, i) => {
    button.classList.toggle("active", i === index);
  });
  const chartBox = document.getElementById("chartContainer");
  chartBox.style.display = scene.showChart ? "block" : "none";
  if (scene.showChart && !chart) drawChart();
  if (scene.festival) {
    const start = Cesium.JulianDate.fromIso8601("2026-08-28T18:00:00Z");
    viewer.clock.currentTime = start;
    viewer.clock.shouldAnimate = true;
    viewer.clock.multiplier = 80;
  }
}

async function goTo(index) {
  if (!viewer) return;
  current = (index + scenes.length) % scenes.length;
  const scene = scenes[current];
  showStory(current);
  updateAnalysis(scene);
  loadWeather(scene);
  try {
    await flyToScene(scene);
  } catch (error) {
    setStatus("The camera move failed. Try the next stop.");
    console.error(error);
  }
}

function drawChart() {
  const canvas = document.getElementById("footfallChart");
  chart = new Chart(canvas, {
    type: "bar",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      datasets: [{
        label: "Relative footfall",
        data: [45, 70, 78, 40, 30, 24, 28, 85, 42, 58, 74, 66],
        backgroundColor: "#6b4423"
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true } }
    }
  });
}

function addGeometry() {
  landmarks.forEach((place) => {
    const entity = viewer.entities.add({
      id: place.id,
      name: place.name,
      position: Cesium.Cartesian3.fromDegrees(place.lon, place.lat, 0),
      description: place.description,
      point: { pixelSize: 12, color: Cesium.Color.fromCssColorString("#ffd700"), outlineColor: Cesium.Color.fromCssColorString("#6b4423"), outlineWidth: 2, heightReference: Cesium.HeightReference.CLAMP_TO_GROUND },
      label: {
        text: place.name,
        font: "600 13px sans-serif",
        fillColor: Cesium.Color.WHITE,
        outlineColor: Cesium.Color.fromCssColorString("#6b4423"),
        outlineWidth: 3,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        pixelOffset: new Cesium.Cartesian2(0, -28),
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        disableDepthTestDistance: Number.POSITIVE_INFINITY
      },
      model: {
        uri: `${import.meta.env.BASE_URL}models/shikhara.gltf`,
        scale: 18,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        color: Cesium.Color.fromCssColorString("#d4a574")
      }
    });
    placeEntities.set(place.id, entity);
  });

  viewer.entities.add({
    id: "yamuna",
    name: "Yamuna at Mathura",
    polyline: {
      positions: Cesium.Cartesian3.fromDegreesArray(yamuna.flat()),
      width: 6,
      material: Cesium.Color.fromCssColorString("#3d7ea6"),
      clampToGround: true
    }
  });

  viewer.entities.add({
    name: "Janmabhoomi precinct",
    polygon: {
      hierarchy: Cesium.Cartesian3.fromDegreesArray([
        77.6684, 27.5041,
        77.6711, 27.5041,
        77.6711, 27.5054,
        77.6684, 27.5054
      ]),
      material: Cesium.Color.fromCssColorString("#ffd700").withAlpha(0.35),
      outline: true,
      outlineColor: Cesium.Color.fromCssColorString("#6b4423"),
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
    }
  });

  viewer.entities.add({
    id: "walk-radius",
    position: Cesium.Cartesian3.fromDegrees(landmarks[0].lon, landmarks[0].lat),
    ellipse: {
      semiMajorAxis: 500,
      semiMinorAxis: 500,
      material: Cesium.Color.fromCssColorString("#fe424d").withAlpha(0.18),
      outline: true,
      outlineColor: Cesium.Color.fromCssColorString("#fe424d"),
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
    }
  });

  const start = Cesium.JulianDate.fromIso8601("2026-08-28T18:00:00Z");
  const property = new Cesium.SampledPositionProperty();
  yamuna.forEach((pair, index) => {
    const time = Cesium.JulianDate.addSeconds(start, index * 400, new Cesium.JulianDate());
    property.addSample(time, Cesium.Cartesian3.fromDegrees(pair[0], pair[1], 2));
  });
  viewer.entities.add({
    id: "procession",
    name: "Festival procession",
    availability: new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({ start, stop: Cesium.JulianDate.addSeconds(start, 2400, new Cesium.JulianDate()) })]),
    position: property,
    point: { pixelSize: 16, color: Cesium.Color.fromCssColorString("#fe424d") },
    path: { leadTime: 0, trailTime: 1800, width: 3, material: Cesium.Color.fromCssColorString("#fe424d") }
  });
  viewer.clock.startTime = start.clone();
  viewer.clock.currentTime = start.clone();
  viewer.clock.stopTime = Cesium.JulianDate.addSeconds(start, 2400, new Cesium.JulianDate());
  viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
  viewer.timeline.zoomTo(viewer.clock.startTime, viewer.clock.stopTime);
}

async function addFacilities() {
  facilitiesSource = await Cesium.GeoJsonDataSource.load(facilities, { clampToGround: true });
  facilitiesSource.show = false;
  facilitiesSource.entities.values.forEach((entity) => {
    entity.billboard = undefined;
    entity.point = { pixelSize: 10, color: Cesium.Color.fromCssColorString("#2f6f4e"), heightReference: Cesium.HeightReference.CLAMP_TO_GROUND };
    entity.label = {
      text: entity.properties.name.getValue(),
      font: "12px sans-serif",
      pixelOffset: new Cesium.Cartesian2(0, -16),
      fillColor: Cesium.Color.WHITE,
      outlineWidth: 2,
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
    };
  });
  await viewer.dataSources.add(facilitiesSource);
}

async function addBuildings() {
  if (!token) {
    setStatus("Running without a Cesium ion token. Terrain stays on the ellipsoid, and 3D buildings stay off. Add VITE_CESIUM_ION_TOKEN to turn them on.");
    return;
  }
  try {
    viewer.terrainProvider = await Cesium.createWorldTerrainAsync();
    tileset = await Cesium.createOsmBuildingsAsync();
    tileset.style = new Cesium.Cesium3DTileStyle({
      color: {
        conditions: [
          ["${feature['cesium#estimatedHeight']} > 18", "color('#c4a574')"],
          ["${feature['cesium#estimatedHeight']} > 8", "color('#efe6d6')"],
          ["true", "color('white', 0.65)"]
        ]
      }
    });
    viewer.scene.primitives.add(tileset);
    setStatus("World terrain and OSM buildings are on. Taller buildings are tinted.");
  } catch (error) {
    setStatus("Ion terrain or buildings did not load. The tour still runs on imagery.");
    console.warn(error);
  }
}

async function initializeViewer() {
  try {
    const imagery = await Cesium.ArcGisMapServerImageryProvider.fromUrl(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer"
    );
    viewer = new Cesium.Viewer("cesiumContainer", {
      imageryProvider: imagery,
      animation: true,
      timeline: true,
      infoBox: true,
      geocoder: false,
      homeButton: false,
      sceneModePicker: false,
      baseLayerPicker: false,
      navigationHelpButton: false,
      shouldAnimate: true
    });
    viewer.scene.globe.enableLighting = true;
    viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    addGeometry();
    await addFacilities();
    await addBuildings();
    viewer.selectedEntityChanged.addEventListener((entity) => {
      if (!entity || !entity.id) return;
      const index = scenes.findIndex((scene) => scene.placeId === entity.id);
      if (index >= 0) goTo(index);
    });
    await goTo(0);
  } catch (error) {
    setStatus("The globe could not start. Check the network and reload.");
    console.error(error);
  }
}

function bindUi() {
  const list = document.getElementById("sceneList");
  scenes.forEach((scene, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "scene-jump";
    button.textContent = scene.title;
    button.addEventListener("click", () => goTo(index));
    list.appendChild(button);
  });
  document.getElementById("prevBtn").addEventListener("click", () => goTo(current - 1));
  document.getElementById("nextBtn").addEventListener("click", () => goTo(current + 1));
  document.getElementById("facilitiesToggle").addEventListener("change", (event) => {
    if (facilitiesSource) facilitiesSource.show = event.target.checked;
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") goTo(current + 1);
    if (event.key === "ArrowLeft") goTo(current - 1);
  });
}

bindUi();
initializeViewer();
