export const landmarks = [
  { id: "janmabhoomi", name: "Krishna Janmabhoomi Temple", category: "Temple", lon: 77.66973, lat: 27.504727, description: "Birthplace of Lord Krishna." },
  { id: "vishram", name: "Vishram Ghat", category: "Ghat", lon: 77.686689, lat: 27.504471, description: "Sacred ghats of the Yamuna, where Krishna is said to have rested." },
  { id: "dwarkadhish", name: "Dwarkadhish Temple", category: "Temple", lon: 77.682433, lat: 27.506264, description: "Krishna as the king of Dwarka, in the old city of Mathura." },
  { id: "banke", name: "Banke Bihari Temple", category: "Temple", lon: 77.70245, lat: 27.583908, description: "Krishna in the tribhanga pose, in the lanes of Vrindavan." },
  { id: "iskcon", name: "ISKCON Temple", category: "Temple", lon: 77.677927, lat: 27.572049, description: "A modern temple and garden on the edge of Vrindavan." },
  { id: "prem", name: "Prem Mandir", category: "Temple", lon: 77.67196, lat: 27.572091, description: "White marble temple completed in 2012." },
  { id: "nidhivan", name: "Nidhivan", category: "Forest", lon: 77.675043, lat: 27.565089, description: "The grove associated with the nightly rasleela." },
  { id: "govardhan", name: "Govardhan Hill", category: "Hill", lon: 77.4622, lat: 27.4984, description: "The hill Krishna is said to have lifted. The parikrama path circles it." }
];

export const facilities = {
  type: "FeatureCollection",
  features: [
    { type: "Feature", geometry: { type: "Point", coordinates: [77.6712, 27.5054] }, properties: { name: "Janmabhoomi guest houses", kind: "Stay" } },
    { type: "Feature", geometry: { type: "Point", coordinates: [77.7031, 27.5826] }, properties: { name: "Banke Bihari lane food stalls", kind: "Food" } },
    { type: "Feature", geometry: { type: "Point", coordinates: [77.6734, 27.5712] }, properties: { name: "Prem Mandir parking", kind: "Parking" } },
    { type: "Feature", geometry: { type: "Point", coordinates: [77.6881, 27.5039] }, properties: { name: "Vishram Ghat boat steps", kind: "Ghat access" } }
  ]
};

export const yamuna = [
  [77.662, 27.492],
  [77.6697, 27.5015],
  [77.678, 27.5038],
  [77.6867, 27.5045],
  [77.696, 27.5065],
  [77.708, 27.512]
];

const overview = { lon: 77.685, lat: 27.535, height: 3500, heading: 45, pitch: -35 };

export const scenes = [
  {
    title: "Welcome to Mathura-Vrindavan",
    description: "A guided flight across the two towns where Krishna's childhood is remembered. Each stop uses a different camera move, and the panels measure the walk between them.",
    camera: overview,
    method: "flyTo",
    showChart: true
  },
  {
    title: "Krishna Janmabhoomi Temple",
    description: "The temple complex at the place remembered as Krishna's birth. The camera frames the precinct with a bounding sphere instead of a straight fly-to.",
    placeId: "janmabhoomi",
    method: "boundingSphere",
    height: 420
  },
  {
    title: "Vishram Ghat and the Yamuna",
    description: "The river bend at Mathura. A time-animated procession moves along the ghat while you watch the water line.",
    placeId: "vishram",
    method: "flyToEntity",
    entityId: "yamuna",
    height: 700
  },
  {
    title: "Dwarkadhish Temple",
    description: "The old-city temple of Krishna as king of Dwarka. The camera locks into a look-at so the spire stays in frame while you orbit.",
    placeId: "dwarkadhish",
    method: "lookAt",
    height: 280
  },
  {
    title: "Banke Bihari Temple",
    description: "Vrindavan's busiest lane. The idol is shown in the tribhanga pose, and the surrounding 3D buildings, when a Cesium ion token is set, are tinted by height.",
    placeId: "banke",
    method: "flyTo",
    height: 380
  },
  {
    title: "ISKCON Temple",
    description: "The Krishna-Balaram temple and its gardens, west of the old lanes.",
    placeId: "iskcon",
    method: "boundingSphere",
    height: 450
  },
  {
    title: "Prem Mandir",
    description: "A marble temple finished in 2012. At night in the scene clock the marble reads against the lit globe.",
    placeId: "prem",
    method: "lookAt",
    height: 520
  },
  {
    title: "Nidhivan",
    description: "The grove kept for the rasleela. A model spire marks the grove so it stays visible above the trees.",
    placeId: "nidhivan",
    method: "flyToEntity",
    height: 360
  },
  {
    title: "Govardhan Hill",
    description: "About 21 km from Mathura. The drawn parikrama is a geospatial measurement, not a decoration: the panel reports its length.",
    placeId: "govardhan",
    method: "flyTo",
    height: 1800
  },
  {
    title: "Holi and Janmashtami",
    description: "The clock jumps to a festival evening and plays a procession along the Yamuna. Footfall in the chart peaks in those seasons.",
    camera: { lon: 77.685, lat: 27.535, height: 2200, heading: 20, pitch: -32 },
    method: "flyTo",
    showChart: true,
    festival: true
  },
  {
    title: "How to travel",
    description: "October to March is the easier season. Delhi airport is about 150 km by road. The distance panel is the same geodesic math you can use to plan a day.",
    camera: overview,
    method: "setView"
  },
  {
    title: "End of the circuit",
    description: "The circuit returns to the wide view. Click any place in the list, or a marker, to go back.",
    camera: { ...overview, height: 4200, pitch: -40 },
    method: "flyTo"
  }
];
