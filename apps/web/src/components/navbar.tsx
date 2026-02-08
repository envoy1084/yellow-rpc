import { useLocation } from "@tanstack/react-router";

import { BalancePill } from "./balance-pill";
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
    <div className="flex justify-between items-center gap-2 border-b h-12 px-4">
      <div className="flex flex-row items-center gap-2">
        <SidebarTrigger />
        <div className="text-muted-foreground border-r h-5 md:block hidden" />
        <div>{pageTitles[pathname] ?? "Dashboard"}</div>
      </div>
      <div className="md:flex flex-row items-center gap-2  hidden">
        <ThemeSwitcher />
        <ConnectButton />
        <BalancePill />
      </div>
    </div>
  );
};
