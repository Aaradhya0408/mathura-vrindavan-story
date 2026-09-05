import * as Cesium from 'cesium';
import Chart from 'chart.js/auto';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';

// Initialize Cesium Ion
const cesiumToken = import.meta.env.VITE_CESIUM_ION_TOKEN;
if (!cesiumToken) {
    console.error('VITE_CESIUM_ION_TOKEN not set. Please add it to your .env file.');
}
Cesium.Ion.defaultAccessToken = cesiumToken || '';

let viewer; // Declare viewer globally

// ============================================
// ASYNC VIEWER INITIALIZATION
// ============================================
async function initializeViewer() {
    try {
        // Create terrain provider asynchronously
        const terrainProvider = await Cesium.createWorldTerrainAsync();
        
        // Create imagery provider asynchronously
        const imageryProvider = await Cesium.ArcGisMapServerImageryProvider.fromUrl(
            'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
        );

        // Create Cesium Viewer with resolved providers
        viewer = new Cesium.Viewer('cesiumContainer', {
            terrainProvider: terrainProvider,
            imageryProvider: imageryProvider,
            animation: false,
            timeline: false,
            homeButton: false,
            fullscreenButton: true,
            vrButton: false,
            infoBox: false,
            sceneModePicker: false,
            navigationHelpButton: false,
            baseLayerPicker: true,
        });

        // Disable default double-click zoom
        viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

        // Load OSM Buildings for 3D visualization
        try {
            const osmBuildings = await Cesium.createOsmBuildingsAsync();
            viewer.scene.primitives.add(osmBuildings);
            console.log('OSM Buildings loaded successfully');
        } catch (error) {
            console.warn('OSM Buildings failed to load (may not be available for all regions):', error);
        }

        console.log('Cesium Viewer initialized successfully');
        
        // Initialize landmarks and scene after viewer is ready
        await addLandmarks();
        updateScene(0);
        
    } catch (error) {
        console.error('Error initializing Cesium viewer:', error);
    }
}

