import { Link } from "@tanstack/react-router";

import { ChartBarIcon, CommandIcon, KeyIcon } from "@phosphor-icons/react";

import { YellowRPCIcon } from "./icons";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";

const sidebarItems = [
  {
    href: "/dashboard",
    icon: CommandIcon,
    key: "dashboard",
    label: "Dashboard",
    tooltip: "Dashboard",
  },
  {
    href: "/api-keys",
    icon: KeyIcon,
    key: "api-keys",
    label: "API Keys",
    tooltip: "API Keys",
  },
  {
    href: "/analytics",
    icon: ChartBarIcon,
    key: "analytics",
    label: "Analytics",
    tooltip: "Analytics",
  },
];

export const AppSidebar = () => {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenuItem>
          <SidebarMenuButton
            className="hover:bg-sidebar! justify-start group-data-[collapsible=icon]:p-px!"
            render={<Link to="/dashboard" />}
          >
            <YellowRPCIcon className="size-7! rounded-sm" />
            <span className="text-lg font-medium">YellowRPC</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {sidebarItems.map((item) => {
              return (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton
                    render={<Link to={item.href} />}
                    tooltip={item.tooltip}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
