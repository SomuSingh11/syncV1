import { useState } from "react";
import { Bell, Calendar, Building2, Clock } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Id } from "@/convex/_generated/dataModel";

interface Request {
  _id: Id<"resourceRequests">;
  status: string;
  resource: {
    _id: Id<"resources">;
    _creationTime: number;
    name: string;
    description?: string;
    location?: {
      latitude?: string;
      longitude?: string;
      city: string;
      state: string;
      zip: string;
    };
    isGlobal: boolean;
  } | null;
  requesterDepartment: {
    _id: Id<"departments">;
    name: string;
    description?: string;
    email?: string;
    pointOfContact?: string;
    location?: {
      city: string;
      state: string;
      zip: string;
    };
  } | null;
  lendingDepartment: {
    _id: Id<"departments">;
    name: string;
  } | null;
  quantityRequested: number;
  purpose?: string;
  expectedDuration?: {
    start: number;
    end: number;
  };
  requestedAt: number;
  priorityLevel: string | undefined;
  expiresAt: number;
  resourceRequestId?: string;
}

interface RequestNotificationsProps {
  departmentId: Id<"departments">;
  onRequestClick: (request: Request) => void;
}

export function RequestNotifications({
  departmentId,
  onRequestClick,
}: RequestNotificationsProps) {
  const [open, setOpen] = useState(false);
  const pendingRequests = useQuery(
    api.resourceRequests.getDetailedRequests,
    departmentId ? { departmentId } : "skip"
  );

  const filteredRequests =
    pendingRequests?.filter(
      (req) =>
        req.status === "pending" && req.lendingDepartment?._id === departmentId
    ) || [];

  const handleRequestClick = (request: Request) => {
    onRequestClick(request);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="relative h-10 w-10 rounded-xl bg-red-100 hover:bg-red-200 hover:cursor-pointer flex items-center justify-center transition-all duration-200 shadow-sm">
          <Bell className="h-5 w-5 text-red-600" />
          {filteredRequests.length > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-[11px] font-medium text-white rounded-full flex items-center justify-center animate-pulse">
              {filteredRequests.length}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[400px] p-0 rounded-xl shadow-lg"
        align="end"
      >
        <div className="p-4 border-b bg-gradient-to-r from-green-50 to-green-100">
          <h3 className="font-semibold text-lg text-gray-800">
            Resource Requests
          </h3>
          <p className="text-sm text-gray-500">
            Pending requests that need your attention
          </p>
        </div>
        <div className="max-h-[450px] overflow-y-auto">
          {filteredRequests.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">No pending requests</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredRequests.map((request) => (
                <div
                  key={request._id}
                  onClick={() => handleRequestClick(request )}
                  className="p-4 hover:bg-gray-50 transition-colors duration-200 cursor-pointer group"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-base text-gray-900 group-hover:text-blue-600 transition-colors">
                          {request.resource?.name}
                        </h4>
                        <Badge
                          variant="outline"
                          className={`ml-2 px-3 py-1 rounded-full font-medium transition-all ${
                            request.priorityLevel === "high"
                              ? "bg-red-50 text-red-700 border-red-200 group-hover:bg-red-100"
                              : request.priorityLevel === "medium"
                                ? "bg-blue-50 text-blue-700 border-blue-200 group-hover:bg-blue-100"
                                : "bg-gray-50 text-gray-700 border-gray-200 group-hover:bg-gray-100"
                          }`}
                        >
                          {request.priorityLevel || "Low"}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <Building2 className="h-4 w-4 mr-2 text-gray-400" />
                          {request.requesterDepartment?.name}
                        </div>
                        {request.expectedDuration && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                            {format(
                              new Date(request.expectedDuration.start),
                              "MMM dd"
                            )}{" "}
                            -{" "}
                            {format(
                              new Date(request.expectedDuration.end),
                              "MMM dd, yyyy"
                            )}
                          </div>
                        )}
                        <div className="flex items-center text-xs text-gray-400">
                          <Clock className="h-3 w-3 mr-2" />
                          Requested on{" "}
                          {format(
                            new Date(request.requestedAt),
                            "MMM dd, yyyy"
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
