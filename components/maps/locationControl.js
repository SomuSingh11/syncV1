import { useMapEvents } from "react-leaflet";

export const LocationControl = ({ setUserLocation }) => {
  const map = useMapEvents({
    locationfound(e) {
      setUserLocation(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  const handleLocationClick = () => {
    map.locate();
  };

  return (
    <button
      onClick={handleLocationClick}
      className="absolute z-[999] bottom-4 right-4 px-4 py-2 rounded bg-blue-600 text-white hover:cursor-pointer"
    >
      Find My Location
    </button>
  );
};