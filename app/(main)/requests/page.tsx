"use client";
import React, { useContext, useCallback } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { DepartmentContext } from "@/app/(main)/layout";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { RequestDialog } from "@/components/request/RequestDialog";
import { AllocationHistoryDialog } from "@/components/request/AllocationHistoryDialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Filter, Clock } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { DepartmentWithContact, RequestWithDetails } from "@/types/requests";

function RequestPage() {
  const router = useRouter();
  const { departmentId } = useContext(DepartmentContext);
  const [filter, setFilter] = React.useState<"all" | "sent" | "received">(
    "all"
  );
  const [showAllocationHistory, setShowAllocationHistory] =
    React.useState(false);
  const [selectedRequest, setSelectedRequest] =
    React.useState<RequestWithDetails | null>(null);
  const updateRequestStatus = useMutation(api.resourceRequests.updateStatus);
  const [statusFilter, setStatusFilter] = React.useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");

  const handleStatusUpdate = async (
    requestId: Id<"resourceRequests">,
    newStatus: "approved" | "rejected"
  ) => {
    try {
      await updateRequestStatus({
        id: requestId,
        status: newStatus,
      });
      setSelectedRequest(null);
    } catch (error) {
      console.error("Failed to update request status:", error);
    }
  };

  const requests = useQuery(
    api.resourceRequests.getDetailedRequests,
    departmentId ? { departmentId: departmentId as Id<"departments"> } : "skip"
  );

  const filteredRequests = React.useMemo(() => {
    if (!requests) return [];
    return requests.filter((request) => {
      const typeMatch =
        filter === "all"
          ? true
          : filter === "sent"
            ? request.requesterDepartment?._id === departmentId
            : request.lendingDepartment?._id === departmentId;

      const statusMatch =
        statusFilter === "all" ? true : request.status === statusFilter;

      return typeMatch && statusMatch;
    });
  }, [requests, filter, statusFilter, departmentId]);

  const getStatusBadge = useCallback((status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-100 text-yellow-800 border-yellow-300"
          >
            Pending
          </Badge>
        );
      case "approved":
        return (
          <Badge
            variant="outline"
            className="bg-green-100 text-green-800 border-green-300"
          >
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge
            variant="outline"
            className="bg-red-100 text-red-800 border-red-300"
          >
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  }, []);

  const formatDate = useCallback((timestamp: number) => {
    return format(new Date(timestamp), "MMM dd, yyyy");
  }, []);

  if (!departmentId) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">
          Department information not available
        </p>
      </div>
    );
  }

  if (!requests) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        <p>Loading requests...</p>
      </div>
    );
  }

  const handleRequestClick = (request: RequestWithDetails) => {
    setSelectedRequest(request);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Resource Requests</h1>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            className="bg-blue-50 text-blue-700 hover:bg-blue-100 flex items-center gap-2"
            onClick={() => setShowAllocationHistory(true)}
          >
            <Clock className="h-4 w-4" />
            Allocation History
          </Button>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Filter className="h-4 w-4" />
            <span>Total: {filteredRequests.length}</span>
          </div>
        </div>
      </div>
      <div className="mb-6 space-y-4 bg-gray-50 p-4 rounded-lg">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 min-w-[60px]">
              Type:
            </span>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant={filter === "all" ? "default" : "outline"}
                onClick={() => setFilter("all")}
                className="h-8"
              >
                All
              </Button>
              <Button
                size="sm"
                variant={filter === "sent" ? "default" : "outline"}
                onClick={() => setFilter("sent")}
                className="h-8"
              >
                Sent
              </Button>
              <Button
                size="sm"
                variant={filter === "received" ? "default" : "outline"}
                onClick={() => setFilter("received")}
                className="h-8"
              >
                Received
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 min-w-[60px]">
              Status:
            </span>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant={statusFilter === "all" ? "default" : "outline"}
                onClick={() => setStatusFilter("all")}
                className="h-8"
              >
                All
              </Button>
              <Button
                size="sm"
                variant={statusFilter === "pending" ? "default" : "outline"}
                onClick={() => setStatusFilter("pending")}
                className={`h-8 ${
                  statusFilter === "pending"
                    ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                    : "hover:bg-yellow-50 hover:text-yellow-800"
                }`}
              >
                Pending
              </Button>
              <Button
                size="sm"
                variant={statusFilter === "approved" ? "default" : "outline"}
                onClick={() => setStatusFilter("approved")}
                className={`h-8 ${
                  statusFilter === "approved"
                    ? "bg-green-100 text-green-800 hover:bg-green-200"
                    : "hover:bg-green-50 hover:text-green-800"
                }`}
              >
                Approved
              </Button>
              <Button
                size="sm"
                variant={statusFilter === "rejected" ? "default" : "outline"}
                onClick={() => setStatusFilter("rejected")}
                className={`h-8 ${
                  statusFilter === "rejected"
                    ? "bg-red-100 text-red-800 hover:bg-red-200"
                    : "hover:bg-red-50 hover:text-red-800"
                }`}
              >
                Rejected
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Resource</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>From Department</TableHead>
              <TableHead>To Department</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Requested</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequests.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-8 text-gray-500"
                >
                  No requests found
                </TableCell>
              </TableRow>
            ) : (
              filteredRequests.map((request) => (
                <TableRow
                  key={request._id}
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => handleRequestClick(request)}
                >
                  <TableCell className="font-medium">
                    {request.resource?.name || "Unknown Resource"}
                  </TableCell>
                  <TableCell>{request.quantityRequested}</TableCell>
                  <TableCell>
                    {request.requesterDepartment?.name || "Unknown"}
                  </TableCell>
                  <TableCell>
                    {request.lendingDepartment?.name || "Unknown"}
                  </TableCell>
                  <TableCell>
                    {request.expectedDuration ? (
                      <>
                        {formatDate(request.expectedDuration.start)} -{" "}
                        {formatDate(request.expectedDuration.end)}
                      </>
                    ) : (
                      "Not specified"
                    )}
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell>{formatDate(request.requestedAt)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <RequestDialog
        request={selectedRequest}
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        onStatusUpdate={handleStatusUpdate}
        currentDepartmentId={departmentId as Id<"departments">}
      />
      <AllocationHistoryDialog
        isOpen={showAllocationHistory}
        onClose={() => setShowAllocationHistory(false)}
        departmentId={departmentId as Id<"departments">}
      />
    </div>
  );
}

export default RequestPage;
