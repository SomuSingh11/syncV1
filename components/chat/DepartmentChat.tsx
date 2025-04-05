"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery} from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import { Loader2} from "lucide-react";

interface DepartmentChatProps {
  departmentId: Id<"departments">;
  currentDepartmentId: Id<"departments">;
  chatType: "project_conflict" | "resource_sharing";
}

export default function DepartmentChat({ 
  departmentId, 
  currentDepartmentId, 
  chatType
}: DepartmentChatProps) {
  const { user } = useUser();
  
  const conversation = useQuery(api.chat.getConversationBetweenDepartments, {
    department1Id: departmentId,
    department2Id: currentDepartmentId,
    chatType
  });

  if (!conversation || !user) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <MessageList 
        conversationId={conversation._id}
        currentDepartmentId={currentDepartmentId}
      />
      <ChatInput 
        conversationId={conversation._id}
        senderId={user.id}
        senderDepartmentId={currentDepartmentId}
      />
    </div>
  );
}