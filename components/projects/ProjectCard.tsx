import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, DollarSign, AlertCircle, Clock } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

interface ProjectCardProps {
  project: {
    _id: string;
    name: string;
    description?: string;
    startDate: number;
    endDate: number;
    status: string;
    departmentId: string;
    location: {
      type: string;
      coordinates: number[];
      radius?: number;
    };
    budget?: number;
    priority: string;
    resourcesRequired?: string[];
  };
  onViewDetails?: (id: string) => void;
}

export function ProjectCard({ project, onViewDetails }: ProjectCardProps) {
  const priorityColors = {
    high: "bg-red-100 text-red-800",
    medium: "bg-yellow-100 text-yellow-800",
    low: "bg-green-100 text-green-800",
  };

  const statusColors = {
    active: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-gray-100 text-gray-800",
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="space-y-1">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{project.name}</CardTitle>
          <Badge
            className={
              priorityColors[project.priority as keyof typeof priorityColors]
            }
          >
            {project.priority}
          </Badge>
        </div>
        <Badge
          className={statusColors[project.status as keyof typeof statusColors]}
        >
          {project.status}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-4">
        {project.description && (
          <p className="text-sm text-gray-500 line-clamp-2">
            {project.description}
          </p>
        )}

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span>{format(project.startDate, "MMM d, yyyy")}</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span>
              {formatDistanceToNow(project.endDate, { addSuffix: true })}
            </span>
          </div>

          {project.budget && (
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-gray-500" />
              <span>{project.budget.toLocaleString()}</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span>
              {`${project.location.coordinates[1].toFixed(2)}, ${project.location.coordinates[0].toFixed(2)}`}
            </span>
          </div>
        </div>

        {project.resourcesRequired && project.resourcesRequired.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {project.resourcesRequired.map((resource, index) => (
              <Badge key={index} variant="outline">
                {resource}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-end gap-2">
        {project.status === "active" && (
          <Button variant="destructive" size="sm">
            <AlertCircle className="h-4 w-4 mr-1" />
            Report Conflict
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewDetails?.(project._id)}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
