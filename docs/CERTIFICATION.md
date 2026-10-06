# CesiumJS certification notes

This is the write-up to attach when applying to become a Cesium Certified Developer. It is not a certificate. Cesium reviews the running app and this explanation.

## Narrative

Pilgrims and first-time visitors treat Mathura and Vrindavan as one circuit, but the places are spread across two towns and a hill 20 km away. A flat list of temple names does not show that distance, the river, or the order of a day.

The app is a guided 3D circuit. Twelve stops tell the story. The globe shows the Yamuna, a precinct polygon at Janmabhoomi, a 500 m walk radius, a sample Govardhan parikrama, and a festival procession that moves with the clock. Open-Meteo supplies the weather at the stop you are looking at.

Cesium fits because the task is geographic: camera moves have to land on real coordinates, distances have to be geodesic, and buildings or terrain should sit under the story when an ion token is available.

## What the app demonstrates

Cesium's JS/ion notes ask for modern JavaScript, handled errors, and at least three of the advanced items below.

| Ask | Where it shows up |
| --- | --- |
| Terrain or imagery | ArcGIS World Imagery always. World Terrain when `VITE_CESIUM_ION_TOKEN` is set. |
| 3D model | `public/models/shikhara.gltf` on every landmark. |
| Three entity types | Point and label, polyline (Yamuna), polygon (precinct), ellipse (walk radius), model, and a time-sampled path. |
| Different camera methods | `flyTo`, `flyToBoundingSphere`, `viewer.flyTo`, `lookAt`, and `setView`. The panel names the method for the current stop. |
| Metadata styling | OSM Buildings are tinted from `cesium#estimatedHeight` when ion is available. |
| Time-dynamic data | A procession uses `SampledPositionProperty` on 28 August 2026, looped on the timeline. |
| API integration | Open-Meteo current weather for the active coordinate. |
| Geospatial analysis | `EllipsoidGeodesic` distances: nearest stop, full circuit, and a Govardhan parikrama sample. |
| Errors | Missing ion token, failed tiles, failed weather, and a failed camera move each leave a message instead of a blank page. |

## Architecture

```text
index.html          layout: globe, stop list, story, analysis
src/story.js        coordinates, copy, Yamuna line, facilities
src/main.js         Viewer, entities, tiles, camera, weather, chart
public/models       glTF spire
```

The Express-style data stays in the client. There is no database. Facilities are a GeoJSON layer you can toggle. New stops belong in `src/story.js`.

## How to run it for review

```bash
npm install
npm run dev
```

Optional, for terrain and OSM buildings:

```bash
# .env
VITE_CESIUM_ION_TOKEN=your_token
```

Without that token the imagery, entities, clock, weather, and measurements still run.

## Next steps

- Replace the sample parikrama with a surveyed path.
- Swap the simple spire for a photographed model of one temple.
- Add a Cesium ion 3D Tileset of a site survey if one is captured later.
