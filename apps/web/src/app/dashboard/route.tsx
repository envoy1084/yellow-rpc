import { createFileRoute, Outlet } from "@tanstack/react-router";

import { AppSidebar, DashboardNavbar } from "@/components";
import { SidebarProvider } from "@/components/ui/sidebar";

const DashboardLayout = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex h-full w-full flex-col">
        <DashboardNavbar />
        <div className="py-[5dvh] px-4">
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  );
};

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayout,
});
