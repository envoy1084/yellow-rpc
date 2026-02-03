import { createRootRoute, Outlet } from "@tanstack/react-router";

import "../styles/globals.css";

const RootComponent = () => {
  return <Outlet />;
};

export const Route = createRootRoute({
  component: RootComponent,
});
