"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Box,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
} from "lucide-react";
import { format } from "date-fns";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "react-hot-toast";
import { DepartmentWithContact, RequestWithDetails } from "@/types/requests";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

interface RequestDialogProps {
  request: RequestWithDetails | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: (
    requestId: Id<"resourceRequests">,
    status: "approved" | "rejected"
  ) => void;
  currentDepartmentId: Id<"departments">;
}

export function RequestDialog({
  request,
  isOpen,
  onClose,
  onStatusUpdate,
  currentDepartmentId,
}: RequestDialogProps) {
  const createAllocation = useMutation(api.resourceAllocation.createAllocation);
  // const createAllocation = useMutation(api.resourceAllocation.createAllocation);
  const isRequester = request?.requesterDepartment?._id === currentDepartmentId;
  const departmentToShow = isRequester
    ? request?.lendingDepartment
    : request?.requesterDepartment;
  const formatDate = (timestamp: number) => {
    return format(new Date(timestamp), "MMM dd, yyyy");
  };

  const handleAction = async (status: "approved" | "rejected") => {
    try {
      if (status === "approved" && request?.resource?._id) {
        // Update resource quantity when approving
        if (
          !request.requesterDepartment?._id ||
          !request.lendingDepartment?._id
        ) {
          toast.error("Department information is missing");
          return;
        }

        try {
          await createAllocation({
            resourceId: request.resource._id,
            lendingDepartmentId: request.lendingDepartment._id,
            borrowingDepartmentId: request.requesterDepartment._id,
            quantityAllocated: request.quantityRequested,
            startDate: request.expectedDuration?.start || Date.now(),
            endDate:
              request.expectedDuration?.end ||
              Date.now() + 7 * 24 * 60 * 60 * 1000,
          });
        } catch (error: any) {
          if (error.message === "Not enough quantity available") {
            toast.error("Not enough quantity available");
            return;
          }
          throw error;
        }
      }

      await onStatusUpdate(request!._id, status);
      toast.success(`Request ${status} successfully`);
    } catch (error) {
      toast.error("Failed to update request");
      console.error("Failed to update request:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[90%] lg:max-w-[85%] xl:max-w-[80%] 2xl:max-w-[75%]">
        <DialogHeader className="pb-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl">
                Resource Request Details
              </DialogTitle>
              <p className="text-sm text-gray-500 mt-1">
                Review and manage resource request
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Request ID:</span>
              <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                {request?.resourceRequestId}
              </span>
            </div>
          </div>
        </DialogHeader>

        {request && (
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto pr-4">
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <Building2 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Department Information
                    </h2>
                    <p className="text-sm text-gray-500">
                      Details about the {isRequester ? "lending" : "requesting"}{" "}
                      department
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <h3 className="font-medium text-gray-700 mb-3">
                      {isRequester ? "Lending" : "Requesting"} Department
                    </h3>
                    <p className="text-gray-600 text-lg font-medium">
                      {departmentToShow?.name}
                    </p>
                    {departmentToShow?.description && (
                      <p className="text-gray-500 mt-2 text-sm">
                        {departmentToShow.description}
                      </p>
                    )}
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <h3 className="font-medium text-gray-700 mb-3">
                      Contact Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-2 bg-white rounded-lg">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="text-gray-600">
                            {departmentToShow?.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-2 bg-white rounded-lg">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">
                            Point of Contact
                          </p>
                          <p className="text-gray-600">
                            {departmentToShow?.pointOfContact}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <h3 className="font-medium text-gray-700 mb-3">Location</h3>
                    <div className="flex items-center gap-3 p-2 bg-white rounded-lg">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-gray-600">
                          {departmentToShow?.location?.city}
                        </p>
                        <p className="text-sm text-gray-500">
                          {departmentToShow?.location?.state},{" "}
                          {departmentToShow?.location?.zip}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <Box className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Request Details
                    </h2>
                    <p className="text-sm text-gray-500">
                      Resource request information
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <h3 className="font-medium text-gray-700 mb-3">
                      Resource Information
                    </h3>
                    <div className="space-y-3">
                      <div className="bg-white rounded-md p-3">
                        <p className="text-sm text-gray-500 mb-1">
                          Resource Name
                        </p>
                        <p className="text-gray-900">
                          {request.resource?.name}
                        </p>
                      </div>

                      <div className="bg-white rounded-md p-3">
                        <p className="text-sm text-gray-500 mb-1">Purpose</p>
                        <p className="text-gray-900">{request.purpose}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white rounded-md p-3">
                          <p className="text-sm text-gray-500 mb-1">Quantity</p>
                          <p className="text-gray-900">
                            {request.quantityRequested}
                          </p>
                        </div>

                        <div className="bg-white rounded-md p-3">
                          <p className="text-sm text-gray-500 mb-1">Priority</p>
                          <Badge
                            variant="outline"
                            className={
                              request.priorityLevel === "high"
                                ? "bg-red-50 text-red-700"
                                : request.priorityLevel === "medium"
                                  ? "bg-blue-50 text-blue-700"
                                  : "bg-gray-50 text-gray-700"
                            }
                          >
                            {request.priorityLevel || "Low"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <h3 className="font-medium text-gray-700 mb-3">Timeline</h3>
                    <div className="space-y-3">
                      <div className="bg-white rounded-md p-3">
                        <p className="text-sm text-gray-500 mb-1">
                          Date of Request
                        </p>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <p className="text-gray-900">
                            {formatDate(request.requestedAt)}
                          </p>
                        </div>
                      </div>
                      <div className="bg-white rounded-md p-3">
                        <p className="text-sm text-gray-500 mb-1">Duration</p>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <p className="text-gray-900">
                            {request.expectedDuration
                              ? `${formatDate(request.expectedDuration.start)} - ${formatDate(
                                  request.expectedDuration.end
                                )}`
                              : "Not specified"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {request?.lendingDepartment?._id === currentDepartmentId &&
          request.status === "pending" && (
            <div className="mt-6 flex justify-end gap-3 pt-4 border-t">
              <p className="text-sm text-gray-500 mr-auto">
                Take action on this request
              </p>
              <Button
                variant="outline"
                className="bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800"
                onClick={() => handleAction("rejected")}
              >
                Reject Request
              </Button>
              <Button
                className="bg-green-600 text-white hover:bg-green-700"
                onClick={() => handleAction("approved")}
              >
                Approve Request
              </Button>
            </div>
          )}
      </DialogContent>
    </Dialog>
  );
}
