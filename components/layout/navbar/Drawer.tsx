"use client";

import Link from "next/link";
import {
  Heart,
  X,
  ChevronRight,
  Package,
  Home,
  Grid,
  ShoppingBag,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/utils";
import ThemeToggle from "@/components/ThemeToggle";

import getClientAuth from "@/lib/auth/getClientAuth";

interface NavLink {
  name: string;
  path: string;
  exact: boolean;
}

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: NavLink[];
  isLinkActive: (path: string, exact: boolean) => boolean;
  wishlistCount: number;
}

const Drawer = ({
  isOpen,
  onClose,
  navLinks,
  isLinkActive,
  wishlistCount,
}: DrawerProps) => {
  const { session } = getClientAuth();

  return (
    <div
      className={cn(
        "fixed inset-0 z-60 lg:hidden transition-all duration-300",
        isOpen ? "visible" : "invisible delay-300",
      )}
    >
      {/* Backdrop */}
      <div
        className={cn(
          "absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0",
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <aside
        className={cn(
          "absolute top-0 left-0 bottom-0 w-[85%] max-w-[320px] bg-background shadow-2xl transform transition-transform duration-300 ease-out flex flex-col border-r border-border",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-2 border-b border-border bg-secondary/30 mb-2">
          <div className="flex items-center sm:hidden">
            <ThemeToggle />
            <span className="text-xs font-semibold ml-2">Theme</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close drawer"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 px-5 mb-4">
          <Link href="/orders" onClick={onClose}>
            <div className="bg-background rounded-xl p-3 text-center border border-border shadow-sm hover:border-primary/50 transition-all active:scale-95 group">
              <Package className="h-5 w-5 mx-auto mb-1.5 text-primary group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium text-foreground">
                Orders
              </span>
            </div>
          </Link>
          <Link href="/wishlist" onClick={onClose}>
            <div className="bg-background rounded-xl p-3 text-center border border-border shadow-sm hover:border-primary/50 transition-all active:scale-95 group">
              <Heart className="h-5 w-5 mx-auto mb-1.5 text-destructive group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium text-foreground">
                Wishlist {wishlistCount} items
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-5 py-2 space-y-6">
          <div>
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
              Shop Categories
            </h4>
            <nav className="space-y-1">
              {navLinks.map((link) => {
                const isActive = isLinkActive(link.path, link.exact);
                return (
                  <Link
                    key={link.path}
                    href={link.path}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-xl text-sm font-medium transition-colors hover:bg-secondary",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-foreground",
                    )}
                    onClick={onClose}
                  >
                    <div className="flex items-center gap-3">
                      {link.name === "Home" && (
                        <Home className="h-4 w-4 opacity-70" />
                      )}
                      {link.name === "Shop All" && (
                        <ShoppingBag className="h-4 w-4 opacity-70" />
                      )}
                      {link.name !== "Home" && link.name !== "Shop All" && (
                        <Grid className="h-4 w-4 opacity-70" />
                      )}
                      {link.name}
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                  </Link>
                );
              })}
            </nav>
          </div>

          <div>
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
              Settings & Support
            </h4>
            <nav className="space-y-1">
              <Link
                href="/about"
                className="flex items-center gap-3 p-3 rounded-xl text-sm font-medium hover:bg-secondary text-foreground"
                onClick={onClose}
              >
                <HelpCircle className="h-4 w-4 opacity-70" />
                Help Center
              </Link>
            </nav>
          </div>
        </div>

        {/* Footer */}
        {!session && (
          <div className="p-5 border-t border-border bg-secondary/10">
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-2">
                New Customer?
              </p>
              <Link href="/sign-up" onClick={onClose}>
                <Button
                  variant="outline"
                  type="button"
                  className="w-full justify-center gap-2"
                >
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
};

export default Drawer;