// ============================================
// SCENES STRUCTURE
// ============================================
const scenes = [
    {
        id: 0,
        title: 'Welcome to Mathura-Vrindavan',
        description: 'Embark on a spiritual journey through the sacred lands of Mathura and Vrindavan, where Lord Krishna spent his divine childhood. This interactive 3D guide will take you through the most revered temples and pilgrimage sites.',
        camera: {
            destination: Cesium.Cartesian3.fromDegrees(77.6739, 27.5009, 2500),
            orientation: {
                heading: Cesium.Math.toRadians(0),
                pitch: Cesium.Math.toRadians(-35),
                roll: 0
            }
        },
        showChart: true
    },
    {
        id: 1,
        title: 'Krishna Janmabhoomi Temple',
        description: 'The birthplace of Lord Krishna. This ancient temple stands at the exact spot where Krishna is believed to have been born. The temple complex showcases architectural brilliance and deep spiritual significance.',
        camera: {
            destination: Cesium.Cartesian3.fromDegrees(77.6729, 27.4958, 500),
            orientation: {
                heading: Cesium.Math.toRadians(45),
                pitch: Cesium.Math.toRadians(-30),
                roll: 0
            }
        },
        showChart: false
    },
    {
        id: 2,
        title: 'Vishram Ghat & Yamuna River',
        description: 'The sacred ghats of the Yamuna River where Krishna is said to have rested after defeating the demon Kansa. The river itself is considered holy and is central to the spiritual life of Mathura.',
        camera: {
            destination: Cesium.Cartesian3.fromDegrees(77.7027, 27.4950, 450),
            orientation: {
                heading: Cesium.Math.toRadians(90),
                pitch: Cesium.Math.toRadians(-32),
                roll: 0
            }
        },
        showChart: false
    },
    {
        id: 3,
        title: 'Dwarkadhish Temple',
        description: 'Dedicated to Krishna as the king of Dwarka, this ancient temple reflects the architectural style of medieval India. It is one of the oldest temples in Mathura with intricate stone carvings and sculptures.',
        camera: {
            destination: Cesium.Cartesian3.fromDegrees(77.6841, 27.4909, 480),
            orientation: {
                heading: Cesium.Math.toRadians(135),
                pitch: Cesium.Math.toRadians(-28),
                roll: 0
            }
        },
        showChart: false
    },
    {
        id: 4,
        title: 'Banke Bihari Temple',
        description: 'Located in Vrindavan, this temple is famous for its unique idol of Krishna in a three-fold bend pose (Tribhanga). The temple attracts thousands of devotees daily and is known for its vibrant festivals and rituals.',
        camera: {
            destination: Cesium.Cartesian3.fromDegrees(77.6468, 27.5717, 520),
            orientation: {
                heading: Cesium.Math.toRadians(180),
                pitch: Cesium.Math.toRadians(-30),
                roll: 0
            }
        },
        showChart: false
    },
    {
        id: 5,
        title: 'ISKCON Temple',
        description: 'The International Society for Krishna Consciousness temple in Vrindavan is a modern spiritual center. It features magnificent architecture, beautiful gardens, and serves as a hub for spiritual education and devotion.',
        camera: {
            destination: Cesium.Cartesian3.fromDegrees(77.6309, 27.5819, 550),
            orientation: {
                heading: Cesium.Math.toRadians(225),
                pitch: Cesium.Math.toRadians(-29),
                roll: 0
            }
        },
        showChart: false
    },
    {
        id: 6,
        title: 'Prem Mandir',
        description: 'A modern architectural marvel completed in 2012, Prem Mandir showcases white marble craftsmanship and intricate carvings. The temple is beautifully illuminated at night and offers panoramic views of Vrindavan.',
        camera: {
            destination: Cesium.Cartesian3.fromDegrees(77.6583, 27.5555, 530),
            orientation: {
                heading: Cesium.Math.toRadians(270),
                pitch: Cesium.Math.toRadians(-31),
                roll: 0
            }
        },
        showChart: false
    },
    {
        id: 7,
        title: 'Nidhivan',
        description: 'A mystical forest sanctuary where Krishna is believed to perform divine dances (Raas Leela) every night. The dense forest of sacred trees attracts pilgrims seeking spiritual experiences and divine blessings.',
        camera: {
            destination: Cesium.Cartesian3.fromDegrees(77.6750, 27.5650, 600),
            orientation: {
                heading: Cesium.Math.toRadians(315),
                pitch: Cesium.Math.toRadians(-25),
                roll: 0
            }
        },
        showChart: false
    },
    {
        id: 8,
        title: 'Govardhan Hill',
        description: 'A sacred mountain located 21 km from Mathura, where Krishna is believed to have lifted the entire hill to protect villagers from torrential rain. Pilgrims circumambulate the hill in reverence and devotion.',
        camera: {
            destination: Cesium.Cartesian3.fromDegrees(77.5944, 27.5031, 800),
            orientation: {
                heading: Cesium.Math.toRadians(0),
                pitch: Cesium.Math.toRadians(-28),
                roll: 0
            }
        },
        showChart: false
    },
    {
        id: 9,
        title: 'Festivals: Holi & Janmashtami',
        description: 'Mathura-Vrindavan is the epicenter of Krishna celebrations. Holi (Festival of Colors) and Janmashtami (Krishna\'s Birthday) are celebrated with grandeur, featuring colorful processions, traditional music, and spiritual fervor.',
        camera: {
            destination: Cesium.Cartesian3.fromDegrees(77.6400, 27.5400, 2000),
            orientation: {
                heading: Cesium.Math.toRadians(45),
                pitch: Cesium.Math.toRadians(-32),
                roll: 0
            }
        },
        showChart: true
    },
    {
        id: 10,
        title: 'Travel Tips',
        description: 'Best time to visit: October to March (cool season). How to reach: Nearest airport is Indira Gandhi International Airport in Delhi (58 km away). Local transport includes taxis, auto-rickshaws, and bicycles. Plan 3-5 days to explore all major sites.',
        camera: {
            destination: Cesium.Cartesian3.fromDegrees(77.6739, 27.5009, 2500),
            orientation: {
                heading: Cesium.Math.toRadians(0),
                pitch: Cesium.Math.toRadians(-35),
                roll: 0
            }
        },
        showChart: false
    },
    {
        id: 11,
        title: 'Thank You',
        description: 'Thank you for joining this spiritual journey through Mathura-Vrindavan. May you find peace, enlightenment, and divine grace in these sacred lands. Hari Om!',
        camera: {
            destination: Cesium.Cartesian3.fromDegrees(77.6739, 27.5009, 3000),
            orientation: {
                heading: Cesium.Math.toRadians(0),
                pitch: Cesium.Math.toRadians(-35),
                roll: 0
            }
        },
        showChart: false
    }
];

// ============================================
// SCENE NAVIGATION
// ============================================
let currentSceneIndex = 0;

function updateScene(index) {
    currentSceneIndex = index;
    const scene = scenes[index];

    // Fade out effect
    const descPanel = document.querySelector('.scene-description');
    descPanel.classList.add('fade-out');

    // Update content after fade
    setTimeout(() => {
        document.getElementById('sceneTitle').textContent = scene.title;
        document.getElementById('sceneDescription').textContent = scene.description;
        document.getElementById('sceneCounter').textContent = `${index + 1} / ${scenes.length}`;
        
        // Fade in effect
        descPanel.classList.remove('fade-out');
    }, 200);

    // Update camera with animation
    viewer.camera.flyTo({
        destination: scene.camera.destination,
        orientation: scene.camera.orientation,
        duration: 3
    });

    // Show/hide chart
    const chartContainer = document.getElementById('chartContainer');
    if (scene.showChart && index === 0) {
        chartContainer.style.display = 'block';
        if (!chartInstance) initializeChart();
    } else if (scene.showChart && index === 9) {
        chartContainer.style.display = 'block';
        if (chartInstance) chartInstance.destroy();
        initializeChart();
    } else {
        chartContainer.style.display = 'none';
    }
}

