import { Phone, Mail, Globe, Building2 } from "lucide-react";

interface ContactPersonProps {
  name: string;
  role: string;
  email: string;
  phone: string;
  office: string;
  availability: string;
  expertise: string[];
}

export function ContactCard({
  name,
  role,
  email,
  phone,
  office,
  availability,
  expertise,
}: ContactPersonProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-8">
      <div className="flex items-start gap-8">
        <div className="flex-shrink-0">
          <div className="h-24 w-24 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-2xl font-bold">
            {name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{name}</h2>
              <p className="text-emerald-600 font-medium">{role}</p>
            </div>
            <span className="px-4 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm">
              Primary Contact
            </span>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-500" />
                <span className="text-gray-600">{email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-500" />
                <span className="text-gray-600">{phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-gray-500" />
                <span className="text-gray-600">{office}</span>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-gray-500" />
                <span className="text-gray-600">{availability}</span>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-700 mb-3">
                Areas of Expertise
              </h3>
              <div className="flex flex-wrap gap-2">
                {expertise.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
