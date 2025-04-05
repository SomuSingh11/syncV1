import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";

interface ConflictChatInputProps {
  conversationId: Id<"projectConflictConversations">;
  senderId: string;
  senderDepartmentId: Id<"departments">;
  isDisabled?: boolean;
}

export default function ConflictChatInput({
  conversationId,
  senderId,
  senderDepartmentId,
  isDisabled = false
}: ConflictChatInputProps) {
  const [message, setMessage] = useState("");
  const sendMessage = useMutation(api.projectConflictChat.sendConflictMessage);

  const handleSend = async () => {
    if (!message.trim()) return;

    try {
      await sendMessage({
        conversationId,
        senderId,
        senderDepartmentId,
        content: message.trim()
      });
      setMessage("");
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div className="p-4 border-t bg-white">
      <div className="flex gap-2">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="resize-none min-h-[44px] max-h-[120px]"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          disabled={isDisabled}
        />
        <Button 
          onClick={handleSend} 
          disabled={!message.trim() || isDisabled}
          className="px-3"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}