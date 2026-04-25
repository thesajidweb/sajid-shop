"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation"; //  Import from next/navigation
import { ShoppingCart, Heart, Menu, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/utils";
import ThemeToggle from "@/components/ThemeToggle";

import { RootState, useAppSelector } from "@/redux/store";
import UserDropdown from "@/components/auth/authDropDown";
import Drawer from "./Drawer";

const Navbar = () => {
  //  Use Next.js hooks that automatically update
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const closeOverlays = () => setIsMobileMenuOpen(false);

  //  Active link logic - simplified and reactive
  const isLinkActive = (linkPath: string, exact: boolean) => {
    if (!pathname) return false;

    if (exact) {
      if (linkPath === "/products") {
        // Check if we're on /products without category param
        return pathname === "/products" && !searchParams?.has("category");
      }
      return pathname === linkPath;
    }
    // For non-exact matching (like About page)
    return pathname.startsWith(linkPath);
  };

  const cartItems = useAppSelector((state: RootState) => state.cart.items);
  const wishlistItems = useAppSelector((state) => state.wishlist.items);
  const itemCount = cartItems?.length ?? 0;
  const wishlistCount = wishlistItems?.length ?? 0;

  const navLinks = [
    { name: "Home", path: "/", exact: true },
    { name: "Products", path: "/products", exact: true },
    { name: "About", path: "/about", exact: false },
  ];

  //  Don't render navbar on dashboard routes
  if (pathname?.startsWith("/dashboard")) {
    return null;
  }

  return (
    <div className="flex flex-col w-full z-50">
      <div
        className={cn(
          "sticky top-0 w-full transition-all duration-300 z-40",
          isScrolled
            ? "bg-background/80 backdrop-blur-md border-b border-border shadow-sm"
            : "bg-background border-b border-transparent",
        )}
      >
        {/* ===== MAIN BAR ===== */}
        <div className="w-full mx-auto px-4 h-12 md:h-12 flex items-center leading-none justify-between">
          {/* Mobile Menu Button (ONLY SMALL SCREENS) */}
          <div className="flex sm:flex md:hidden items-center w-1/4">
            <button
              className="-ml-2 border p-1 rounded hover:bg-secondary text-foreground cursor-pointer"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menu</span>
            </button>
          </div>

          {/* Logo */}
          <div className="hidden md:flex items-center justify-start lg:justify-start lg:mr-8">
            <Link
              onClick={closeOverlays}
              href="/"
              aria-label="Go to homepage"
              className="group flex items-center gap-2 select-none"
            >
              <div className="flex items-center justify-center h-7 w-7 md:h-8 md:w-8 rounded-lg bg-primary text-primary-foreground font-bold text-sm md:text-base">
                S
              </div>
              <span className="text-base md:text-lg font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors">
                Sajid
                <span className="text-muted-foreground text-xs">Shop</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="flex items-center gap-5 xl:gap-7 mx-auto">
            {navLinks.map((link) => {
              const active = isLinkActive(link.path, link.exact);
              return (
                <Link
                  onClick={closeOverlays}
                  key={link.path}
                  href={link.path}
                  className={cn(
                    "relative text-[13px] md:text-sm font-semibold transition-colors duration-200 hover:text-primary py-1",
                    active ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {link.name}
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center justify-end gap-1.5 sm:gap-2 lg:gap-2.5 lg:w-auto w-1/4">
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>

            <Link
              onClick={closeOverlays}
              href="/wishlist"
              className="hidden sm:block"
            >
              <Button
                variant="default"
                size="icon"
                className="rounded-full relative shadow-md hover:shadow-lg hover:scale-105 transition-all bg-destructive hover:bg-chart-4"
              >
                <Heart className="h-4 w-4" />
                <span
                    suppressHydrationWarning  // Add this
                  className={cn(
                    "p-2 absolute -top-1 -right-1 h-4 w-4 rounded-full bg-chart-1 dark:bg-white/80 dark:text-black text-[11px] font-semibold flex items-center justify-center border border-border transition-opacity",
                    wishlistCount > 0 ? "opacity-100" : "opacity-0",
                  )}
                >
                  {wishlistCount}
                </span>
              </Button>
            </Link>

            <Link onClick={closeOverlays} href="/cart">
              <Button
                variant="default"
                size="icon"
                className="rounded-full relative shadow-md hover:shadow-lg hover:scale-105 transition-all bg-primary text-primary-foreground hover:bg-chart-4 w-8 sm:w-9 h-8 sm:h-9"
              >
                <ShoppingCart className="h-4 w-4" />
                <span
                  className={cn(
                    "p-2 absolute -top-1 -right-1 h-4 w-4 rounded-full bg-black text-[11px] font-semibold flex items-center justify-center border border-border transition-opacity",
                    itemCount > 0 ? "opacity-100" : "opacity-0",
                  )}
                >
                  {itemCount}
                </span>
              </Button>
            </Link>

            <Link
              onClick={closeOverlays}
              href="/orders"
              className="hidden sm:block"
            >
              <div className="relative group">
                <Button
                  size="icon"
                  className="h-8 w-8 md:h-9 md:w-9 rounded-full bg-chart-2 text-primary-foreground hover:bg-chart-1 transition"
                >
                  <Truck className="h-4 w-4" />
                </Button>
                <span className="hidden md:block absolute left-1/2 -translate-x-1/2 top-full mt-1 text-xs px-1 opacity-0 group-hover:opacity-100 transition pointer-events-none bg-primary text-primary-foreground border rounded-2xl">
                  Orders
                </span>
              </div>
            </Link>

            <UserDropdown />
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer ONLY SMALL SCREENS */}
      <div className="sm:block md:hidden">
        <Drawer
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          navLinks={navLinks}
          isLinkActive={isLinkActive}
          wishlistCount={wishlistCount}
        />
      </div>
    </div>
  );
};

export default Navbar;
