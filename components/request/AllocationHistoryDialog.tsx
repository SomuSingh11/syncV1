import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "../ui/button";

interface AllocationHistoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  departmentId: Id<"departments">;
}

const AllocationTable = ({
  allocations,
  type,
}: {
  allocations: any[];
  type: "borrowed" | "lent";
}) => {
  const returnResource = useMutation(api.resourceAllocation.returnResource);
  const formatDate = (timestamp: number) => {
    return format(new Date(timestamp), "MMM dd, yyyy");
  };

  const handleReturn = async (allocation: any) => {
    try {
      await returnResource({
        allocationId: allocation.allocationId,
        resourceId: allocation.resourceId,
        quantityReturned: allocation.quantityAllocated,
      });
      toast.success("Resource returned successfully");
    } catch (error) {
      toast.error("Failed to return resource");
      console.error("Failed to return resource:", error);
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-gray-50">
          <TableHead>Resource</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>
            {type === "borrowed" ? "Lending" : "Borrowing"} Department
          </TableHead>
          <TableHead>Start Date</TableHead>
          <TableHead>End Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Return Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {allocations.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-8 text-gray-500">
              No {type} resources found
            </TableCell>
          </TableRow>
        ) : (
          allocations.map((allocation) => (
            <TableRow key={allocation._id}>
              <TableCell className="font-medium">
                {allocation.resource?.name || "Unknown Resource"}
              </TableCell>
              <TableCell>{allocation.quantityAllocated}</TableCell>
              <TableCell>
                {type === "borrowed"
                  ? allocation.lendingDepartment?.name
                  : allocation.borrowingDepartment?.name || "Unknown"}
              </TableCell>
              <TableCell>{formatDate(allocation.startDate)}</TableCell>
              <TableCell>{formatDate(allocation.endDate)}</TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={
                    allocation.status === "active"
                      ? "bg-green-50 text-green-700"
                      : "bg-gray-50 text-gray-700"
                  }
                >
                  {allocation.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={
                    allocation.returnStatus === "returned"
                      ? "bg-blue-50 text-blue-700"
                      : "bg-yellow-50 text-yellow-700"
                  }
                >
                  {allocation.returnStatus || "Not Returned"}
                </Badge>
              </TableCell>
              <TableCell>
                {type === "borrowed" &&
                  allocation.status === "active" &&
                  allocation.returnStatus !== "returned" && (
                    <Button
                      onClick={() => handleReturn(allocation)}
                      variant="outline"
                      size="sm"
                      className="bg-blue-50 text-blue-700 hover:bg-blue-100"
                    >
                      Return Resource
                    </Button>
                  )}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export function AllocationHistoryDialog({
  isOpen,
  onClose,
  departmentId,
}: AllocationHistoryDialogProps) {
  const borrowedResources = useQuery(
    api.resourceAllocation.getBorrowedResources,
    {
      departmentId: departmentId,
    }
  );

  const lentResources = useQuery(api.resourceAllocation.getLentResources, {
    departmentId: departmentId,
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[90%] lg:max-w-[85%] xl:max-w-[80%] 2xl:max-w-[75%]">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="text-2xl">
            Resource Allocation History
          </DialogTitle>
          <p className="text-sm text-gray-500">
            Track all resource allocations
          </p>
        </DialogHeader>

        <div className="mt-6">
          <Tabs defaultValue="borrowed" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="borrowed">Borrowed Resources</TabsTrigger>
              <TabsTrigger value="lent">Lent Resources</TabsTrigger>
            </TabsList>

            <TabsContent value="borrowed">
              {!borrowedResources ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin mr-2" />
                  <p>Loading borrowed resources...</p>
                </div>
              ) : (
                <AllocationTable
                  allocations={borrowedResources}
                  type="borrowed"
                />
              )}
            </TabsContent>

            <TabsContent value="lent">
              {!lentResources ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin mr-2" />
                  <p>Loading lent resources...</p>
                </div>
              ) : (
                <AllocationTable allocations={lentResources} type="lent" />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
