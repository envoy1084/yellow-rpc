import { createFileRoute, Outlet } from "@tanstack/react-router";

import { AppSidebar, DashboardNavbar } from "@/components";
import { CreateSession } from "@/components/create-session";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useUnifiedBalance, useYellow, useYellowEvents } from "@/hooks";

const DashboardLayout = () => {
  useYellow();
  useYellowEvents();
  useUnifiedBalance();
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex h-full w-full flex-col">
        <DashboardNavbar />
        <div className="py-[5dvh] px-4">
          <Outlet />
        </div>
      </div>
      <CreateSession />
    </SidebarProvider>
  );
};

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayout,
});
