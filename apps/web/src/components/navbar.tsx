import { useLocation } from "@tanstack/react-router";

import { ConnectButton } from "./connect-button";
import { ThemeSwitcher } from "./theme-switcher";
import { SidebarTrigger } from "./ui/sidebar";

const pageTitles: Record<string, string> = {
  "/analytics": "Analytics",
  "/api-keys": "API Keys",
  "/dashboard": "Dashboard",
};

export const DashboardNavbar = () => {
  const { pathname } = useLocation();
  return (
    <nav className="flex justify-between items-center gap-2 border-b h-12 px-4">
      <div className="flex flex-row items-center gap-2">
        <SidebarTrigger />
        <div className="text-muted-foreground border-r h-5" />
        <div>{pageTitles[pathname] ?? "Dashboard"}</div>
      </div>
      <div className="flex flex-row items-center gap-2">
        <ThemeSwitcher />
        <ConnectButton />
      </div>
    </nav>
  );
};
