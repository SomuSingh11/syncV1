"use client";
import { MapContainer, TileLayer, Circle, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function LocationMarker({ value, onChange }) {
  const map = useMapEvents({
    click(e) {
      onChange({
        type: "Point",
        coordinates: [e.latlng.lng, e.latlng.lat],
        radius: value.radius,
      });
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return value.coordinates[0] !== 0 ? (
    <Circle
      center={[value.coordinates[1], value.coordinates[0]]}
      radius={value.radius}
      pathOptions={{ color: 'blue' }}
    />
  ) : null;
}

export default function LocationPicker({ value, onChange }) {
  return (
    <MapContainer
      center={[value.coordinates[1], value.coordinates[0]]}
      zoom={5}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker value={value} onChange={onChange} />
    </MapContainer>
  );
}