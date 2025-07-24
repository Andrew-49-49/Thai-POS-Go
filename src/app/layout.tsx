"use client";

import type { Metadata } from "next";
import "./globals.css";
import { SidebarProvider, Sidebar, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { SiteSidebar } from "@/components/site-sidebar";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { PanelLeft } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isMobile = useIsMobile();

  return (
    <html lang="th" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <SidebarProvider>
            <SiteSidebar />
            <SidebarInset className="bg-background min-h-svh">
              <main className="p-4 md:p-6">
                {children}
              </main>
            </SidebarInset>
          <Toaster />
        </SidebarProvider>
      </body>
    </html>
  );
}
