import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

export default function LebanonMap({ cases }) {
  const [geoData, setGeoData] = useState(null);

  useEffect(() => {
    fetch("/geoBoundaries-LBN-ADM1_simplified.geojson")
      .then((res) => res.json())
      .then((data) => setGeoData(data));
  }, []);

  // Match GeoJSON region names with your database region names
  const normalizeRegion = (geoJsonName) => {
    const regionMap = {
      "Beirut": "Beirut",
      "Mount Lebanon": "Mount Lebanon", 
      "Keserwan-Jbeil": "Keserwan-Jbeil",
      "North": "North",
      "Akkar": "Akkar",
      "Bekaa": "Bekaa",
      "Baalbek-Hermel": "Baalbek-Hermel",
      "South": "South",
      "Nabatieh": "Nabatieh"
    };
    return regionMap[geoJsonName] || geoJsonName;
  };

  const getColor = (regionName) => {
    const value = cases?.[regionName] || 0;
    
    // Color scale based on total cases (AS + SS)
    if (value >= 5) return "#800026"; // Very High (dark red)
    if (value >= 3) return "#BD0026"; // High (red)
    if (value >= 2) return "#E31A1C"; // Medium High (dark orange)
    if (value >= 1) return "#FC4E2A"; // Medium (orange)
    if (value > 0) return "#FD8D3C";  // Low (light orange)
    return "#D5E8D4";                 // No cases (light green)
  };

  const style = (feature) => {
    const regionName = feature.properties.shapeName;
    return {
      fillColor: getColor(regionName),
      weight: 1.5,
      color: "#666",
      fillOpacity: 0.8,
    };
  };

  const onEachFeature = (feature, layer) => {
    const regionName = feature.properties.shapeName;
    const totalCases = cases?.[regionName] || 0;
    
    // Create a styled tooltip that appears above the cursor
    const tooltipContent = `
      <div style="
        background: rgba(0, 0, 0, 0.85);
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-family: Arial, sans-serif;
        font-size: 10px;
        font-weight: bold;
        text-align: center;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        border: 1px solid rgba(255,255,255,0.2);
        pointer-events: none;
        white-space: nowrap;
      ">
        <div style="font-size: 12px; margin-bottom: 5px;"> ${regionName}</div>
        <div style="font-size: 14px; color: ${totalCases > 0 ? '#ff6b6b' : '#6bff6b'};">
          ${totalCases > 0 ? `⚠️ ${totalCases} Case${totalCases > 1 ? 's' : ''}` : '✅ No Cases'}
        </div>
      </div>
    `;
    
    // Bind tooltip with custom options
    layer.bindTooltip(tooltipContent, {
      sticky: true,        // Follows the cursor
      direction: 'top',    // Appears above the cursor
      offset: [0, -10],    // Offset from cursor (x, y)
      opacity: 1,
      className: 'custom-tooltip'  // Add custom class for additional styling
    });
    
    // Highlight on hover
    layer.on({
      mouseover: (e) => {
        e.target.setStyle({ 
          weight: 3, 
          color: "#000", 
          fillOpacity: 0.9 
        });
        // Open tooltip on hover
        e.target.openTooltip();
      },
      mouseout: (e) => {
        e.target.setStyle({ 
          weight: 1.5, 
          color: "#666", 
          fillOpacity: 0.8 
        });
        // Close tooltip on mouseout
        e.target.closeTooltip();
      },
    });
  };

  return (
    <MapContainer
      center={[33.8547, 35.8623]}
      zoom={8}
      style={{ height: "600px", width: "100%", marginTop: "20px" }}
    >
      <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
      
      {geoData && (
        <GeoJSON 
          data={geoData} 
          style={style} 
          onEachFeature={onEachFeature}
        />
      )}
    </MapContainer>
  );
}