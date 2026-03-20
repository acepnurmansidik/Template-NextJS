import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Acep Nurman - Portfolio",
  description: "Fullstack Developer Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Script Murni untuk mencegah layar berkedip (FOUC) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark')
                } else {
                  document.documentElement.classList.remove('dark')
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="antialiased bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}
