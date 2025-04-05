export const lineData = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { name: "Sample Line" },
        geometry: {
          type: "LineString",
          coordinates: [[75.86, 22.71], [75.87, 22.72], [75.88, 22.73]]
        }
      }
    ]
  };
  
  export const polygonData = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { name: "Sample Polygon" },
        geometry: {
          type: "Polygon",
          coordinates: [[[75.85, 22.70], [75.86, 22.71], [75.87, 22.70], [75.85, 22.70]]]
        }
      }
    ]
  };
  
  export const circleData = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { name: "Sample Circle", radius: 500 },
        geometry: {
          type: "Point",
          coordinates: [75.88, 22.73]
        }
      }
    ]
  };
  
  export const intersectionData = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { name: "Intersection Point" },
        geometry: {
          type: "Point",
          coordinates: [75.87, 22.72]
        }
      }
    ]
  };