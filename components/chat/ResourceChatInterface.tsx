import { useState } from 'react';
import { useUser } from "@clerk/nextjs";
import { Id } from "@/convex/_generated/dataModel";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, Users, Loader2, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import DepartmentChat from './DepartmentChat';
import VideoChat from './video-chat';

interface ResourceChatInterfaceProps {
  title: string;
  departments: Array<{
    _id: Id<"departments">;
    name: string;
    email: string;
  }> | undefined;
  currentDepartmentId: Id<"departments">;
  chatType: "resource_sharing" | "project_conflict";
  isLoading?: boolean;
}

export default function ResourceChatInterface({
  title,
  departments,
  currentDepartmentId,
  chatType,
  isLoading
}: ResourceChatInterfaceProps) {
  const { user } = useUser();
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<Id<"departments"> | null>(null);
  const [isVideoMode, setIsVideoMode] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-80px)]">
        <div className="flex flex-col items-center gap-2 text-gray-500">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p>Loading your workspace...</p>
        </div>
      </div>
    );
  }

  const handleDepartmentSelect = (deptId: Id<"departments">) => {
    setSelectedDepartmentId(deptId);
    setIsVideoMode(false);
  };

  const handleVideoToggle = () => {
    setIsVideoMode(!isVideoMode);
  };

  return (
    <div className="flex h-[calc(100vh-100px)] bg-gray-50 gap-6">
      <div className="w-100 border-r bg-white p-6 shadow-sm mt-6 rounded-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-500" />
            {title}
          </h2>
        </div>
        <div className="space-y-2 ">
          {departments?.map((dept) => (
            <div
              key={dept._id}
              className={`w-full flex items-center justify-between p-2 rounded-lg transition-all cursor-pointer ${
                selectedDepartmentId === dept._id 
                  ? 'bg-blue-50 text-blue-900 ring-1 ring-blue-200' 
                  : 'hover:bg-gray-50 hover:shadow-sm'
              }`}
              onClick={() => handleDepartmentSelect(dept._id)}
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border">
                  <AvatarFallback className="bg-blue-100 text-blue-700">
                    {dept.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <p className="font-medium">{dept.name}</p>
                  <p className="text-sm text-gray-500">{dept.email}</p>
                </div>
              </div>
              {selectedDepartmentId === dept._id && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleVideoToggle();
                  }}
                  className={`ml-2 ${isVideoMode ? 'text-red-500 hover:text-red-600 hover:bg-red-50' : 'hover:bg-blue-50'}`}
                >
                  <Video className={`h-4 w-4 ${isVideoMode ? 'text-red-500' : 'text-blue-500'}`} />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden">
        {selectedDepartmentId ? (
          isVideoMode ? (
            <VideoChat
              departmentId={`${selectedDepartmentId}`}
              currentDepartmentId={`${currentDepartmentId}`}
              userId={user?.id || ''}
              userName={user?.fullName || user?.username || 'User'}
            />
          ) : (
            <DepartmentChat
              departmentId={selectedDepartmentId}
              currentDepartmentId={currentDepartmentId}
              chatType={chatType}
            />
          )
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-3">
            <MessageSquare className="h-12 w-12 text-gray-300" />
            <p className="text-lg font-medium">Start a {title}</p>
            <p className="text-sm">Select a department from the sidebar to begin chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}