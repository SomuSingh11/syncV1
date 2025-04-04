"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, LayersControl, LayerGroup } from "react-leaflet";
import { mapStyles } from "@/components/maps/mapStyles.js";
import { LocationControl } from "@/components/maps/locationControl.js";
import {cities } from "@/public/mockData/markerData.js";
import { MarkerGroup, icons } from "@/components/maps/MarkerComponents.js";
import { Circle, CircleMarker } from "react-leaflet";


import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import "leaflet/dist/leaflet.css";

const LeafletMap = ({ resourceMarkers, projectMarkers }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [userLocation, setUserLocation] = useState(null);


  useEffect(() => {
    setIsMounted(true);
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: markerIcon2x,
      iconUrl: markerIcon,
      shadowUrl: markerShadow,
    });
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div style={{ height: "100vh", width: "100%", position: "relative" }}>
      <MapContainer
        center={[23.17993, 80.02671]}
        zoom={13}
        style={{ height: "80%", width: "100%" }}
      >
        <LayersControl position="topright">
          {/* Base Layers */}
          {mapStyles.map((style, index) => (
            <LayersControl.BaseLayer
              key={style.name}
              name={style.name}
              checked={index === 0}
            >
              <TileLayer url={style.url} attribution={style.attribution} />
            </LayersControl.BaseLayer>
          ))}

          {/* Resource Markers */}
          {resourceMarkers?.globalResources?.length > 0 && (
            <LayersControl.Overlay name="Global Resources">
              <MarkerGroup markers={resourceMarkers.globalResources} icon={icons.completed} />
            </LayersControl.Overlay>
          )}

          {resourceMarkers?.myResources?.length > 0 && (
            <LayersControl.Overlay name="My Resources">
              <MarkerGroup markers={resourceMarkers.myResources} icon={icons.completed} />
            </LayersControl.Overlay>
          )}

          {/* Project Markers */}
          <LayersControl.Overlay name="Department Projects" checked>
            <LayerGroup>
              {projectMarkers?.departmentProjects?.map((project) => (
                <div key={project.id}>
                  <CircleMarker
                    center={project.position}
                    radius={8}
                  >
                    <Popup>
                      <div className="p-2">
                        <h3 className="font-bold text-lg">{project.name}</h3>
                        <p>Status: {project.status}</p>
                        <p>Priority: {project.priority}</p>
                        <p>Start: {project.startDate.toLocaleDateString()}</p>
                        <p>End: {project.endDate.toLocaleDateString()}</p>
                      </div>
                    </Popup>
                  </CircleMarker>
                  <Circle
                    center={project.position}
                    radius={project.radius}
                    pathOptions={{
                      weight: 1,
                      opacity: 0.5,
                      fillOpacity: 0.1
                    }}
                  />
                </div>
              ))}
            </LayerGroup>
          </LayersControl.Overlay>

          <LayersControl.Overlay name="Other Projects">
            <LayerGroup>
              {projectMarkers?.otherProjects?.map((project) => (
                <div key={project.id}>
                  <CircleMarker
                    center={project.position}
                    pathOptions={{
                      fillOpacity: 0.2
                    }}
                    radius={8}
                  >
                    <Popup>
                      <div className="p-2">
                        <h3 className="font-bold text-lg">{project.name}</h3>
                        <p>Status: {project.status}</p>
                        <p>Priority: {project.priority}</p>
                        <p>Start: {project.startDate.toLocaleDateString()}</p>
                        <p>End: {project.endDate.toLocaleDateString()}</p>
                      </div>
                    </Popup>
                  </CircleMarker>
                  <Circle
                    center={project.position}
                    radius={project.radius}
                    pathOptions={{
                      weight: 1,
                      opacity: 0.3,
                      fillOpacity: 0.05
                    }}
                  />
                </div>
              ))}
            </LayerGroup>
          </LayersControl.Overlay>

          {/* Other existing layers */}
          <LayersControl.Overlay name="Major Cities">
            <MarkerGroup markers={cities} icon={icons.default} />
          </LayersControl.Overlay>

          {/* Location control and other layers */}
          <LayersControl.Overlay name="Your Location">
            <LayerGroup>
              {userLocation && (
                <Marker position={userLocation}>
                  <Popup>You are here!</Popup>
                </Marker>
              )}
            </LayerGroup>
          </LayersControl.Overlay>
        </LayersControl>  
        <LocationControl setUserLocation={setUserLocation}/>
      </MapContainer>
    </div>
  );
};

export default LeafletMap;