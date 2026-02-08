import { createRootRoute, Outlet } from "@tanstack/react-router";

import "../styles/globals.css";

import { AppSidebar, DashboardNavbar } from "@/components";
import { CreateSession } from "@/components/create-session";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { ProviderTree } from "@/providers";

const RootComponent = () => {
  return (
    <ProviderTree>
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
      <Toaster richColors={true} />
    </ProviderTree>
  );
};

export const Route = createRootRoute({
  component: RootComponent,
});
