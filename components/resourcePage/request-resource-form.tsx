import React, { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
// import EditResourceForm from "./edit-resource-form";
import { Resource } from "./edit-resource-form";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { DepartmentContext } from "@/app/(main)/layout";
import { Id } from "@/convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import EditResourceForm from "./edit-resource-form";

interface RequestResourceFormProps {
  resourceId: Id<"resources">;
  userDepartmentId?: string;
  departmentId: string;
}

const formSchema = z.object({
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  startDate: z.date({
    required_error: "Start date is required",
  }),
  endDate: z
    .date({
      required_error: "End date is required",
    })
    .refine((date) => date > new Date(), {
      message: "End date must be in the future",
    }),
  purpose: z.string().min(10, "Purpose must be at least 10 characters"),
  priority: z.enum(["low", "medium", "high"]),
  additionalNotes: z.string().optional(),
});

export default function RequestResourceForm({
  resourceId,
  userDepartmentId,
  departmentId,
}: RequestResourceFormProps) {
  // 1. All hooks at the top
  const router = useRouter();
  const { departmentId: requestingDepartmentId } =
    useContext(DepartmentContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const resource = useQuery(api.resources.getById, { id: resourceId });
  const createRequest = useMutation(api.resourceRequests.create);
  const createResourceChat = useMutation(api.chat.createResourceChat);
  const deleteResource = useMutation(api.resources.remove);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantity: 1,
      purpose: "",
      priority: "medium",
      additionalNotes: "",
    },
  });

  // 2. Functions after hooks
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!resource || !requestingDepartmentId) {
      toast.error("Missing resource or department information");
      return;
    }

    setIsSubmitting(true);

    try {
      const requestId = await createRequest({
        resourceId: resourceId as Id<"resources">,
        requesterDepartmentId: requestingDepartmentId as Id<"departments">,
        ownerDepartmentId: resource.departmentId as Id<"departments">,
        quantity: values.quantity,
        status: "pending",
        priority: values.priority,
        purpose: values.purpose,
        additionalNotes: values.additionalNotes || "",
        startDate: values.startDate.getTime(),
        endDate: values.endDate.getTime(),
      });

      await createResourceChat({
        initiatorDepartmentId: requestingDepartmentId as Id<"departments">,
        recipientDepartmentId: resource.departmentId as Id<"departments">,
        resourceId: resourceId,
      });

      toast.success("Request submitted successfully");
      form.reset();
      router.push("/collaboration");
    } catch (error) {
      toast.error("Failed to submit request. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  // 3. Loading check
  if (!resource || !requestingDepartmentId) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <p>Loading resource information...</p>
      </div>
    );
  }

  // 4. Owner check
  const isOwner = userDepartmentId === departmentId;
  if (isOwner) {
    return (
      <div className="space-y-4 p-6">
        <h3 className="text-lg font-semibold mb-6">Resource Management</h3>
        <Button
          className="w-full bg-blue-600 hover:bg-blue-700"
          onClick={() => setIsEditSheetOpen(true)}
        >
          Edit Resource
        </Button>
        <Button
          variant="destructive"
          className="w-full"
          onClick={async () => {
            try {
              await deleteResource({
                resourceId: resource._id,
              });
              toast.success("Resource deleted successfully");
              router.push("/dashboard");
            } catch (error) {
              toast.error("Failed to delete resource");
              console.error(error);
            }
          }}
        >
          Delete Resource
        </Button>
        <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
          <SheetContent side="right" className="w-[600px] sm:w-[720px]">
            <SheetHeader>
              <SheetTitle>Edit Resource</SheetTitle>
            </SheetHeader>
            <EditResourceForm
              resource={{
                ...resource,
                type: resource.type as Resource["type"],
              }}
              onClose={() => setIsEditSheetOpen(false)}
            />
          </SheetContent>
        </Sheet>
      </div>
    );
  }

  // 5. Main form render
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Request Resource</h2>
      <div className="mb-4 p-3 bg-blue-50 rounded-md">
        <p className="text-sm text-blue-800">
          You are requesting{" "}
          <span className="font-semibold">{resource.name}</span> from{" "}
          {resource.departmentName || "another department"}
        </p>
        <p className="text-xs text-blue-600 mt-1">
          Available quantity:{" "}
          {resource.totalQuantity - resource.allocatedQuantity}
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    max={resource.totalQuantity - resource.allocatedQuantity}
                    {...field}
                  />
                </FormControl>
                <FormDescription>How many units do you need?</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Start Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>End Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date() ||
                          (form.getValues("startDate") &&
                            date < form.getValues("startDate"))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="purpose"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Purpose</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Explain why you need this resource..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
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
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="additionalNotes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Notes (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Any additional information..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Request"
            )}
          </Button>
        </form>
      </Form>
      ;
    </div>
  );
}
