"use client";

//import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useRef } from "react";

interface MessageListProps {
  conversationId: Id<"conversations">;
  currentDepartmentId: Id<"departments">;
}

export default function MessageList({ conversationId, currentDepartmentId }: MessageListProps) {
 // const { user } = useUser();
  const messages = useQuery(api.chat.getMessages, { conversationId });
  const conversation = useQuery(api.chat.getConversation, { conversationId });
  const resource = useQuery(
    api.resources.getById,
    conversation?.resourceId 
      ? { id: conversation.resourceId as Id<"resources"> }
      : "skip"
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  //const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: "instant",
        block: "end" 
      });
    }
  };

  useEffect(() => {
    // Scroll on new messages
    scrollToBottom();
    
    // Scroll again after a short delay to handle dynamic content
    const timeoutId = setTimeout(scrollToBottom, 150);
    return () => clearTimeout(timeoutId);
  }, [messages]);

  // Also scroll when resource info loads
  useEffect(() => {
    if (resource) {
      scrollToBottom();
    }
  }, [resource]);

  return (
    <ScrollArea className="h-[calc(100vh-200px)] p-2 overflow-hidden">
      {resource && conversation && (
        <div className="mb-6 mt-5 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-medium text-blue-900">Resource Information</h3>
            <div className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
              Request from {conversation.initiatorDepartmentId === currentDepartmentId ? 'You' : 'Other Department'}
            </div>
          </div>
          <div className="space-y-1 text-sm text-blue-700">
            <p><span className="font-medium">Name:</span> {resource.name}</p>
            <p><span className="font-medium">Type:</span> {resource.type}</p>
            <p><span className="font-medium">Status:</span> {resource.status}</p>
            <p><span className="font-medium">Department:</span> {resource.departmentName}</p>
            {resource.location && (
              <p><span className="font-medium">Location:</span> {resource.location.city}, {resource.location.state}</p>
            )}
          </div>
        </div>
      )}
      <div className="space-y-4">
        {messages?.slice().reverse().map((message) => (
          <div
            key={message._id}
            className={`flex items-start gap-3 ${
              message.senderDepartmentId === currentDepartmentId ? 'flex-row-reverse' : ''
            }`}
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                {message.senderId.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className={`max-w-[70%] ${
              message.senderDepartmentId === currentDepartmentId 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100'
            } rounded-lg p-3`}>
              <p>{message.content}</p>
              <p className="text-xs mt-1 opacity-70">
                {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
}