"use client";
import dynamic from "next/dynamic";
import { Card, CardContent } from "@/components/ui/card";
import { useFormattedResourceMarkers } from "@/hooks/useFormattedResourceMarkers";
import { useFormattedProjectMarkers } from "@/hooks/useFormattedProjectMarkers";

const LeafletMap = dynamic(() => import("@/components/maps/map.js"), {
  ssr: false,
});

function MapPage() {
  const resourceMarkers = useFormattedResourceMarkers();
  const projectMarkers = useFormattedProjectMarkers();

  const isLoading = !resourceMarkers?.myResources || 
                    !resourceMarkers?.globalResources || 
                    !projectMarkers?.departmentProjects || 
                    !projectMarkers?.otherProjects;

  return (
    <div className="px-10 h-[calc(100vh-80px)]">
      <Card className="shadow-lg border-0 px-6">
        <CardContent className="p-0 rounded-lg overflow-hidden h-[calc(100vh-160px)]">
          {!isLoading ? (
            <LeafletMap 
              resourceMarkers={resourceMarkers} 
              projectMarkers={projectMarkers}
            />
          ) : (
            <p>Loading map...</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default MapPage;