"use client";
import Sidebar from "@/components/Sidebar";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
// import DepartmentRegistrationForm from "@/components/DepartmentRegistrationForm";
import { Loader2 } from "lucide-react";
import Navigation from "@/components/dashboard/navigation";

// Create a context to share department data
import { createContext } from "react";

import DialogFlowMessenger from "@/components/chat/DialogFlowMessenger";
import DepartmentRegistrationForm from "@/components/DepartmentRegistrationForm";

// Define the context type
export const DepartmentContext = createContext<{
  departmentId: string | null;
  departmentName: string | null;
  userRole: string | null;
}>({
  departmentId: null,
  departmentName: null,
  userRole: null,
});

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoaded } = useUser();
  const [showDepartmentForm, setShowDepartmentForm] = useState(false);

  const syncUser = useMutation(api.users.syncUser);
  const userDepartmentStatus = useQuery(
    api.users.getUserDepartmentStatus,
    user?.id ? { userId: user.id } : "skip"
  );

  // Get department where user is point of contact
  const departmentAsContact = useQuery(
    api.departments.getDepartmentsByPointOfContact,
    user?.id ? { userId: user.id } : "skip"
  );

  // Initial loading state while waiting for query
  const isInitialLoading = user && userDepartmentStatus === undefined;

  // Extract department ID from the query results
  const departmentId =
    departmentAsContact && departmentAsContact.length > 0
      ? departmentAsContact[0]._id
      : null;

  useEffect(() => {
    if (isLoaded && user) {
      // Sync user data with Convex
      syncUser({
        userId: user.id,
        email: user.primaryEmailAddress?.emailAddress || "",
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
      });
    }
  }, [isLoaded, user, syncUser]);

  useEffect(() => {
    if (userDepartmentStatus && !userDepartmentStatus.isPointOfContact) {
      setShowDepartmentForm(true);
    } else if (userDepartmentStatus?.isPointOfContact) {
      setShowDepartmentForm(false);
    }
  }, [userDepartmentStatus]);

  return (
    <DepartmentContext.Provider
      value={{
        departmentId: departmentId,
        departmentName: userDepartmentStatus?.departmentName || null,
        userRole: userDepartmentStatus?.role || null,
      }}
    >
      <div className="min-h-screen flex">
        <div className="min-h-screen fixed">
          <Sidebar />
        </div>
        <div className="flex-grow flex flex-col">
          <main className="flex-grow bg-gray-400/10 ml-80">
            <div className="p-6 ">
              {departmentId ? (
                <Navigation
                  userData={{
                    fullName: user
                      ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
                      : undefined,
                    imageUrl: user?.imageUrl,
                    emailAddresses: user?.emailAddresses,
                  }}
                  departmentId={departmentId}
                />
              ) : (
                <div className="flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                </div>
              )}
            </div>
            {isInitialLoading ? (
              <div className="h-full w-full flex flex-col items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
                <h3 className="text-xl font-medium">
                  Checking your account...
                </h3>
                <p className="text-gray-500 mt-2">
                  This will only take a moment
                </p>
              </div>
            ) : showDepartmentForm &&
              !userDepartmentStatus?.isPointOfContact ? (
              <DepartmentRegistrationForm
                userId={user?.id || ""}
                onComplete={() => setShowDepartmentForm(false)}
              />
            ) : (
              <>
                {children}
                <DialogFlowMessenger />
              </>
            )}
          </main>
        </div>
      </div>
    </DepartmentContext.Provider>
  );
}
