"use client";

import React from "react";

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  imageUrl?: string;
}

export default function AuthLayout({
  title,
  subtitle,
  children,
  imageUrl = "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?q=90&auto=format&fit=crop&w=1400",
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* LEFT IMAGE */}
      <div className="hidden md:block md:w-1/2 relative">
        <img src={imageUrl} alt="Home" className="w-full h-full object-cover" />

        <div className="absolute bottom-10 left-10 text-white">
          <h1 className="text-4xl font-bold">Find your sweet home</h1>
          <p className="mt-3">Schedule visit in just a few clicks</p>
          <div className="flex gap-2 mt-5">
            <div className="w-3 h-3 bg-white rounded-full"></div>
            <div className="w-3 h-3 bg-white/50 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* RIGHT AREA */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-10 py-10">
        <h2 className="text-3xl font-bold mb-2 px-10">{title}</h2>
        {subtitle && <p className="text-gray-500 mb-7 px-10">{subtitle}</p>}

        <div className="w-full px-10">{children}</div>
      </div>
    </div>
  );
}
