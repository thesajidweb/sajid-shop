"use client";

import { LayoutDashboard } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

import Link from "next/link";
import { usePathname } from "next/navigation";

import MenuItems from "./MenuItems";
import ThemeToggle from "../ThemeToggle";
import UserDropdown from "../auth/authDropDown";

export function AppSidebar() {
  const pathname = usePathname();

  const { open, setOpen } = useSidebar();
  return (
    <Sidebar side="left" collapsible="icon">
      {/*  Trigger Section (Top – No Overlap) */}
      {!open && (
        <div className="sticky top-0 z-40 hidden md:flex items-center gap-2 pl-1 pt-2">
          <SidebarTrigger
            onClick={() => {
              setOpen(true);
            }}
            className="w-9 h-9 rounded-md hover:bg-accent"
          />
        </div>
      )}

      {/* ===== Sidebar Content ===== */}
      <SidebarContent className="">
        <SidebarGroup>
          {/* Header */}
          <SidebarGroupLabel className="flex items-center justify-between pl-2 pt-4 pb-5">
            <span className="text-lg font-semibold tracking-wide">
              Application
            </span>
            <div className="flex items-center justify-end gap-2">
              <ThemeToggle />
              {open && (
                <div className=" hidden md:block ">
                  <SidebarTrigger
                    onClick={() => {
                      setOpen(false);
                    }}
                    className="w-9 h-9 rounded-lg "
                  />{" "}
                </div>
              )}
            </div>
          </SidebarGroupLabel>

          <SidebarGroupContent className="relative">
            <SidebarMenu>
              {/* Dashboard */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/dashboard"}
                  className="gap-3 font-medium"
                >
                  <Link href="/dashboard" className="flex items-center gap-3">
                    <LayoutDashboard size={22} />
                    <span className="text-sm md:text-base">Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Collections */}
              <SidebarMenuItem>
                <MenuItems menuType="collections" />
              </SidebarMenuItem>

              {/* Products */}
              <SidebarMenuItem>
                <MenuItems menuType="products" />
              </SidebarMenuItem>

              {/* Orders */}
              <SidebarMenuItem>
                <MenuItems menuType="orders" />
              </SidebarMenuItem>
              <SidebarMenuItem>
                <MenuItems menuType="users" />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <div className="w-full absolute bottom-2.5 left-1">
          <div className="px-1 mb-2 flex justify-between items-center ">
            <UserDropdown />
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
