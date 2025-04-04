"use client";
import Sidebar from '@/components/Sidebar';
import React from 'react';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      <div className="min-h-screen fixed">
        <Sidebar />
      </div>
      <div className="flex-grow flex flex-col">
        <main className="flex-grow bg-gray-400/10 ml-80">
          {children}
        </main>
      </div>
    </div>
  );
}