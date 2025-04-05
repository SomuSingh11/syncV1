"use client";

import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import ResourceCard from "@/components/resourcePage/resource-card";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { Id } from "@/convex/_generated/dataModel";

function ResourcePage() {
  const [selectedResourceId, setSelectedResourceId] = useState<string | null>(
    null
  );
  const { user } = useUser();

  const userDepartmentStatus = useQuery(api.users.getUserDepartmentStatus, {
    userId: user?.id || "",
  });

  // Add loading state for department status
  if (!userDepartmentStatus) {
    return (
      <div className="p-4 px-10 flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const resources = useQuery(api.resources.getAllExceptOwn, {
    departmentId: userDepartmentStatus.departmentId || "",
  });

  // Add loading state for resources
  if (!resources) {
    return (
      <div className="p-4 px-10 flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const handleViewResource = (id: number | string) => {
    console.log(`Viewing resource with ID: ${id}`);
    setSelectedResourceId(String(id));
  };

  // Show empty state if no resources
  if (resources.length === 0) {
    return (
      <div className="p-4 px-10 flex items-center justify-center min-h-screen">
        <p className="text-gray-500">No resources available</p>
      </div>
    );
  }

  return (
    <div className="p-4 px-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {resources.map((resource) => (
          <ResourceCard
            key={resource._id}
            departmentId={resource.departmentId as Id<"departments">}
            createdAt={resource.createdAt}
            resourceId={resource._id}
            name={resource.name || ""}
            type={resource.type || ""}
            totalQuantity={resource.totalQuantity || 0}
            allocatedQuantity={resource.allocatedQuantity || 0}
            status={resource.status || ""}
            isGlobal={resource.isGlobal || false}
            description={resource.description || ""}
            image={resource.image || ""}
            departmentName={resource.departmentName || ""}
            price={resource.price || 0}
            location={resource.location || { city: "", state: "", zip: "" }}
            onViewResource={handleViewResource}
          />
        ))}
      </div>
    </div>
  );
}

export default ResourcePage;
