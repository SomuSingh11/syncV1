"use client";

import { useEffect, useState } from "react";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
// import { Id } from "@/convex/_generated/dataModel";

interface VideoChatProps {
  departmentId: string; // The department you're chatting with
  userId: string;
  userName: string;
  currentDepartmentId?: string; // Your own department ID
}

export default function VideoChat({ 
  departmentId, 
  userName,
  currentDepartmentId 
}: VideoChatProps) {
  const [token, setToken] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();
  
  // Create a room name that represents the conversation between two departments
  // Sort IDs to ensure the same room name regardless of which department initiates
  const departmentIds = [departmentId, currentDepartmentId || ""].sort();
  const roomName = `dept-convo-${departmentIds[0]}-${departmentIds[1]}`;

  useEffect(() => {
    if (!user) return;
    
    let isMounted = true;
    
    const fetchToken = async () => {
      try {
        console.log(`Fetching token for room: ${roomName}`);
        
        const response = await fetch(
          `/api/livekit?room=${encodeURIComponent(roomName)}&username=${encodeURIComponent(userName)}`
        );
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Token fetch error:", response.status, errorText);
          throw new Error(`Failed to get token: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (isMounted) {
          console.log("Token received successfully");
          setToken(data.token);
        }
      } catch (error) {
        console.error("Video chat error:", error);
        if (isMounted) {
          setError(error instanceof Error ? error.message : "Failed to connect");
        }
      }
    };

    fetchToken();
    
    return () => {
      isMounted = false;
    };
  }, [roomName, userName, user]);

  if (error) {
    return (
      <div className="flex flex-col flex-1 justify-center items-center h-full">
        <p className="text-red-500 mb-2">Connection error</p>
        <p className="text-sm text-gray-500">{error}</p>
      </div>
    );
  }

  if (token === "") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center h-full">
        <Loader2 className="h-7 w-7 text-blue-500 animate-spin my-4" />
        <p className="text-sm text-gray-500">Connecting to video call...</p>
      </div>
    );
  }

  return (
    <LiveKitRoom
      token={token}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      data-lk-theme="default"
      connect={true}
      video={true}
      audio={true}
    >
      <VideoConference />
    </LiveKitRoom>
  );
}