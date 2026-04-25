import type { Metadata } from "next";

import { AppSidebar } from "@/components/layout/AppSidebar";

import SidebarShell from "@/components/layout/SidebarShell";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface RootLayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: "dashboard",
  description: "This is the dashboard section of my site.",
};

export default function RootLayout({ children }: RootLayoutProps) {
  // Sidebar open state for mobile

  return (
    <>
      {/* Sidebar + Main Layout */}
      <SidebarShell>
        {/* Sidebar */}
        <AppSidebar />

        {/* Main Content */}
        <div className="ml-0  flex-1 transition-all w-full min-w-0">
          <SidebarTrigger className="fixed top-0  z-50  w-8 h-8 md:hidden" />
          {children}
        </div>
      </SidebarShell>
    </>
  );
}
