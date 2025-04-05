import { Building, Mail, Phone, MapPin } from "lucide-react";

interface ProfileHeaderProps {
  departmentId: string;
  name: string;
  email: string;
  phone: string;
  location: string;
}

export function ProfileHeader({
  departmentId,
  name,
  email,
  phone,
  location,
}: ProfileHeaderProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-8">
      <div className="flex items-start gap-8">
        <div className="h-32 w-32 rounded-full bg-emerald-100 flex items-center justify-center">
          <Building className="h-16 w-16 text-emerald-600" />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">{name}</h1>
          <p className="text-lg text-gray-600 mt-2">
            Department ID: {departmentId}
          </p>
          <div className="mt-4 flex gap-6">
            <div className="flex items-center gap-2 text-gray-600">
              <Mail className="h-5 w-5" />
              <span>{email}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Phone className="h-5 w-5" />
              <span>{phone}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="h-5 w-5" />
              <span>{location}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
