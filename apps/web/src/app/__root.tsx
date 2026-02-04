import { createRootRoute, Outlet } from "@tanstack/react-router";

import "../styles/globals.css";

import { ProviderTree } from "@/providers";

const RootComponent = () => {
  return (
    <ProviderTree>
      <Outlet />
    </ProviderTree>
  );
};

export const Route = createRootRoute({
  component: RootComponent,
});
