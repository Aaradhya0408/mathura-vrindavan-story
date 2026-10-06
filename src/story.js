export const landmarks = [
  { id: "janmabhoomi", name: "Krishna Janmabhoomi Temple", category: "Temple", lon: 77.66973, lat: 27.504727, description: "Birthplace of Lord Krishna." },
  { id: "vishram", name: "Vishram Ghat", category: "Ghat", lon: 77.686689, lat: 27.504471, description: "Sacred ghats of the Yamuna, where Krishna is said to have rested." },
  { id: "dwarkadhish", name: "Dwarkadhish Temple", category: "Temple", lon: 77.682433, lat: 27.506264, description: "Krishna as the king of Dwarka, in the old city of Mathura." },
  { id: "banke", name: "Banke Bihari Temple", category: "Temple", lon: 77.70245, lat: 27.583908, description: "Krishna in the tribhanga pose, in the lanes of Vrindavan." },
  { id: "iskcon", name: "ISKCON Temple", category: "Temple", lon: 77.677927, lat: 27.572049, description: "A modern temple and garden on the edge of Vrindavan." },
  { id: "prem", name: "Prem Mandir", category: "Temple", lon: 77.67196, lat: 27.572091, description: "White marble temple completed in 2012." },
  { id: "nidhivan", name: "Nidhivan", category: "Forest", lon: 77.675043, lat: 27.565089, description: "The grove associated with the nightly rasleela." },
  { id: "govardhan", name: "Govardhan Hill", category: "Hill", lon: 77.597643, lat: 27.503801, description: "Sacred mountain where Krishna lifted the entire hill." }
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

export const scenes = [
  {
    title: "Welcome to Mathura-Vrindavan",
    description: "Embark on a spiritual journey through the sacred lands of Mathura and Vrindavan, where Lord Krishna spent his divine childhood. This interactive 3D guide will take you through the most revered temples and pilgrimage sites.",
    camera: { lon: 77.685, lat: 27.535, height: 3500, heading: 45, pitch: -40 },
    showChart: true
  },
  {
    title: "Krishna Janmabhoomi Temple",
    description: "The birthplace of Lord Krishna. This ancient temple stands at the exact spot where Krishna is believed to have been born. The temple complex showcases architectural brilliance and deep spiritual significance.",
    placeId: "janmabhoomi",
    camera: { lon: 77.669795806, lat: 27.504727, height: 418.2712, heading: 360, pitch: -90 }
  },
  {
    title: "Vishram Ghat & Yamuna River",
    description: "The sacred ghats of the Yamuna River where Krishna is said to have rested after defeating the demon Kansa. The river itself is considered holy and is central to the spiritual life of Mathura.",
    placeId: "vishram",
    camera: { lon: 77.686689, lat: 27.504471, height: 723, heading: 360, pitch: -90 }
  },
  {
    title: "Dwarkadhish Temple",
    description: "Dedicated to Krishna as the king of Dwarka, this ancient temple reflects the architectural style of medieval India. It is one of the oldest temples in Mathura with intricate stone carvings and sculptures.",
    placeId: "dwarkadhish",
    camera: { lon: 77.68475664290054, lat: 27.505050728, height: 325.43529, heading: 360, pitch: -90 }
  },
  {
    title: "Banke Bihari Temple",
    description: "Located in Vrindavan, this temple is famous for its unique idol of Krishna in a three-fold bend pose (Tribhanga). The temple attracts thousands of devotees daily and is known for its vibrant festivals and rituals.",
    placeId: "banke",
    camera: { lon: 77.702297, lat: 27.582296, height: 450.8624, heading: 360, pitch: -90 }
  },
  {
    title: "ISKCON Temple",
    description: "The International Society for Krishna Consciousness temple in Vrindavan is a modern spiritual center. It features magnificent architecture, beautiful gardens, and serves as a hub for spiritual education and devotion.",
    placeId: "iskcon",
    camera: { lon: 77.67514751042745, lat: 27.569233875039977, height: 433.9466974273855, heading: 360, pitch: -90 }
  },
  {
    title: "Prem Mandir",
    description: "A modern architectural marvel completed in 2012, Prem Mandir showcases white marble craftsmanship and intricate carvings. The temple is beautifully illuminated at night and offers panoramic views of Vrindavan.",
    placeId: "prem",
    camera: { lon: 77.67196, lat: 27.572091, height: 744, heading: 360, pitch: -90 }
  },
  {
    title: "Nidhivan",
    description: "A mystical forest sanctuary where Krishna is believed to perform divine dances (Raas Leela) every night. The dense forest of sacred trees attracts pilgrims seeking spiritual experiences and divine blessings.",
    placeId: "nidhivan",
    camera: { lon: 77.70455403026638, lat: 27.580250327, height: 474, heading: 360, pitch: -90 }
  },
  {
    title: "Govardhan Hill",
    description: "A sacred mountain located 21 km from Mathura, where Krishna is believed to have lifted the entire hill to protect villagers from torrential rain. Pilgrims circumambulate the hill in reverence and devotion.",
    placeId: "govardhan",
    camera: { lon: 77.4437643, lat: 27.43801, height: 688.5361, heading: 360, pitch: -90 }
  },
  {
    title: "Festivals: Holi & Janmashtami",
    description: "Mathura-Vrindavan is the epicenter of Krishna celebrations. Holi (Festival of Colors) and Janmashtami (Krishna's Birthday) are celebrated with grandeur, featuring colorful processions, traditional music, and spiritual fervor.",
    camera: { lon: 77.685, lat: 27.535, height: 2000, heading: 45, pitch: -38 },
    showChart: true,
    festival: true
  },
  {
    title: "Travel Tips",
    description: "Best time to visit: October to March (cool season). How to reach: Nearest airport is Indira Gandhi International Airport in Delhi (58 km away). Local transport includes taxis, auto-rickshaws, and bicycles. Plan 3-5 days to explore all major sites.",
    camera: { lon: 77.685, lat: 27.535, height: 3500, heading: 0, pitch: -40 }
  },
  {
    title: "Thank You",
    description: "Thank you for joining this spiritual journey through Mathura-Vrindavan. May you find peace, enlightenment, and divine grace in these sacred lands. Hari Om!",
    camera: { lon: 77.685, lat: 27.535, height: 4000, heading: 0, pitch: -40 }
  }
];
