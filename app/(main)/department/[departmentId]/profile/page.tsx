"use client";
import { useUser } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import {
  BarChart3,
  Users,
  FileText,
  Network,
  PackageSearch,
  Phone,
  Mail,
  Globe,
  Building2,
} from "lucide-react";
import { ContactCard } from "@/components/departmentProfile/ContactCard";
import { ProfileHeader } from "@/components/departmentProfile/ProfileHeader";
import { ProfileStats } from '@/components/departmentProfile/ProfileStats';
// import { ProfileHeader } from '../components/ProfileHeader';
// import { ProfileStats } from '../components/ProfileStats';

export default function DepartmentProfilePage() {
  const { user } = useUser();
  const params = useParams();

  // This data should come from your API or database
  const departmentData = {
    id: params.departmentId as string,
    name: "Engineering Department",
    email: "engineering@synccity.com",
    phone: "+1 (555) 123-4567",
    location: "Building A, Floor 3",
    stats: [
      {
        label: "Active Projects",
        value: "12",
        icon: FileText,
        color: "text-blue-600",
      },
      {
        label: "Team Members",
        value: "48",
        icon: Users,
        color: "text-green-600",
      },
      {
        label: "Collaborating Depts",
        value: "8",
        icon: Network,
        color: "text-purple-600",
      },
      {
        label: "Resources Available",
        value: "156",
        icon: PackageSearch,
        color: "text-orange-600",
      },
    ],
    contactPerson: {
      name: "Dr. Sarah Johnson",
      role: "Head of Department",
      email: "sarah.johnson@synccity.com",
      phone: "+1 (555) 234-5678",
      office: "Room 405, Building A",
      availability: "Mon-Fri, 9:00 AM - 5:00 PM",
      expertise: [
        "System Architecture",
        "Project Management",
        "Team Leadership",
      ],
    },
  };

  return (
    <div className="min-h-screen bg-[#eef6fd] p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <ProfileHeader
          departmentId={departmentData.id}
          name={departmentData.name}
          email={departmentData.email}
          phone={departmentData.phone}
          location={departmentData.location}
        />
        <ProfileStats stats={departmentData.stats} />
        <ContactCard {...departmentData.contactPerson} />
      </div>
    </div>
  );
}
