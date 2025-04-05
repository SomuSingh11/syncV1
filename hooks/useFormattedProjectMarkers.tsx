import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { DepartmentContext } from "@/app/(main)/layout";
import { useContext, useEffect, useState } from "react";

export function useFormattedProjectMarkers() {
  const { departmentId } = useContext(DepartmentContext);
  const projects = useQuery(api.projects.getAll);

  const [formattedMarkers, setFormattedMarkers] = useState<{ 
    departmentProjects: any[]; 
    otherProjects: any[] 
  } | null>(null);

  useEffect(() => {
    if (projects !== undefined) {
      const projectMarkers = {
        departmentProjects: [],
        otherProjects: [],
      };

      projects.forEach((project) => {
        if (!project.location?.coordinates) return;

        const markerInfo = {
          id: project._id,
          position: [
            Number(project.location.coordinates[1]), // lat
            Number(project.location.coordinates[0]) // lng
          ],
          radius: project.location.radius || 1000,
          name: project.name,
          status: project.status,
          priority: project.priority,
          startDate: new Date(project.startDate),
          endDate: new Date(project.endDate),
          description: project.description,
          budget: project.budget,
        };

        if (project.departmentId === departmentId) {
         (projectMarkers.departmentProjects as any[]).push(markerInfo);
        } else {
            (projectMarkers.otherProjects as any[]).push(markerInfo);
        }
      });

      setFormattedMarkers(projectMarkers);
    }
  }, [projects, departmentId]);

  if (formattedMarkers === null) {
    return { departmentProjects: [], otherProjects: [] };
  }

  return formattedMarkers;
}