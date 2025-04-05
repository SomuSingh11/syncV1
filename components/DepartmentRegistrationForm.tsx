"use client";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
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
import Image from "next/image";

interface DepartmentRegistrationFormProps {
  userId: string;
  onComplete: () => void;
}

// Define form validation schema based on your Convex schema
const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Department name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  description: z.string().optional(),
  departmentType: z.string().optional(),
  location: z
    .object({
      city: z.string().min(1, { message: "City is required" }),
      state: z.string().min(1, { message: "State is required" }),
      zip: z.string().min(1, { message: "Zip code is required" }),
    })
    .optional(),
});

export default function DepartmentRegistrationForm({
  userId,
  onComplete,
}: DepartmentRegistrationFormProps) {
  const [loading, setLoading] = useState(false);

  const createDepartment = useMutation(api.departments.createDepartment);
  const assignUserToDepartment = useMutation(api.users.assignUserToDepartment);

  // Initialize form with react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      description: "",
      departmentType: "",
      location: {
        city: "",
        state: "",
        zip: "",
      },
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);

    try {
      // Create a new department
      const departmentResult = await createDepartment({
        name: values.name,
        email: values.email,
        description: values.description,
        pointOfContact: userId,
        departmentType: values.departmentType,
        location: values.location,
      });

      // Assign user to the department
      await assignUserToDepartment({
        userId,
        departmentId: departmentResult.id,
        departmentName: values.name,
        role: "admin", // Make the creator an admin
      });

      onComplete();
    } catch (error) {
      console.error("Error creating department:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 flex p-10 rounded-lg shadow-xl mx-auto">
        <div className="flex items-center justify-between">
          <Image
            src={"/assets/departmentRegistration.gif"}
            alt="Registration GIF"
            height={600}
            width={600}
          />
        </div>

        <div className="pl-10">
          <h2 className="text-3xl font-bold mb-3 text-gray-900 dark:text-white">
            Department Registration
          </h2>
          <p className="mb-8 text-gray-600 dark:text-gray-400 text-base">
            You need to register a department to continue using the application.
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Department Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter department name"
                        className="focus-visible:ring-blue-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Department Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="department@example.com"
                        className="focus-visible:ring-blue-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the department's purpose"
                        className="resize-none focus-visible:ring-blue-500 min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="departmentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Department Type
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Engineering, Marketing, etc."
                        className="focus-visible:ring-blue-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <div className="space-y-4 pt-2">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  Location (Optional)
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="location.city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium">
                          City
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="City"
                            className="focus-visible:ring-blue-500"
                            {...field}
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
                        <FormLabel className="text-xs font-medium">
                          State
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="State"
                            className="focus-visible:ring-blue-500"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="location.zip"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium">
                        Zip Code
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Zip Code"
                          className="focus-visible:ring-blue-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                className="w-full mt-8 py-6 text-lg bg-blue-600 hover:bg-blue-700 text-white"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating...
                  </span>
                ) : (
                  "Create Department"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
