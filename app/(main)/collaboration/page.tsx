"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import ResourceChatInterface from '@/components/chat/ResourceChatInterface';
import { Id } from "@/convex/_generated/dataModel";
import ConflictChatInterface from "@/components/chat/ConflictChatInterface";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { MessageSquare, Share2 } from "lucide-react";
import { useState } from "react";

function CollaborationPage() {
  const { user } = useUser();
  const [chatType, setChatType] = useState<"resource" | "conflict">("resource");

  const userDepartment = useQuery(api.users.getUserDepartmentStatus, {
    userId: user?.id || "",
  });

  const resourceDepartments = useQuery(api.departments.getResourceSharingDepartments, {
    departmentId: userDepartment?.departmentId as Id<"departments">,
  });

  const conflictDepartments = useQuery(api.projectConflictChat.getConflictingDepartments, {
    currentDepartmentId: userDepartment?.departmentId as Id<"departments">,
  });
  console.log(conflictDepartments);
  console.log(userDepartment);

  if (!userDepartment || !user) {
    return <ResourceChatInterface 
      title="Resource Sharing"
      departments={undefined}
      currentDepartmentId={userDepartment?.departmentId as Id<"departments">}
      chatType="resource_sharing"
      isLoading={true}
    />;
  }

  return (
    <div className="space-y-4">
      <div className=" absolute top-6 right-100">
        <div className="flex items-center space-x-4 bg-white/50 backdrop-blur-sm p-2.5 rounded-lg border shadow-sm">
          <div className={`flex items-center gap-2 ${chatType === "resource" ? "text-blue-600" : "text-gray-500"}`}>
            <Share2 className="h-5 w-5" />
            <Label htmlFor="chat-mode" className="font-medium cursor-pointer">
              Resources
            </Label>
          </div>
          
          <Switch
            id="chat-mode"
            checked={chatType === "conflict"}
            onCheckedChange={(checked) => setChatType(checked ? "conflict" : "resource")}
            className="data-[state=checked]:bg-blue-600"
          />
          
          <div className={`flex items-center gap-2 ${chatType === "conflict" ? "text-blue-600" : "text-gray-500"}`}>
            <MessageSquare className="h-5 w-5" />
            <Label htmlFor="chat-mode" className="font-medium cursor-pointer">
              Conflicts
            </Label>
          </div>
        </div>
      </div>

      {chatType === "resource" ? (
        <ResourceChatInterface 
          title="Resource Sharing"
          departments={resourceDepartments}
          currentDepartmentId={userDepartment.departmentId as Id<"departments">}
          chatType="resource_sharing"
        />
      ) : (
        <ConflictChatInterface 
          title="Project Conflicts"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          departments={conflictDepartments as any[]}
          currentDepartmentId={userDepartment.departmentId as Id<"departments">}
        />
      )}
    </div>
  );
}

export default CollaborationPage;