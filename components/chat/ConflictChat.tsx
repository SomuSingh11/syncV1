import { useEffect, useRef} from 'react';
import { useQuery} from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from "@/convex/_generated/dataModel";
import { ScrollArea } from '@/components/ui/scroll-area';
import ConflictChatInput from './ConflictChatInput';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { formatDistanceToNow } from 'date-fns';

interface ConflictChatProps {
  projectConflictId: Id<"projectConflicts">;
  currentDepartmentId: Id<"departments">;
  otherDepartmentName: string;
  userId: string;
}

export default function ConflictChat({ 
  projectConflictId,
  currentDepartmentId,
  otherDepartmentName,
  userId,
}: ConflictChatProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Get conversation details
  const conversation = useQuery(
    api.projectConflictChat.getConflictConversation,
    { projectConflictId }
  );
  
  // Get messages for the conversation
  const messages = useQuery(
    api.projectConflictChat.getConflictMessages, 
    conversation ? { conversationId: conversation._id } : "skip"
  );
  
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: "instant",
        block: "end" 
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
    const timeoutId = setTimeout(scrollToBottom, 150);
    return () => clearTimeout(timeoutId);
  }, [messages]);

  if (!conversation) {
    return <div className="p-4 text-center">Loading conversation...</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">Chat with {otherDepartmentName}</h3>
        <p className="text-sm text-gray-500">
          {conversation.status === "resolved" ? "This conflict has been resolved" : "Active conflict discussion"}
        </p>
      </div>

      <ScrollArea className="flex-1 px-4">
        <div className="h-[calc(100vh-300px)] space-y-4 py-4">
          {!messages?.length && (
            <div className="text-center text-gray-500 py-8">
              No messages yet. Start the conversation!
            </div>
          )}
          {messages?.sort((a, b) => a.timestamp - b.timestamp).map((msg) => (
            <div
              key={msg._id}
              className={`flex items-start gap-3 ${
                msg.senderDepartmentId === currentDepartmentId ? 'flex-row-reverse' : ''
              }`}
            >
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs">
                  {msg.senderId.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className={`max-w-[60%] ${
                msg.senderDepartmentId === currentDepartmentId 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100'
              } rounded-lg p-2`}>
                <p className="text-sm">{msg.content}</p>
                <p className="text-xs mt-1 opacity-70">
                  {formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <ConflictChatInput
        conversationId={conversation._id}
        senderId={userId}
        senderDepartmentId={currentDepartmentId}
        isDisabled={conversation.status === "resolved"}
      />
    </div>
  );
}