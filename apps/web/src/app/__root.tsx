import { createRootRoute, Outlet } from "@tanstack/react-router";

import "../styles/globals.css";

import { Toaster } from "@/components/ui/sonner";
import { ProviderTree } from "@/providers";

const RootComponent = () => {
  return (
    <ProviderTree>
      <Outlet />
      <Toaster richColors={true} />
    </ProviderTree>
  );
};

export const Route = createRootRoute({
  component: RootComponent,
});
