import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";

export const RESOURCE_TYPES = [
  "Equipment",
  "Vehicle",
  "Space",
  "Tool",
  "Technology",
  "Furniture",
  "Other",
] as const;

const editFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(RESOURCE_TYPES, {
    required_error: "Please select a resource type",
  }),
  totalQuantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  allocatedQuantity: z.coerce.number().min(0),
  status: z.string(),
  isGlobal: z.boolean(),
  description: z.string().optional(),
  price: z.coerce.number().optional(),
  location: z
    .object({
      city: z.string(),
      state: z.string(),
      zip: z.string(),
    })
    .optional(),
  categories: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});

export interface Resource {
  _id: Id<"resources">;
  name: string;
  type: (typeof RESOURCE_TYPES)[number];
  totalQuantity: number;
  allocatedQuantity: number;
  status: string;
  isGlobal: boolean;
  description?: string;
  price?: number;
  location?: {
    city: string;
    state: string;
    zip: string;
  };
  categories?: string[];
  tags?: string[];
}


interface EditResourceFormProps {
  resource: Resource;
  onClose: () => void;
}

export default function EditResourceForm({
  resource,
  onClose,
}: EditResourceFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const updateResource = useMutation(api.resources.update);

  const form = useForm<z.infer<typeof editFormSchema>>({
    resolver: zodResolver(editFormSchema),
    defaultValues: {
      name: resource?.name || "",
      type: resource?.type || "",
      totalQuantity: resource?.totalQuantity || 0,
      allocatedQuantity: resource?.allocatedQuantity || 0,
      status: resource?.status || "active",
      isGlobal: resource?.isGlobal || false,
      description: resource?.description || "",
      price: resource?.price || 0,
      location: resource?.location || { city: "", state: "", zip: "" },
      categories: resource?.categories || [],
      tags: resource?.tags || [],
    },
  });

  async function onSubmit(values: z.infer<typeof editFormSchema>) {
    setIsSubmitting(true);
    try {
      // Calculate available quantity and determine status
      const availableQuantity = values.totalQuantity - values.allocatedQuantity;
      const newStatus = availableQuantity <= 0 ? "unavailable" : "available";

      await updateResource({
        id: resource._id,
        ...values,
        status: newStatus,
      });

      toast.success("Resource updated successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to update resource");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="py-4 px-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Name</FormLabel>
                  <FormControl>
                    <Input className="h-11" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select resource type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {RESOURCE_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="totalQuantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Total Quantity</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} className="h-11" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="allocatedQuantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">
                    Allocated Quantity
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      max={form.getValues("totalQuantity")}
                      className="h-11"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Available: {form.getValues("totalQuantity") - field.value}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Price (Optional)</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} className="h-11" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Resource description..."
                    className="resize-none min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isGlobal"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    Globally Available
                  </FormLabel>
                  <FormDescription>
                    Make this resource available to all departments
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full h-11 text-base font-medium"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Resource"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
