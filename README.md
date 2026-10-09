# Mathura-Vrindavan: A Spiritual Journey



An interactive 3D tourist guide for the sacred landmarks of Mathura and Vrindavan. The submission notes for Cesium's developer certification are in [docs/CERTIFICATION.md](docs/CERTIFICATION.md). Cesium still has to review the project; this repository is prepared for that review, it is not already certified.

The tour uses more than one camera method, measures geodesic distance between stops, plays a festival procession on the timeline, and reads live weather. With a Cesium ion token it also loads world terrain and tints OSM buildings by height.

## 🌟 Project Overview

This is a CesiumJS-powered geospatial web application, built with the goal of being submitted for Cesium Certification, that provides:

- **Scene-based guided navigation** with smooth camera transitions between 12 spiritual locations
- **Interactive 3D maps** powered by CesiumJS with satellite imagery and terrain
- **Landmark markers** with detailed information about temples and sacred sites
- **Tourist facilities layer** (optional) showing food, hotels, parking, etc.
- **Seasonal tourism statistics** displayed via Chart.js visualization
- **Mobile-responsive design** with Bootstrap for accessibility
- **Spiritual storytelling** combining technology with cultural heritage

## 📍 Featured Locations

1. Welcome to Mathura-Vrindavan
2. Krishna Janmabhoomi Temple
3. Vishram Ghat & Yamuna River
4. Dwarkadhish Temple
5. Banke Bihari Temple
6. ISKCON Temple
7. Prem Mandir
8. Nidhivan
9. Govardhan Hill
10. Festivals: Holi & Janmashtami
11. Travel Tips
12. Thank You

## 🛠 Tech Stack

- **Frontend Framework**: Vite (Lightning-fast build tool)
- **3D Mapping**: CesiumJS 1.120.0
- **Plugin**: vite-plugin-cesium for seamless integration
- **Charts & Visualizations**: Chart.js 4.4.0
- **UI Framework**: Bootstrap 5.3.0
- **Styling**: Custom CSS with responsive design

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A Cesium Ion account (get your free token at https://ion.cesium.com/)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Aaradhya0408/mathura-vrindavan-story.git
cd mathura-vrindavan-story
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your Cesium Ion token:
```env
VITE_CESIUM_ION_TOKEN=your_cesium_ion_token_here
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The optimized build will be in the `dist/` folder.

## 📖 Usage

### Navigation

- **Next/Previous Buttons**: Click to move between scenes
- **Keyboard Shortcuts**: Use arrow keys (← →) for quick navigation
- **Scene Counter**: Displays current scene position (e.g., "1 / 12")

### Features

- **Scene Descriptions**: Each location includes historical and cultural significance
- **Interactive Landmarks**: Clickable markers on the map showing all major temples and sites
- **Tourist Facilities**: Toggle to show/hide facilities like hotels, restaurants, and parking
- **Statistics**: View seasonal tourist footfall patterns (Holi and Janmashtami peaks)
- **Mobile-Friendly**: Fully responsive layout for tablets and smartphones

## 📊 Adding Tourist Facilities Data

To add the tourist facilities layer:

1. Prepare your GeoJSON data with the following structure:
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": { "type": "Point", "coordinates": [longitude, latitude] },
      "properties": {
        "name": "Facility Name",
        "category": "Hotel/Food/Parking",
        "description": "Brief description"
      }
    }
  ]
}
```

2. Update `src/main.js` in the "TOURIST FACILITIES LAYER" section

## 📸 Customizing Scene Coordinates

To update scene camera positions:

1. Open `src/main.js`
2. Locate the `scenes` array
3. Update the `camera` object for each scene with:
   - `destination`: Cesium.Cartesian3.fromDegrees(longitude, latitude, height)
   - `orientation`: heading, pitch, and roll angles

Example:
```javascript
{
    id: 1,
    title: 'Temple Name',
    description: 'Temple description...',
    camera: {
        destination: Cesium.Cartesian3.fromDegrees(77.6729, 27.4958, 1500),
        orientation: {
            heading: Cesium.Math.toRadians(45),
            pitch: Cesium.Math.toRadians(-30),
            roll: 0
        }
    },
    showChart: false
}
```

## 🎨 Styling Customization

Edit `src/styles.css` to customize:

- Color scheme (primary: `#6b4423`, secondary: `#d4a574`)
- Panel sizes and positions
- Font styles and sizes
- Responsive breakpoints

## 📝 Attribution & Copyright

**Created by**: [Aaradhya Garg](https://github.com/Aaradhya0408)

This project was built as part of a **GIS Developer internship** for learning and portfolio purposes.

### Licensing

Feel free to use this project for educational and personal purposes. Please provide appropriate credit to the creator.

## 🙏 Acknowledgments

- **CesiumJS**: For powerful 3D geospatial visualization
- **Vite**: For blazing-fast development experience
- **Bootstrap**: For responsive UI components
- **Chart.js**: For beautiful data visualizations
- **Mathura-Vrindavan**: For inspiring this spiritual journey

## 🐛 Issues & Contributions

Found a bug or have a suggestion? Please open an issue or submit a pull request.

## 📞 Support

For questions or support, please reach out through:
- GitHub Issues: https://github.com/Aaradhya0408/mathura-vrindavan-story/issues
- GitHub Profile: https://github.com/Aaradhya0408

---

**Hari Om!** 🙏

May this project bring knowledge and spiritual awareness to all visitors.
