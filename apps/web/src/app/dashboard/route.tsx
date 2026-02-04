import { createFileRoute, Outlet } from "@tanstack/react-router";

import { AppSidebar } from "@/components/sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const DashboardLayout = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex h-full w-full flex-col">
        <SidebarTrigger />
        <Outlet />
      </div>
    </SidebarProvider>
  );
};

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayout,
});
