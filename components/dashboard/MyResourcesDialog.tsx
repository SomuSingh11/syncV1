"use client";

import { useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";

import { api } from "@/convex/_generated/api";
import ResourceCard from "../resourcePage/resource-card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Id } from "@/convex/_generated/dataModel";

interface MyResourcesDialogProps {
  isOpen: boolean;

//   departmentId: Id<"departments">;
  onClose: () => void;
}

export default function MyResourcesDialog({
  isOpen,
  onClose,
}: MyResourcesDialogProps) {
  const { user } = useUser();
  const userDepartmentStatus = useQuery(api.users.getUserDepartmentStatus, {
    userId: user?.id || "",
  });

  const resources = useQuery(
    api.resources.getByDepartmentId,
    userDepartmentStatus?.departmentId
      ? { departmentId: userDepartmentStatus.departmentId }
      : "skip"
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[90%] h-[85vh] overflow-y-auto p-6 bg-gray-50">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-2xl font-bold">My Resources</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
          {resources?.map((resource) => (
            <div className="h-full" key={resource._id}>
              <ResourceCard
                key={resource._id}
                resourceId={resource._id}
                userDepartmentId={userDepartmentStatus?.departmentId}
                departmentId={resource.departmentId as Id<"departments">}
                departmentName={resource.departmentName}
                name={resource.name}
                type={resource.type}
                totalQuantity={resource.totalQuantity}
                allocatedQuantity={resource.allocatedQuantity}
                status={resource.status}
                isGlobal={resource.isGlobal}
                description={resource.description}
                image={resource.image}
                price={resource.price}
                location={resource.location}
                categories={resource.categories}
                tags={resource.tags}
                createdAt={resource.createdAt}
              />
            </div>
          ))}

          {resources?.length === 0 && (
            <div className="col-span-full text-center py-8 text-gray-500">
              No resources found
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
