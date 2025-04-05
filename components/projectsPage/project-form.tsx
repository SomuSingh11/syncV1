'use client';
import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useUser } from '@clerk/nextjs';

const LocationPicker = dynamic(() => import('../maps/location-picker.js'), {
  ssr: false,
});

const formSchema = z.object({
  name: z.string().min(3, 'Project name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  startDate: z.date({
    required_error: 'Start date is required',
  }),
  endDate: z
    .date({
      required_error: 'End date is required',
    })
    .refine(date => date > new Date(), {
      message: 'End date must be in the future',
    }),
  location: z.object({
    type: z.string(),
    coordinates: z.array(z.number()),
    radius: z.number().optional(),
  }),
  budget: z.number().min(0).optional(),
  priority: z.enum(['low', 'medium', 'high']),
  resourcesRequired: z.array(z.string()).optional(),
});

export default function ProjectForm() {
  const { user } = useUser();
  const userDepartmentStatus = useQuery(api.users.getUserDepartmentStatus, {
    userId: user?.id || '',
  });
  const departmentId = userDepartmentStatus?.departmentId || '';

  const createProject = useMutation(api.projects.create);
  const [location, setLocation] = useState({
    type: 'Point',
    coordinates: [79.09134, 23.971],
    radius: 1000,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      priority: 'medium',
      location,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!departmentId) {
      toast.error('Department information not available');
      return;
    }

    try {
      await createProject({
        ...values,
        departmentId,
        startDate: values.startDate.getTime(),
        endDate: values.endDate.getTime(),
        location: {
          ...values.location,
          radius: values.location.radius || 1000,
        },
      });

      toast.success('Project created successfully');
      form.reset();
    } catch (error) {
      toast.error('Failed to create project');
      console.error(error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Create New Project</h2>
        <p className="text-sm text-gray-500 mt-1">Fill in the project details below</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Project Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter project name"
                      className="bg-gray-50 border-gray-200 focus:bg-white"
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
                  <FormLabel className="text-gray-700">Priority</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-gray-50 border-gray-200">
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
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe the project..."
                    className="resize-none bg-gray-50 border-gray-200 focus:bg-white min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-gray-700">Start Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={`w-full pl-3 text-left font-normal bg-gray-50 border-gray-200 ${!field.value && 'text-muted-foreground'}`}
                        >
                          {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={date => date < new Date()}
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
                  <FormLabel className="text-gray-700">End Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={`w-full pl-3 text-left font-normal bg-gray-50 border-gray-200 ${!field.value && 'text-muted-foreground'}`}
                        >
                          {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={date =>
                          date < new Date() ||
                          (form.getValues('startDate') && date < form.getValues('startDate'))
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
            name="budget"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">Budget (Optional)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter budget amount"
                    className="bg-gray-50 border-gray-200 focus:bg-white"
                    {...field}
                    onChange={e => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">Project Location</FormLabel>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormItem>
                      <FormLabel className="text-gray-600">Longitude</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.000001"
                          className="bg-gray-50 border-gray-200 focus:bg-white"
                          value={field.value.coordinates[0]}
                          onChange={e => {
                            const newLocation = {
                              ...field.value,
                              coordinates: [Number(e.target.value), field.value.coordinates[1]],
                            };
                            field.onChange(newLocation);
                            setLocation(newLocation as any);
                          }}
                        />
                      </FormControl>
                    </FormItem>
                    <FormItem>
                      <FormLabel className="text-gray-600">Latitude</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.000001"
                          className="bg-gray-50 border-gray-200 focus:bg-white"
                          value={field.value.coordinates[1]}
                          onChange={e => {
                            const newLocation = {
                              ...field.value,
                              coordinates: [field.value.coordinates[0], Number(e.target.value)],
                            };
                            field.onChange(newLocation);
                            setLocation(newLocation as any);
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  </div>
                  <FormControl>
                    <div className="h-[400px] rounded-xl border border-gray-200 overflow-hidden">
                      <LocationPicker
                        value={field.value}
                        onChange={(newLocation : any) => {
                          field.onChange(newLocation);
                          setLocation({
                            type: newLocation.type,
                            coordinates: newLocation.coordinates,
                            radius: newLocation.radius || 1000,
                          });
                        }}
                      />
                    </div>
                  </FormControl>
                </div>
                <FormDescription className="text-gray-500">
                  Click on the map or enter coordinates manually to set project location
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location.radius"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">Project Radius (meters)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    className="bg-gray-50 border-gray-200 focus:bg-white"
                    {...field}
                    onChange={e => field.onChange(Number(e.target.value))}
                    min={100}
                    max={10000}
                    step={100}
                  />
                </FormControl>
                <FormDescription className="text-gray-500">
                  Set the project area radius (100m - 10km)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="pt-4">
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white"
            >
              {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Project
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
