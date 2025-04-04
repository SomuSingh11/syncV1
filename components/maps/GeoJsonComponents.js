import { GeoJSON, Circle, LayerGroup, Popup } from "react-leaflet";
import L from "leaflet";

// Styles for different GeoJSON types
const styles = {
  line: {
    color: "#ff7800",
    weight: 5,
    opacity: 0.65
  },
  polygon: {
    fillColor: "#ff7800",
    weight: 2,
    opacity: 1,
    color: '#000',
    fillOpacity: 0.7
  },
  point: {
    radius: 8,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
  },
  intersection: {
    radius: 8,
    fillColor: "#ff0000",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
  }
};

// Add popups to GeoJSON features
const onEachFeature = (feature, layer) => {
  if (feature.properties && feature.properties.name) {
    layer.bindPopup(feature.properties.name);
  }
};

// Line component
export const LineLayer = ({ data, style = styles.line }) => {
  return (
    <GeoJSON 
      data={data} 
      style={style}
      onEachFeature={onEachFeature}
    />
  );
};

// Polygon component
export const PolygonLayer = ({ data, style = styles.polygon }) => {
  return (
    <GeoJSON 
      data={data} 
      style={style}
      onEachFeature={onEachFeature}
    />
  );
};

// Circle component
export const CircleLayer = ({ data }) => {
  return (
    <LayerGroup>
      {data.features.map((feature, index) => {
        const coords = feature.geometry.coordinates;
        const radius = feature.properties.radius || 500;
        return (
          <Circle 
            key={index}
            center={[coords[1], coords[0]]}
            radius={radius}
            pathOptions={styles.point}
          >
            {feature.properties.name && <Popup>{feature.properties.name}</Popup>}
          </Circle>
        );
      })}
    </LayerGroup>
  );
};

// Intersection points component
export const IntersectionLayer = ({ data }) => {
  return (
    <GeoJSON 
      data={data}
      pointToLayer={(feature, latlng) => L.circleMarker(latlng, styles.intersection)}
      onEachFeature={onEachFeature}
    />
  );
};