import React, { useState } from "react";
// import { MapPin, Briefcase, Tag, Clock, Loader2 } from "lucide-react";
import { MapPin ,Briefcase , Clock  } from "lucide-react";
// import { Separator } from "../ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import DepartmentCard from "./department-card";
import RequestResourceForm from "./request-resource-form";
import { Separator } from "@/components/ui/separator";
import { Id } from "@/convex/_generated/dataModel";

export interface ResourceCardProps {
  resourceId: string;
  departmentId: Id<"departments">;
  userDepartmentId?: string;
  departmentName?: string; // We'll need this from a join or separate query
  name: string;
  type: string;
  totalQuantity: number;
  allocatedQuantity: number;
  status: string;
  isGlobal: boolean;
  description?: string;
  image?: string;
  price?: number;
  location?: {
    city: string;
    state: string;
    zip: string;
  };
  categories?: string[];
  tags?: string[];
  createdAt: number;
  onViewResource?: (id: string) => void;
}

export default function ResourceCard({
  resourceId,
  departmentId,
  userDepartmentId,
  name,
  type,
  departmentName = "Unknown Department",
  totalQuantity,
  allocatedQuantity,
  status,
  isGlobal,
  description,
  image,
  price,
  location,
  categories,
  tags,
  onViewResource,
}: ResourceCardProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Calculate free quantity
  const freeQuantity = totalQuantity - allocatedQuantity;

  // Format location string if available
  const locationString = location
    ? `${location.city}, ${location.state}`
    : "Location not specified";

  // Format date
  const formattedDate = new Date(Date.now()).toLocaleDateString();

  const handleViewResource = () => {
    setIsSheetOpen(true);
    if (onViewResource) {
      onViewResource(resourceId);
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl p-5 shadow-lg relative h-[250px] flex flex-col">
        {/* Status indicator */}
        <div className="absolute top-5 right-5 flex items-center">
          <span
            className={`h-2 w-2 rounded-full mr-2 ${
              status === "active"
                ? "bg-green-500"
                : status === "maintenance"
                  ? "bg-yellow-500"
                  : status === "outofservice"
                    ? "bg-red-500"
                    : status === "inactive"
                      ? "bg-gray-500"
                      : "bg-blue-500"
            }`}
          ></span>
          <span className="text-sm text-gray-500 capitalize">{status}</span>
        </div>

        <div className="mt-1 absolute top-12 right-5">
          {isGlobal && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
              Globally Available
            </span>
          )}
        </div>

        {/* Resource type and name */}
        <div className="mb-3 min-h-[80px]">
          <div className="text-md text-gray-500 mr-2 truncate">{type}</div>
          <h3 className="text-3xl font-bold truncate">{name}</h3>
        </div>

        {/* Location and department */}
        <div className="flex justify-between mb-3">
          <div className="flex flex-col gap-1 flex-1">
            <div className="flex items-center text-sm text-gray-600">
              <MapPin size={14} className="mr-2 flex-shrink-0" />
              <span className="truncate">{locationString}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Briefcase size={14} className="mr-2 flex-shrink-0" />
              <span className="truncate">{departmentName}</span>
            </div>
          </div>
          <div className="flex items-end">
            {price !== undefined ? (
              <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm whitespace-nowrap">
                Rs. {price.toLocaleString()}
              </div>
            ) : (
              <div className="text-sm text-gray-500 flex items-center whitespace-nowrap">
                <Clock size={14} className="mr-1" />
                {formattedDate}
              </div>
            )}
          </div>
        </div>

        <Separator className="my-3" />

        {/* Bottom section with fixed positioning */}
        <div className="flex justify-between mt-auto">
          {/* Resource counts */}
          <div className="flex justify-between gap-3">
            <div className="text-center">
              <div className="text-sm text-gray-500">Total</div>
              <div className="font-semibold">{totalQuantity}</div>
            </div>
            <Separator orientation="vertical" />
            <div className="text-center">
              <div className="text-sm text-gray-500">Available</div>
              <div className="font-semibold">{freeQuantity}</div>
            </div>
            <Separator orientation="vertical" />
            <div className="text-center">
              <div className="text-sm text-gray-500">Allocated</div>
              <div className="font-semibold">{allocatedQuantity}</div>
            </div>
          </div>
          <button
            className="bg-blue-950 text-white text-sm px-3 py-2 hover:cursor-pointer rounded-md shadow-lg"
            onClick={handleViewResource}
          >
            View Resource
          </button>
        </div>
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-full md:max-w-full lg:max-w-full p-0 m-0 flex flex-row"
        >
          <SheetHeader className="absolute bottom-0">
            <SheetTitle className="text-lg font-semibold p-4">
              Resource Details
            </SheetTitle>
          </SheetHeader>
          <div className="w-80">
            <DepartmentCard departmentId={departmentId} />
          </div>
          <div className="overflow-y-auto bg-gray-400/10 w-200">
            <div className="p-6 pt-0">
              {image && (
                <div className="mb-4">
                  <img
                    src={image}
                    alt={name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="font-medium capitalize">{status}</p>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm text-gray-500">Availability</p>
                    <p className="font-medium">
                      {isGlobal ? "Globally Available" : "Department Only"}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm text-gray-500">Total Quantity</p>
                    <p className="font-medium">{totalQuantity}</p>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm text-gray-500">Available</p>
                    <p className="font-medium">{freeQuantity}</p>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm text-gray-500">Allocated</p>
                    <p className="font-medium">{allocatedQuantity}</p>
                  </div>

                  {price !== undefined && (
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="text-sm text-gray-500">Price</p>
                      <p className="font-medium">
                        Rs. {price.toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>

                {description && (
                  <div>
                    <h4 className="font-semibold mb-2">Description</h4>
                    <p className="text-gray-700">{description}</p>
                  </div>
                )}

                {location && (
                  <div>
                    <h4 className="font-semibold mb-2">Location</h4>
                    <p className="text-gray-700">
                      {location.city}, {location.state} {location.zip}
                    </p>
                  </div>
                )}

                {categories && categories.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Categories</h4>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {tags && tags.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-xs text-gray-500">
                  Resource ID: {resourceId}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-400/10 flex-grow">
            <RequestResourceForm
              resourceId={resourceId as Id<"resources">}
              userDepartmentId={userDepartmentId}
              departmentId={departmentId}
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
