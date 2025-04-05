"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";

interface ChatInputProps {
  conversationId: Id<"conversations">;
  senderId: string;
  senderDepartmentId: Id<"departments">;
}

export default function ChatInput({ conversationId, senderId, senderDepartmentId }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const sendMessage = useMutation(api.chat.sendMessage);

  const handleSend = async () => {
    if (!message.trim()) return;

    await sendMessage({
      conversationId,
      senderId,
      senderDepartmentId,
      content: message.trim(),
      type: "text"
    });

    setMessage("");
  };

  return (
    <div className="p-2 border-t flex gap-2 items-center">
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        className="resize-none min-h-[40px] max-h-[120px] py-2 px-3"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
      />
      <Button size="sm" onClick={handleSend} disabled={!message.trim()}>
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
}