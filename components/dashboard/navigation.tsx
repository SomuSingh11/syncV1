import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  Calculator,
  Calendar,
  CreditCard,
  MessageSquareMore,
  Search,
  Settings,
  Smile,
  User,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { UserButton } from "@clerk/nextjs";
import { Id } from "@/convex/_generated/dataModel";
import { RequestNotifications } from "@/components/request/RequestNotifications";
// import { RequestDialog } from "@/components/request/RequestDialog";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { RequestDialog } from "./RequestDialog";

interface NavigationProps {
  userData: {
    fullName?: string;
    imageUrl?: string;
    emailAddresses?: Array<{
      emailAddress: string;
    }>;
  };
  departmentId: Id<"departments">;
}

function Navigation({ userData, departmentId }: NavigationProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);

  const updateRequestStatus = useMutation(api.resourceRequests.updateStatus);

  const handleRequestClick = (request: any) => {
    setSelectedRequest(request);
    setIsRequestDialogOpen(true);
  };

  const handleStatusUpdate = async (
    requestId: Id<"resourceRequests">,
    status: "approved" | "rejected"
  ) => {
    await updateRequestStatus({
      id: requestId,
      status: status,
    });
    setIsRequestDialogOpen(false);
  };

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <div className="flex justify-between items-center w-full">
        <div className="w-1/2">
          <div className="relative w-full">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Press ⌘K to search..."
              className="pl-8 h-10 w-full bg-white"
              onClick={() => setOpen(true)}
            />
          </div>

          <CommandDialog open={open} onOpenChange={setOpen}>
            <Command className="rounded-lg border shadow-md">
              <CommandInput placeholder="Type a command or search..." />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Suggestions">
                  <CommandItem>
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>Calendar</span>
                  </CommandItem>
                  <CommandItem>
                    <Smile className="mr-2 h-4 w-4" />
                    <span>Search Emoji</span>
                  </CommandItem>
                  <CommandItem disabled>
                    <Calculator className="mr-2 h-4 w-4" />
                    <span>Calculator</span>
                  </CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Settings">
                  <CommandItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                    <CommandShortcut>⌘P</CommandShortcut>
                  </CommandItem>
                  <CommandItem>
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>Billing</span>
                    <CommandShortcut>⌘B</CommandShortcut>
                  </CommandItem>
                  <CommandItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                    <CommandShortcut>⌘S</CommandShortcut>
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </CommandDialog>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            <button className="relative h-10 w-10 rounded-xl bg-blue-100 hover:cursor-pointer flex items-center justify-center transition-colors">
              <MessageSquareMore className="h-5 w-5 text-blue-600" />
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-blue-500 text-[11px] font-medium text-white rounded-full flex items-center justify-center">
                21
              </span>
            </button>

            <RequestNotifications
              departmentId={departmentId}
              onRequestClick={handleRequestClick}
            />

            <button className="h-10 w-10 rounded-xl bg-gray-200 flex items-center hover:cursor-pointer justify-center transition-colors">
              <Settings className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="max-w-[180px]">
              <p className="text-sm font-semibold text-gray-800 truncate">
                <span className="text-muted-foreground">Hello, </span>
                {userData.fullName || "Point of Contact"}
              </p>
              <p className="text-xs text-gray-500 truncate max-w-[140px]">
                {userData.emailAddresses?.[0]?.emailAddress || "poi@gmail.com"}
              </p>
            </div>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "h-16 w-16",
                  userButtonTrigger: "h-12",
                  userButtonAvatarBox: "h-12 w-12",
                },
              }}
            />
          </div>
        </div>
      </div>
      <RequestDialog
        request={selectedRequest}
        isOpen={isRequestDialogOpen}
        onClose={() => setIsRequestDialogOpen(false)}
        onStatusUpdate={handleStatusUpdate}
        currentDepartmentId={departmentId}
      />
    </>
  );
}

export default Navigation;
