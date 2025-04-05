import { Id } from "@/convex/_generated/dataModel";
import { Doc } from "@/convex/_generated/dataModel";

export interface ContactUser {
  firstName: string;
  lastName: string;
  _id: Id<"users">;
}

export interface DepartmentWithContact {
  _id: Id<"departments">;
  _creationTime: number;
  name: string;
  description?: string;
  email?: string;
  pointOfContact?: string;
  departmentType?: string;
  parentDepartmentId?: string;
  location?: {
    latitude?: string;
    longitude?: string;
    city: string;
    state: string;
    zip: string;
  };
  contactUser?: ContactUser;
  createdAt: number;
}

export interface Resource {
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
}

export interface RequestWithDetails extends Doc<"resourceRequests"> {
  resourceRequestId: string;
  resourceId: Id<"resources">;
  requestingDepartmentId: Id<"departments">;
  lendingDepartmentId: Id<"departments">;
  resource?: Resource | null;
  requesterDepartment?: DepartmentWithContact | null;
  lendingDepartment?: DepartmentWithContact | null;
  quantityRequested: number;
  expectedDuration?: {
    start: number;
    end: number;
  };
  priorityLevel?: string;
  status: string;
  requestedAt: number;
  description?: string;
  purpose?: string;
  expiresAt: number;
}
