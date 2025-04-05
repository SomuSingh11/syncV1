"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";

// Update the form schema to include lat and lng
const formSchema = z.object({
  name: z.string().min(2, "Resource name must be at least 2 characters"),
  type: z.string().min(2, "Resource type must be at least 2 characters"),
  totalQuantity: z.number().min(1, "Quantity must be at least 1"),
  allocatedQuantity: z.number().default(0),
  status: z.enum([
    "active",
    "inactive",
    "maintenance",
    "shared",
    "outofservice",
  ]),
  isGlobal: z.boolean().default(false),
  description: z.string().min(10, "Description must be at least 10 characters"),
  image: z.string().optional(),
  price: z.number().optional(),
  departmentName: z.string().optional(), // Added departmentName field
  location: z.object({
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    zip: z.string().min(5, "ZIP code is required"),
    latitude: z.string().optional(),
    longitude: z.string().optional(),
  }),
});

interface ResourceFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ResourceForm({ isOpen, onClose }: ResourceFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { user } = useUser();
  const router = useRouter();

  // Get the user's department information
  const userDepartmentStatus = useQuery(api.users.getUserDepartmentStatus, {
    userId: user?.id || "",
  });

  const createResource = useMutation(api.resources.create);

  // Update the defaultValues in useForm
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      name: "",
      type: "",
      totalQuantity: 1,
      allocatedQuantity: 0,
      status: "active",
      isGlobal: false,
      description: "",
      image: "",
      price: undefined,
      departmentName: "", // Always start with an empty string
      location: {
        city: "",
        state: "",
        zip: "",
        latitude: undefined,
        longitude: undefined,
      },
    },
  });

  // Add this effect to update the form when userDepartmentStatus changes
  useEffect(() => {
    if (userDepartmentStatus?.departmentName) {
      form.setValue("departmentName", userDepartmentStatus.departmentName);
    }
  }, [userDepartmentStatus?.departmentName, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (
      !userDepartmentStatus ||
      !userDepartmentStatus.exists ||
      !userDepartmentStatus.departmentId
    ) {
      console.error("No department ID found for current user");
      return;
    }

    try {
      // Use the departmentId directly from userDepartmentStatus
      const departmentId = userDepartmentStatus.departmentId;
      const departmentName =
        values.departmentName ||
        userDepartmentStatus.departmentName ||
        "Unknown Department";

      await createResource({
        departmentId,
        departmentName,
        name: values.name,
        type: values.type,
        totalQuantity: parseFloat(values.totalQuantity.toString()), // Convert to float
        allocatedQuantity: parseFloat(values.allocatedQuantity.toString()), // Convert to float
        status: values.status,
        isGlobal: values.isGlobal,
        description: values.description,
        image: imagePreview || "",
        price: values.price ? parseFloat(values.price.toString()) : undefined, // Convert to float if exists
        location: values.location,
        categories: [],
        tags: [],
      });

      onClose();
      form.reset();
      setImagePreview(null);
    } catch (error) {
      console.error("Failed to create resource:", error);
    }
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-40"
          onClick={onClose}
        ></div>
      )}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: isOpen ? 0 : "100%" }}
        transition={{ type: "tween", duration: 0.3 }}
        className="fixed top-0 right-0 w-[720px] h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-white shadow-lg flex flex-col z-50"
      >
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Add Resource</h2>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col h-[calc(100vh-64px)]"
          >
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 custom-scrollbar">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Resource Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter resource name"
                        {...field}
                        className="bg-white/70 backdrop-blur-sm rounded-lg h-9"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="departmentName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Department Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Department name"
                        {...field}
                        // Fix: Always provide a string value, never undefined
                        value={
                          field.value ||
                          userDepartmentStatus?.departmentName ||
                          ""
                        }
                        disabled={true}
                        className="bg-white/70 backdrop-blur-sm rounded-lg h-9"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Resource Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-white/70 backdrop-blur-sm rounded-lg h-9">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Equipment">Equipment</SelectItem>
                        <SelectItem value="Vehicle">Vehicle</SelectItem>
                        <SelectItem value="Staff">Staff</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="totalQuantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Total Quantity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                          className="bg-white/70 backdrop-blur-sm rounded-lg h-9"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="allocatedQuantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">
                        Allocated Quantity
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                          className="bg-white/70 backdrop-blur-sm rounded-lg h-9"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-white/70 backdrop-blur-sm rounded-lg h-9">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="shared">Shared</SelectItem>
                        <SelectItem value="outofservice">
                          Out of Service
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="image"
                render={({ field: { onChange, value, ...field } }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Resource Image</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-4">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              onChange(file);
                              setImagePreview(URL.createObjectURL(file));
                            }
                          }}
                          className="bg-white/70 backdrop-blur-sm rounded-lg h-9 file:bg-transparent file:border-0 file:text-sm file:font-medium"
                        />
                        {imagePreview ? (
                          <div className="relative h-20 w-20 rounded-md border overflow-hidden">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="flex h-20 w-20 items-center justify-center rounded-md border bg-white/70">
                            <ImageIcon className="h-10 w-10 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter price"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? Number(e.target.value) : undefined
                          )
                        }
                        className="bg-white/70 backdrop-blur-sm rounded-lg h-9"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="location.city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">City</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter city"
                          {...field}
                          className="bg-white/70 backdrop-blur-sm rounded-lg h-9"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location.state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">State</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter state"
                          {...field}
                          className="bg-white/70 backdrop-blur-sm rounded-lg h-9"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location.zip"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">ZIP Code</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter ZIP code"
                          {...field}
                          className="bg-white/70 backdrop-blur-sm rounded-lg h-9"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location.latitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Latitude</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter lat coordinate"
                          {...field}
                          className="bg-white/70 backdrop-blur-sm rounded-lg h-9"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location.longitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Longitude</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter lng coordinate"
                          {...field}
                          className="bg-white/70 backdrop-blur-sm rounded-lg h-9"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="isGlobal"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel className="text-sm">Global Resource</FormLabel>
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

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter resource description"
                        {...field}
                        className="bg-white/70 backdrop-blur-sm rounded-lg min-h-[60px] resize-none"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <div className="p-4 border-t bg-white/50 backdrop-blur-sm">
              <div className="flex justify-between gap-3">
                <Button
                  type="button"
                  onClick={onClose}
                  variant="outline"
                  className="rounded-lg h-9"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white rounded-lg h-9"
                >
                  Add Resource
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </motion.div>
    </>
  );
}
