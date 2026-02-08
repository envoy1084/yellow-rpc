import { Link } from "@tanstack/react-router";

import { CommandIcon, MoneyIcon } from "@phosphor-icons/react";

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
    href: "/",
    icon: CommandIcon,
    key: "dashboard",
    label: "Dashboard",
    tooltip: "Dashboard",
  },
  {
    href: "/billing",
    icon: MoneyIcon,
    key: "billings",
    label: "Billings",
    tooltip: "Billings",
  },
] as const;

export const AppSidebar = () => {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenuItem>
          <SidebarMenuButton
            className="hover:bg-sidebar! justify-start group-data-[collapsible=icon]:p-px!"
            render={<Link to="/" />}
          >
            <YellowRPCIcon className="size-7! rounded-sm" />
            <span className="text-lg font-medium">YellowRPC</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="flex flex-col gap-1">
            {sidebarItems.map((item) => {
              return (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton
                    render={
                      <Link
                        activeOptions={{
                          exact: true,
                        }}
                        activeProps={{
                          className:
                            "bg-primary hover:bg-primary! text-primary-foreground hover:text-primary-foreground!",
                        }}
                        to={item.href}
                      />
                    }
                    // tooltip={item.tooltip}
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
