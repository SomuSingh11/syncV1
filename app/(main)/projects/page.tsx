"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useContext } from "react";
import { Loader2, Plus } from "lucide-react";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { Id } from "@/convex/_generated/dataModel";
import { DepartmentContext } from "@/app/(main)/layout";
// import { ProjectTimelineComponent } from "@/components/dashboard/projectTimelineGraph";
import ProjectForm from "@/components/projectsPage/project-form";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
// import { ProjectConflictGraph } from "@/components/dashboard/projectConflictGraph";
// import { ResourcesAndProjectsGraph } from "@/components/dashboard/ResourcesAndProjectsGraph";
// import { RadialGlobalChart } from "@/components/dashboard/radiaGlobalChart";

function ProjectPage() {
  const { departmentId } = useContext(DepartmentContext);

  const projects = useQuery(api.projects.getAll);
  const myProjects = useQuery(api.projects.getByDepartment, {
    departmentId: departmentId as Id<"departments">,
  });
  const departments = useQuery(api.departments.listDepartments);

  const getProjectWithDepartment = (project: any) => {
    if (!departments) return null;

    const department = departments.find((d) => d._id === project.departmentId);
    if (!project) return null;
    console.log(project.createdAt);

    return {
      _id: project._id,
      name: project.name,
      description: project.description,
      departmentName: department?.name ?? "Unknown Department",
      location: project.location ?? { type: "Point", coordinates: [0, 0] },
      startDate: project.startDate ?? Date.now(),
      endDate: project.endDate ?? Date.now(),
      createdAt: project.createdAt ?? Date.now(),
      status: project.status ?? "pending",
      priority: project.priority ?? "medium",
      resourcesRequired: project.resourcesRequired ?? [],
    };
  };

  const renderProjects = (projectsList: any[] | undefined) => {
    if (!projectsList || !departments) {
      return (
        <div className="col-span-full flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      );
    }

    if (projectsList.length === 0) {
      return (
        <div className="col-span-full text-center text-gray-500">
          No projects found
        </div>
      );
    }

    return projectsList.map((project) => {
      const enrichedProject = getProjectWithDepartment(project);
      if (!enrichedProject) return null;

      return (
        <ProjectCard project={project} key={project._id} {...enrichedProject} />
      );
    });
  };

  return (
    <>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Projects</h1>
          <Sheet>
            <SheetTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Project
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[95%] sm:w-[90%] lg:w-[2000px] overflow-y-auto h-screen"
            >
              <SheetHeader>
                <SheetTitle>Create New Project</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <ProjectForm />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Projects</TabsTrigger>
            <TabsTrigger value="my">My Projects</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {!projects || !departments ? (
                <div className="col-span-full flex justify-center">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : projects.length === 0 ? (
                <div className="col-span-full text-center text-gray-500">
                  No projects found
                </div>
              ) : (
                projects.map((project) => (
                  <ProjectCard
                    project={project}
                    key={project._id}
                    {...getProjectWithDepartment(project)}
                  />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="my">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {!myProjects || !departments ? (
                <div className="col-span-full flex justify-center">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : myProjects.length === 0 ? (
                <div className="col-span-full text-center text-gray-500">
                  No projects found
                </div>
              ) : (
                myProjects.map((project) => (
                  <ProjectCard
                    project={project}
                    key={project._id}
                    {...getProjectWithDepartment(project)}
                  />
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      {/* <ProjectTimelineComponent
        departmentId={departmentId as Id<"departments">}
      /> */}
      {/* <ProjectConflictGraph />
      <ResourcesAndProjectsGraph />
      <RadialGlobalChart /> */}
    </>
  );
}

export default ProjectPage;
