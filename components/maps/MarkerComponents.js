import { Marker, Popup, LayerGroup } from "react-leaflet";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";

// Create different icons for different marker types
const createIcon = (className) => {
  return new L.Icon({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    className: className // Add custom CSS class for styling
  });
};

// Icons for different project statuses
export const icons = {
  completed: createIcon('completed-marker'),
  ongoing: createIcon('ongoing-marker'),
  inPreparation: createIcon('preparation-marker'),
  default: createIcon('default-marker'),
  myResources: createIcon('bg-red-500'),
};

// Single marker component
export const CustomMarker = ({ position, name, icon = icons.default }) => {
  return (
    <Marker position={position} icon={icon}>
      <Popup>{name}</Popup>
    </Marker>
  );
};

// Group of markers component
export const MarkerGroup = ({ markers, icon = icons.default }) => {
  return (
    <LayerGroup>
      {markers.map((marker, index) => (
        <CustomMarker
          key={index}
          position={marker.position}
          name={marker.name}
          icon={icon}
        />
      ))}
    </LayerGroup>
  );
};

// Project status markers component
export const ProjectMarkers = ({ projectData }) => {
  return (
    <>
      <MarkerGroup markers={projectData.completed} icon={icons.completed} />
      <MarkerGroup markers={projectData.ongoing} icon={icons.ongoing} />
      <MarkerGroup markers={projectData.inPreparation} icon={icons.inPreparation} />
      <MarkerGroup markers={resouceMarkers.myResources} icon={icons.myResources} />
    </>
  );
};