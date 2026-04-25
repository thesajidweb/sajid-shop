"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuButton } from "../ui/sidebar";
import {
  ChevronDown,
  PlusCircle,
  Package,
  Boxes,
  PackageOpen,
  List,
  FolderKanban,
  ShoppingCart,
  ShoppingBag,
  Users,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/utils";

/* ================= MENU DATA ================= */

const collectionItems = [
  { title: "All Collections", url: "/dashboard/collections", icon: List },
  {
    title: "Create Collection",
    url: "/dashboard/collections/create",
    icon: PlusCircle,
  },
];

const productItems = [
  { title: "All Products", url: "/dashboard/products", icon: PackageOpen },
  {
    title: "Create Product",
    url: "/dashboard/products/create",
    icon: PlusCircle,
  },
  { title: "Categories", url: "/dashboard/products/categories", icon: Boxes },
];

const orderItems = [
  { title: "All Orders", url: "/dashboard/orders", icon: ShoppingBag },
  // { title: "Pending Orders", url: "/dashboard/orders", icon: Clock },
  // { title: "Completed Orders", url: "/dashboard/orders", icon: CheckCircle },
  // { title: "Shipping", url: "/dashboard/orders/shipping", icon: Truck },
  // { title: "Refunds", url: "/dashboard/orders/refunds", icon: Receipt },
];

const userItems = [
  { title: "All Users", url: "/dashboard/users", icon: Users },
];

type MenuType = "products" | "collections" | "orders" | "users";

interface MenuItemsProps {
  menuType: MenuType;
}

export default function MenuItems({ menuType }: MenuItemsProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const basePath = `/dashboard/${menuType}`;
  const getMenuConfig = () => {
    switch (menuType) {
      case "products":
        return { items: productItems, title: "Products", icon: Package };
      case "collections":
        return {
          items: collectionItems,
          title: "Collections",
          icon: FolderKanban,
        };
      case "orders":
        return { items: orderItems, title: "Orders", icon: ShoppingCart };
      case "users":
        return { items: userItems, title: "Users", icon: Users };
    }
  };

  const { items, title, icon: IconComponent } = getMenuConfig()!;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          className={cn(
            "w-full my-1 transition-colors",
            (open || pathname.startsWith(basePath)) && "bg-accent",
          )}
          isActive={pathname.startsWith(basePath)}
        >
          <div className="flex items-center justify-between w-full py-1.5">
            <div className="flex items-center gap-3">
              <IconComponent size={22} />
              <span className="font-medium">{title}</span>
            </div>
            <ChevronDown
              className={cn(
                "h-3 w-3 transition-transform",
                open && "rotate-180",
              )}
            />
          </div>
        </SidebarMenuButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56 rounded-lg">
        <DropdownMenuGroup>
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.url;

            return (
              <DropdownMenuItem key={item.title} asChild>
                <Link
                  href={item.url}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4",
                      isActive && "text-primary-foreground",
                    )}
                  />
                  <span className="text-sm font-medium">{item.title}</span>
                </Link>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
