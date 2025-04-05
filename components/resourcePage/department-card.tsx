import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Loader2,
//   Users,
  MapPin,
//   Phone,
  Mail,
  Calendar,
  User,
  Building,
} from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";

  interface DepartmentCardProps {
  departmentId: Id<"departments">;
}


function DepartmentCard({ departmentId }: DepartmentCardProps) {
  // Fetch department details from Convex
  const department = useQuery(api.departments.getDepartmentByInternalId, {
    id: departmentId ,
  });

  // Fetch resources count for this department
  const resources = useQuery(api.resources.getByDepartmentId, {
    departmentId: departmentId,
  });

  // Fetch parent department if exists
   const parentDepartment = useQuery(
     api.departments.getDepartmentByInternalId,
     department?.parentDepartmentId
       ? { id: department.parentDepartmentId as Id<"departments"> }
       : "skip"
   );

  // Calculate resource stats
  const resourceStats = React.useMemo(() => {
    if (!resources) return { total: 0, allocated: 0, available: 0 };

    const total = resources.length;
    const allocated = resources.reduce(
      (sum, r) => sum + r.allocatedQuantity,
      0
    );
    const totalQuantity = resources.reduce(
      (sum, r) => sum + r.totalQuantity,
      0
    );

    return {
      total,
      allocated,
      available: totalQuantity - allocated,
    };
  }, [resources]);

  if (!department) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-md flex items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-blue-600 mr-2" />
        <span>Loading department details...</span>
      </div>
    );
  }

  // Format date
  const createdDate = new Date(department.createdAt).toLocaleDateString();

  return (
    <div className="bg-white rounded-lg p-6 shadow-md min-h-screen">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {department.name}
          </h2>
          <p className="text-gray-500">
            {department.departmentType || "Department"}
          </p>
        </div>

        {/* Department logo/profile image */}
        <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
          {department.name.charAt(0).toUpperCase()}
        </div>
      </div>

      <div className="space-y-3 mb-4">
        {department.description && (
          <div>
            <h3 className="font-semibold text-gray-700">Description</h3>
            <p className="text-gray-700">{department.description}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
          <div className="flex items-center text-gray-600">
            <Mail size={16} className="mr-2 flex-shrink-0" />
            <span className="truncate">{department.email}</span>
          </div>

          <div className="flex items-center text-gray-600">
            <User size={16} className="mr-2 flex-shrink-0" />
            <span className="truncate">
              Contact: {department.pointOfContact}
            </span>
          </div>

          <div className="flex items-center text-gray-600">
            <Calendar size={16} className="mr-2 flex-shrink-0" />
            <span>Created on {createdDate}</span>
          </div>

          {parentDepartment && (
            <div className="flex items-center text-gray-600">
              <Building size={16} className="mr-2 flex-shrink-0" />
              <span className="truncate">Parent: {parentDepartment.name}</span>
            </div>
          )}
        </div>

        {department.location && (
          <div className="mt-4">
            <h3 className="font-semibold text-gray-700 mb-2">Location</h3>
            <div className="flex items-center text-gray-600">
              <MapPin size={16} className="mr-2 flex-shrink-0" />
              <span>
                {department.location.city}, {department.location.state}{" "}
                {department.location.zip}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="border-t pt-4">
        <h3 className="font-semibold mb-2">Resource Summary</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-50 p-3 rounded text-center">
            <p className="text-sm text-gray-500">Total</p>
            <p className="font-bold text-lg">{resourceStats.total}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded text-center">
            <p className="text-sm text-gray-500">Available</p>
            <p className="font-bold text-lg">{resourceStats.available}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded text-center">
            <p className="text-sm text-gray-500">Allocated</p>
            <p className="font-bold text-lg">{resourceStats.allocated}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-500">
        Department ID: {department.departmentId}
      </div>
    </div>
  );
}

export default DepartmentCard;
