import React from "react";
// import test from '@/public/test';
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="p-6">
      <div className="bg-gradient-to-br from-slate-100 via-slate-50 to-white p-8 rounded-3xl shadow-sm max-w-5xl mx-auto">
        <h1 className="text-3xl font-semibold mb-6">About Sync City</h1>

        {/* Mission Statement */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-green-600 mb-4">
            Our Mission
          </h2>
          <p className="text-slate-600 leading-relaxed">
            At Sync City, we&apos;re dedicated to revolutionizing the way
            departments collaborate and share resources. Our platform enables
            seamless integration and efficient resource management across
            organizations, making interdepartmental cooperation smoother than
            ever before.
          </p>
        </div>

        {/* Values Section */}
        <div className="grid grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-br from-slate-100/90 via-slate-50/80 to-white p-6 rounded-2xl shadow-sm">
            <div className="bg-green-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Innovation</h3>
            <p className="text-slate-600">
              Continuously pushing boundaries to create cutting-edge solutions
              for modern organizational challenges.
            </p>
          </div>

          <div className="bg-gradient-to-br from-slate-100/90 via-slate-50/80 to-white p-6 rounded-2xl shadow-sm">
            <div className="bg-green-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Collaboration</h3>
            <p className="text-slate-600">
              Fostering meaningful partnerships and teamwork across departments
              and organizations.
            </p>
          </div>

          <div className="bg-gradient-to-br from-slate-100/90 via-slate-50/80 to-white p-6 rounded-2xl shadow-sm">
            <div className="bg-green-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Security</h3>
            <p className="text-slate-600">
              Ensuring the highest standards of data protection and privacy in
              all our operations.
            </p>
          </div>
        </div>

        {/* Team Section */}
        {/* Team Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-green-600 mb-6">
            Our Team
          </h2>
          <div className="grid grid-cols-4 gap-6">
            {[
              {
                name: "Bharat Katariya",
                position: "Member-1",
                image: "/member1.jpg",
              },
              {
                name: "Somu Singh",
                position: "Member-2",
                image: "/member2.jpg",
              },
              {
                name: "Chinmay Gupta",
                position: "Member-3",
                image: "/member3.jpg",
              },
              {
                name: "Shreya Dixit",
                position: "Member-4",
                image: "/member4.jpg",
              },
            ].map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-24 h-24 mx-auto mb-4 relative">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="rounded-full object-cover border-4 border-white shadow-md"
                  />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-500/10 via-transparent to-transparent"></div>
                </div>
                <h3 className="font-semibold">{member.name}</h3>
                <p className="text-sm text-slate-600">{member.position}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-slate-100/90 via-slate-50/80 to-white p-4 rounded-2xl text-center">
            <div className="text-3xl font-bold text-green-600">500+</div>
            <div className="text-sm text-slate-600">Organizations</div>
          </div>
          <div className="bg-gradient-to-br from-slate-100/90 via-slate-50/80 to-white p-4 rounded-2xl text-center">
            <div className="text-3xl font-bold text-green-600">10K+</div>
            <div className="text-sm text-slate-600">Users</div>
          </div>
          <div className="bg-gradient-to-br from-slate-100/90 via-slate-50/80 to-white p-4 rounded-2xl text-center">
            <div className="text-3xl font-bold text-green-600">98%</div>
            <div className="text-sm text-slate-600">Satisfaction</div>
          </div>
          <div className="bg-gradient-to-br from-slate-100/90 via-slate-50/80 to-white p-4 rounded-2xl text-center">
            <div className="text-3xl font-bold text-green-600">24/7</div>
            <div className="text-sm text-slate-600">Support</div>
          </div>
        </div>
      </div>
    </div>
  );
}
