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
let currentSceneIndex = 0; // Move this to global scope

// ============================================
// SCENES STRUCTURE - WITH ACCURATE COORDINATES
// ============================================
const scenes = [
    {
        id: 0,
        title: 'Welcome to Mathura-Vrindavan',
        description: 'Embark on a spiritual journey through the sacred lands of Mathura and Vrindavan, where Lord Krishna spent his divine childhood. This interactive 3D guide will take you through the most revered temples and pilgrimage sites.',
        camera: {
            destination: Cesium.Cartesian3.fromDegrees(77.6850, 27.5350, 3500),
            orientation: {
                heading: Cesium.Math.toRadians(45),
                pitch: Cesium.Math.toRadians(-40),
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
            destination: Cesium.Cartesian3.fromDegrees(77.669795806, 27.504727, 418.2712),
            orientation: {
                heading: Cesium.Math.toRadians(360),
                pitch: Cesium.Math.toRadians(-90),
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
            destination: Cesium.Cartesian3.fromDegrees(77.686689, 27.504471, 723),
            orientation: {
                heading: Cesium.Math.toRadians(360),
                pitch: Cesium.Math.toRadians(-90),
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
           destination: Cesium.Cartesian3.fromDegrees(77.68475664290054, 27.505050728, 325.43529),
orientation: {
    heading: Cesium.Math.toRadians(360),
    pitch: Cesium.Math.toRadians(-90),
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
            destination: Cesium.Cartesian3.fromDegrees(77.702297, 27.582296, 450.8624),
            orientation: {
                heading: Cesium.Math.toRadians(360),
                pitch: Cesium.Math.toRadians(-90),
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
            destination: Cesium.Cartesian3.fromDegrees(77.67514751042745, 27.569233875039977 ,433.9466974273855),
            orientation: {
                heading: Cesium.Math.toRadians(360),
                pitch: Cesium.Math.toRadians(-90),
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
            destination: Cesium.Cartesian3.fromDegrees(77.671960, 27.572091, 744),
            orientation: {
                heading: Cesium.Math.toRadians(360),
                pitch: Cesium.Math.toRadians(-90),
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
            destination: Cesium.Cartesian3.fromDegrees( 77.70455403026638,27.580250327 , 474),
            orientation: {
                heading: Cesium.Math.toRadians(360),
                pitch: Cesium.Math.toRadians(-90),
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
            destination: Cesium.Cartesian3.fromDegrees(77.4437643, 27.43801, 688.5361),
            orientation: {
                heading: Cesium.Math.toRadians(360),
                pitch: Cesium.Math.toRadians(-90),
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
            destination: Cesium.Cartesian3.fromDegrees(77.6850, 27.5350, 2000),
            orientation: {
                heading: Cesium.Math.toRadians(45),
                pitch: Cesium.Math.toRadians(-38),
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
            destination: Cesium.Cartesian3.fromDegrees(77.6850, 27.5350, 3500),
            orientation: {
                heading: Cesium.Math.toRadians(0),
                pitch: Cesium.Math.toRadians(-40),
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
            destination: Cesium.Cartesian3.fromDegrees(77.6850, 27.5350, 4000),
            orientation: {
                heading: Cesium.Math.toRadians(0),
                pitch: Cesium.Math.toRadians(-40),
                roll: 0
            }
        },
        showChart: false
    }
];

// ============================================
// GEOJSON LANDMARKS LAYER - ACCURATE COORDINATES
// ============================================
const landmarksGeoJSON = {
    type: 'FeatureCollection',
    features: [
        {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [77.669730, 27.504727] },
            properties: {
                name: 'Krishna Janmabhoomi Temple',
                category: 'Temple',
                description: 'Birthplace of Lord Krishna'
            }
        },
        {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [77.686689, 27.504471] },
            properties: {
                name: 'Vishram Ghat',
                category: 'Ghat',
                description: 'Sacred ghats of the Yamuna River'
            }
        },
        {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [77.682433, 27.506264] },
            properties: {
                name: 'Dwarkadhish Temple',
                category: 'Temple',
                description: 'Ancient temple dedicated to Krishna as king of Dwarka'
            }
        },
        {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [77.702450, 27.583908] },
            properties: {
                name: 'Banke Bihari Temple',
                category: 'Temple',
                description: 'Famous for unique idol of Krishna in Tribhanga pose'
            }
        },
        {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [77.677927, 27.572049] },
            properties: {
                name: 'ISKCON Temple',
                category: 'Temple',
                description: 'Modern spiritual center with beautiful gardens'
            }
        },
        {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [77.671960, 27.572091] },
            properties: {
                name: 'Prem Mandir',
                category: 'Temple',
                description: 'Modern architectural marvel with white marble craftsmanship'
            }
        },
        {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [77.675043, 27.565089] },
            properties: {
                name: 'Nidhivan',
                category: 'Forest Sanctuary',
                description: 'Mystical forest where Krishna performs divine dances'
            }
        },
        {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [77.597643, 27.503801] },
            properties: {
                name: 'Govardhan Hill',
                category: 'Mountain',
                description: 'Sacred mountain where Krishna lifted the entire hill'
            }
        }
    ]
};

// ============================================
// SCENE NAVIGATION
// ============================================

function updateScene(index) {
    // Guard: make sure viewer is ready
    if (!viewer || !viewer.camera) {
        console.warn('Viewer not ready yet');
        return;
    }

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

    // Update camera with animation - 4 seconds for smooth cinematic feel
    viewer.camera.flyTo({
        destination: scene.camera.destination,
        orientation: scene.camera.orientation,
        duration: 4
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

// Add GeoJSON entities to map
async function addLandmarks() {
    try {
        const dataSource = await Cesium.GeoJsonDataSource.load(landmarksGeoJSON);
        viewer.dataSources.add(dataSource);
        const entities = dataSource.entities.values;
        
        for (let i = 0; i < entities.length; i++) {
            const entity = entities[i];
            entity.point = new Cesium.PointGraphics({
                pixelSize: 18,
                color: Cesium.Color.fromCssColorString('#FFD700'),
                outlineColor: Cesium.Color.fromCssColorString('#FF6B35'),
                outlineWidth: 3
            });
            
            entity.label = new Cesium.LabelGraphics({
                text: entity.properties.name.getValue(),
                font: 'bold 14px sans-serif',
                fillColor: Cesium.Color.WHITE,
                outlineColor: Cesium.Color.fromCssColorString('#6b4423'),
                outlineWidth: 3,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                verticalOrigin: Cesium.VerticalOrigin.TOP,
                pixelOffset: new Cesium.Cartesian2(0, 25),
                showBackground: true,
                backgroundColor: Cesium.Color.fromCssColorString('rgba(107, 68, 35, 0.8)'),
                backgroundPadding: new Cesium.Cartesian2(8, 4)
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
// ASYNC VIEWER INITIALIZATION
// ============================================
async function initializeViewer()
 {
    window.viewer = viewer; // TEMPORARY - for finding camera angles
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
            shadows: true,
            shouldAnimate: true
        });
window.viewer = viewer; // TEMPORARY - for finding camera angles
        // Disable default double-click zoom
        viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

        // Load OSM Buildings for 3D visualization
       try {
    const photorealisticTileset = await Cesium.createGooglePhotorealistic3DTileset();
    viewer.scene.primitives.add(photorealisticTileset);
    console.log('✅ Photorealistic 3D Tiles loaded successfully!');
} catch (error) {
    console.warn('⚠️ Photorealistic 3D Tiles failed to load:', error);
}
        // Enable lighting for better 3D effect
        viewer.scene.globe.enableLighting = true;

        console.log('✅ Cesium Viewer initialized successfully');
        
        // NOW initialize landmarks and scene AFTER viewer is fully ready
        await addLandmarks();
        updateScene(0);
        
    } catch (error) {
        console.error('❌ Error initializing Cesium viewer:', error);
    }
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && currentSceneIndex > 0) {
        updateScene(currentSceneIndex - 1);
    } else if (e.key === 'ArrowRight' && currentSceneIndex < scenes.length - 1) {
        updateScene(currentSceneIndex + 1);
    }
});

// ============================================
// START APPLICATION
// ============================================
initializeViewer();

console.log('🙏 Mathura-Vrindavan: A Spiritual Journey - Script loaded');
