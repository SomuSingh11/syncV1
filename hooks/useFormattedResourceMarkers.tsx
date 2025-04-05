import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { DepartmentContext } from "@/app/(main)/layout";
import { useContext, useEffect, useState } from "react";

// Custom hook to fetch and format project markers
export function useFormattedResourceMarkers() {
  const { departmentId } = useContext(DepartmentContext);
  const resources = useQuery(api.resources.getAll);

  const [formattedMarkers, setFormattedMarkers] = useState<{ myResources: any[]; globalResources: any[] } | null>(null);

  useEffect(() => {
    if (resources !== undefined) {
      const resourceMarkers = {
        myResources: [],
        globalResources: [],
      };

      resources.forEach((resource) => {
        if (!resource.location?.latitude || !resource.location?.longitude) return;

        const markerInfo = {
          position: [Number(resource.location.latitude), Number(resource.location.longitude)],
          name: resource.name,
          departmentName: resource.departmentName,
        };

        // Example logic to categorize resources
        if (resource.departmentId === departmentId) {
            (resourceMarkers.myResources as any[]).push(markerInfo);
        } else {
          (resourceMarkers.globalResources as any[]).push(markerInfo);
        }
      });

      setFormattedMarkers(resourceMarkers); // Set formatted markers after resources are fetched
    }
  }, [resources, departmentId]); // Effect re-runs when `resources` or `departmentId` changes

  if (formattedMarkers === null) {
    return { myResources: [], globalResources: [] }; // Return empty markers or a loading state while data is being fetched
  }

  return formattedMarkers;
}