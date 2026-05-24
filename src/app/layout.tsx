"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/atoms/sharedComponents/Sidebar";
import Navbar from "@/components/atoms/sharedComponents/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-gray-900 dark:text-gray-100`}
      >
        {isLandingPage ? (
          <>{children}</>
        ) : (
          // TAMBAHKAN: dark:bg-zinc-900 untuk background utama CMS saat dark mode
          <main className="flex h-screen w-full bg-gray-100 dark:bg-zinc-900 overflow-hidden transition-colors duration-300">
            <Sidebar />

            <div className="flex flex-col h-full w-full overflow-hidden">
              <Navbar />

              {/* Area scroll konten dashboard */}
              <div
                id="global-content-scroll"
                className="flex-1 overflow-y-auto p-4"
              >
                {children}
              </div>
            </div>
          </main>
        )}
      </body>
    </html>
  );
}
