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

  // convert geojson names → db keys
  const normalizeRegion = (name) => {
    const map = {
      Beirut: "beirut",
      "Mount Lebanon": "mountLebanon",
      "Keserwan-Jbeil": "kesrwanjbeil",
      North: "north",
      Akkar: "akkar",
      Bekaa: "bekaa",
      "Baalbek-Hermel": "baalbekHermel",
      South: "south",
      Nabatieh: "nabatieh",
    };

    return map[name] || name.toLowerCase();
  };

  const getColor = (regionName) => {
    const key = normalizeRegion(regionName);
    const value = cases?.[key] || 0;

    if (value > 50) return "#800026";
    if (value > 20) return "#BD0026";
    if (value > 10) return "#E31A1C";
    if (value > 5) return "#FC4E2A";
    if (value > 0) return "#FD8D3C";
    return "#D5E8D4";
  };

  const style = (feature) => ({
    fillColor: getColor(feature.properties.shapeName),
    weight: 1.5,
    color: "#666",
    fillOpacity: 0.8,
  });

  const onEachFeature = (feature, layer) => {
    const name = feature.properties.shapeName;
    const key = normalizeRegion(name);
    const value = cases?.[key] || 0;

    layer.bindTooltip(
      `<div style="text-align:center; font-weight:bold;">
        ${name}<br/>
        Cases: ${value}
      </div>`,
      { permanent: true, direction: "center" },
    );

    layer.on({
      mouseover: (e) => e.target.setStyle({ weight: 3 }),
      mouseout: (e) => e.target.setStyle({ weight: 1.5 }),
    });
  };

  return (
    <MapContainer
      center={[33.8547, 35.8623]}
      zoom={8}
      style={{ height: "648px", width: "100%", marginTop: "50px" }}
    >
      <TileLayer url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png" />

      {geoData && (
        <GeoJSON data={geoData} style={style} onEachFeature={onEachFeature} />
      )}
    </MapContainer>
  );
}
