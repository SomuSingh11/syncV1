"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { useContext, useState } from "react";
import { DepartmentContext } from "@/app/(main)/layout";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Id } from "@/convex/_generated/dataModel";

// Add these imports at the top
import { useQuery } from "convex/react";
import { Checkbox } from "@/components/ui/checkbox";
import { ProjectAnalysis } from "../ai/ProjectAnalysis";
import { Progress } from "@radix-ui/react-progress";

// Update the schema to use resourcesRequired
const testProjectSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  startDate: z.string(),
  endDate: z.string(),
  status: z.string(),
  locationType: z.string(),
  coordinates: z.array(z.number()).default([0, 0]),
  radius: z.number().optional(),
  budget: z.number().optional(),
  priority: z.string(),
  resourcesRequired: z.array(z.string()).default([]),
});

export function TestProjectForm() {
  const { departmentId } = useContext(DepartmentContext);
    const [projectId, setProjectId] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Add query to get available resources
  const resources = useQuery(api.resources.getAll);

  const form = useForm<z.infer<typeof testProjectSchema>>({
    resolver: zodResolver(testProjectSchema),
    defaultValues: {
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      status: "active",
      locationType: "Point",
      coordinates: [0, 0],
      radius: 0,
      budget: 0,
      priority: "medium",
      resourcesRequired: [],
    },
  });

  const createTestProject = useMutation(api.testProjects.create);

  // Update onSubmit to include resourceRequirements
  async function onSubmit(values: z.infer<typeof testProjectSchema>) {
    try {
      const result = await createTestProject({
        departmentId: departmentId as Id<"departments">,
        name: values.name,
        description: values.description,
        startDate: new Date(values.startDate).getTime(),
        endDate: new Date(values.endDate).getTime(),
        status: values.status,
        location: {
          type: values.locationType,
          coordinates: values.coordinates,
          radius: values.radius,
        },
        budget: values.budget,
        priority: values.priority,
        resourcesRequired: values.resourcesRequired,
        createdAt: Date.now(),
      });
      setProjectId(result);
      // form.reset();
    } catch (error) {
      console.error("Error creating test project:", error);
    }
    finally{
      setIsAnalyzing(false);
    }
  }

  // Add this before the return statement
  const handleResourceChange = (resourceId: string, checked: boolean) => {
    const currentResources = form.getValues("resourcesRequired");
    if (checked) {
      form.setValue("resourcesRequired", [...currentResources, resourceId]);
    } else {
      form.setValue(
        "resourcesRequired",
        currentResources.filter((id) => id !== resourceId)
      );
    }
  };

  return (
    <div className="flex gap-8">
      <div className="flex-1">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter project name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Project description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter budget"
                      {...field}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value
                            ? parseFloat(e.target.value)
                            : undefined
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="locationType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Point">Point</SelectItem>
                        <SelectItem value="Polygon">Polygon</SelectItem>
                        <SelectItem value="LineString">LineString</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="coordinates"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Coordinates [lng, lat]</FormLabel>
                    <FormControl>
                      <div className="flex space-x-2">
                        <Input
                          type="number"
                          placeholder="Longitude"
                          value={field.value[0]}
                          onChange={(e) => {
                            const newCoords = [...field.value];
                            newCoords[0] = parseFloat(e.target.value);
                            field.onChange(newCoords);
                          }}
                        />
                        <Input
                          type="number"
                          placeholder="Latitude"
                          value={field.value[1]}
                          onChange={(e) => {
                            const newCoords = [...field.value];
                            newCoords[1] = parseFloat(e.target.value);
                            field.onChange(newCoords);
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="radius"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Radius (meters)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Optional radius"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value
                              ? parseFloat(e.target.value)
                              : undefined
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Required Resources</h3>
              <div className="grid grid-cols-1 gap-4 max-h-60 overflow-y-auto p-2 border rounded-md">
                {resources?.map((resource) => (
                  <FormField
                    key={resource._id}
                    control={form.control}
                    name="resourcesRequired"
                    render={({ field }) => {
                      return (
                        <FormItem className="flex items-center space-x-4 p-2">
                          <Checkbox
                            checked={field.value.includes(resource._id)}
                            onCheckedChange={(checked) =>
                              handleResourceChange(
                                resource._id,
                                checked as boolean
                              )
                            }
                          />
                          <label className="flex-grow">
                            {resource.name} ({resource.type})
                          </label>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isAnalyzing}>
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Analyse the Project"
              )}
            </Button>
          </form>
        </Form>
        ;
      </div>
      <div className="flex-1 h-[calc(100vh-8rem)] sticky top-24 overflow-y-auto">
        {isAnalyzing ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : projectId ? (
          <div className="space-y-6">
            <div className="grid gap-4">
              {/* <div className="space-y-3">
                <h3 className="font-semibold">Risk Analysis</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Scope Risk</span>
                    <div className="flex-1 mx-4">
                      <Progress value={75} className="h-2" />
                    </div>
                    <span className="text-sm w-12">75%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Environmental Risk</span>
                    <div className="flex-1 mx-4">
                      <Progress value={45} className="h-2" />
                    </div>
                    <span className="text-sm w-12">45%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Technical Risk</span>
                    <div className="flex-1 mx-4">
                      <Progress value={60} className="h-2" />
                    </div>
                    <span className="text-sm w-12">60%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Schedule Risk</span>
                    <div className="flex-1 mx-4">
                      <Progress value={30} className="h-2" />
                    </div>
                    <span className="text-sm w-12">30%</span>
                  </div>
                </div>
              </div> */}
            </div>
            <ProjectAnalysis
              projectId={projectId as Id<"testProjects">}
              departmentId={departmentId as Id<"departments">}
            />
          </div>
        ) : (
          <div className="text-center p-4">Submit the form to see analysis</div>
        )}
      </div>
    </div>
  );
}































































