document.getElementById('prevBtn').addEventListener('click', () => {
    if (currentSceneIndex > 0) {
        updateScene(currentSceneIndex - 1);
    }
});

document.getElementById('nextBtn').addEventListener('click', () => {
    if (currentSceneIndex < scenes.length - 1) {
        updateScene(currentSceneIndex + 1);
    }
});

// ============================================
// CHART INITIALIZATION
// ============================================
let chartInstance = null;

function initializeChart() {
    const ctx = document.getElementById('footfallChart');
    if (!ctx) return;

    if (chartInstance) {
        chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Tourist Footfall',
                data: [45000, 65000, 70000, 35000, 28000, 22000, 25000, 30000, 40000, 55000, 72000, 68000],
                borderColor: '#6b4423',
                backgroundColor: 'rgba(107, 68, 35, 0.1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#d4a574',
                pointBorderColor: '#6b4423',
                pointRadius: 5,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: '#2c2c2c',
                        font: {
                            size: 12
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 80000,
                    ticks: {
                        color: '#2c2c2c'
                    },
                    grid: {
                        color: 'rgba(107, 68, 35, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: '#2c2c2c'
                    },
                    grid: {
                        color: 'rgba(107, 68, 35, 0.1)'
                    }
                }
            }
        }
    });
}

// ============================================
// GEOJSON LANDMARKS LAYER
// ============================================
const landmarksGeoJSON = {
    type: 'FeatureCollection',
    features: [
        {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [77.6729, 27.4958] },
            properties: {
                name: 'Krishna Janmabhoomi Temple',
                category: 'Temple',
                description: 'Birthplace of Lord Krishna'
            }
        },
        {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [77.7027, 27.4950] },
            properties: {
                name: 'Vishram Ghat',
                category: 'Ghat',
                description: 'Sacred ghats of the Yamuna River'
            }
        },
        {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [77.6841, 27.4909] },
            properties: {
                name: 'Dwarkadhish Temple',
                category: 'Temple',
                description: 'Ancient temple dedicated to Krishna as king of Dwarka'
            }
        },
        {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [77.6468, 27.5717] },
            properties: {
                name: 'Banke Bihari Temple',
                category: 'Temple',
                description: 'Famous for unique idol of Krishna in Tribhanga pose'
            }
        },
        {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [77.6309, 27.5819] },
            properties: {
                name: 'ISKCON Temple',
                category: 'Temple',
                description: 'Modern spiritual center with beautiful gardens'
            }
        },
        {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [77.6583, 27.5555] },
            properties: {
                name: 'Prem Mandir',
                category: 'Temple',
                description: 'Modern architectural marvel with white marble craftsmanship'
            }
        },
        {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [77.6750, 27.5650] },
            properties: {
                name: 'Nidhivan',
                category: 'Forest Sanctuary',
                description: 'Mystical forest where Krishna performs divine dances'
            }
        },
        {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [77.5944, 27.5031] },
            properties: {
                name: 'Govardhan Hill',
                category: 'Mountain',
                description: 'Sacred mountain where Krishna lifted the entire hill'
            }
        }
    ]
};

// Add GeoJSON entities to map
async function addLandmarks() {
    try {
        const dataSource = await Cesium.GeoJsonDataSource.load(landmarksGeoJSON);
        viewer.dataSources.add(dataSource);
        const entities = dataSource.entities.values;
        
        for (let i = 0; i < entities.length; i++) {
            const entity = entities[i];
            entity.point = new Cesium.PointGraphics({
                pixelSize: 14,
                color: Cesium.Color.fromCssColorString('#d4a574'),
                outlineColor: Cesium.Color.fromCssColorString('#6b4423'),
                outlineWidth: 2
            });
            
            entity.label = new Cesium.LabelGraphics({
                text: entity.properties.name.getValue(),
                font: 'bold 16px sans-serif',
                fillColor: Cesium.Color.WHITE,
                outlineColor: Cesium.Color.fromCssColorString('#6b4423'),
                outlineWidth: 2,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                verticalOrigin: Cesium.VerticalOrigin.TOP,
                pixelOffset: new Cesium.Cartesian2(0, 20)
            });
        }
        console.log('Landmarks loaded successfully');
    } catch (error) {
        console.error('Error loading landmarks:', error);
    }
}

// ============================================
// TOURIST FACILITIES LAYER (Placeholder)
// ============================================
function toggleFacilities() {
    const isChecked = document.getElementById('facilitiesToggle').checked;
    console.log('Tourist Facilities layer:', isChecked ? 'ON' : 'OFF');
    // Add your tourist facilities GeoJSON data here
    // This is a placeholder for future data integration
}

document.getElementById('facilitiesToggle').addEventListener('change', toggleFacilities);

// ============================================
// INITIALIZE APPLICATION
// ============================================
initializeViewer();

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && currentSceneIndex > 0) {
        updateScene(currentSceneIndex - 1);
    } else if (e.key === 'ArrowRight' && currentSceneIndex < scenes.length - 1) {
        updateScene(currentSceneIndex + 1);
    }
});

console.log('Mathura-Vrindavan: A Spiritual Journey - Script loaded');
